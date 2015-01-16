var EventEmitter = require('events').EventEmitter;
var stripComments = require('./utils/stripComments.js');

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var Sbagen = module.exports = function(sba){
  if (sba){
    if(sba) this.sbagen = sba;
    this.parse(sba);
  }
};

Sbagen.prototype = EventEmitter.prototype;

/**
 * Get comments that have ## which denotes they should be outputted
 * @return {[type]} [description]
 */
Sbagen.prototype.comments = function(){
  var re = /^\s?##(.+)$/gm;
  var m;
  var out=[];
  while ((m = re.exec(this.sbagen)) !== null) {
    out.push(m[1]);
  }
  return out.map(function(l){ return l.trim(); });
};

/**
 * Translate an offset time to ms
 * @param  {String} time the offset time, like 00:01:00 or 02:00
 * @return {Number}      the offset in ms
 */
Sbagen.prototype.offsetToMs = function(time){
  if (time.length === 5) time = time + ':00';
  var t = time.split(':').map(Number);
  return (t[2] * 1000) +
    (t[1] * 60000) +
    (t[0] * 3600000);
};

/**
 * Convert time-of-day to ms timestamp
 * @param  {String} time the time of day, like 00:01:00 or 02:00
 * @return {Number}      Timestamp of when this should happen
 */
Sbagen.prototype.timeToMs = function(time){
  var now = new Date();
  var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  var t = this.offsetToMs(time);
  var newTime = midnight + t;
  return (newTime > now.getTime()) ? newTime : newTime + 86400000;
};

/**
 * Create base op-sequence keyed by timecodes from sbagen sequence
 * @param  {String} sba raw sbagen sequence
 * @return {Array}      op-sequence keyed by timecodes
 */
Sbagen.prototype.parse = function(sba){
  var self = this;
  self.sequence = [];
  self.timers = [];
  self.stop();
  if(sba) self.sbagen = sba;
  sba = stripComments(self.sbagen);
  var m;
  var ops = {};

  // TODO: this should probably be refactored for simplicity, but it hits all the cases.

  // get op-name & op-text: https://regex101.com/r/fT9hG4/1
  var re = /([a-z][a-z0-9]+)\s?:\s?(.+)/ig;

  // extract ops: https://regex101.com/r/oS7zD3/1
  var re2 = /\s*(([0-9]+)([\+-])?([0-9]+)|pink|mix|(bell)([\+-])([0-9]+)|(spin):([0-9]+)([\+\-])([0-9]+)|(wave)([0-9]+):([0-9]+)([\+\-])([0-9]+))\/([0-9]{1,3})|(-)\s?$/gm;

  while ((m = re.exec(sba)) !== null) {
    if (m.index === re.lastIndex) {
        re.lastIndex++;
    }
    
    // console.log(m);

    ops[m[1]] = [];

    while ((m2 = re2.exec(m[2])) !== null) {
      if (m2.index === re2.lastIndex) {
        re2.lastIndex++;
      }
      m2 = m2.filter(function(o){
        return o !== undefined;
      });

      var newOp = {};

      if (m2.length ===2){ // -
        newOp.op = '-';
        newOp.amp = 0;
      }else{
        newOp.amp = Number(m2.pop());
        if (m2.length == 2){ // pink, mix
          newOp.op = m2[1];
        }else{
          if (isNumeric(m2[2]) ){
            newOp.op = 'sin';

            if (m2.length === 5){ // 400+10
              newOp.offset = Number(m2.pop());
              newOp.offset = newOp.offset * (m2.pop() + 1);
              newOp.frequency = Number(m2.pop());
            }else{ // 400
              newOp.offset = 0;
              newOp.freqency = Number(m2[1]);
            }
          }
        }
      }
      ops[m[1]].push(newOp);
    }
  }

};

/**
 * Playback this.sequence as emits at proper time
 */
Sbagen.prototype.play = function(){
  var self = this;
  self.clear();
  self.playing = true;
  
  // add top-level ops
  self.timers = self.sequence.map(function(op, i){
    if(op[1]){
      return setTimeout(function(){
        // ops, fadeInOut, fullTimeFade, time, index
        self.emit('op', op[1][1], op[1][0], (op[1][2] && op[1][2] === '->'), op[0], i);
      }, op[0]);
    }
  });

  // add fade intervals
  self.sequence.forEach(function(op, i){
    if (i === 0) return;
    console.log(op);
    
  });

  self.emit('comments', self.comments());
};

/**
 * Stop playback of this.sequence
 */
Sbagen.prototype.stop = function(){
  var self = this;
  self.playing = false;
  self.clear();
};

/**
 * Clear all sequencer timers
 */
Sbagen.prototype.clear = function(){
  this.timers.forEach(function(timer){
    clearTimeout(timer);
  });
  this.timers = [];
};


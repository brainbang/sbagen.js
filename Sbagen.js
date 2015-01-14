var EventEmitter = require('events').EventEmitter;
var stripComments = require('./utils/stripComments.js');

var Sbagen = module.exports = function(sba){
  if (sba){
    if(sba) this.sbagen = sba;
    this.parse(sba);
  }
};

Sbagen.prototype = EventEmitter.prototype;

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
  
  var re = /([a-z][a-z0-9]+)\s?:\s?(.+)/ig;
  while ((m = re.exec(sba)) !== null) {
    ops[ m[1] ] = m[2].split(' ');
  }

  var n = new Date();
  n.setMilliseconds(0);
  var now = n.getTime();
  var last = now + 0;
  re = /([NOW\+0-9:]{3,12}) +(.+)/g;
  while ((m = re.exec(sba)) !== null) {
    var time = null;
    if (m[1].indexOf('NOW') === 0){
      if (m[1] === 'NOW'){
        time = now;
        last = now + 0;
      }else{ // NOW+00:00:00
        time = now + self.offsetToMs(m[1].substr(4));
      }
    }else{
      if (m[1][0] === '+'){ // +00:00:00
        time = last + self.offsetToMs(m[1].substr(1));
      }else{ // 00:00:00
        time = self.timeToMs(m[1]);
      }
    }
    self.sequence.push([time-now, ops[m[2]] ]);
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
        self.emit('op', op[1], op[0], i, self.sequence);
      }, op[0]);
    }
  });

  self.emit('comments', self.comments()); 

  // for every op, sequence the fades for the next one
  self.sequence.forEach(function(op, i){
    if (!self.sequence[i+1]) return;
    // default fade is 30 secs before & after
    var volFadeIn = 30000;
    var volFadeOut = 30000;
    var fadeType = '--';
  });
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


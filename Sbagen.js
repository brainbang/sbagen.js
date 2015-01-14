var EventEmitter = require('events').EventEmitter;
var stripComments = require('./utils/stripComments.js');

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
  
  function mapOp(o){
    return ops[o] ? ops[o] : o;
  }

  function filterEmpty(o){
    return (o && o !== '');
  }

  var re = /([a-z][a-z0-9]+)\s?:\s?(.+)/ig;
  while ((m = re.exec(sba)) !== null) {
    ops[ m[1] ] = m[2].split(/\s+/).filter(filterEmpty);
  }

  var n = new Date();
  n.setMilliseconds(0);
  var now = n.getTime();
  var last = now + 0;
  re = /^(NOW|\+?[0-9]{2}:[0-9]{2}:[0-9]{2}|\+?[0-9]{2}:[0-9]{2})\s+(.+)$/igm;
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
    self.sequence.push([ time-now, m[2].split(/\s+/).map(mapOp) ]);
  }
  
  self.sequence = self.sequence.map(function(o){
    if (typeof o[1][0] !== 'string'){
      o[1].unshift('--');
    }
    return o;
  });
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

  // add fades
  self.on('op', function(ops, fadeInOut, fullTimeFade, time, index){
    switch(fadeInOut[0]){
      case '-':
        // Fade from previous to this, fading out all tones not continuing, fading in all new tones, and adjusting the amplitude of any tones continuing.
        break;
      case '<':
        // Fade in from silence.
        break;
      case '=':
        // Slide from previous to this, fading out all tones ending, fading in all new tones, and sliding the frequency and adjusting the amplitude of all other tones.
        break;
    }

    switch(fadeInOut[1]){
      case '-':
        // Fade to next, as above
        break;
      case '>':
        // Fade out to silence
        break;
      case '=':
        // Slide to next, as above
        break;
    }
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


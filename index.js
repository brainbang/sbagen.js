var emitonoff = require('emitonoff');

var sbagen = {};

emitonoff(sbagen);

// holds current timers & intervals
var timers = [], intervals = [];

// are timers playing?
var playing = false;

// all regexes, pre-compiled
var regexes = {
  // https://regex101.com/r/yR8oR6/1
  getOp : /([a-z][a-z0-9]+)\s?:\s?(.+)/ig,

  // https://regex101.com/r/bA9zV2/1
  extractOps : /\s*(([0-9]+)([\+-])?([0-9]+)|pink|mix|(bell)([\+-])([0-9]+)|(spin):([0-9]+)([\+\-])([0-9]+)|(wave)([0-9]+):([0-9]+)([\+\-])([0-9]+))\/([0-9]{1,3})|(-)\s?$/gm,

  // https://regex101.com/r/iI6rG9/1
  sequence : /(NOW|\+?[0-9]{2}:[0-9]{2}:?[0-9]{0,2})\s+([\-=<]?[\-=>]?)\s?([a-z][a-z0-9_-]+)\s?(-?>?)/igm,

  stripComments : /^\s?#.+$/gm,

  displayComments : /^\s?##(.+)$/gm
};

// is n a number?
var isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

// remove empty elements for Array.filter
var removeEmpty = function(o){
  return o !== undefined && o !== '' && o !== null;
};

// trim strings for Array.map
var trimLine = function(o){
  return o.trim();
};

// clean up comments, blank lines
var stripComments = function (s) {
  return s
    .replace(regexes.stripComments, '')
    .split('\n')
    .filter(removeEmpty)
    .map(trimLine)
    .join('\n');
};


/**
 * Get comments that have ## which denotes they should be outputted
 * @return {[type]} [description]
 */
sbagen.comments = function(sba){
  var m;
  var out = [];
  while ((m = regexes.displayComments.exec(sba)) !== null) {
    out.push(m[1]);
  }
  return out.map(function(l){ return l.trim(); });
};

/**
 * Translate an offset time to ms
 * @param  {String} time the offset time, like 00:01:00 or 02:00
 * @return {Number}      the offset in ms
 */
sbagen.offsetToMs = function(time){
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
sbagen.timeToMs = function(time){
  var now = new Date();
  var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(),0,0,0,0).getTime();
  var t = sbagen.offsetToMs(time);
  var newTime = midnight + t;
  return (newTime > now.getTime()) ? newTime : newTime + 86400000;
};

/**
 * Create base op-sequence keyed by timecodes from sbagen sequence
 * @param  {String} sba raw sbagen sequence
 * @return {Array}      op-sequence of {time:Number, ops: [{}]}
 */
sbagen.parse = function(sba){
  sba = stripComments(sba);
  var sequence = [];

  var ops = {};
  var m, m2, m3;
  
  while ((m = regexes.getOp.exec(sba)) !== null) {
    if (m.index === regexes.getOp.lastIndex) {
        regexes.getOp.lastIndex++;
    }

    ops[m[1]] = [];

    while ((m2 = regexes.extractOps.exec(m[2])) !== null) {
      if (m2.index === regexes.extractOps.lastIndex) {
        regexes.extractOps.lastIndex++;
      }
      m2 = m2.filter(removeEmpty);

      var newOp = {};

      if (m2.length === 2){ // -
        newOp.op = '-';
        newOp.amp = 0;
      }else if (m2.length === 3){ // pink or mix
        newOp.op = m2[1];
        newOp.amp = Number(m2[2]);
      }else if (m2.length === 5){ // non-binaurl sin
        newOp.op = 'sin';
          newOp.amp = Number(m2[4]);
          newOp.carrier = Number(m2[1]);
          newOp.freq = 0;
      }else if (m2.length === 6){ // bell or binaural sin
        if (m2[2] === 'bell'){
          newOp.op = 'bell';
          newOp.amp = Number(m2[5]);
          newOp.carrier = Number(m2[4]);
        }else{
          newOp.op = 'sin';
          newOp.amp = Number(m2[5]);
          newOp.carrier = Number(m2[2]);
          newOp.freq = Number(m2[4]) * (m2[3] + '1');
        }
      }else if (m2.length === 7){ // spin
        newOp.op = 'spin';
        newOp.amp = Number(m2[6]);
        newOp.carrier = Number(m2[3]);
        newOp.freq = Number(m2[5]) * (m2[4] + '1');
      }else if (m2.length === 8){ // wave
        newOp.op = 'wave';
        newOp.num = Number(m2[3]);
        newOp.amp = Number(m2[7]);
        newOp.carrier = Number(m2[4]);
        newOp.freq = Number(m2[6]) * (m2[5] + '1');
      }else{
        newOp.op = 'unknown';
        newOp.info = m2;
      }
      
      ops[m[1]].push(newOp);
    }
  }

  while ((m3 = regexes.sequence.exec(sba)) !== null) {
    if (m3.index === regexes.sequence.lastIndex) {
      regexes.sequence.lastIndex++;
    }

    var seq = {
      time: (m3[1] === 'NOW') ? 0 : (m3[1][0] === '+') ? sbagen.offsetToMs(m3[1].substr(1)) : sbagen.timeToMs(m3[1]),
    };

    seq.fadeTime = (m3[4] === '->') ? seq.time : 60000; // 1 minute
    seq.fadeType = (m3[2] === '') ? '--' : m3[2];

    seq.ops = ops[ m3[3] ];

    sequence.push(seq);
  }

  return sequence;
};

/**
 * Playback sequence as emits at proper times
 */
sbagen.play = function(sba){
  var sequence;

  sbagen.stop();
  
  if (!sba || (typeof sba !== 'string' && typeof sba !== 'object')){
    return;
  }

  if (typeof sba === 'string'){
    sequence = sbagen.parse(sba);
    sbagen.emit('comments', sbagen.comments(sba));
  }

  // allow pre-parsed sequence
  if (typeof sba === 'object'){
    sequence = sba;
  }

  if (!sequence) return;

  playing = true;
  sbagen.emit('play');

  // timers that fire on action time to inform UI, etc
  sequence.forEach(function(action, index){
    action.index = index;
    timers.push(setTimeout(function(){
      sbagen.emit('op', action);
    }, action.time));

    if (index !== (sequence.length-1)){
      var actionNext = sequence[ index+1 ];
      action.ops.forEach(function(op,channel){
        if (actionNext.ops[channel] && op.amp !== actionNext.ops[channel].amp){
          timers.push(setTimeout(function(){
            // TODO: need to handle correct action.fadeType -=<>
            sbagen.animate(op.amp, actionNext.ops[channel].amp, action.fadeTime, function(amp){
              sbagen.emit('amp', amp, op, channel, action, actionNext);
            });
          }, action.fadeTime/2));
        }
      });
    }
  });
};

/**
 * Stop playback of current sequence
 */
sbagen.stop = function(){
  playing = false;
  sbagen.emit('stop');
  timers.forEach(function(timer){
    clearTimeout(timer);
  });
  intervals.forEach(function(interval){
    clearInterval(interval);
  });
  timers = [];
  intervals = [];
};

/**
 * Animate a value over time to target
 * @param  {Number}   value   The start value
 * @param  {Number}   target  The target value
 * @param  {Number}   time    The total time the transition should take
 * @param  {Function} cb      The function to callback with value
 */

sbagen.animate = function(value, target, time, cb){
  if (value == target){
    return cb(value);
  }

  var interval = time / (target-value);
  var increment = 1;
  if (value > target){
    interval = time / (value-target);
    increment = -1;
  }

  var i = setInterval(function(){
    var test = (increment > 0) ? (value > target) : (value < target);
    if (test) {
      clearInterval(i);
    }else{
      cb(value);
      value += increment;
    }
  }, interval);
  intervals.push(i);
};

module.exports = sbagen;

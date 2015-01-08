var EventEmitter = require('events').EventEmitter;

var trimArray = require('./utils/trimArray.js');
var removeBlank = require('./utils/removeBlank.js');

var Sbagen = module.exports = function(sbagen){
	this.sbagen = sbagen;
  this.timers = [];
  this.sequece = [];
};

Sbagen.prototype = EventEmitter.prototype;

/**
 * get offset time from `time`
 * @param {Number} time        Time to start with (datestamp in ms)
 * @param {String} add         Future time (HH:MM:SS or HH:MM)
 * @param {Boolean} startOfDay Is `add` a daytime or offset from `time`?
 * @return {Number}            The seconds offset
 */
Sbagen.prototype.addTime = function(time, add, startOfDay){
  //console.log('starting with ' + new Date(time) + ' adding ' + add);
  var out;
	if (add.length === 5) add = add + ':00';
	var t = add.split(':').map(Number);
  var offset = (t[0] * 3600000) + (t[1] * 60000) + (t[2] * 1000);
	if (startOfDay){
    var d = new Date(time); d.setHours(0); d.setMinutes(0); d.setSeconds(0);
    var newTime = offset + d.getTime();
    if (newTime >= time){
      out=Math.floor((newTime-time) / 1000);
    }else{
      out=Math.floor(((newTime-time) + (8.64e+7) ) / 1000);
    }
	}else{
		out=Math.floor(offset / 1000);
	}
  //console.log('got', out);
  return out;
};

/**
 * Parse sbagen file with time offsets
 * TODO: not complete parsing of sbagen. no cli-options or blocks 
 * @param  {String} sbagen [description]
 */
Sbagen.prototype.parse = function(){
  var self = this;
  var code = this.sbagen.replace(/##.+/g, '').split(/[\n\r]/).map(trimArray).filter(removeBlank);
  var ops = {};
  var seq = [];

  // pull out ops & seq
  for (var c in code){
    if (code[c].search(/.+: /) === 0){
      var op = code[c].split(/[: ]/).map(trimArray);
      ops[ op[0] ] = op.slice(1).filter(removeBlank);
    }else if(code[c] !== ''){
      seq.push(code[c].split(' ').map(trimArray).filter(removeBlank));
    }
  }

  var now = (new Date()).getTime();
  var lastTime = 0;

  self.sequence = seq.map(function(s){
    var addTime = 0;

    var parsed_ops=[];
    s.slice(1).forEach(function(op){
      parsed_ops=parsed_ops.concat(ops[op] ? ops[op] : op);
    });

    if (s[0].indexOf('NOW') === 0){
      addTime = 0;
      // NOW
      // NOW+00:00:10
      if (s[0] !== 'NOW'){
        addTime = self.addTime(now, s[0].substr(4));
      }
    }else{
      // +00:20
      if (s[0][0] === '+'){
        addTime = lastTime+self.addTime((lastTime*1000)+now, s[0].substr(1));
      }
      // 15:00
      else{
        addTime = self.addTime(now, s[0], true);
      }
    }

    lastTime = addTime;

    return [addTime, parsed_ops];
  });

  this.emit('parsed', self.sequence);
};

/**
 * Clear all sequencer timers
 * @return {[type]} [description]
 */
Sbagen.prototype.clear = function(){
  this.timers.forEach(function(timer){
    clearTimeout(timer);
  });
  this.timers = [];
};

/**
 * Playback this.sequence as emits at proper time
 * @return {[type]} [description]
 */
Sbagen.prototype.play = function(){
	var self = this;
  self.clear();
	self.emit('play');
	self.playing = true;
	self.timers = self.sequence.map(function(op, i){
		return setTimeout(function(){
			self.emit('op', op[1], op[0], i, self.sequence);
		}, op[0]*1000);
	});
};

/**
 * Stop playback of this.sequence
 * @return {[type]} [description]
 */
Sbagen.prototype.stop = function(){
	var self = this;
	self.emit('stop');
	self.playing = false;
  self.clear();
};
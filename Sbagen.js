var EventEmitter = require('events').EventEmitter;

var trimArray = require('./utils/trimArray.js');
var removeBlank = require('./utils/removeBlank.js');

var Sbagen = module.exports = function(sbagen){
	this.sbagen = sbagen;
};

Sbagen.prototype = EventEmitter.prototype;

/**
 * get offset time from `time`
 * @param {Number} time        Time to start with
 * @param {String} add         Future time (HH:MM:SS or HH:MM)
 * @param {Boolean} startOfDay Is `add` a daytime or offset from `time`?
 * @return {Number}            The ms offset
 */
Sbagen.prototype.addTime = function(time, add, startOfDay){
	if (add.length === 5) add = add + ':00';
	var d = new Date(time);
	var n = new Date(time);
	var t = add.split(':').map(Number);
	if (startOfDay){
		d.setHours(0);
		d.setMinutes(0);
		d.setSeconds(0);
	}
	d.setHours( d.getHours() + t[0] );
	d.setMinutes( d.getMinutes() + t[1] );
	d.setSeconds( d.getSeconds() + t[2] );
	if (startOfDay && d.getTime() < n.getTime()){
		d.setDate( d.getDate() + 1 );
	}
	return d.getMilliseconds() - n.getMilliseconds();
};

/**
 * Parse sbagen file with time offsets
 * TODO: not complete parsing of sbagen. no cli-options, mix, bell, spin or wave or blocks 
 * @param  {String} sbagen [description]
 */
Sbagen.prototype.parse = function(){
	var self = this;
	var code = this.sbagen.replace(/##.+/g, '').split('\n').map(trimArray);
	var ops = {};
	var seq = [];

	// pull out ops & seq
	for (var c in code){
		if (code[c].search(/.+: /) === 0){
			var op = code[c].split(/[: ]/).map(trimArray);
			ops[ op[0] ] = op.slice(1).filter(removeBlank)
			// .map(function(o){ return o.split('/'); });
		}else if(code[c] !== ''){
			seq.push(code[c].split(' ').map(trimArray));
		}
	}

	// console.log(ops, seq);

	var now = (new Date()).getTime();
	var lastTime = now;

	// get times that things happen
	// TODO: figure out 'sway:' (Alcohol)
	// TODO: empty times need a look (Adrenaline)
	self.sequence = seq.map(function(s){
		if (s[0].indexOf('NOW') === 0){
			// NOW
			if (s[0] === 'NOW'){
				s[0] = 0;
			}
			// NOW+00:00:10
			else {
				s[0] = self.addTime(now, s[0].substr(4));
			}
			lastTime = s[0] + now;
		}else{
			// +00:20
			if (s[0][0] === '+'){
				s[0] = self.addTime(lastTime, s[0].substr(1));
			}
			// 15:00
			else{
				s[0] = self.addTime(now, s[0], true);
				lastTime = s[0];
			}
		}
		s[1] = ops[s[1]];
		return s;
	});

	this.emit('parsed', self.sequence);
};

/**
 * Playback this.sequence as emits at proper time
 * @return {[type]} [description]
 */
Sbagen.prototype.play = function(){
	var self = this;
	self.emit('play');
	self.playing = true;
	self.timers = self.sequence.map(function(seq, i){
		return setTimeout(function(){
			self.emit('change', seq, i, self.sequence);
		}, seq[0]);
	});
};

/**
 * Stop playback of this.sequence
 * @return {[type]} [description]
 */
Sbagen.prototype.stop = function(){
	this.emit('stop');
	this.playing = false;
};


var EventEmitter = require('events').EventEmitter;
var stripComments = require('./utils/stripComments.js');

var Sbagen = module.exports = function(sbagen){
  this.sbagen = sbagen;
};

Sbagen.prototype = EventEmitter.prototype;

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
 * Parse sbagen sequence & turn it into events
 * @param  {String} sba the sequence source
 */
Sbagen.prototype.parse = function(sba){
  var self = this;
  var sequence = [];
  sba = stripComments(sba||self.sbagen);
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
    sequence.push([time-now, ops[m[2]] ]);
  }
  // TODO: create sequence of all fades
};
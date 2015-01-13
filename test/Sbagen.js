var expect = require('chai').expect;
var sinon = require('sinon');

var ml = require('multiline');
var testSequence = ml(function(){/*
## simple demo

test1: pink/10 pink/20 pink/30
test2: mix/20
test3: 400+10/10
test4: 440/20
test5: bell+480/20
test6: spin:100+10/20
test7: wave1:400+10/10
off: -

NOW test1
 +00:01:00 test2
+00:02:00 test3
+00:03:00 test4
NOW+00:04:00 test5
+00:05:00 test6
+00:06:00 test7
+00:07:00 off
*/});

var Sbagen = require('..');

describe('Sbagen', function(){
  it('should instantiate', function(){
    var test = new Sbagen();
    expect(test).to.be.instanceOf(Sbagen);
  });
  
  describe('#offsetToMs()', function(){
    var test;

    before(function(){
      test = new Sbagen();
    });

    it('should handle 00:01', function(){
      expect(test.offsetToMs('00:01')).to.equal(60000);
    });

    it('should handle 00:05', function(){
      expect(test.offsetToMs('00:05')).to.equal(300000);
    });

    it('should handle 00:01:00', function(){
      expect(test.offsetToMs('00:01:00')).to.equal(60000);
    });

    it('should handle 15:01:00', function(){
      expect(test.offsetToMs('15:01:00')).to.equal(54060000);
    });
  });

  describe('#timeToMs()', function(){
    var test;

    before(function(){
      test = new Sbagen();
    });

    it('should handle 00:01', function(){
      var d = new Date();
      d.setMilliseconds(0);
      d.setSeconds(0);
      d.setMinutes(1);
      d.setHours(0);
      d.setDate(d.getDate() + 1);
      expect(test.timeToMs('00:01')).to.equal(d.getTime());
    });

    it('should handle 00:05:00', function(){
      var d = new Date();
      d.setMilliseconds(0);
      d.setSeconds(0);
      d.setMinutes(5);
      d.setHours(0);
      d.setDate(d.getDate() + 1);
      expect(test.timeToMs('00:05:00')).to.equal(d.getTime());
    });
  });

  describe('sequencer', function(){
    var clock, test;
    
    before(function () {
      clock = sinon.useFakeTimers();
      test = new Sbagen(testSequence);
    });

    after(function () {
      clock.restore();
    });

    it('should create the sequence array', function(){
      expect(test.sequence.length).to.equal(8);
    });

    it('should fire correct op events', function(){
      var timeElapsed = 0;
      var timeCheck = setInterval(function(){
        timeElapsed += 1000;
      }, 1000);

      test.on('op', function(ops, time, index){
        var seq;
        switch(index){
          case 0: seq = ['pink/10', 'pink/20', 'pink/30']; break;
          case 1: seq = ['mix/20']; break;
          case 2: seq = ['400+10/10']; break;
          case 3: seq = ['440/20']; break;
          case 4: seq = ['bell+480/20']; break;
          case 5: seq = ['spin:100+10/20']; break;
          case 6: seq = ['wave1:400+10/10']; break;
          case 7: seq = ['-']; break;
        }
        expect(ops).to.have.members(seq);
        expect(timeElapsed).to.equal(time);
      });

      test.play();
      clock.tick(86400000); // a day has passed
    });
  });

});
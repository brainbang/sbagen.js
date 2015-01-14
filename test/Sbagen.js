var expect = require('chai').expect;
var sinon = require('sinon');

var ml = require('multiline');
var testSequence = ml(function(){/*
## Alpha
# this comment should not be outputted.

h8:   pink/50 100+8/50
h10:  pink/50 100+10/50
h12:  pink/50 200+12/50
h13:  pink/50 400+13/50
alloff:      -

NOW       h8
+00:05:00 h8 ->
+00:06:00 h10
+00:13:00 h10 ->
+00:14:00 h12
+00:22:00 h12 ->
+00:23:00 h13
+00:28:00 h13 ->
+00:30:00 alloff
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

  describe('#comments()', function(){
    it('should do comments', function(){
      var test = new Sbagen(testSequence);
      expect(test.comments()).to.have.members(['Alpha']);
    });
  });

  describe('sequencer', function(){
    var clock, test, timeCheck, timeElapsed = 0;
    
    beforeEach(function () {
      clock = sinon.useFakeTimers();
      test = new Sbagen(testSequence);
      timeCheck = setInterval(function(){
        timeElapsed += 1000;
      }, 1000);
    });

    afterEach(function () {
      clock.restore();
      clearInterval(timeCheck);
    });

    it('fire comments event', function(done){
      var test = new Sbagen(testSequence);
      test.on('comments', function(comments){
        expect(comments).to.have.members(['Alpha']);
        done();
      });
      test.play();
    });

    it('should create the sequence array', function(){
      expect(test.sequence.length).to.equal(9);
    });
    
    it('should fire correct op events', function(){
      test.on('op', function(ops, fadeInOut, fullTimeFade, time, index){
        var seq;
        switch(index){
          case 0: seq = [ 'pink/50', '100+8/50' ]; break;
          case 1: seq = [ 'pink/50', '100+8/50' ]; break;
          case 2: seq = [ 'pink/50', '100+10/50' ]; break;
          case 3: seq = [ 'pink/50', '100+10/50' ]; break;
          case 4: seq = [ 'pink/50', '200+12/50' ]; break;
          case 5: seq = [ 'pink/50', '200+12/50' ]; break;
          case 6: seq = [ 'pink/50', '400+13/50' ]; break;
          case 7: seq = [ 'pink/50', '400+13/50' ]; break;
          case 8: seq = [ '-' ]; break;
        }
        expect(ops).to.have.members(seq);
        expect(timeElapsed).to.equal(time);
      });

      test.play();
      clock.tick(1.86e+6); // 31 minutes has passed
    });
  });
});
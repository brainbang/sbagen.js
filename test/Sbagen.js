var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
chai.use(require('chai-things'));

var testData = {
  test1: {
    sequence: fs.readFileSync(__dirname + '/data/test1.sbg').toString(),
    expected: require(__dirname + '/data/test1.json')
  }
};

var sbagen = require('..');

describe('Sbagen', function(){  
  describe('.offsetToMs()', function(){
    it('should handle 00:01', function(){
      expect(sbagen.offsetToMs('00:01')).to.equal(60000);
    });

    it('should handle 00:05', function(){
      expect(sbagen.offsetToMs('00:05')).to.equal(300000);
    });

    it('should handle 00:01:00', function(){
      expect(sbagen.offsetToMs('00:01:00')).to.equal(60000);
    });

    it('should handle 15:01:00', function(){
      expect(sbagen.offsetToMs('15:01:00')).to.equal(54060000);
    });
  });

  describe('.timeToMs()', function(){
    it('should handle 00:01', function(){
      var d = new Date();
      d.setMilliseconds(0);
      d.setSeconds(0);
      d.setMinutes(1);
      d.setHours(0);
      d.setDate(d.getDate() + 1);
      expect(sbagen.timeToMs('00:01')).to.equal(d.getTime());
    });

    it('should handle 00:05:00', function(){
      var d = new Date();
      d.setMilliseconds(0);
      d.setSeconds(0);
      d.setMinutes(5);
      d.setHours(0);
      d.setDate(d.getDate() + 1);
      expect(sbagen.timeToMs('00:05:00')).to.equal(d.getTime());
    });
  });

  describe('.comments()', function(){
    it('should handle displayable comments correctly', function(){
      expect(sbagen.comments(testData.test1.sequence)).to.have.members(['tester']);
    });
  });

  describe('.parse()', function(){
    it('should parse the sequence correctly', function(){
      var sequence = sbagen.parse(testData.test1.sequence);
      testData.test1.expected.forEach(function(line){
        expect(sequence).to.include.something.that.deep.equals(line);
      });
    });
  });

  describe('.animate()', function(){
    var clock;
    
    beforeEach(function () {
      clock = sinon.useFakeTimers();
    });

    afterEach(function () {
      clock.restore();
    });

    it('should animate positive values', function(){
      var elapsedMinutes = 0;
      var runCount = 0;
      function cb(val){
        var now = new Date();
        elapsedMinutes = now.getMinutes();
        runCount++;
      }

      sbagen.animate(1, 100, 1800000, cb);
      clock.tick(3600000); // 1 hour has passed
      expect(elapsedMinutes).to.equal(30);
      expect(runCount).to.equal(100);
    });

    it('should animate negative values', function(){
      var elapsedMinutes = 0;
      var runCount = 0;
      function cb(val){
        var now = new Date();
        elapsedMinutes = now.getMinutes();
        runCount++;
      }

      sbagen.animate(100, 1, 1800000, cb);
      clock.tick(3600000); // 1 hour has passed
      expect(elapsedMinutes).to.equal(30);
      expect(runCount).to.equal(100);
    });
  });

  describe('.play()', function(done){
    var clock;
    
    beforeEach(function () {
      clock = sinon.useFakeTimers();
    });

    afterEach(function () {
      clock.restore();
    });

    it('should fire comments event', function(){
      var comments = null;
      
      function handleComments(c){
        comments = c;
      }
      
      sbagen.on('comments', handleComments);
      sbagen.play(testData.test1.sequence);
      expect(comments).to.have.members(['tester']);
      sbagen.off('comments', handleComments);
    });

    it('should fire play event', function(){
      var played = false;
      function handlePlay(){
        played = true;
      }
      sbagen.on('play', handlePlay);
      sbagen.play(testData.test1.sequence);
      sbagen.off('play', handlePlay);
      expect(played).to.be.ok();
    });

    it('should fire op events', function(){
      var firedOps = [];
      
      function handleOp(op){
        var now = new Date();
        if (op.time === (now.getSeconds()*1000) && op.time === testData.test1.expected[op.index].time){
          firedOps.push(op.index);
          for (var i in op.ops){
            expect(op.ops).to.include.something.that.deep.equals(testData.test1.expected[op.index].ops[i]);
          }
        }
      }
      
      sbagen.on('op', handleOp);
      sbagen.play(testData.test1.sequence);
      clock.tick(1.86e+6); // 31 minutes has passed
      sbagen.off('op', handleOp);
      
      expect(firedOps).to.have.members([0,1,2,3,4,5,6,7]);
    });

    /*
    it('should fire freq and amp events', function(){
      function handleFreq(freq, channel, op){
        console.log('freq', freq, channel, op);
      }
      
      function handleAmp(amp, channel, op){
        console.log('amp', amp, channel, op);
      }

      sbagen.on('freq', handleFreq);
      sbagen.on('amp', handleAmp);
      sbagen.play(testData.test1.sequence);
      clock.tick(1.86e+6); // 31 minutes has passed
    });
    */
  });
});
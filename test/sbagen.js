var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
chai.use(require('chai-things'));

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
    var clock, testData;

    /**
     * Ensure play event was fired correctly
     * @param  {Object} testData[pattern] set from above testData
     */
    function testPlay(pattern){
      var played = false;
      function handlePlay(){
        played = true;
      }
      sbagen.on('play', handlePlay);
      sbagen.play(testData[pattern].sequence);
      sbagen.off('play', handlePlay);
      expect(played).to.be.ok();
    }

    /**
     * Ensure comment event was fired correctly
     * @param  {Object} testData[pattern] set from above testData
     */
    function testComments(pattern){
      var comments = null;

      function handleComments(c){
        comments = c;
      }

      sbagen.on('comments', handleComments);
      sbagen.play(testData[pattern].sequence);
      expect(comments).to.have.members(testData[pattern].comments);
      sbagen.off('comments', handleComments);
    }

    function testChange(pattern){
      var firedOps = 0;
      var start = (new Date()).getTime();
      var callCountAmp = [];
      for (i=0;i<testData[pattern].expected.length;i++){
        callCountAmp.push(0);
      }
      callCountFreq = callCountAmp.slice();
      
      // TODO: actually check these values
      function handleAmp(amp, op, channel, action, actionNext){
        callCountAmp[action.index]++;
      }

      function handleFreq(freq, op, channel, action, actionNext){
        callCountFreq[action.index]++;
      }

      function handleOp(op){
        var now = (new Date()).getTime() - start;
        if (op.time === now && op.time === testData[pattern].expected[op.index].time){
          firedOps++;
          for (var i in op.ops){
            expect(op.ops).to.include.something.that.deep.equals(testData[pattern].expected[op.index].ops[i]);
          }
        }
      }

      sbagen.on('amp', handleAmp);
      sbagen.on('freq', handleFreq);
      sbagen.on('op', handleOp);
      sbagen.play(testData[pattern].sequence);
      clock.tick(3600000); // 1 hour has passed
      sbagen.off('amp', handleAmp);
      sbagen.off('freq', handleFreq);
      sbagen.off('op', handleOp);
      
      return {
        amp: callCountAmp,
        freq: callCountFreq
      };
    }

    before(function(){
      testData = {
        test1: {
          sequence: fs.readFileSync(__dirname + '/data/test1.sbg').toString(),
          expected: JSON.parse(fs.readFileSync(__dirname + '/data/test1.json')),
          comments: JSON.parse(fs.readFileSync(__dirname + '/data/test1_comments.json'))
        },
        test2: {
          sequence: fs.readFileSync(__dirname + '/data/test2.sbg').toString(),
          expected: JSON.parse(fs.readFileSync(__dirname + '/data/test2.json')),
          comments: JSON.parse(fs.readFileSync(__dirname + '/data/test2_comments.json'))
        }
      };
    });
    
    beforeEach(function () {
      clock = sinon.useFakeTimers();
    });

    afterEach(function () {
      clock.restore();
    });

    it('should fire comments event: test1', function(){
      testComments('test1');
    });

    it('should fire play event: test1', function(){
      testPlay('test1');
    });

    it('should fire op, amp & freq events: test1', function(){
      var change = testChange('test1');
      expect(change.amp).to.have.members([ 11, 11, 11, 0, 0, 11, 11, 0 ]);
      // TODO: freq?
    });

    it('should fire comments event: test2', function(){
      testComments('test2');
    });

    it('should fire play event: test2', function(){
      testPlay('test2');
    });

    it('should fire op, amp & freq events: test2', function(){
      var change = testChange('test2');
      // TODO: check these values, I think this might be wrong
      expect(change.amp).to.have.members([ 0, 0, 0, 0, 0, 0, 0, 51, 0 ]);
      // TODO: freq?
    });
  });
});

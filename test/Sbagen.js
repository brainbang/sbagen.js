var assert = require('chai').assert;

var Sbagen = require('..');

describe('Sbagen', function(){
  var test;
  
  it('should be creatable without sbagen code', function(){
    test = new Sbagen();
  });

  describe('addTime', function(){
    // lunchtime on my birthday
    var time = (new Date(1977, 1, 21, 12)).getMilliseconds();

    it('should be able to add relative for second-based time', function(){
      var t = test.addTime(time, '01:05:01');
      var expected = new Date(1977, 1, 21, 13, 5, 1); // 13:05:01
      assert.equal(t, expected.getMilliseconds());
    });

    it('should be able to add relative for minute-based time', function(){
      var t = test.addTime(time, '01:03');
      var expected = new Date(1977, 1, 21, 13, 3); // 13:03:00
      assert.equal(t, expected.getMilliseconds());
    });

    it('should be able to add time-of-day for second-based time', function(){
      var t = test.addTime(time, '12:01:01', true);
      var expected = new Date(1977, 1, 21, 12, 1, 1); // 12:01:01
      assert.equal(t, expected.getMilliseconds());
    });

    it('should be able to add time-of-day for minute-based time', function(){
      var t = test.addTime(time, '12:08', true);
      var expected = new Date(1977, 1, 21, 12, 8); // 12:08:00
      assert.equal(t, expected.getMilliseconds());
    });

    it('should know when it should be the next day', function(){
      var t = test.addTime(time, '01:08', true);
      var expected = new Date(1977, 1, 22, 1, 8); // 01:08, next day
      assert.equal(t, expected.getMilliseconds());
    });
  });
  
  describe('parse timecoded', function(){
    var timecoded = [
        '## simple tester',
        '',
        'theta6: pink/40 150+6/30',
        'test10: pink/40 100+1.5/30 200-4/27 400+8/1.5',
        'all-off: -',
        '',
        '16:00 theta6',
        'NOW theta6',
        '+00:03:30 == theta4 ->',
        'NOW+04:00 <> theta4',
        '12:00 theta-bursts'
      ].join('/n');

    it('should emit parse event', function(done){
      var test = new Sbagen(timecoded);
      test.on('parsed', function(){ done(); });
      test.parse();
    });

    it('should make sequence correctly', function(done){
      var test = new Sbagen(timecoded);
      test.on('parsed', function(){
        // TODO: check times
        done();
      });
      test.parse();
    });
  });
});
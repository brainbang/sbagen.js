var assert = require('chai').assert;

var Sbagen = require('..');

describe('Sbagen', function(){
  it('should instantiate without sbagen code', function(){
    var test = new Sbagen();
  });

  describe('addTime()', function(){
    // lunchtime on my birthday
    var time = (new Date(1977, 1, 21, 12)).getTime();
    var test = new Sbagen();

    it('should be able to add relative for second-based time', function(){
      var t = test.addTime(time, '01:05:01');
      var expected = new Date(1977, 1, 21, 13, 5, 1); // 13:05:01
      assert.equal((expected.getTime()-time)/1000, t);
    });

    it('should be able to add relative for minute-based time', function(){
      var t = test.addTime(time, '01:03');
      var expected = new Date(1977, 1, 21, 13, 3); // 13:03:00
      assert.equal((expected.getTime()-time)/1000, t);
    });

    it('should be able to add time-of-day for second-based time', function(){
      var t = test.addTime(time, '12:01:01', true);
      var expected = new Date(1977, 1, 21, 12, 1, 1); // 12:01:01
      assert.equal((expected.getTime()-time)/1000, t);
    });

    it('should be able to add time-of-day for minute-based time', function(){
      var t = test.addTime(time, '12:08', true);
      var expected = new Date(1977, 1, 21, 12, 8); // 12:08:00
      assert.equal((expected.getTime()-time)/1000, t);
    });

    it('should know when it should be the next day', function(){
      var t = test.addTime(time, '01:08', true);
      var expected = new Date(1977, 1, 22, 1, 8); // 01:08, next day
      assert.equal((expected.getTime()-time)/1000, t);
    });
  });

  describe('parse()', function(){
    var simplecode = [
        '## simple tester',
        '',
        'test11: pink/40 150+6/30',
        'test12: pink/40 100+1.5/30 200-4/27 400+8/1.5',
        'test13: -',
        '',
        'NOW test11',             // 0
        'NOW test12',             // 0
        '+00:03:30 == test13 ->', // 03:30
        'NOW+04:00 <> test11',
        '+12:00 test12'
      ].join('\n');

    it('should emit `parsed` event', function(done){
      var test = new Sbagen(simplecode);
      test.on('parsed', function(){ done(); });
      test.parse();
    });

    it('should handle times', function(done){
      var test = new Sbagen(simplecode);
      test.on('parsed', function(seq){
        assert.equal(0, seq[0][0]);
        assert.equal(0, seq[1][0]);
        assert.equal(210, seq[2][0]);
        assert.equal(14400, seq[3][0]);
        assert.equal(57600, seq[4][0]);
        done();
      });
      test.parse();
    });

    it('should handle ops', function(done){
      var test = new Sbagen(simplecode);
      test.on('parsed', function(seq){
        assert.equal('pink/40|150+6/30', seq[0][1].join('|'));
        assert.equal('pink/40|100+1.5/30|200-4/27|400+8/1.5', seq[1][1].join('|'));

        assert.equal('==|-|->', seq[2][1].join('|'));
        assert.equal('<>|pink/40|150+6/30', seq[3][1].join('|'));
        assert.equal('pink/40|100+1.5/30|200-4/27|400+8/1.5', seq[4][1].join('|'));

        done();
      });
      test.parse();
    });
  });
  
  describe('sequencer', function(){
    var seqcode = [
        'test1: pink/10',
        'test2: pink/20',
        'test3: pink/30',
        'test4: pink/40',
        'test5: pink/50',
        'NOW test1',          // 0
        '+00:00:01 test2',    // 1
        'NOW+00:00:02 test3', // 2
        '+00:00:01 test4',    // 3
        '+00:00:01 test5'     // 3
      ].join('\n');

    // make a new sequencer with 1 callback
    function setup(cb){
      var test = new Sbagen(seqcode);
      test.parse();
      var start = (new Date()).getTime();
      test.on('op', function(op,time,i,seq){
        cb(op,time,i,seq,Math.floor(((new Date()).getTime()-start)/1000));
      });
      test.play();
      return test;
    }

    it('should handle `NOW test1`', function(done){
      setup(function(op,time,i,seq,elapsed){
        if (i===0){
          if (op[0]==='pink/10' && elapsed===0 && elapsed===time){
            done();
          }else{
            done(new Error('test1 took ' + elapsed + ' but should have taken 0 ('+time+')'));
          }
        }
      });
    });
   
    it('should handle `+00:00:01 test2`', function(done){
      setup(function(op,time,i,seq,elapsed){
        if (i===1){
          if (op[0]==='pink/20' && elapsed===1 && elapsed===time){
            done();
          }else{
            done(new Error('test2 took ' + elapsed + ' but should have taken 1 ('+time+')'));
          }
        }
      });
    });

    it('should handle `NOW+00:00:02 test3`', function(done){
      setup(function(op,time,i,seq,elapsed){
        if (i===2){
          if (op[0]==='pink/30' && elapsed===2 && elapsed===time){
            done();
          }else{
            done(new Error('test3 took ' + elapsed + ' but should have taken 2 ('+time+')'));
          }
        }
      });
    });

    it('should handle `+00:00:01 test4`', function(done){
      setup(function(op,time,i,seq,elapsed){
        if (i===3){
          // console.log('test4', elapsed, time);

          if (op[0]==='pink/40' && elapsed===3 && elapsed===time){
            done();
          }else{
            done(new Error('test4 took ' + elapsed + ' but should have taken 3 ('+time+')'));
          }
        }
      });
    });

    it('should allow sequencer stop', function(done){
      var test = setup(function(op,time,i,seq,elapsed){
        if (i > 2){
          done(Error('extra op called after stop'));
        }
      });

      // stop sequencer in 2 seconds
      setTimeout(function(){
        test.stop();
      },2000);

      // mark done in 5 seconds
      setTimeout(function(){
        done();
      },5000);
    });
  });
});
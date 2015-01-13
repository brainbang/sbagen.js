var expect = require('chai').expect;
var ml = require('multiline');

var testSequence = ml(function(){/*
test1: pink/10 pink/20 pink/30
test2: mix/20
test3: 400+10/10
test4: 440/20
test5: bell+480/20
test6: spin:100+10/20
test7: wave1:400+10/10
off: -

NOW test1
 +00:00:01 test2
+00:00:02 test3
+00:00:03 test4
NOW+00:00:04 test5
+00:00:05 test6
+00:00:06 test7
+00:00:07 off
*/});

var Sbagen = require('..');

describe('Sbagen', function(){
  it('should instantiate without sbagen code', function(){
    var test = new Sbagen();
    expect(test).to.be.instanceOf(Sbagen);
  });
  
  describe('.offsetToMs()', function(){
    var test;

    before(function(){
      test = new Sbagen();
    });

    it('should handle 00:01', function(){
      expect(test.offsetToMs('00:01')).to.be.equal(60000);
    });

    it('should handle 00:05', function(){
      expect(test.offsetToMs('00:05')).to.be.equal(300000);
    });

    it('should handle 00:01:00', function(){
      expect(test.offsetToMs('00:01:00')).to.be.equal(60000);
    });

    it('should handle 15:01:00', function(){
      expect(test.offsetToMs('15:01:00')).to.be.equal(54060000);
    });
  });

  describe('.timeToMs()', function(){
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
      expect(test.timeToMs('00:01')).to.be.equal(d.getTime());
    });

    it('should handle 00:05:00', function(){
      var d = new Date();
      d.setMilliseconds(0);
      d.setSeconds(0);
      d.setMinutes(5);
      d.setHours(0);
      d.setDate(d.getDate() + 1);
      expect(test.timeToMs('00:05:00')).to.be.equal(d.getTime());
    });
    
  });
});
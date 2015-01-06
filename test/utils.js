var assert = require('chai').assert;

var trimArray = require('../utils/trimArray.js');
var removeBlank = require('../utils/removeBlank.js');

var test = ['', 1, 2, 0, ' ', 'hello', 'hello ', ' hello'];

describe('utils', function(){
  describe('removeBlank', function(){
  	var tested = test.filter(removeBlank);
  	
  	it('filtered output should be an array', function(){
  		assert.isArray(tested);
    });

    it('should remove blank string elements', function(){
    	assert.lengthOf(tested, 7);
    });
  });

  describe('trimArray', function(){
  	var tested = test.map(trimArray);
  	
  	it('mapped output should be an array', function(){
  		assert.isArray(tested);
    });

    it('should not remove any elements', function(){
    	assert.lengthOf(tested, 8);
    });

    it('should remove whitespace from all elements', function(){
    	assert.equal(tested[0],'');
      assert.equal(tested[1], 1);
      assert.equal(tested[2], 2);
      assert.equal(tested[3], 0);
      assert.equal(tested[4], '');
      assert.equal(tested[5], 'hello');
      assert.equal(tested[6], 'hello');
      assert.equal(tested[7], 'hello');
    });
  });
});
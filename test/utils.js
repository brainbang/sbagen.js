var expect = require('chai').expect;
var ml = require('multiline');
var stripComments = require('../utils/stripComments.js');

var testSequence = ml(function(){/*
## cool stuff
 # more cool
 looks good  
*/});

describe('utils', function(){
  describe('stripComments()', function(){
    it('should remove comments and leading/trailing whitespace', function(){
      expect(stripComments(testSequence)).to.be.equal('looks good');
    });
  });
});
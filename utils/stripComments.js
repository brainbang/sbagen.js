var stripComments =  module.exports = (function () {
  var re = /^\s?#.+$/gm;
  return function (s) {
    return s
    	.replace(re, '')
    	.split('\n')
    	.filter(function(l){
    		return (l !== '');
    	})
    	.map(function(l){
    		return l.trim();
    	})
    	.join('\n');
  };
}());
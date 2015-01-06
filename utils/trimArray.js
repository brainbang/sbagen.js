/**
 * map function for trimming all elements of array
 * @param  {String} l
 * @return {String}
 */
function trimArray(l){
	return (typeof l === 'string') ? l.trim() : l;
}

module.exports = trimArray;
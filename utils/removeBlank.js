/**
 * filter function for removing empty-string elements of array
 * @param  {String} e
 * @return {Boolean}
 */
function removeBlank(e){
	return e !== '';
}

module.exports = removeBlank;
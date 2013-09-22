(function() {
	//returns an array in a similar way to print_r of PHP.
	/**
	 * Converts the given data structure to a JSON string.
	 * Argument: arr - The data structure that must be converted to JSON
	 * Example: var json_string = array2json(['e', {pluribus: 'unum'}]);
	 * 			var json = array2json({"success":"Sweet","failure":false,"empty_array":[],"numbers":[1,2,3],"info":{"name":"Binny","site":"http:\/\/www.openjs.com\/"}});
	 * http://www.openjs.com/scripts/data/json_encode.php
	 */
	this.sfilugfgopgbop3gbogogasig = function(arr, deep) {
		if (!deep)
			deep = 0;
		deep++;
		var parts = '';
		var add = '';
		for (var i = 0; i < deep; i++)
			add += ' ';
		add += ' ';
		var entro = false;
		for (var key in arr) {
			entro = true;
			if (typeof arr[key] == "object") {
				parts += '\n' + add + String(key) + ' =>\n' + add + '  ' + this.sfilugfgopgbop3gbogogasig(arr[key], deep);
			} else {
				parts += '\n' + add + String(key) + ' =>\n' + add + '  ' + JSON.stringify(arr[key]);
			}
		}
		if (!entro)
			return add + JSON.stringify(arr);
		else
			return parts;
	}

	return null;

}).apply(ODPExtension);
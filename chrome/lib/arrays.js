(function() {
	//removes duplicate values from an array
	this.arrayUnique = function(anArray) {
		var tmp = [];
		for (var id in anArray) {
			if (!this.inArray(tmp, anArray[id])) {
				tmp[tmp.length] = anArray[id];
			}
		}
		return tmp;
	};
	//removes duplicate values from an array
	this.arrayUniqueObjects = function(anArray, aFunction) {
		var unique = {};
		var tmp = [];
		anArray.forEach(function(x) {
			var key = aFunction(x);
			if (!(key in unique)) {
				tmp[tmp.length] = x;
				unique[key] = true;
			}
		});
		return tmp;
	}
	//checks if a value exists in an array
	this.inArray = function(anArray, some) {
		return anArray.indexOf(some) != -1;

		for (var id in anArray) {
			if (anArray[id] == some)
				return true;
		}
		return false;
	};
	//sorts using the current locale.
	this.sortLocale = function(a, b) {
		return String(a).localeCompare(String(b));
	}

	return null;

}).apply(ODPExtension);
(function() {

	this.categoriesTXTGetDatabaseNameFromCategory = function(aCategory) {
		//fixing regular expresions
		aCategory = aCategory.replace(/^\^/, '').replace(/^([^\[]+)\[.*/, '$1');
		var aNodes = aCategory.split('/');
		var database;
		if (aNodes.length > 2 && this.inArray(this.shared.categories.txt.databases, aNodes[0] + '-' + aNodes[1] + '-' + aNodes[2] + '.txt'))
			database = aNodes[0] + '-' + aNodes[1] + '-' + aNodes[2] + '.txt';
		else if (aNodes.length > 1 && this.inArray(this.shared.categories.txt.databases, aNodes[0] + '-' + aNodes[1] + '-.txt'))
			database = aNodes[0] + '-' + aNodes[1] + '-.txt';
		else if (aNodes.length > 1 && this.inArray(this.shared.categories.txt.databases, aNodes[0] + '-' + aNodes[1] + '.txt'))
			database = aNodes[0] + '-' + aNodes[1] + '.txt';
		else if (this.inArray(this.shared.categories.txt.databases, aNodes[0] + '.txt'))
			database = aNodes[0] + '.txt';
		else {
			if (aNodes[0].toLowerCase() == 'world')
				database = 'world';
			else if (aNodes[0].toLowerCase() == 'regional')
				database = 'regional';
			else
				database = '';
		}

		return database;
	}
	return null;

}).apply(ODPExtension);
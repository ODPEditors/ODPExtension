(function() {

	this.addListener('preferencesLoadGlobal', function() {

		if (ODPExtension.categoriesTXTExists())
			ODPExtension.shared.categories.txt.exists = true;

	});

	//returns true if the categories.txt database exists
	this.categoriesTXTExists = function() {
		return this.categoriesTXTDatabaseOpen().tableExists('categories_txt');
	}

	return null;

}).apply(ODPExtension);
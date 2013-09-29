(function() {

	//returns true if the categories.txt database exists
	this.categoriesTXTExists = function() {
		return this.rdfDatabaseOpen().tableExists('categories_txt');
	}

	return null;

}).apply(ODPExtension);
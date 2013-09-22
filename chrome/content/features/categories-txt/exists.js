(function() {

	//returns true if the categories.txt database exists
	this.categoriesTXTExists = function() {
		return (this.folderListContent('categories.txt/').length > 2);
	}

	return null;

}).apply(ODPExtension);
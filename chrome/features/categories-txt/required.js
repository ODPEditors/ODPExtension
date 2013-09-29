(function() {

	//returns true if the categories.txt database exists if not alerts the user that this tool needs the file
	this.categoriesTXTRequired = function() {
		if (this.shared.categories.txt.exists)
			return true;
		else {
			this.alert(this.getString('categories.txt.dependent'));
			return false;
		}
	}

	return null;

}).apply(ODPExtension);
(function() {

	var db
	this.addListener('databaseCreate', function() {
		db = ODPExtension.categoriesTXTDatabaseOpen()
	});

	//returns true if the categories.txt database exists
	this.categoriesTXTExists = function() {
		return db.exists;
	}

	//returns true if the categories.txt database exists if not alerts the user that this tool needs the file
	this.categoriesTXTRequired = function() {
		if (db.exists)
			return true;
		else {
			this.alert(this.getString('categories.txt.dependent'));
			return false;
		}
	}

	return null;

}).apply(ODPExtension);
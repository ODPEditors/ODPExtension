(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//opens a connection to the SQLite database

	var database = false;

	this.categoriesTXTDatabaseOpen = function() {
		if (!database) {
			database = this.databaseGet('CategoriesTXT');
			database.executeSimple('PRAGMA temp_store = 2');
			database.executeSimple('PRAGMA journal_mode = memory');//memory
			database.executeSimple('PRAGMA read_uncommitted = true');

			//database.executeSimple('PRAGMA synchronous = 0'); does not free mem.
			database.exists = database.tableExists('categories_txt');
		}
		return database;
	}
	this.categoriesTXTDatabaseClose = function() {
		if (database) {
			database.close();
			database = false;
		}
	}
	return null;

}).apply(ODPExtension);
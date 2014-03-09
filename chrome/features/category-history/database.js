(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//opens a connection to the SQLite database

	var database = false;

	this.categoriesHistoryDatabaseOpen = function() {
		if (!database) {
			database = this.databaseGet('ODPExtension');
			database.executeSimple('PRAGMA temp_store = 3');
			database.executeSimple('PRAGMA read_uncommitted = true');
			database.executeSimple('PRAGMA journal_mode = memory');//memory
			//database.executeSimple('PRAGMA synchronous = 0');  does not free mem.
			database.exists = database.tableExists('categories_history');

		}
		return database;
	}
	this.categoriesHistoryDatabaseClose = function() {
		if (database) {
			database.close();
			database = false;
		}
	}
	return null;

}).apply(ODPExtension);
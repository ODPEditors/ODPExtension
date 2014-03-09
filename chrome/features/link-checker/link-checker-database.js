(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//opens a connection to the RDF SQLite database

	var database = false;

	this.linkCheckerDatabaseOpen = function() {
		if (!database) {
			database = this.databaseGet('LinkChecker');
			database.executeSimple('PRAGMA temp_store = 2');
			database.executeSimple('PRAGMA secure_delete = false');
			database.executeSimple('PRAGMA journal_mode = memory');//memory
			//database.executeSimple('PRAGMA synchronous = 0');  does not free mem.
		}
		return database;
	}
	this.linkCheckerDatabaseClose = function() {
		if (database) {
			database.close();
			database = false;
		}
	}
	return null;

}).apply(ODPExtension);
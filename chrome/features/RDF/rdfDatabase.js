(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//opens a connection to the RDF SQLite database

	var database = false;

	this.rdfDatabaseOpen = function() {
		if (!database) {
			database = this.databaseGet('RDF');
			database.executeSimple('PRAGMA temp_store = 2');
			database.executeSimple('PRAGMA journal_mode = memory');
			//database.executeSimple('PRAGMA synchronous = 0');  does not free mem.
			database.exists = database.tableExists('uris');
		}
		return database;
	}
	this.rdfDatabaseClose = function() {
		if (database) {
			database.close();
			database = false;
		}
	}
	return null;

}).apply(ODPExtension);
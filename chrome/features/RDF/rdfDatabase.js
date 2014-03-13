(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//opens a connection to the RDF SQLite database

	var database = false;

	this.rdfDatabaseOpen = function() {
		if (!database) {
			database = this.databaseGet('RDF');
			database.executeSimple('PRAGMA temp_store = 2');//2
			database.executeSimple('PRAGMA read_uncommitted = true');
			database.executeSimple('PRAGMA cache_spill = false');
			database.executeSimple('PRAGMA secure_delete = false');
			database.executeSimple('PRAGMA journal_mode = memory');//memory
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
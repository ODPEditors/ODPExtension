(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//opens a connection to the RDF SQLite database

	var database = false;

	this.afroditaDatabaseOpen = function() {
		if (!database) {
			database = this.databaseGet('Afrodita');
			database.executeSimple('PRAGMA temp_store = 2');
			database.executeSimple('PRAGMA secure_delete = false');
			database.executeSimple('PRAGMA read_uncommitted = true');
			database.executeSimple('PRAGMA journal_mode = memory');//memory
			//database.executeSimple('PRAGMA synchronous = 0');  does not free mem.
		}
		return database;
	}
	this.afroditaDatabaseClose = function() {
		if (database) {
			database.close();
			database = false;
		}
	}
	return null;

}).apply(ODPExtension);
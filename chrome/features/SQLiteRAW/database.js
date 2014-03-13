(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//opens a connection to the RDF SQLite database

	var database = false;

	this.afroditaDatabaseOpen = function() {
		if (!database) {
			database = this.databaseGet('Afrodita');
			//database.executeSimple('PRAGMA temp_store = 2');
			//database.executeSimple('PRAGMA read_uncommitted = true');
			database.executeSimple('PRAGMA secure_delete = false');

			//The MEMORY journaling mode stores the rollback journal in volatile RAM. This saves disk I/O but at the expense of database safety and integrity. If the application using SQLite crashes in the middle of a transaction when the MEMORY journaling mode is set, then the database file will very likely go corrupt.
			//database.executeSimple('PRAGMA journal_mode = memory');
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
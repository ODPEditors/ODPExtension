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

			//The MEMORY journaling mode stores the rollback journal in volatile RAM. This saves disk I/O but at the expense of database safety and integrity. If the application using SQLite crashes in the middle of a transaction when the MEMORY journaling mode is set, then the database file will very likely go corrupt.
			//database.executeSimple('PRAGMA journal_mode = memory');

			//When synchronous is FULL (2), the SQLite database engine will use the xSync method of the VFS to ensure that all content is safely written to the disk surface prior to continuing. This ensures that an operating system crash or power failure will not corrupt the database.
			database.executeSimple('PRAGMA synchronous = OFF');
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
(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//opens a connection to the SQLite database

	var database = false;

	this.categoriesHistoryDatabaseOpen = function() {
		if (!database) {
			database = this.databaseGet('ODPExtension');
			database.executeSimple('PRAGMA temp_store = 2');
			database.executeSimple('PRAGMA read_uncommitted = true');
			//The MEMORY journaling mode stores the rollback journal in volatile RAM. This saves disk I/O but at the expense of database safety and integrity. If the application using SQLite crashes in the middle of a transaction when the MEMORY journaling mode is set, then the database file will very likely go corrupt.
			//database.executeSimple('PRAGMA journal_mode = memory');

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
(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//opens a connection to the RDF SQLite database

	this.categoriesHistoryDatabaseOpen = function() {
		if (!this.categoriesHistory) {
			this.categoriesHistory = this.databaseGet('ODPExtension');
			this.categoriesHistory.executeSimple('PRAGMA temp_store = 2');
			this.categoriesHistory.executeSimple('PRAGMA journal_mode = memory');
			//this.categoriesHistory.executeSimple('PRAGMA synchronous = 0');  does not free mem.
		}
		return this.categoriesHistory;
	}
	this.categoriesHistoryDatabaseClose = function() {
		this.categoriesHistory.close();
		this.categoriesHistory = false;
	}
	return null;

}).apply(ODPExtension);
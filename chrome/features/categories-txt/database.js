(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//opens a connection to the RDF SQLite database

	this.categoriesTXTDatabaseOpen = function() {
		if (!this.categoriesTXT) {
			this.categoriesTXT = this.databaseGet('CategoriesTXT');
			this.categoriesTXT.executeSimple('PRAGMA temp_store = 2');
			this.categoriesTXT.executeSimple('PRAGMA journal_mode = memory');
			//this.categoriesTXT.executeSimple('PRAGMA synchronous = 0'); does not free mem.
		}
		return this.categoriesTXT;
	}
	this.categoriesTXTDatabaseClose = function() {
		this.categoriesTXT.close();
		this.categoriesTXT = false;
	}
	return null;

}).apply(ODPExtension);
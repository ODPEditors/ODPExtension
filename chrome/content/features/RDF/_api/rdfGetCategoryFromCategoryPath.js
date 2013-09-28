(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.rdfGetCategoryFromCategoryPath = function(aCategory) {
		this.rdfDatabaseOpen(); //opens a connection to the RDF SQLite database.

		//sql query
		var query = this.DBRDF.query('\
											 	SELECT \
													* \
												FROM \
													`PREFIX_categories` \
												where \
													`categories_path` = :categories_path \
											');
		query.params('categories_path', aCategory);

		//searching
		return this.DBRDF.fetchObject(query);
	}
	return null;

}).apply(ODPExtension);
(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.rdfGetCategoryFromCategoryID = function(aCategory) {
		this.rdfOpen(); //opens a connection to the RDF SQLite database.

		//sql query
		var query = this.DBRDF.query(' \
											 	SELECT \
													* \
												FROM \
													`PREFIX_categories` \
												where \
													`categories_id` = :categories_id \
											');
		query.params('categories_id', aCategory);

		//searching
		return this.DBRDF.fetchObject(query);
	}
	return null;

}).apply(ODPExtension);
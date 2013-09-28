(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.rdfGetCategoryRelatedCategoriesFromCategoryID = function(aCategoryID) {
		this.rdfDatabaseOpen(); //opens a connection to the RDF SQLite database.

		var query = this.DBRDF.query(' \
											 	SELECT \
													* \
												FROM \
													`PREFIX_categories`, \
													`PREFIX_related` \
												where \
													`related_id_from` = :categories_id and \
													`categories_id` = `related_id_to` \
												order by \
													related_id_to asc \
											');
		query.params('categories_id', aCategoryID);

		if (!anArrayResults)
			var anArrayResults = [];

		var row;
		for (var i = 0; row = this.DBRDF.fetchObjects(query); i++) {
			anArrayResults.push(row);
		}
		return anArrayResults;
	}
	return null;

}).apply(ODPExtension);
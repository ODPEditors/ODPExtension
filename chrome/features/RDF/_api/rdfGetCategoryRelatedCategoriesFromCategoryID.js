(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;
	var db, query;
	this.addListener('databaseReady', function() {

		db = ODPExtension.rdfDatabaseOpen();
		if (db.exists){
			query = db.query(' \
												 	SELECT \
														* \
													FROM \
														`categories` c , \
														`related` r \
													where \
														r.`from` = :categories_id and \
														c.`id` = r.`to` \
													order by \
														r.`to` asc \
												');
		}
	});
	this.rdfGetCategoryRelatedCategoriesFromCategoryID = function(aCategoryID) {

		query.params('categories_id', aCategoryID);

		var anArrayResults = [];

		var row;
		for (var i = 0; row = db.fetchObjects(query); i++) {
			anArrayResults[anArrayResults.length] = row.category;
		}
		return anArrayResults;
	}
	return null;

}).apply(ODPExtension);
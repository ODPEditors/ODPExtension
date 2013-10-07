(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;
	var db, query;
	this.addListener('databaseReady', function() {

		db = ODPExtension.rdfDatabaseOpen();
		if (db.exists){
			//sql query
			query = db.query(' \
												 	SELECT \
														* \
													FROM \
														`categories` c  \
													where \
														c.`parent` =  :parent \
												');
		}
	});
	this.rdfGetCategorySubcategoriesFromCategoryPath = function(aCategory) {

		query.params('parent', this.rdfGetCategoryFromCategoryPath(aCategory).id);

		var row, rows = [];
		for (var i = 0; row = db.fetchObjects(query); i++) {
			rows[i] = row;
		}
		return rows;
	}
	return null;

}).apply(ODPExtension);
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
														`categories` c  \
													where \
														c.`id` = :id \
												');
		}
	});
	this.rdfGetCategoryFromCategoryID = function(aCategory) {


		query.params('id', aCategory);

		//searching
		return db.fetchObject(query);
	}
	return null;

}).apply(ODPExtension);
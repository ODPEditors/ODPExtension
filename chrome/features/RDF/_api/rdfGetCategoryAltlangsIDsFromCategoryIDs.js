(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	var db, query;
	this.addListener('databaseReady', function() {

		db = ODPExtension.rdfDatabaseOpen();
		if (db.exists){

		}
	});
	this.rdfGetCategoryAltlangsIDsFromCategoryIDs = function(aCategoryID, anArrayResults) {

		try {
			aCategoryID = aCategoryID.join(',');
		} catch (e) {  }

		query = db.query(' \
										SELECT \
											DISTINCT(c.id),\
											c.category \
										FROM \
											`categories` c ,\
											`altlang` a \
										where \
											a.`from` in  ( '+aCategoryID+' ) and \
											(c.`id` = a.`to`) \
										order by \
											c.`category` asc \
									');

		if (!anArrayResults)
			var anArrayResults = [];

		var row;
		for (var i = 0; row = db.fetchObjects(query); i++) {
			anArrayResults[anArrayResults.length] = row.id;
		}
		query.delete();

		return anArrayResults;
	}
	return null;

}).apply(ODPExtension);
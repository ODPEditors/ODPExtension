(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;
	var db, query;
	this.addListener('databaseReady', function() {

		db = ODPExtension.rdfDatabaseOpen();
		if (db.exists){

		}
	});
	this.rdfGetCategoryAltlangsIDsToCategoryIDs = function(aCategoryID, anArrayResults) {

		try {
			aCategoryID = aCategoryID.join(',');
		} catch (e) {   }

		query = db.query(' \
										SELECT \
											DISTINCT(c.id) \
										FROM \
											`categories` c , \
											`altlang` a \
										where \
											a.`to` in  ( '+aCategoryID+' ) and \
											(c.`id` = a.`from`) \
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
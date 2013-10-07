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
														c.`category` GLOB :category \
														AND \
														( \
															regexp(\'--\', c.`name`) or \
															regexp(\' \', c.`name`) or \
															regexp(\'__\', c.`name`)
														) \
													order by \
														c.`category` asc \
												');
		}
	});
	this.rdfFindCategorySubcategoriesWithInvalidName = function(aCategory) {


		var aMsg = 'Categories with a " " or with a double "_" or "-" in the category "{CATEGORY}" or on any of its subcategories ({RESULTS})'; //informative msg and title of document

		query.params('category', aCategory + '*');

		//searching
		var row, rows = [],
			aData = '';
		for (var results = 0; row = db.fetchObjects(query); results++) {
			aData += row.category;
			aData += this.__LINE__;
		}

		//sets msg
		aMsg = aMsg.replace('{CATEGORY}', aCategory).replace('{RESULTS}', results);

		//display results
		if (results > 0)
			this.tabOpen(this.fileCreateTemporal(
				'RDF.html',
				aMsg,
				'<div class="header">' + aMsg + '</div>' +
				'<pre style="background-color:white !important;padding:2px;">' + aData +
				'</pre>'), true);
		else
			this.notifyTab(aMsg, 8);
	}
	return null;

}).apply(ODPExtension);
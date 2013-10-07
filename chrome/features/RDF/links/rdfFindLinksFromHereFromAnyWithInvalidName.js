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
														l.`name`, l.`to`, c.`category` \
													FROM \
														`categories` c , \
														`link` l \
													where \
														l.`from` IN \
														( \
														 	SELECT \
																c.`id` \
															FROM \
																`categories` c  \
															WHERE \
																c.`category` GLOB  :category \
														 ) \
														AND \
														( \
															regexp(\'--\', l.`name`) or \
															regexp(\' \', l.`name`) or \
															regexp(\'__\', l.`name`) \
														) \
														AND \
														( \
															c.`id` = l.`from` \
														) \
													order by \
														c.`category` asc \
												');
		}
	});
	this.rdfFindLinksFromHereFromAnyWithInvalidName = function(aCategory) {

		var aMsg = '@links with a " " or with a double "_" or "-" in the name from the category "{CATEGORY}" or from any of its subcategories ({RESULTS})'; //informative msg and title of document

		query.params('category', aCategory + '*');

		//searching
		var row, rows = [],
			aData = '';
		for (var results = 0; row = db.fetchObjects(query); results++) {
			aData += row.category;
			aData += this.__LINE__;
			aData += this.__LINE__;
			aData += '\t';
			aData += row.name;
			aData += '<b style="color:green;font-size:16px;">@</b>';
			aData += this.rdfGetCategoryFromCategoryID(row.to).category;
			aData += this.__LINE__;
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
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
														l.`name`, c.`category` \
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
																c.`category` = :category \
														 ) AND \
														c.`id` = l.`to` \
													order by \
														l.`to` asc \
												');
		}
	});
	this.rdfFindLinksFromHere = function(aCategory) {

		var aMsg = '@links from "{CATEGORY}" ({RESULTS})'; //informative msg and title of document

		query.params('category', aCategory);

		//searching
		var row, rows = [],
			aData = '';
		for (var results = 0; row = db.fetchObjects(query); results++) {
			aData += row.name;
			aData += '<b style="color:green;font-size:16px;">@</b>';
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
				'<pre>' + aData +
				'</pre>'), true);
		else
			this.notifyTab(aMsg, 8);
	}
	return null;

}).apply(ODPExtension);
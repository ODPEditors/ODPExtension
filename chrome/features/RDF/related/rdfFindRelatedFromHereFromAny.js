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
														c.`category`, r.`from`  \
													FROM \
														`categories` c , \
														`related` r \
													where \
														r.`from` IN \
														( \
														 	SELECT \
																c.`id` \
															FROM \
																`categories` c  \
															WHERE \
																c.`category` GLOB  :category \
														 ) AND \
														c.`id` = r.`to` \
													order by \
														r.`from` asc, \
														r.`to` asc \
												');
		}
	});
	this.rdfFindRelatedFromHereFromAny = function(aCategory) {

		var aMsg = 'Related categories from "{CATEGORY}" or from any of its subcategories ({RESULTS})'; //informative msg and title of document


		query.params('category', aCategory + '*');

		//searching
		var row, rows = [],
			aData = '',
			last, tmp;
		for (var results = 0; row = db.fetchObjects(query);) {
			tmp = row.from
			if (last != tmp) {
				results++
				last = tmp;
				aData += this.__LINE__;
				aData += this.rdfGetCategoryFromCategoryID(last).category;
				aData += this.__LINE__;
				aData += this.__LINE__;
			}
			aData += '\t';
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
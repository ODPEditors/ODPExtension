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
																c.`category`, a.`from` as a_from \
															FROM \
																`categories` c , \
																`altlang` a \
															where \
																a.`from` IN \
																( \
																 	SELECT \
																		c.`id` as id \
																	FROM \
																		`categories` c  \
																	WHERE \
																		c.`category` GLOB  :category_path \
																 ) AND \
																c.`id` = a.`to` \
															order by \
																a.`from` asc, \
																a.`to` asc \
			 \
														');
		}
	});
	this.rdfFindAltlangsFromHereFromAny = function(aCategory) {


		var aMsg = 'Alternative languages from "{CATEGORY}" and from any of its subcategories ({RESULTS})'; //informative msg and title of document


		query.params('category_path', aCategory + '*');

		//searching
		var row, rows = [],
			aData = '',
			last, tmp;
		for (var results = 0; row = db.fetchObjects(query);) {
			tmp = row.a_from
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
				'<pre style="background-color:white !important;padding:2px;">' + aData +
				'</pre>'), true);
		else
			this.notifyTab(aMsg, 8);
	}
	return null;

}).apply(ODPExtension);
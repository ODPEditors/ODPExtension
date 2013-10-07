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
														c.`category` GLOB  :category and \
														c.`id` not in \
														( \
														 	select \
																a.`to` \
															from \
																`altlang` a \
														) \
													order by \
														c.`category` asc \
												');
		}
	});
	this.rdfFindAltlangsCategoriesWithoutIncoming = function(aCategory) {


		var aMsg = 'Categories without incoming alternative languages on "{CATEGORY}" and on its subcategories ({RESULTS})'; //informative msg and title of document


		query.params('category', aCategory + '*');


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
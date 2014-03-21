(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;
	var db, query;
	this.addListener('databaseReady', function() {

		db = ODPExtension.rdfDatabaseOpen();
		if (db.exists){
			//sql query
			query = db.query(' SELECT u.uri, u.description, u.title, c.category FROM uris u, categories c where u.category_id in (select id from categories where category GLOB :category) and c.id = u.category_id order by c.category asc, u.uri asc');
		}
	});
	this.rdfFindSitesCategory = function(aCategory) {

		var aMsg = 'Sites listed in "{CATEGORY}" ({RESULTS})'; //informative msg and title of document

		query.params('category', aCategory+'*');

		var urls = []

		//searching
		var row, rows = [],
			aData = '';
		for (var results = 0; row = db.fetchObjects(query); results++) {
			urls[urls.length] = row.uri

			aData += this.rdfTemplatedSite(row)
			aData += this.__LINE__;
		}

		urls = this.arrayUnique(urls);
		aData += this.__LINE__+this.__LINE__+(urls.join(this.__LINE__))

		//sets msg
		aMsg = aMsg.replace('{CATEGORY}', aCategory).replace('{RESULTS}', results);

		//display results
		if (results > 0)
			this.tabOpen(this.fileCreateTemporal(
				'RDF.html',
				aMsg,
				'<div class="header">' + aMsg + '</div>' +
				'<pre style="background-color:white !important;"><ul>' + aData +
				'</pre>'), true);
		else
			this.notifyTab(aMsg, 8);

	}
	return null;

}).apply(ODPExtension);
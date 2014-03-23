(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;
	var db, query;
	this.addListener('databaseReady', function() {

		db = ODPExtension.rdfDatabaseOpen();
		if (db.exists){
			//sql query
			query = db.query(' SELECT u.uri, u.description, u.title, c.category, u.mediadate, u.cool, u.rss, u.atom, u.pdf FROM uris u, hosts h, categories c where h.host = :host and h.id = u.domain_id and c.id = u.category_id order by h.host asc, u.uri asc');
		}
	});
	this.rdfFindSitesDomain = function(aURL) {

		var aDomain = this.getDomainFromURL(aURL)
		var aMsg = 'Sites from domain "{DOMAIN}" ({RESULTS})'; //informative msg and title of document

		query.params('host', aDomain);

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
		aMsg = aMsg.replace('{DOMAIN}', aDomain).replace('{RESULTS}', results);

		//display results
		if (results > 0)
			this.tabOpen(this.fileCreateTemporal(
				'RDF.html',
				aMsg,
				'<div class="header">' + aMsg + '</div>' +
				'<pre><ul>' + aData +
				'</pre>'), true);
		else
			this.notifyTab(aMsg, 8);

	}
	return null;

}).apply(ODPExtension);
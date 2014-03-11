(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;
	var db, query;
	this.addListener('databaseReady', function() {

		db = ODPExtension.rdfDatabaseOpen();
		if (db.exists){
			//sql query
			query = db.query(' SELECT u.uri, u.description, u.title, c.category FROM uris u, hosts h, categories c where h.host = :host and h.id = u.subdomain_id and c.id = u.category_id order by h.host asc, u.uri asc');
		}
	});
	this.rdfFindSitesSubdomain = function(aURL) {

		var aDomain =  this.removeWWW(this.getSubdomainFromURL(aURL))
		var aMsg = 'Sites from subdomain "{DOMAIN}" ({RESULTS})'; //informative msg and title of document

		query.params('host', aDomain);

		var urls = []

		//searching
		var row, rows = [],
			aData = '';
		for (var results = 0; row = db.fetchObjects(query); results++) {
			urls[urls.length] = row.uri

			aData += '<li>[<a href="http://www.dmoz.org/editors/editurl/edit?url='+this.encodeUTF8(row.uri)+'&cat='+this.encodeUTF8(row.category)+'">edit</a>] - <a href="'+this.h(row.uri)+'">'+this.h(row.title)+'</a> - '+this.h(row.description)+'<br><small style="color:green">'+this.h(row.uri)+'</small><br><small>'+this.h(row.category)+'</small></li>'
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
				'<pre style="background-color:white !important;padding:2px;"><ul>' + aData +
				'</pre>'), true);
		else
			this.notifyTab(aMsg, 8);

	}
	return null;

}).apply(ODPExtension);
(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;
	var db, query_1, query_2;
	this.addListener('databaseReady', function() {

		db = ODPExtension.rdfDatabaseOpen();
		if (db.exists){
			//sql query
			query_1 = db.query(' \
												 	SELECT \
														c.`category` \
													FROM \
														`categories` c  																		');
			//sql query
			query_2 = db.query(' \
												 	SELECT \
														c.`category`, c.`description` \
													FROM \
														`categories` c  \
												where c.`category` GLOB  :category and c.`description` like "%href%" \
													order by \
														c.`category` asc \
											');
		}
	});
	this.rdfFindDescriptionsBrokenLinks = function(aCategory) {


		var aMsg = 'Categories with broken or external links in descriptions [{CATEGORY}] ({RESULTS}) '; //informative msg and title of document

		var categories = [];
		for (var results = 0; row = db.fetchObjects(query_1); results++) {
			categories[categories.length] = row.category;
		}

		var row, rows = [],
			aData = [],
			hrefs = [];

		query_2.params('category', aCategory + '*');

		for (var results = 0; row = db.fetchObjects(query_2); results++) {
			var found = false;

			var links = this.select('a', row.description, this.encodeURI('http://www.dmoz.org/' + row.category))

			for (var id in links) {
				var category = this.decodeUTF8(links[id].getAttribute('href') || '').replace('http://www.dmoz.org/', '').replace(/\/+$/, '') + '/'
				if (categories.indexOf(category) !== -1) {} else {

					if (!found) {
						found = true;
						var subtop = this.categoryGetSubTop(row.category);
						if (!aData[subtop]) {
							aData[subtop] = {}
							aData[subtop].str = '';
							aData[subtop].count = 0;
						}
						aData[subtop].count++;
						aData[subtop].str += '[<a href="http://www.dmoz.org/editors/editcat/desc?cat=' + this.encodeUTF8(row.category) + '">edit</a>] ' + row.category;
						aData[subtop].str += this.__LINE__;
						aData[subtop].str += this.__LINE__;
					}
					aData[subtop].str += "\t" + this.htmlSpecialCharsEncode(links[id].getAttribute('href'));
					aData[subtop].str += this.__LINE__;
				}
			}
			if (found)
				aData[subtop].str += this.__LINE__;
			//aData += row.description;
		}

		//display results
		if (results > 0) {
			for (var id in aData)
				this.tabOpen(this.fileCreateTemporal(
					id + '.html',
					aMsg.replace('{CATEGORY}', aCategory).replace('{RESULTS}', aData[id].count),
					'<div class="header">' + aMsg.replace('{CATEGORY}', aCategory).replace('{RESULTS}', aData[id].count) + '</div>' +
					'<pre>' + aData[id].str +
					'</pre>'), true);
		} else
			this.notifyTab(aMsg, 8);
	}

	return null;

}).apply(ODPExtension);
(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;
	var db, query_1, query_2, query_3;
	this.addListener('databaseReady', function() {

		db = ODPExtension.rdfDatabaseOpen();
		if (db.exists){
			//sql query
			query_1 = db.query(' \
												 	SELECT \
														*, \
														(LENGTH(c.category) - LENGTH(REPLACE(c.category, \'/\', \'\'))) AS cnt \
													FROM \
														`categories` c  \
													where \
														c.`category` GLOB  \'World/*\' and \
														c.`id` not in \
													( \
													 	select \
															a.`to` \
														from \
															`altlang` a \
													) \
													and \
													c.`id`  in \
													( \
													 	select \
															a.`from` \
														from \
															`altlang` a \
													) \
													order by \
																									cnt asc \
												');
			//sql query
			query_2 = db.query(' \
												 	SELECT \
														*, \
														(LENGTH(c.category) - LENGTH(REPLACE(c.category, \'/\', \'\'))) AS cnt \
													FROM \
														`categories` c  \
													where \
														c.`category` GLOB  \'World/*\' and \
														c.`id` not in \
													( \
													 	select \
															a.`to` \
														from \
															`altlang` a \
													) \
													and cnt > 2 and cnt < 7 \
													and \
													LENGTH(c.`name`) > 1 \
													order by \
														cnt asc \
												');
			//sql query
			query_3 = db.query(' \
												 	SELECT \
														*, \
														(LENGTH(c.category) - LENGTH(REPLACE(c.category, \'/\', \'\'))) AS cnt \
													FROM \
														`categories` c  \
													where \
														c.`category` GLOB  \'World/*\' and \
														c.`id` not in \
													( \
													 	select \
															a.`from` \
														from \
															`altlang` a \
													) \
													and cnt > 2 and cnt < 7 \
													and \
													LENGTH(c.`name`) > 1 \
													order by \
														cnt asc, \
														c.`category` asc \
												');
		}
	});
	this.rdfFindAltlangsGame = function(aCategory) {

		var id = 0;

		var categories = [];



		for (var results = 0; row = db.fetchObjects(query_1); results++) {
			categories[categories.length] = row.category
		}



		for (var results = 0; row = db.fetchObjects(query_2); results++) {
			categories[categories.length] = row.category
		}



		for (var results = 0; row = db.fetchObjects(query_3); results++) {
			categories[categories.length] = row.category
		}

		categories = this.arrayUnique(categories);

		var aData = '';
		var count = 0;
		for (var id in categories) {
			aData += '<span class="cat" id="c' + count + '" c="' + (categories[id]) + '">' + (categories[id]) + '</span>\n';
			count++;
		}

		//display results
		if (results > 0)
			this.tabOpen(this.fileCreateTemporal(
				'RDF.html',
				'Worldlinkerator World Cup',
				'<div class="header">Worldlinkerator World Cup!</div>' +
				'<pre>' + aData +
				'</pre>'), true);
		else
			this.notifyTab(aMsg, 8);
	}
	return null;

}).apply(ODPExtension);
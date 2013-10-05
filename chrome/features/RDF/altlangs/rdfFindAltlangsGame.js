(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.rdfFindAltlangsGame = function(aCategory) {
		this.rdfDatabaseOpen(); //opens a connection to the RDF SQLite database.

		var id = 0;

		var categories = [];

		//sql query
		var query = this.DBRDF.query(' \
											 	SELECT \
													*, \
													(LENGTH(categories_path) - LENGTH(REPLACE(categories_path, \'/\', \'\'))) AS cnt \
												FROM \
													`categories` \
												where \
													`categories_path` GLOB  \'World/*\' and \
													`categories_id` not in \
												( \
												 	select \
														`altlang_id_to` \
													from \
														`altlang` \
												) \
												and \
												`categories_id`  in \
												( \
												 	select \
														`altlang_id_from` \
													from \
														`altlang` \
												) \
												order by \
																								cnt asc \
											');

		for (var results = 0; row = this.DBRDF.fetchObjects(query); results++) {
			categories.push(row.categories_path)
		}

		//sql query
		var query = this.DBRDF.query(' \
											 	SELECT \
													*, \
													(LENGTH(categories_path) - LENGTH(REPLACE(categories_path, \'/\', \'\'))) AS cnt \
												FROM \
													`categories` \
												where \
													`categories_path` GLOB  \'World/*\' and \
													`categories_id` not in \
												( \
												 	select \
														`altlang_id_to` \
													from \
														`altlang` \
												) \
												and cnt &gt; 2 and cnt &lt; 7 \
												and \
												LENGTH(categories_category) &gt; 1 \
												order by \
													cnt asc \
											');

		for (var results = 0; row = this.DBRDF.fetchObjects(query); results++) {
			categories.push(row.categories_path)
		}

		//sql query
		var query = this.DBRDF.query(' \
											 	SELECT \
													*, \
													(LENGTH(categories_path) - LENGTH(REPLACE(categories_path, \'/\', \'\'))) AS cnt \
												FROM \
													`categories` \
												where \
													`categories_path` GLOB  \'World/*\' and \
													`categories_id` not in \
												( \
												 	select \
														`altlang_id_from` \
													from \
														`altlang` \
												) \
												and cnt &gt; 2 and cnt &lt; 7 \
												and \
												LENGTH(categories_category) &gt; 1 \
												order by \
													cnt asc, \
													categories_path asc \
											');

		for (var results = 0; row = this.DBRDF.fetchObjects(query); results++) {
			categories.push(row.categories_path)
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
				'<pre style="background-color:white !important;padding:2px;">' + aData +
				'</pre>'), true);
		else
			this.notifyTab(aMsg, 8);
	}
	return null;

}).apply(ODPExtension);
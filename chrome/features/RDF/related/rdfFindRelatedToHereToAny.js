(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.rdfFindRelatedToHereToAny = function(aCategory) {
		this.rdfDatabaseOpen(); //opens a connection to the RDF SQLite database.

		var aMsg = 'Related categories to "{CATEGORY}" or to any of its subcategories ({RESULTS})'; //informative msg and title of document

		//sql query
		var query = this.DBRDF.query(' \
											 	SELECT \
													* \
												FROM \
													`PREFIX_categories`, \
													`PREFIX_related` \
												where \
													`related_id_to` IN \
													( \
													 	SELECT \
															categories_id \
														FROM \
															`PREFIX_categories` \
														WHERE \
															`categories_path` GLOB  :categories_path \
													 ) AND \
													`categories_id` = `related_id_from` \
												order by \
													related_id_to asc, \
													related_id_from asc \
											');
		query.params('categories_path', aCategory + '*');

		//searching
		var row, rows = [],
			aData = '',
			last, tmp;
		for (var results = 0; row = this.DBRDF.fetchObjects(query);) {
			tmp = row.related_id_to
			if (last != tmp) {
				results++
				last = tmp;
				aData += this.__LINE__;
				aData += this.rdfGetCategoryFromCategoryID(last).categories_path;
				aData += this.__LINE__;
				aData += this.__LINE__;
			}
			aData += '\t';
			aData += row.categories_path;
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
		this.rdfClose();
	}
	return null;

}).apply(ODPExtension);
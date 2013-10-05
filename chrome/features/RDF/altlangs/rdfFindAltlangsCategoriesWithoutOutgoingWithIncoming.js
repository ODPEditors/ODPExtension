(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.rdfFindAltlangsCategoriesWithoutOutgoingWithIncoming = function(aCategory) {
		this.rdfDatabaseOpen(); //opens a connection to the RDF SQLite database.

		var aMsg = 'Categories without outgoing but with incoming alternative languages on "{CATEGORY}" and on its subcategories ({RESULTS})'; //informative msg and title of document

		//sql query
		var query = this.DBRDF.query(' \
											 	SELECT \
													* \
												FROM \
													`categories` \
												where \
													`categories_path` GLOB  :categories_path and \
													`categories_id` not in \
													( \
													 	select \
															`altlang_id_from` \
														from \
															`altlang` \
													) \
													and \
													`categories_id` in \
													( \
													 	select \
															`altlang_id_to` \
														from \
															`altlang` \
													) \
												order by \
													categories_id asc \
											');
		query.params('categories_path', aCategory + '*');


		var row, rows = [],
			aData = '';
		for (var results = 0; row = this.DBRDF.fetchObjects(query); results++) {
			aData += '<a onclick="flip(' + row.categories_id + ', this)" opened="false"></a>';
			aData += row.categories_path;
			aData += this.__LINE__;
			aData += '<div id="' + row.categories_id + '" style="display:none" level="1">';
			aData += this.__LINE__;
			aData += '\t<font color="red">';
			var altlangs = this.rdfGetCategoryAltlangsIDsToCategoryIDs(row.categories_id);
			for (var id in altlangs) {
				aData += this.rdfGetCategoryFromCategoryID(altlangs[id]).categories_path;
				aData += this.__LINE__;
			}
			aData += '</font>';
			aData += this.__LINE__;
			aData += '</div>';
		}
		if (results > 0) {
			aData = '<div><a href="javascript:expand(1)" opened="false">Expand all</a> - <a href="javascript:collapse(1)" opened="true">Collapse all</a>' + this.__LINE__ + this.__LINE__ + '</div>' + aData;
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
(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.rdfFindEditorsFromHereFromAny = function(aCategory) {
		this.rdfDatabaseOpen(); //opens a connection to the RDF SQLite database.

		var aMsg = 'Editors found on "{CATEGORY}" and on any of its subcategories ({RESULTS})'; //informative msg and title of document

		//sql query
		var query = this.DBRDF.query(' \
											 	SELECT \
													* \
												FROM \
													`categories`, \
													`editor` \
												where \
													`editor_id_category` IN \
													( \
													 	SELECT \
															categories_id \
														FROM \
															`categories` \
														WHERE \
															`categories_path` GLOB  :categories_path \
													 ) AND \
													`categories_id` = `editor_id_category` \
												order by \
													editor_editor asc \
											');
		query.params('categories_path', aCategory + '*');

		//searching
		var row, rows = [],
			aData = '',
			tmp, last;
		for (var results = 0; row = this.DBRDF.fetchObjects(query);) {
			tmp = row.editor_editor
			if (last != tmp) {
				results++
				last = tmp;
				aData += this.__LINE__;
				aData += '<a href="';
				aData += this.editorGetURLPublic(row.editor_editor);
				aData += '">';
				aData += row.editor_editor;
				aData += '</a>';
				aData += this.__LINE__;
				aData += this.__LINE__;
			}
			aData += '\t';
			aData += this.rdfGetCategoryFromCategoryID(row.categories_id).categories_path;
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
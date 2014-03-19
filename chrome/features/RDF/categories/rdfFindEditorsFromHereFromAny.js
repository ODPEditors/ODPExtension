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
														e.`editor`, c.`id` \
													FROM \
														`categories` c , \
														`editors` e \
													where \
														c.`id` IN \
														( \
														 	SELECT \
																c.`id` \
															FROM \
																`categories` c  \
															WHERE \
																c.`category` GLOB  :category \
														 ) AND \
														e.`category_id` = c.`id` \
													order by \
														e.`editor` asc \
												');
		}
	});
	this.rdfFindEditorsFromHereFromAny = function(aCategory) {


		var aMsg = 'Editors found on "{CATEGORY}" and on any of its subcategories ({RESULTS})'; //informative msg and title of document


		query.params('category', aCategory + '*');

		//searching
		var row, rows = [],
			aData = '',
			tmp, last;
		for (var results = 0; row = db.fetchObjects(query);) {
			tmp = row.editor
			if (last != tmp) {
				results++
				last = tmp;
				aData += this.__LINE__;
				aData += '<a href="';
				aData += this.editorGetURLPublic(row.editor);
				aData += '">';
				aData += row.editor;
				aData += '</a>';
				aData += this.__LINE__;
				aData += this.__LINE__;
			}
			aData += '\t';
			aData += this.rdfGetCategoryFromCategoryID(row.id).category;
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
				'<pre>' + aData +
				'</pre>'), true);
		else
			this.notifyTab(aMsg, 8);

	}
	return null;

}).apply(ODPExtension);
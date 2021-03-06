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
														c.`id`, c.`category` \
													FROM \
														`categories` c  \
													where \
														c.`category` GLOB  :category and \
														c.`id` not in \
														( \
														 	select \
																a.`to` \
															from \
																`altlang` a \
														) \
														and \
														c.`id` in \
														( \
														 	select \
																a.`from` \
															from \
																`altlang` a \
														) \
													order by \
														c.`category` asc \
												');
		}
	});
	this.rdfFindAltlangsCategoriesWithoutIncomingWithOutgoing = function(aCategory) {


		var aMsg = 'Categories without incoming but with outgoing alternative languages on "{CATEGORY}" and on its subcategories ({RESULTS})'; //informative msg and title of document

		query.params('category', aCategory + '*');

		var row, rows = [],
			aData = '';
		for (var results = 0; row = db.fetchObjects(query); results++) {
			aData += '<a onclick="$(\'.result' + row.id + '\').toggle()" class="collapse"></a>';
			aData += row.category;
			aData += this.__LINE__;
			aData += '<div class="result result' + row.id + '" style="display:none">';
			aData += this.__LINE__;
			aData += '<font color="red">';
			var altlangs = this.rdfGetCategoryAltlangsIDsFromCategoryIDs(row.id);
			for (var id in altlangs) {
				aData += '\t';
				aData += this.rdfGetCategoryFromCategoryID(altlangs[id]).category;
				aData += this.__LINE__;
			}
			aData += '</font>';
			aData += this.__LINE__;
			aData += '</div>';
		}
		if (results > 0) {
			aData = '<div><a   href="javascript://" onclick="$(\'.result\').show();">Expand all</a> - <a href="javascript://" onclick="$(\'.result\').hide();">Collapse all</a>' + this.__LINE__ + this.__LINE__ + '</div>' + aData;
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
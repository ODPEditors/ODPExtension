(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.rdfFindSameLangAltlangs = function(aCategory) {

		var aMsg = 'Categories with altlangs to the same language twice or more.. [{CATEGORY}] ({RESULTS}) '; //informative msg and title of document

		db = ODPExtension.rdfDatabaseOpen();

		//sql query
		var query_from = db.query(' \
						 	SELECT \
								distinct(a.`from`), c.category \
							FROM \
								`altlang` a, categories c where a.`from` = c.id order by `from` asc  ');

		var last = 0;
		var group = []
		var row, row2
		var aData = ''
		for (var results = 0; row = db.fetchObjects(query_from); results++) {

			var categories = []

			var current = this.getLanguageNameFromCategory(row.category);

			categories[categories.length] = current;
			var query_to = db.query(' \
							 	SELECT \
									category \
								FROM \
									categories where id in (select `to` as id from altlang where `from` = :id ) ');
			query_to.params('id', row.from);
			while(row2 = db.fetchObjects(query_to)) {
				var category = this.getLanguageNameFromCategory(row2.category);

				if(categories.indexOf(category) != -1){
					//this.dump('Problematic category '+row.category)
					aData += row.category+'\n'
					break;
				}
				categories[categories.length] = category
			}

		}

		this.tabOpen(this.fileCreateTemporal(
			'RDF.html',
			aMsg.replace('{CATEGORY}', '').replace('{RESULTS}', ''),
			'<div class="header">' + aMsg.replace('{CATEGORY}', '').replace('{RESULTS}','') + '</div>' +
			'<pre style="background-color:white !important;padding:2px;">' + aData +
			'</pre>'), true);

	}

	return null;

}).apply(ODPExtension);
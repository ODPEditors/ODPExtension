(function() {

	var db, query;
	this.addListener('databaseReady', function() {

		db = ODPExtension.categoriesTXTDatabaseOpen();
		if (db.exists){
			query = db.query('select * from categories_txt where category GLOB :category');
			query_all = db.query('select * from categories_txt');
		}

	});
	//searchs in the categories.txt database
	this.categoriesTXTQuery = function(aQuery, aWhere, aSearchEngineSearch) {
		//SEARCHING
		var results = {};
		results.count = 0;
		results.query = aQuery;
		results.categories = [];

		if (!db.exists) {} else {
			if(aWhere == ''){
				if(!this.confirm('Warning: Searching for categories without restricting the search to a branch is super slow! (a minute~ or so)'))
					return;
				var fetch_from = query_all;
			} else {
				query.params('category', aWhere.replace(/\/$/, '') + '*');
				var fetch_from = query;
			}

			if (!aSearchEngineSearch) {
				aQuery = this.trim(aQuery).replace(/ /g, '_').replace(/\/*\$$/g, '/$');
				var row;
				for (var i = 0; row = db.fetchObjects(fetch_from); i++) {
					if (aQuery == '' || this.match(row.category, aQuery)) {
						results.categories[results.count] = row.category;
						results.count++;
					}
				}
			} else {
				aQuery = this.trim(aQuery).replace(/_/g, ' ');
				var row;
				for (var i = 0; row = db.fetchObjects(fetch_from); i++) {
					if (aQuery == '' || this.searchEngineSearch(aQuery, row.category.replace(/_/g, ' ').replace(/-/g, ' '))) {
						results.categories[results.count] = row.category;
						results.count++;
					}
				}
			}
		}
		return results;
	}

	return null;

}).apply(ODPExtension);
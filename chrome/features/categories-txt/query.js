(function() {

	//searchs in the categories.txt database
	this.categoriesTXTQuery = function(aQuery, aWhere, aSearchEngineSearch) {
		//SEARCHING
		var results = {};
		results.count = 0;
		results.query = aQuery;
		results.categories = [];

		if (!this.categoriesTXTRequired()) {} else {

			var aConnection = this.categoriesTXTDatabaseOpen();
			var query = aConnection.query('select * from categories_txt where category GLOB :category');
			query.params('category', aWhere.replace(/\/$/, '') + '*');

			if (!aSearchEngineSearch) {
				aQuery = this.trim(aQuery).replace(/ /g, '_').replace(/\/*\$$/g, '/$');
				var row;
				for (var i = 0; row = aConnection.fetchObjects(query); i++) {
					if (aQuery == '' || this.match(row.category, aQuery)) {
						results.categories[results.count] = row.category;
						results.count++;
					}
				}
			} else {
				aQuery = this.trim(aQuery).replace(/_/g, ' ');
				var row;
				for (var i = 0; row = aConnection.fetchObjects(query); i++) {
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
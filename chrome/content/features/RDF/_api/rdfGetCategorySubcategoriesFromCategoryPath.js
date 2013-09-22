(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.rdfGetCategorySubcategoriesFromCategoryPath = function(aCategory) {
		this.rdfOpen(); //opens a connection to the RDF SQLite database.

		//sql query
		var query = this.DBRDF.query(' \
											 	SELECT \
													* \
												FROM \
													`PREFIX_categories` \
												where \
													`categories_id_parent` =  :categories_id_parent \
											');
		query.params('categories_id_parent', this.rdfGetCategoryFromCategoryPath(aCategory).categories_id);

		var row, rows = [];
		for (var i = 0; row = this.DBRDF.fetchObjects(query); i++) {
			rows[i] = row;
		}
		return rows;
	}
	return null;

}).apply(ODPExtension);
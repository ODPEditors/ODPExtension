(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.rdfFindCategoryDescriptionEmpty = function(aCategory) {
		this.rdfDatabaseOpen(); //opens a connection to the RDF SQLite database.

		var aMsg = 'Categories without description on "{CATEGORY}" and on its subcategories ({RESULTS})'; //informative msg and title of document

		//sql query
		var subCategories = this.rdfGetCategorySubcategoriesRecursiveFromCategoryPath(aCategory)

		//searching
		var aData = '';
		for (var results = 0, i = 0; i < subCategories.length; i++) {
			if (this.trim(subCategories[i].categories_description) == '') {
				aData += subCategories[i].categories_path;
				aData += this.__LINE__;
				results++;
			}
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
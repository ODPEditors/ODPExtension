(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.rdfFindCategoryDescriptionRecursive = function(aCategory) {
		this.rdfDatabaseOpen(); //opens a connection to the RDF SQLite database.

		var aMsg = 'Description of category "{CATEGORY}" and of its subcategories ({RESULTS})'; //informative msg and title of document

		//sql query
		var subCategories = this.rdfGetCategorySubcategoriesRecursiveFromCategoryPath(aCategory)

		//searching
		var aData = '';
		for (var results = 0, i = 0; i < subCategories.length; i++) {
			if (subCategories[i].categories_description != '') {
				results++;
				aData += subCategories[i].categories_path;
				aData += this.__NEW_LINE__;
				aData += '<pre wrap="true">';
				aData += this.htmlSpecialCharsEncode(subCategories[i].categories_description);
				aData += this.__NEW_LINE__;
				aData += '<a href="data:text/html;charset=utf-8,';
				aData += this.encodeUTF8(subCategories[i].categories_description);
				aData += '">view as html</a>';
				aData += '</pre>';
				aData += this.__NEW_LINE__;
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

		this.rdfClose();
	}
	return null;

}).apply(ODPExtension);
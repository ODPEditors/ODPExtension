(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.rdfFindCategorySubcategoriesWithPath = function(aCategory, aQuery) {


		var aMsg = 'Subcategories of "{CATEGORY}" with search "{QUERY}" ({RESULTS})'; //informative msg and title of document

		//sql query
		var subCategories = this.rdfGetCategorySubcategoriesRecursiveFromCategoryPath(aCategory)

		//searching
		var aData = '';
		aQuery = aQuery.replace(/[\.|_]/g, ' ')
		for (var results = 0, i = 0; i < subCategories.length; i++) {
			if (!this.searchEngineSearch(aQuery, subCategories[i].category.replace(/[\.|,|-|_]/g, ' ')))
				continue;
			results++
			aData += subCategories[i].category;
			aData += this.__LINE__;
		}

		//sets msg
		aMsg = aMsg.replace('{CATEGORY}', aCategory).replace('{RESULTS}', results).replace('{QUERY}', aQuery);

		//display results
		if (results > 0)
			this.tabOpen(this.fileCreateTemporal(
				'RDF.html',
				aMsg,
				'<div class="header">' + this.htmlSpecialCharsEncode(aMsg) + '</div>' +
				'<pre style="background-color:white !important;padding:2px;">' + aData +
				'</pre>'), true);
		else
			this.notifyTab(aMsg, 8);
	}
	return null;

}).apply(ODPExtension);
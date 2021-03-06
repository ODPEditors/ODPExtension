(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.rdfFindCategoryDescriptionSearch = function(aCategory, aQuery) {


		var aMsg = 'Looking for "{QUERY}" on category "{CATEGORY}" and on any of its subcategories ({RESULTS})'; //informative msg and title of document

		//sql query
		var subCategories = this.rdfGetCategorySubcategoriesRecursiveFromCategoryPath(aCategory)

		//searching
		var aData = '';
		for (var results = 0, i = 0; i < subCategories.length; i++) {
			if (!this.searchEngineSearch(aQuery, subCategories[i].description))
				continue;
			results++;
			aData += subCategories[i].category;
			aData += this.__LINE__;
			aData += '<pre wrap="true">';
			aData += this.searchEngineSearchHigh(aQuery, subCategories[i].description);
			aData += this.__LINE__;
			aData += '<a href="data:text/html;charset=utf-8,';
			aData += this.encodeUTF8(subCategories[i].description);
			aData += '">view as html</a>';
			aData += '</pre>';
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
				'<pre>' + aData +
				'</pre>'), true);
		else
			this.notifyTab(aMsg, 8);

	}
	return null;

}).apply(ODPExtension);
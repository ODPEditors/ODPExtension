(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.rdfFindCategoryDescription = function(aCategory) {
		this.rdfOpen(); //opens a connection to the RDF SQLite database.

		var aMsg = 'Description of "{CATEGORY}" ({RESULTS})'; //informative msg and title of document

		//sql query
		var aCategory = this.rdfGetCategoryFromCategoryPath(aCategory)
		var results = 0;
		//searching
		if (aCategory.categories_description != '') {
			results++;

			var aData = '';
			aData += aCategory.categories_path;
			aData += this.__NEW_LINE__;
			aData += '<pre wrap="true">';
			aData += this.htmlSpecialCharsEncode(aCategory.categories_description);
			aData += this.__NEW_LINE__;
			aData += '<a href="data:text/html;charset=utf-8,';
			aData += this.encodeUTF8(aCategory.categories_description);
			aData += '">view as html</a>';
			aData += '</pre>';
			aData += this.__NEW_LINE__;
		}
		//sets msg
		aMsg = aMsg.replace('{CATEGORY}', aCategory.categories_path).replace('{RESULTS}', results);

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
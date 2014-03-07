(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.rdfFindCategoryDescription = function(aCategory) {


		var aMsg = 'Description of "{CATEGORY}" ({RESULTS})'; //informative msg and title of document

		//sql query
		aCategory = this.rdfGetCategoryFromCategoryPath(aCategory)
		var results = 0;
		//searching
		if (aCategory.description != '') {
			results++;

			var aData = '';
			aData += aCategory.category;
			aData += this.__LINE__;
			aData += '<pre wrap="true">';
			aData += this.htmlSpecialCharsEncode(aCategory.description);
			aData += this.__LINE__;
			aData += '<a href="data:text/html;charset=utf-8,';
			aData += this.encodeUTF8(aCategory.description);
			aData += '">view as html</a>';
			aData += '</pre>';
			aData += this.__LINE__;
		}
		//sets msg
		aMsg = aMsg.replace('{CATEGORY}', aCategory.category).replace('{RESULTS}', results);

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
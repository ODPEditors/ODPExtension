(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.rdfCategorySpellCheck = function(aCategory, aLang) {


		var aMsg = 'Spelling errors on categories names of "{CATEGORY}" including its subcategories ({RESULTS})'; //informative msg and title of document

		//sql query
		var subCategories = this.rdfGetCategorySubcategoriesRecursiveFromCategoryPath(aCategory)

		//searching
		var aData = '';
		for (var results = 0, i = 0; i < subCategories.length; i++) {
			var aString = subCategories[i].name.replace(/[\.|,|-|_]/g, ' ').split(' ');
			var spell = '';
			var found = false;
			for (var id in aString) {
				if (this.spellError(aString[id], aLang)) {
					spell += aString[id];
					spell += ' ';
					subCategories[i].category = subCategories[i].category.split(aString[id]).join('<b>' + aString[id] + '</b>');
					if (!found) {
						found = true;
						results++;
					}
				}
			}
			if (!found)
				continue;
			aData += subCategories[i].category;
			aData += '<input type="text"  spellcheck="true" value="' + this.htmlSpecialCharsEncode(this.trim(spell)) + '"/>';
			aData += this.__LINE__;
		}

		//sets msg
		aMsg = aMsg.replace('{CATEGORY}', aCategory).replace('{RESULTS}', results);

		//display results
		if (results > 0)
			this.tabOpen(this.fileCreateTemporal(
				'RDF.html',
				aMsg,
				'<div class="header">' + aMsg + '</div>' +
				'<div class="informative">You may want to suggest the words that are not recognized (but correct) to the dictionary maintainers by looking into the URLs on "Install dictionary" links at <a href="https://addons.mozilla.org/en-US/firefox/language-tools/">&lt;https://addons.mozilla.org/en-US/firefox/language-tools/&gt;</a></div>' +
				'<pre style="background-color:white !important;padding:2px;">' + aData +
				'</pre>'), true);
		else
			this.notifyTab(aMsg, 8);

	}
	return null;

}).apply(ODPExtension);
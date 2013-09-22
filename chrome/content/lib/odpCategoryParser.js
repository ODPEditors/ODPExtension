(function() {
	//parse a category data (category public page HTML) and returns an array with the editors if any

	this.categoryParserGetCategoryEditors = function(aCategoryDocumentHTML) {

		var hrefs = aCategoryDocumentHTML.split('href="');

		var categoryEditors = [];
		var aEditor = '';

		for (var i = 0; i < hrefs.length; i++) {
			if ((aEditor = this.editorGetFromURL((hrefs[i] + '\n').split('\n')[0])) != '') {
				categoryEditors[categoryEditors.length] = aEditor;
			}
		}
		return categoryEditors;

	}
	//parse a category data (category public page HTML) and returns an array with all the subcategories

	this.categoryParserGetCategorySubcategories = function(aCategoryDocumentHTML, anURI) {
		//var debugingThisFile = false;//sets debuging on/off for this JavaScript file

		var categorySubcategories = [];

		var elements = this.select('.dir-1 li', aCategoryDocumentHTML, anURI);

		for (var id in elements) {
			if (elements[id].innerHTML.indexOf('>@') != -1) { /*its a link*/ } else {
				categorySubcategories[categorySubcategories.length] = this.categoryGetFromURL(this.select('a', elements[id].innerHTML, anURI)[0].getAttribute('href'));
			}
		}
		return categorySubcategories;
	}

	return null;

}).apply(ODPExtension);
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

		var categorySubcategories = [];

		var elements = this.select('.dir-1 li', aCategoryDocumentHTML, anURI);

		for (var id in elements) {
			if (elements[id].innerHTML.indexOf('>@') != -1) { /*its a link*/ } else {
				categorySubcategories[categorySubcategories.length] = this.categoryGetFromURL(this.select('a', elements[id].innerHTML, anURI)[0].getAttribute('href'));
			}
		}
		return categorySubcategories;
	}

	this.categoryParserGetCategoryUS = function(aCategoryDocumentHTML, aURI) {

		var aSites = [];
		aCategoryDocumentHTML = aCategoryDocumentHTML.split('<h3 class="mt1em">')
		for (var id = 1; id < aCategoryDocumentHTML.length; id++) {
			if (aCategoryDocumentHTML[id].indexOf('<strong><a name="errors">') != -1) {
				this.categoryParserGetCategoryUSSites(aCategoryDocumentHTML[id], aURI, aSites, 'error');
			} else if (aCategoryDocumentHTML[id].indexOf('<strong><a name="from_editors">') != -1) {
				this.categoryParserGetCategoryUSSites(aCategoryDocumentHTML[id], aURI, aSites, 'editor');
			} else if (aCategoryDocumentHTML[id].indexOf('<strong><a name="from_public">') != -1) {
				this.categoryParserGetCategoryUSSites(aCategoryDocumentHTML[id], aURI, aSites, 'public');
			} else if (aCategoryDocumentHTML[id].indexOf('<strong><a name="from_xml">') != -1) {
				this.categoryParserGetCategoryUSSites(aCategoryDocumentHTML[id], aURI, aSites, 'xml');
			} else if (aCategoryDocumentHTML[id].indexOf('<strong><a name="updates">') != -1) {
				this.categoryParserGetCategoryUSSites(aCategoryDocumentHTML[id], aURI, aSites, 'updates');
			}
		}
		return aSites;
	}

	this.categoryParserGetCategoryUSSites = function(aCategoryDocumentHTML, aURI, aSites, aType) {
		var elements = this.select('li', aCategoryDocumentHTML, aURI);
		for (var id in elements) {
			try{
				var site = {}
				site.id = elements[id].getElementsByTagName('a')[0].href.split('urlsubId=')[1].split('&')[0];
				site.url = elements[id].getElementsByTagName('a')[1].href;
				site.url_id = this.getURLID(site.url);
				site.title = this.stripTags(this.htmlEntityDecode(this.select('input[name^="urlsub_title_"]', elements[id].innerHTML, aURI)[0].value));
				site.description = this.stripTags(this.htmlEntityDecode(this.select('input[name^="urlsub_desc_"]', elements[id].innerHTML, aURI)[0].value));
				site.category = this.categoryGetFromURL(elements[id].getElementsByTagName('a')[2].href);
				site.user = this.select('small', elements[id].innerHTML, aURI)[0].innerHTML;
				site.date = site.user.split('<i>')[1].trim().replace(/^- +/, '').slice(0, 10).trim();
				site.ip = site.user.split(' ')[1].trim();
				site.user = site.user.split(' ')[0].trim().toLowerCase();
				site.type = aType;
				aSites[aSites.length] = site;
			}catch(e){
				//
			}
		}
		return aSites
	}

	return null;

}).apply(ODPExtension);
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
			if (elements[id].innerHTML.indexOf('>@') != -1) { /*its a link*/ }
			else {
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
			}
			else if (aCategoryDocumentHTML[id].indexOf('<strong><a name="from_editors">') != -1) {
				this.categoryParserGetCategoryUSSites(aCategoryDocumentHTML[id], aURI, aSites, 'editor');
			}
			else if (aCategoryDocumentHTML[id].indexOf('<strong><a name="from_public">') != -1) {
				this.categoryParserGetCategoryUSSites(aCategoryDocumentHTML[id], aURI, aSites, 'public');
			}
			else if (aCategoryDocumentHTML[id].indexOf('<strong><a name="from_xml">') != -1) {
				this.categoryParserGetCategoryUSSites(aCategoryDocumentHTML[id], aURI, aSites, 'xml');
			}
			else if (aCategoryDocumentHTML[id].indexOf('<strong><a name="updates">') != -1) {
				this.categoryParserGetCategoryUSSites(aCategoryDocumentHTML[id], aURI, aSites, 'updates');
			}
		}

		return aSites;
	}

	this.categoryParserGetCategoryUSSites = function(aCategoryDocumentHTML, aURI, aSites, aType) {
		var elements = this.select('li', aCategoryDocumentHTML, aURI);
		for (var id in elements) {
			try {
				var site = {}
				site.site_id = elements[id].getElementsByTagName('a')[0].href.split('urlsubId=')[1].split('&')[0];
				site.url = this.IDNDecodeURL(elements[id].getElementsByTagName('a')[1].href);
				site.url_id = this.getURLID(site.url);
				site.domain = site.url_id.domain;
				site.subdomain = site.url_id.subdomain;
				site.title = this.stripTags(this.htmlSpecialCharsDecode(this.select('input[name^="urlsub_title_"]', elements[id].innerHTML, aURI)[0].value)).trim();
				site.description = this.stripTags(this.htmlSpecialCharsDecode(this.select('input[name^="urlsub_desc_"]', elements[id].innerHTML, aURI)[0].value)).trim().replace('[Forward a Copy', '').trim();
				site.category = this.categoryGetFromURL(elements[id].getElementsByTagName('a')[2].href);
				site.user = this.select('small', elements[id].innerHTML, aURI)[0].innerHTML;
				try {
					site.date = site.user.split('<i>')[1].trim().replace(/^- +/, '').slice(0, 10).trim();
					if (/[0-9][0-9][0-9][0-9].[0-9][0-9].[0-9][0-9]/.test(site.date))
						site.date = site.date.slice(0, 4) + '-' + site.date.slice(5, 7) + '-' + site.date.slice(8, 10);
					else if (/[0-9][0-9].[0-9][0-9].[0-9][0-9][0-9][0-9]/.test(site.date))
						site.date = site.date.slice(6, 10) + '-' + site.date.slice(3, 5) + '-' + site.date.slice(0, 2);
				}
				catch (e) {
					site.date = '1980-07-12';
				}
				site.date_object = this.sqlDate(site.date);
				site.ip = site.user.split(' ')[1].trim();
				site.user = site.user.split(' ')[0].trim().toLowerCase();
				if (site.user == '')
					site.user = 'no user';
				if (site.ip == '' || site.ip == '7' + '4.2' + '08' + '.18' + '0.10' + '6')
					site.ip = 'no ip';
				site.type = aType;
				switch (site.type) {
					case 'error':
						site.colour = this.odpColourErrorD();
						break;
					case 'editor':
						site.colour = this.odpColourEditorD();
						break;
					case 'public':
						site.colour = this.odpColourPublicD();
						break;
					case 'xml':
						site.colour = this.odpColourXMLD();
						break;
					case 'updates':
						site.colour = this.odpColourPurpleD();
						break;
					case 'greenbust':
						site.colour = this.odpColourGreenbustD();
						break;
					default:
						site.colour = this.odpColourGreyD();
						break;
				}
				site.type_colour = site.type + '-' + site.colour;
				site.area = 'unreviewed';
				site.action = 'unreviewed'; // unreviewed, reviewed, deleted
				site.id = site.area + '-' + site.site_id;
				aSites[aSites.length] = site;

			}
			catch (e) {}
		}
		return aSites
	}

	this.categoryParserGetCategoryU = function(aCategoryDocumentHTML, aURI, aSites) {
		if (!aSites)
			aSites = [];
		aCategoryDocumentHTML = aCategoryDocumentHTML.split('<h3 class="mt1em">')
		for (var id = 1; id < aCategoryDocumentHTML.length; id++) {
			if (aCategoryDocumentHTML[id].indexOf('<strong><a name="errors">') != -1) {
				this.categoryParserGetCategoryUSites(aCategoryDocumentHTML[id], aURI, aSites, 'error');
			}
			else if (aCategoryDocumentHTML[id].indexOf('<strong><a name="from_editors">') != -1) {
				this.categoryParserGetCategoryUSites(aCategoryDocumentHTML[id], aURI, aSites, 'editor');
			}
			else if (aCategoryDocumentHTML[id].indexOf('<strong><a name="from_public">') != -1) {
				this.categoryParserGetCategoryUSites(aCategoryDocumentHTML[id], aURI, aSites, 'public');
			}
			else if (aCategoryDocumentHTML[id].indexOf('<strong><a name="from_xml">') != -1) {
				this.categoryParserGetCategoryUSites(aCategoryDocumentHTML[id], aURI, aSites, 'xml');
			}
			else if (aCategoryDocumentHTML[id].indexOf('<strong><a name="updates">') != -1) {
				this.categoryParserGetCategoryUSites(aCategoryDocumentHTML[id], aURI, aSites, 'updates');
			}
		}

		//ODPExtension.dump(aSites)
		return aSites;
	}

	this.categoryParserGetCategoryUSites = function(aCategoryDocumentHTML, aURI, aSites, aType) {
		var elements = this.select('li', aCategoryDocumentHTML, aURI);
		for (var id in elements) {
			//ODPExtension.dump(elements[id].innerHTML)
			try {
				var site = {}
				site.site_id = elements[id].getElementsByTagName('a')[0].href.split('urlsubId=')[1].split('&')[0];
				site.url = this.IDNDecodeURL(this.string(elements[id].getElementsByTagName('a')[1].href));
				site.url_id = this.getURLID(site.url);
				site.domain = site.url_id.domain;
				site.subdomain = site.url_id.subdomain;
				site.title = this.stripTags(this.htmlSpecialCharsDecode(elements[id].getElementsByTagName('a')[1].innerHTML)).trim();
				site.description = this.stripTags(this.htmlSpecialCharsDecode(elements[id].innerHTML.split('<br>')[0].split('</a>')[2])).trim().replace(/^- +/, '').trim().replace('[Forward a Copy', '').trim();
				site.category = this.categoryGetFromURL(aURI);
				site.user = this.select('small', elements[id].innerHTML, aURI)[0].innerHTML;
				try {
					site.date = site.user.split('<i>')[1].trim().replace(/^- +/, '').slice(0, 10).trim();
					if (/[0-9][0-9][0-9][0-9].[0-9][0-9].[0-9][0-9]/.test(site.date))
						site.date = site.date.slice(0, 4) + '-' + site.date.slice(5, 7) + '-' + site.date.slice(8, 10);
					else if (/[0-9][0-9].[0-9][0-9].[0-9][0-9][0-9][0-9]/.test(site.date))
						site.date = site.date.slice(6, 10) + '-' + site.date.slice(3, 5) + '-' + site.date.slice(0, 2);
				}
				catch (e) {
					site.date = '1980-07-12';
				}
				site.date_object = this.sqlDate(site.date);
				site.ip = site.user.split(' ')[1].trim();
				site.user = site.user.split(' ')[0].trim().toLowerCase();
				if (site.user == '')
					site.user = 'no user';
				if (site.ip == '' || site.ip == '7' + '4.2' + '08' + '.18' + '0.10' + '6')
					site.ip = 'no ip';
				site.type = aType;
				switch (site.type) {
					case 'error':
						site.colour = this.odpColourErrorD();
						break;
					case 'editor':
						site.colour = this.odpColourEditorD();
						break;
					case 'public':
						site.colour = this.odpColourPublicD();
						break;
					case 'xml':
						site.colour = this.odpColourXMLD();
						break;
					case 'updates':
						site.colour = this.odpColourPurpleD();
						break;
					case 'greenbust':
						site.colour = this.odpColourGreenbustD();
						break;
					default:
						site.colour = this.odpColourGreyD();
						break;
				}
				site.type_colour = site.type + '-' + site.colour;
				site.area = 'unreviewed';
				site.action = 'unreviewed'; // unreviewed, reviewed, deleted
				site.id = site.area + '-' + site.site_id;

				site.kK = false
				site.kT = false
				site.kMT = false

				site.cool = false
				site.isKT = this.categoryIsKidsAndTeens(site.category)

				aSites[aSites.length] = site;

			}
			catch (e) {
				throw e
			}
		}
		return aSites
	}

	this.categoryParserGetCategoryUJSONSites = function(aData, aSites) {

		for (var id in aData) {
			var d = aData[id]
			try {
				var site = {}
				site.site_id = d.id;
				site.url = this.IDNDecodeURL(d.url);
				site.url_id = this.getURLID(d.url);
				site.domain = site.url_id.domain;
				site.subdomain = site.url_id.subdomain;
				site.title = d.title.trim();
				site.description = d.description.trim();
				site.category = d.category;
				site.user = (d.submitterEmail+' '+(d.lastEditorName || '')).trim().toLowerCase();
				try {
					site.date = d.updateAt.split(' ')[0]
					site.date = site.date.replace(/^- +/, '').slice(0, 10).trim();
					if (/[0-9][0-9][0-9][0-9].[0-9][0-9].[0-9][0-9]/.test(site.date))
						site.date = site.date.slice(0, 4) + '-' + site.date.slice(5, 7) + '-' + site.date.slice(8, 10);
					else if (/[0-9][0-9].[0-9][0-9].[0-9][0-9][0-9][0-9]/.test(site.date))
						site.date = site.date.slice(6, 10) + '-' + site.date.slice(3, 5) + '-' + site.date.slice(0, 2);
				}
				catch (e) {
					site.date = '1980-07-12';
				}
				site.date_object = this.sqlDate(site.date);
				site.ip = d.submitterIP.trim();
				if (site.user == '')
					site.user = 'no user';
				if (site.ip == '' || site.ip == '7' + '4.2' + '08' + '.18' + '0.10' + '6')
					site.ip = 'no ip';
				site.type = (d.httpStatus != 200 ? 'error' : 'public');
				if(site.type == 'public'){
					if(!d.lastEditorName){}
					else
						site.type = 'editor'
				}
				switch (site.type) {
					case 'error':
						site.colour = this.odpColourErrorD();
						break;
					case 'editor':
						site.colour = this.odpColourEditorD();
						break;
					case 'public':
						site.colour = this.odpColourPublicD();
						break;
					case 'xml':
						site.colour = this.odpColourXMLD();
						break;
					case 'updates':
						site.colour = this.odpColourPurpleD();
						break;
					case 'greenbust':
						site.colour = this.odpColourGreenbustD();
						break;
					default:
						site.colour = this.odpColourGreyD();
						break;
				}
				site.type_colour = site.type + '-' + site.colour;
				site.area = 'unreviewed';
				site.action = 'unreviewed'; // unreviewed, reviewed, deleted
				site.id = site.area + '-' + site.site_id;

				site.kK = d.kids == 'true' ? true : false;
				site.kT = d.teens == 'true' ? true : false;
				site.kMT = d.mteens == 'true' ? true : false;

				site.cool = d.cool == 'true' ? true : false;
				site.isKT = this.categoryIsKidsAndTeens(site.category)

				aSites[aSites.length] = site;

			}
			catch (e) {
				throw e
			}
		}
		return aSites
	}

	this.categoryParserGetCategoryL = function(aCategoryDocumentHTML, aURI, aSites) {
		try{
			var elements = this.select('li', aCategoryDocumentHTML.split('<ul class="edit">')[1].split('</ul>')[0], aURI);
		}catch(e){
			return aSites
		}
		for (var id in elements) {

			try {
				var site = {}
				site.site_id = elements[id].getElementsByTagName('a')[0].href.split('urlId=')[1].split('&')[0];
				site.url = this.IDNDecodeURL(this.string(elements[id].getElementsByTagName('a')[1].href));
				site.url_id = this.getURLID(site.url);
				site.domain = site.url_id.domain;
				site.subdomain = site.url_id.subdomain;
				site.title = this.stripTags(this.htmlSpecialCharsDecode(elements[id].getElementsByTagName('a')[1].innerHTML)).trim();
				site.description = this.stripTags(this.htmlSpecialCharsDecode(elements[id].innerHTML.split('</a>')[2].replace(/&nbsp;/g, ' '))).trim().replace(/^- +/, '').trim().replace('[Forward a Copy', '').trim();
				site.category = this.categoryGetFromURL(aURI);
				site.user = '' //this.select('small', elements[id].innerHTML, aURI)[0].innerHTML;
				try {
					site.date = site.user.split('<i>')[1].trim().replace(/^- +/, '').slice(0, 10).trim();
					if (/[0-9][0-9][0-9][0-9].[0-9][0-9].[0-9][0-9]/.test(site.date))
						site.date = site.date.slice(0, 4) + '-' + site.date.slice(5, 7) + '-' + site.date.slice(8, 10);
					else if (/[0-9][0-9].[0-9][0-9].[0-9][0-9][0-9][0-9]/.test(site.date))
						site.date = site.date.slice(6, 10) + '-' + site.date.slice(3, 5) + '-' + site.date.slice(0, 2);
				}
				catch (e) {
					site.date = '1980-07-12';
				}
				site.date_object = this.sqlDate(site.date);
				site.ip = 'no ip' //site.user.split(' ')[1].trim();
				site.user = 'no user' //site.user.split(' ')[0].trim().toLowerCase();
				if (site.user == '')
					site.user = 'no user';
				if (site.ip == '' || site.ip == '7' + '4.2' + '08' + '.18' + '0.10' + '6')
					site.ip = 'no ip';
				site.type = 'editor';
				switch (site.type) {
					case 'error':
						site.colour = this.odpColourErrorD();
						break;
					case 'editor':
						site.colour = this.odpColourEditorD();
						break;
					case 'public':
						site.colour = this.odpColourPublicD();
						break;
					case 'xml':
						site.colour = this.odpColourXMLD();
						break;
					case 'updates':
						site.colour = this.odpColourPurpleD();
						break;
					case 'greenbust':
						site.colour = this.odpColourGreenbustD();
						break;
					default:
						site.colour = this.odpColourGreyD();
						break;
				}
				site.type_colour = site.type + '-' + site.colour;
				site.area = 'reviewed';
				site.action = 'reviewed'; // unreviewed, reviewed, deleted
				site.id = site.area + '-' + site.site_id;

				if (site.description.indexOf('[') != -1 && this.categoryIsKidsAndTeens(site.category)) {
					site.kK = site.description.indexOf('[ Kids') != -1
					site.kT = site.description.indexOf('[ Teens/') != -1 || site.description.indexOf('Kids/Teens') != -1  || site.description.indexOf('[ Teens ]') != -1
					site.kMT = site.description.indexOf('[ Mature Teens') != -1 || site.description.indexOf('Kids/Mature Teens') != -1 || site.description.indexOf('Teens/Mature Teens') != -1

					site.description = site.description.replace(/^\[[^\]]+\]/, '').trim().replace(/^- +/, '')
				} else {
					site.kK = false
					site.kT = false
					site.kMT = false
				}

				site.rss = false
				site.atom = false
				site.pdf = false

				site.rss = /\[rss\]$/i.test(site.description)
				site.atom = /\[atom\]$/i.test(site.description)
				site.pdf = /\[pdf\]$/i.test(site.description)

				site.description = site.description.replace(/\[(rss|atom|pdf)\]$/i, '').trim()

				site.cool = elements[id].innerHTML.indexOf('</a></strong>') != -1
				site.isKT = this.categoryIsKidsAndTeens(site.category)

				aSites[aSites.length] = site;
			}
			catch (e) {
				this.error(e)
			}
		}
		return aSites
	}

	return null;

}).apply(ODPExtension);
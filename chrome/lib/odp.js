(function() {
	//sanitize the format of a category
	var categoryCheckFormatRegExp1 = /(\+|\.|\:|@|"|,|'| |#|>|<|\)|\(|\*|_|-)*$/;
	var categoryCheckFormatRegExp2 = /^(\+|\.|\:|@|"|,|'| |#|>|<|\)|\(|\*|_|-)*/;
	var categoryCheckFormatRegExp3 = /\r/g
	var categoryCheckFormatRegExp4 = /\n\n/g
	var categoryCheckFormatRegExp5 = / +\(.*$/
	var categoryCheckFormatRegExp6 = / +\[.*$/
	var categoryCheckFormatRegExp7 = /Unreviewed$/
	var categoryCheckFormatRegExp8 = /Unrev$/
	var categoryCheckFormatRegExp9 = /unrev$/
	var categoryCheckFormatRegExp10 = /\.unreview$/
	var categoryCheckFormatRegExp11 = /->.*$/
	var categoryCheckFormatRegExp12 = /]$/
	var categoryCheckFormatRegExp13 = /.* ([^ ]+)\]$/
	var categoryCheckFormatRegExp14 = /\]$/
	var categoryCheckFormatRegExp15 = /\:\+/g
	var categoryCheckFormatRegExp16 = /\+/g
	var categoryCheckFormatRegExp17 = /^\:+/
	var categoryCheckFormatRegExp18 = /\s*?:\s*/g
	var categoryCheckFormatRegExp19 = /\s/g
	var categoryCheckFormatRegExp20 = /\s*?\/\s*/g
	var categoryCheckFormatRegExp21 = /_*?\/_*/g
	var categoryCheckFormatRegExp22 = /<.*$/
	var categoryCheckFormatRegExp23 = /\/([^\/]+)\.(html|cgi|htm|php)$/i
	var categoryCheckFormatRegExp24 = /\/[^\/]+$/
	var categoryCheckFormatRegExp25 = / /g

	this.categoryCheckFormat = function(aCategory, aggressive) {
		//multiples categories selected maybe
		if (aCategory.indexOf('\n') != -1 || aCategory.indexOf('\r') != -1) {
			aCategory = aCategory.replace(categoryCheckFormatRegExp3, '\n').replace(categoryCheckFormatRegExp4, '\n').split('\n')[0];
		}

		//ending with
		aCategory = aCategory
			.replace(categoryCheckFormatRegExp1, '')
		//starts with
		.replace(categoryCheckFormatRegExp2, '');

		//Test/Tools_for_Editors/New_Editors/faq.html#42
		if (aCategory.indexOf('#') != -1)
			aCategory = aCategory.split('#')[0];

		//Computers/Software/Internet/Clients/WWW/Browsers/Firefox/Add-ons/Web_Design_and_Development/?
		//World/Español/?World/Español
		if (aCategory.indexOf('?') != -1)
			aCategory = aCategory.split('?')[0];

		//World/Español/Regional/Países/U@Uruguay
		if (aCategory.indexOf('@') != -1) {
			if (aCategory.split('@')[0].indexOf('/') != -1)
				aCategory = aCategory.split('@')[0];
			else if (aCategory.split('@').length > 1)
				aCategory = aCategory.split('@')[1];
			else
				aCategory = aCategory.split('@')[0];
		}

		//World/Português/Artes/Música/Estilos&server=dmoz8080
		if (aCategory.indexOf('&') != -1 && aCategory.indexOf('=') != -1)
			aCategory = aCategory.split('&')[0];

		//some log pages

		aCategory = aCategory
			.replace(categoryCheckFormatRegExp5, '')
			.replace(categoryCheckFormatRegExp6, '')
			.replace(categoryCheckFormatRegExp7, '')
			.replace(categoryCheckFormatRegExp8, '')
			.replace(categoryCheckFormatRegExp9, '')
			.replace(categoryCheckFormatRegExp10, '')

		//ending with

		.replace(categoryCheckFormatRegExp11, '')
		//.replace(categoryCheckFormatRegExp1, '')

		//starting with
		//.replace(categoryCheckFormatRegExp2, '')

		.trim(aCategory);
		//I cant' remember this one

		if (aCategory.indexOf('[') == -1 && aCategory.indexOf(']') != -1) {
			aCategory = aCategory.replace(categoryCheckFormatRegExp12, '');
		}

		if (aCategory.indexOf('[') != -1 && aCategory.indexOf(']') != -1 && (categoryCheckFormatRegExp14.test(aCategory))) {
			var catTest = aCategory.replace(categoryCheckFormatRegExp13, "$1");
			if (catTest != '' && this.categoryStartsWithValidName(catTest)) {
				aCategory = catTest;
			}
		}
		//well know used formats

		//lovely editor:tangyp use this format!??
		//:World:+Chinese+Simplified:+科学:+科技:+电子工程/

		if (aCategory.indexOf(':+') != -1)
			aCategory = aCategory.replace(categoryCheckFormatRegExp15, '/').replace(categoryCheckFormatRegExp16, '_').replace(categoryCheckFormatRegExp17, '');

		//World : Chinese Simplified : 科学 : 科技 : 电子工程
		if (aCategory.indexOf(':') != -1)
			aCategory = aCategory.replace(categoryCheckFormatRegExp18, '/').replace(categoryCheckFormatRegExp19, '_');

		//World / Euskara / Hezkuntza
		if (aCategory.indexOf(' /') != -1 || aCategory.indexOf('/ ') != -1)
			aCategory = aCategory.replace(categoryCheckFormatRegExp20, '/');

		//World_/_Euskara_/_Hezkuntza
		if (aCategory.indexOf('_/') != -1 || aCategory.indexOf('/_') != -1)
			aCategory = aCategory.replace(categoryCheckFormatRegExp21, '/');

		//World/Español/Juegos/Cartas</td>
		if (aCategory.indexOf('<') != -1)
			aCategory = aCategory.replace(categoryCheckFormatRegExp22, '');

		//Test/Tools_for_Editors/New_Editors/faq.html
		if (categoryCheckFormatRegExp23.test(aCategory))
			aCategory = aCategory.replace(categoryCheckFormatRegExp24, '');

		aCategory = this.categorySanitize(aCategory)

		//ends with
		.replace(categoryCheckFormatRegExp1, '')
		//starting with
		.replace(categoryCheckFormatRegExp2, '');

		//Bookmarks/D/development/Bandas y artistas/
		if (aCategory.indexOf(' ') != -1)
			aCategory = aCategory.replace(categoryCheckFormatRegExp25, '_');
		//ok we have a valid category
		if (this.categoryStartsWithValidName(aCategory))
			return aCategory;
		else {
			if (aggressive) {
				var aCategory2 = '';
				//argg!!!!!!! try to find the category in text

				//first try with world because the other categories maybe are inside of world
				aCategory2 = aCategory.replace(/.*(Top\/[^ ]+).*$/, "$1");
				if (this.categoryStartsWithValidName(aCategory2))
					return aCategory2;

				//first try with world because the other categories maybe are inside of world
				aCategory2 = aCategory.replace(/.*(Test\/[^ ]+).*$/, "$1");
				if (this.categoryStartsWithValidName(aCategory2))
					return aCategory2;

				//first try with world because the other categories maybe are inside of world
				var aCategory2 = aCategory.replace(/.*(World\/[^ ]+).*$/, "$1");
				if (this.categoryStartsWithValidName(aCategory2))
					return aCategory2;

				//first try with world because the other categories maybe are inside of world
				aCategory2 = aCategory.replace(/.*(Kids_and_Teens\/[^ ]+).*$/, "$1");
				if (this.categoryStartsWithValidName(aCategory2))
					return aCategory2;

				//first try with world because the other categories maybe are inside of world
				aCategory2 = aCategory.replace(/.*(Regional\/[^ ]+).*$/, "$1");
				if (this.categoryStartsWithValidName(aCategory2))
					return aCategory2;

				aCategory = aCategory.replace(/.*((Bookmarks|Arts|Computers|Games|Health|Home|News|Recreation|Reference|Society|Sports|Science|Shopping|Business|Netscape|AOL|Adult)\/[^ ]+).*$/, "$1");
				if (this.categoryStartsWithValidName(aCategory)) {
					//!yay!yepeyepeyeye!!!!!!!!
					return aCategory;
				} else {
					return '';
				}
			} else {
				return '';
			}
		}
	}
	//returns the category name for the focused tab, trys to get the category from the document, if fails will look into the url
	this.categoryGetFocused = function() {
		return this.categoryGetFromDocument(this.documentGetFocused());
	}
	//returns the category name for the document
	this.categoryGetFromDocument = function(aDoc) {

		var isODPSubdomain = this.isODPSubdomain(this.getSubdomainFromURL(this.documentGetLocation(aDoc)));

		if (!isODPSubdomain)
			return '';

		var aCategory = '';

		var item = this.getElementNamed('cat', aDoc);
		if (!item) {} else
			aCategory = item.value;

		//public pages select
		if (aCategory == '' || this.tagName(item) == 'select') {
			if (
				aDoc.getElementsByTagName("option").length &&
				aDoc.getElementsByTagName("option").length > 1) {
				aCategory = aDoc.getElementsByTagName("option").item(1).value;
			}
		}

		aCategory = this.categorySanitize(aCategory);

		if (!this.categoryStartsWithValidName(aCategory))
			aCategory = '';

		if (aCategory == '')
			aCategory = this.categoryGetFromURL(this.documentGetLocation(aDoc));

		return aCategory;
	}
	//returns the category name for the URI, if multiples categories found will return the first
	this.categoryGetFromURL = function(aURI, aggressive) {
		var aCategory = '';

		if (!aURI)
			return aCategory;

		if (aURI.indexOf('cat=') != -1) {
			if (aURI.indexOf('?cat=') != -1) {
				aCategory = aURI.replace(/^.*\?cat=([^&]*)([^&amp])?.*$/, "$1");
			} else if (aURI.indexOf('&cat=') != -1) {
				aCategory = aURI.replace(/^.*&cat=([^&]*)([^&amp])?.*$/, "$1");
			} else if (aURI.indexOf('cat=') != -1) {
				aCategory = aURI.replace(/^.*cat=([^&]*)([^&amp])?.*$/, "$1");
			} else if (aURI.indexOf('where=') != -1) {
				aCategory = aURI.replace(/^.*where=([^&]*)([^&amp])?.*$/, "$1");
			} else {
				aCategory = aURI;
			}
		} else if (aURI.indexOf('.html') != -1) {
			if (aURI.indexOf('/full-index.html') != -1) {
				aCategory = aURI.replace(/^(.*)\/full-index\.html$/, "$1");
			} else if (aURI.indexOf('/desc.html') != -1) {
				aCategory = aURI.replace(/^(.*)\/desc\.html$/, "$1");
			} else if (aURI.indexOf('/faq.html') != -1) {
				aCategory = aURI.replace(/^(.*)\/faq\.html$/, "$1");
			} else if (aURI.indexOf('/about.html') != -1) {
				aCategory = aURI.replace(/^(.*)\/about\.html$/, "$1");
			} else {
				aCategory = aURI;
			}
		} else if (aURI.indexOf('profiles/') != -1) {
			return '';
		} else {
			aCategory = aURI;
		}

		if (aggressive || this.isODPSubdomain(this.getSubdomainFromURL(aCategory)))
			aCategory = this.removeSubdomain(aCategory);

		if (aCategory == '')
			return '';

		aCategory = this.categorySanitize(aCategory);

		//if multiples categories founds
		if (aCategory.indexOf('\n') != -1 || aCategory.indexOf('\r') != -1) {
			aCategory = aCategory.replace(/\r/g, '\n').replace(/\n\n/g, '\n');
			aCategory = aCategory.split('\n')[0];
			aCategory = this.categorySanitize(aCategory);
		}

		//aCategory = this.trim(aCategory);

		aCategory = this.categoryCheckFormat(aCategory, aggressive);

		//aCategory = this.categorySanitize(aCategory);

		if (this.categoryStartsWithValidName(aCategory))
			return aCategory;
		else
			return '';
	}
	//returns the category name for the last child of a category
	this.categoryGetLastChildName = function(aCategory) {
		return aCategory.replace(/\/+$/, '').replace(/.*\/([^\/]+)$/, "$1");
	}
	//returns the category name and the parent for the last child of a category
	this.categoryGetLastTwoChildName = function(aCategory) {
		return aCategory.replace(/\/+$/, '').replace(/^.*\/([^\/]+\/[^\/]+)$/, "$1").replace(/^\//, '');
	}
	//returns the parent category name for the category
	this.categoryGetParent = function(aCategory) {
		return aCategory.replace(/\/+$/, '').replace(/^(.+)\/[^\/]+$/, "$1");
	}
	//returns the top category of a category
	this.categoryGetSubTop = function(aCategory) {
		if (this.categoryIsAdult(aCategory))
			return 'Adult';
		else if (this.categoryIsKidsAndTeens(aCategory))
			return 'Kids_and_Teens';
		else if (aCategory.indexOf('World/') === 0)
			return aCategory.split('/')[1];
		else if (aCategory.indexOf('Regional') === 0)
			return aCategory.replace(/^([^\/]+)\/([^\/]+)\/([^\/]+)\/.*/, '$1 $2 $3');
		else
			return aCategory.split('/')[0];

	}
	//returns the editcat URL from a category name
	this.categoryGetURLEdit = function(aCategory) {
		/* here all the trouble for dmoz2.0 */
		return 'http://www.dmoz.org/editors/editcat/index?cat=' + this.encodeUTF8(aCategory);
	}
	//returns the public URL from a category name
	this.categoryGetURL = function(aCategory) {
		/* here all the trouble for dmoz2.0 */
		return this.encodeURI('http://www.dmoz.org/' + aCategory + '/');
	}
	//returns true if the category is Adult
	this.categoryIsAdult = function(aCategory) {
		if (aCategory.indexOf('Adult') == 0)
			return true;
		else
			return false;
	}
	//returns true if the category is for a RTL language
	this.categoryIsRTL = function(aCategory) {
		if (
			aCategory.indexOf('World/Arabic') != -1 ||
			aCategory.indexOf('World/Persian') != -1 ||
			aCategory.indexOf('World/Hebrew') != -1 ||

		aCategory.indexOf('International/Arabic') != -1 ||
			aCategory.indexOf('International/Persian') != -1 ||
			aCategory.indexOf('International/Hebrew') != -1)
			return true;
		else
			return false;
	}
	//returns true if the has badly characters, Note: should receive categories
	this.categoryIsBadEncoded = function(aCategory) {
		return aCategory.indexOf('%') != -1;
	}
	//returns true if the category is kids and teens
	this.categoryIsKidsAndTeens = function(aCategory) {
		return aCategory.indexOf('Kids_and_Teens') == 0;
	}
	//convert &amp; to ampersands & and remove slashs from the beggining and end.
	var categorySanitizeRegExp1 = /%2F/gi
	var categorySanitizeRegExp2 = /\*$/
	var categorySanitizeRegExp3 = /\\/g
	var categorySanitizeRegExp4 = /\/+/g
	var categorySanitizeRegExp5 = /^\//
	var categorySanitizeRegExp6 = /\/$/
	var categorySanitizeRegExp7 = /^Top\//
	this.categorySanitize = function(aCategory) {
		return this.htmlSpecialCharsDecode(this.trim(this.decodeUTF8(aCategory)))
			.replace(categorySanitizeRegExp1, '/')
			.replace(categorySanitizeRegExp2, '')
			.replace(categorySanitizeRegExp3, '/')
			.replace(categorySanitizeRegExp4, '/')
			.replace(categorySanitizeRegExp5, '')
			.replace(categorySanitizeRegExp6, '')
			.replace(categorySanitizeRegExp7, '');
	}
	//returns true if aCategory starts with a valid category name
	this.categoryStartsWithValidName = function(aCategory) {
		aCategory = aCategory.split('/')[0];
		switch (aCategory) {
			case 'World':
			case 'Regional':
			case 'Bookmarks':
			case 'Test':
				//case 'Top/':
			case 'Kids_and_Teens':
			case 'Arts':
			case 'Computers':
			case 'Games':
			case 'Health':
			case 'Home':
			case 'News':
			case 'Recreation':
			case 'Reference':
			case 'Society':
			case 'Sports':
			case 'Science':
			case 'Shopping':
			case 'Business':
			case 'Netscape':
			case 'AOL':
			case 'Adult':
				return true;
			default:
				return false;
		}
	}
	//returns a category title from a category name
	this.categoryTitle = function(aCategory) {
		return aCategory.replace(/_/g, ' ').replace(/-/g, ' ').replace(/ +/g, ' ');
	}
	//returns the a nice crop for use with labels
	this.categoryTitleForLabel = function(aCategory) {
		aCategory = this.categoryTitle(aCategory);
		if (aCategory.length > 23)
			return '…' + (aCategory.substr(aCategory.length - 23, aCategory.length)).replace(/^\//, '').replace(/\/$/, '');
		else
			return aCategory;
	}
	//returns a category title from a category name
	this.categoryTitleLastChild = function(aCategory) {
		return this.categoryTitle(this.categoryGetLastChildName(aCategory));
	}
	//returns the editor name for the URI
	var editorGetFromURLRegExp1 = /^.*editor=(([a-z]|[0-9])+)[^\:]?[^\.]?[^\%]?[^a-z]?.*$/i
	var editorGetFromURLRegExp2 = /^.*\/profiles\/(([a-z]|[0-9])+)[^a-z]?.*$/
	var editorGetFromURLRegExp3 = /^.*Bookmarks\/.\/(([a-z]|[0-9])+)[^a-z]?.*$/
	var editorGetFromURLRegExp4 = /^.*\/(Редактори|编辑员|Redaktører|Editoren|Editores|Editoreak|Editeurs|Συντάκτες|Editori|Editors|Redacteuren|RedaktorzyРедакторы|Redaktörer)\/(.\/)?(([a-z]|[0-9])+)\/?.*$/i
	this.editorGetFromURL = function(aURI) {
		var aFellowEditor = '';

		if (aURI.indexOf('editor=') != -1)
			aFellowEditor = aURI.replace(editorGetFromURLRegExp1, "$1");
		else if (aURI.indexOf('/profiles/') != -1)
			aFellowEditor = aURI.replace(editorGetFromURLRegExp2, "$1");
		else if (aURI.indexOf('Bookmarks/') != -1)
			aFellowEditor = aURI.replace(editorGetFromURLRegExp3, "$1");
		else if (aURI.indexOf('Test/') != -1) //the regular expression is not accepting the chinise characters! !?
			aFellowEditor = this.categoryGetFromURL(aURI).replace(editorGetFromURLRegExp4, "$3");

		if (aFellowEditor.indexOf('/') != -1 || aFellowEditor == 'http')
			return '';
		else
			return this.trim(aFellowEditor).replace('$', '').replace('^', '');
	}
	//returns the public URL for an editor
	this.editorGetURLPublic = function(anEditor) {
		return this.encodeURI('http://www.dmoz.org/public/profile?editor=' + anEditor);
	}
	//returns true if the subdomain/domain is from the ODP
	this.isODPSubdomain = function(aSubdomain) {
		aSubdomain = this.removeWWW(aSubdomain);

		switch (aSubdomain) {
			case 'dmoz.org':
			case 'editors.dmoz.org':
			case 'search.dmoz.org':
			case 'beta.dmoz.org':
			case 'dmoz.com':
			case 'core-n02.dmoz.aol.com':
			case 'directory.google.com': //what!?
				{
					return true;
					break;
				}
			default:
				return false;
		}
		return false;
	}
	//opens a tab with a ODP search
	this.odpSearchGetURL = function(aString) {
		return 'http://www.dmoz.org/search?ebuttons=1&q=' + this.encodeUTF8(aString);
	}
	//returns the URL for editing a site
	this.siteGetURLEdit = function(aURL, aCategory) {
		return 'http://www.dmoz.org/editors/editurl/edit?cat=' + this.encodeUTF8(aCategory) + '&url=' + this.encodeUTF8(aURL);
	}
	this.categoryGetURLEditUS = function(aCategory) {
		return 'http://www.dmoz.org/editors/editunrev/listurl?cat=' + this.encodeUTF8(aCategory) + '&mode=super';
	}

	this.odpNotes = function(aURL, aFunction) {
		aURL = 'http://www.godzuki.com.uy/mimizu/notes.php?url=' + this.encodeUTF8(aURL);
		this.readURL(aURL, false, false, false, function(aData) {
			try {
				aData = JSON.parse(aData);
				aFunction(aData);
			} catch (e) {
				ODPExtension.alert('You must be logged in to http://www.godzuki.com.uy/mimizu/.');
			}
		}, true, true);
	}
	//DARK
	this.odpPurpleD = function() {
		return 'purple';
	}
	this.odpGreenD = function() {
		return 'green';
	}
	this.odpRedD = function() {
		return 'red';
	}
	//Light
	this.odpPurple = function() {
		return 'rgba(128, 0, 128, 0.45)';
	}
	this.odpGreenL = function() {
		return 'rgba(0, 128, 0, 0.45)';
	}
	this.odpRedL = function() {
		return 'rgba(255, 0, 0, 0.45)';
	}

	var getLanguageFromCategoryData = {
		'Arabic': {
			'code': 'ar',
			'name': 'Arabic',
			'encodings': ['Windows-1256', 'ISO-8859-6']
		},
		'Azerbaijani': {
			'code': 'az',
			'name': 'Azerbaijani',
			'encodings': ['Windows-1254']
		},
		'Bahasa_Indonesia': {
			'code': 'id',
			'name': 'Bahasa_Indonesia',
			'encodings': ['Windows-1252', 'ISO-8859-1']
		},
		'Bulgarian': {
			'code': 'bg',
			'name': 'Bulgarian',
			'encodings': ['Windows-1251']
		},
		'Català': {
			'code': 'ca',
			'name': 'Català',
			'encodings': ['Windows-1252', 'ISO-8859-1']
		},
		'Česky': {
			'code': 'cs',
			'name': 'Česky',
			'encodings': ['Windows-1250', 'ISO-8859-2']
		},
		'Chinese_Simplified': {
			'code': 'zh',
			'name': 'Chinese_Simplified',
			'encodings': ['gb2312', 'gbk', 'gb18030']
		},
		'Chinese_Traditional': {
			'code': 'zh-tw',
			'name': 'Chinese_Traditional',
			'encodings': ['BIG-5', 'gb2312']
		},
		'Cymraeg': {
			'code': 'cy',
			'name': 'Cymraeg',
			'encodings': ['ISO-8859-1']
		},
		'Dansk': {
			'code': 'da',
			'name': 'Dansk',
			'encodings': ['ISO-8859-1', 'Windows-1252']
		},
		'Deutsch': {
			'code': 'de',
			'name': 'Deutsch',
			'encodings': ['ISO-8859-1', 'Windows-1252']
		},
		'Eesti': {
			'code': 'et',
			'name': 'Eesti',
			'encodings': ['ISO-8859-1', 'Windows-1251']
		},
		'Español': {
			'code': 'es',
			'name': 'Español',
			'encodings': ['ISO-8859-1', 'Windows-1251', 'Windows-1252']
		},
		'Français': {
			'code': 'fr',
			'name': 'Français',
			'encodings': ['ISO-8859-1', 'Windows-1251', 'Windows-1252']
		},
		'Gàidhlig': {
			'code': 'gd',
			'name': 'Gàidhlig',
			'encodings': ['ISO-8859-1', 'Windows-1251', 'Windows-1252']
		},
		'Galego': {
			'code': 'gl',
			'name': 'Galego',
			'encodings': ['ISO-8859-1', 'Windows-1251', 'Windows-1252']
		},
		'Greek': {
			'code': 'el',
			'name': 'Greek',
			'encodings': ['ISO-8859-7', 'Windows-1253']
		},
		'Hrvatski': {
			'code': 'hr',
			'name': 'Hrvatski',
			'encodings': ['ISO-8859-2', 'Windows-1250']
		},
		'Italiano': {
			'code': 'it',
			'name': 'Italiano',
			'encodings': ['ISO-8859-1', 'Windows-1251', 'Windows-1252']
		},
		'Japanese': {
			'code': 'jp',
			'name': 'Japanese',
			'encodings': ['SHIFT_JIS', 'EUC-JP', 'SJIS', 'ISO-2022-JP', 'eucJP-win', 'SJIS-win']
		},
		'Korean': {
			'code': 'ko',
			'name': 'Korean',
			'encodings': ['EUC-KR', 'ISO-2022-KR', 'SHIFT_JIS', 'EUC-JP', 'SJIS', 'ISO-2022-JP', 'eucJP-win', 'SJIS-win']
		},
		'Latviski': {
			'code': 'lv',
			'name': 'Latviski',
			'encodings': ['windows-1257', 'ISO-8859-1', 'Windows-1250']
		},
		'Lietuvių': {
			'code': 'lt',
			'name': 'Lietuvių',
			'encodings': ['windows-1257', 'Windows-1251', 'ISO-8859-1']
		},
		'Nederlands': {
			'code': 'nl',
			'name': 'Nederlands',
			'encodings': ['ISO-8859-1', 'windows-1252', 'ISO-8859-15', 'windows-1257']
		},
		'Norsk': {
			'code': 'nb',
			'name': 'Norsk',
			'encodings': ['ISO-8859-1', 'windows-1252']
		},
		'Norsk': {
			'code': 'nb',
			'name': 'Norsk',
			'encodings': ['ISO-8859-1', 'windows-1252']
		},
		'Persian': {
			'code': 'nb',
			'name': 'Persian',
			'encodings': ['Windows-1256', 'ISO-8859-6', 'ISO-8859-1', 'Windows-1252']
		},
		'Persian': {
			'code': 'fa',
			'name': 'Persian',
			'encodings': ['Windows-1256', 'ISO-8859-6', 'ISO-8859-1', 'Windows-1252']
		},
		'Polski': {
			'code': 'pl',
			'name': 'Polski',
			'encodings': ['ISO-8859-1', 'ISO-8859-2', 'Windows-1250']
		},
		'Português': {
			'code': 'pt',
			'name': 'Português',
			'encodings': ['ISO-8859-1', 'Windows-1252', 'Windows-1251']
		},
		'Română': {
			'code': 'ro',
			'name': 'Română',
			'encodings': ['ISO-8859-1', 'Windows-1250', 'ISO-8859-2', 'Windows-1251']
		},
		'Russian': {
			'code': 'ru',
			'name': 'Russian',
			'encodings': ['Windows-1251', 'KOI8-R', 'ISO-8859-5', 'KOI8-U']
		},
		'Slovensky': {
			'code': 'sk',
			'name': 'Slovensky',
			'encodings': ['Windows-1250', 'ISO-8859-1', 'ISO-8859-2']
		},
		'English': {
			'code': 'en',
			'name': 'English',
			'encodings': ['ISO-8859-1', 'ISO-8859-2']
		}
	}
	this.getLanguageFromCategory = function(aCategory) {
		aCategory = aCategory
			.replace(/^\/?Top\//, '')
			.replace(/^\/+/, '')
			.replace(/^Test\/World_Test\/World\/?/, '')
			.replace(/^Test\/World\/?/, '')
			.replace(/^Test\/World\/?/, '')
			.replace(/^Test\/?/, '')
			.replace(/^World\/?/, '')
			.replace(/^Kids_and_Teens\/International\/?/, '')
			.replace(/^Kids_and_Teens\/?/, '')
			.replace(/^Adult\/World\/?/, '')
			.replace(/^\/+/, '')
			.split('/')[0];
		if (!getLanguageFromCategoryData[aCategory])
			return getLanguageFromCategoryData['English'];
		else
			return getLanguageFromCategoryData[aCategory];
	}

	return null;

}).apply(ODPExtension);
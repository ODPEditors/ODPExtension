(function() {
	//sanitize the format of a category
	this.categoryCheckFormat = function(aCategory, aggressive) {
		//multiples categories selected maybe

		if (aCategory.indexOf('\n') != -1 || aCategory.indexOf('\r') != -1) {
			aCategory = aCategory.replace(/\r/g, '\n').replace(/\n\n/g, '\n');
			aCategory = aCategory.split('\n')[0];
		}

		//ending with
		aCategory = aCategory.replace(/(\+|\.|\:|@|"|,|'| |#|>|<|\)|\(|\*|_|-)*$/, '');
		//starting with
		aCategory = aCategory.replace(/^(\+|\.|\:|@|"|,|'| |#|>|<|\)|\(|\*|_|-)*/, '');

		//stange caracteres

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

		aCategory = aCategory.replace(/ +\(.*$/, '');
		aCategory = aCategory.replace(/ +\[.*$/, '');
		aCategory = aCategory.replace(/Unreviewed$/, '');
		aCategory = aCategory.replace(/Unrev$/, '');
		aCategory = aCategory.replace(/unrev$/, '');
		aCategory = aCategory.replace(/\.unreview$/, '');

		//ending with

		aCategory = aCategory.replace(/->.*$/, '');
		aCategory = aCategory.replace(/(\+|\.|\:|@|"|,|'| |#|>|<|\)|\(|\*|_|-)*$/, '');

		//starting with
		aCategory = aCategory.replace(/^(\+|\.|\:|@|"|,|'| |#|>|<|\)|\(|\*|_|-)*/, '');

		aCategory = this.trim(aCategory);

		//I cant' remember this one

		if (aCategory.indexOf('[') == -1 && aCategory.indexOf(']') != -1) {
			aCategory = aCategory.replace(/]$/, '');
		}

		if (aCategory.indexOf('[') != -1 && aCategory.indexOf(']') != -1 && /\]$/.test(aCategory)) {
			var catTest = aCategory.replace(/.* ([^ ]+)\]$/, "$1");
			if (catTest != '' && this.categoryStartsWithValidName(catTest)) {
				aCategory = catTest;
			}
		}
		//well know used formats

		//lovely editor:tangyp use this format!??
		//:World:+Chinese+Simplified:+科学:+科技:+电子工程/

		if (aCategory.indexOf(':+') != -1)
			aCategory = aCategory.replace(/\:\+/g, '/').replace(/\+/g, '_').replace(/^\:+/, '');

		//World : Chinese Simplified : 科学 : 科技 : 电子工程
		if (aCategory.indexOf(':') != -1)
			aCategory = aCategory.replace(/\s*?:\s*/g, '/').replace(/\s/g, '_');

		//World / Euskara / Hezkuntza
		if (aCategory.indexOf(' /') != -1 || aCategory.indexOf('/ ') != -1)
			aCategory = aCategory.replace(/\s*?\/\s*/g, '/');

		//World_/_Euskara_/_Hezkuntza
		if (aCategory.indexOf('_/') != -1 || aCategory.indexOf('/_') != -1)
			aCategory = aCategory.replace(/_*?\/_*/g, '/');

		//World/Español/Juegos/Cartas</td>
		if (aCategory.indexOf('<') != -1)
			aCategory = aCategory.replace(/<.*$/, '');

		//Test/Tools_for_Editors/New_Editors/faq.html
		if (/\/([^\/]+)\.(html|cgi|htm|php)$/i.test(aCategory))
			aCategory = aCategory.replace(/\/[^\/]+$/, '');

		aCategory = this.categorySanitize(aCategory);

		//ends with
		aCategory = aCategory.replace(/(\+|\.|\:|@|"|,|'| |#|>|<|\)|\(|\*|_)*$/, '');
		//starting with
		aCategory = aCategory.replace(/^(\+|\.|\:|@|"|,|'| |#|>|<|\)|\(|\*|_)*/, '');


		//Bookmarks/D/development/Bandas y artistas/
		if (aCategory.indexOf(' ') != -1)
			aCategory = aCategory.replace(/ /g, '_');

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
		var focusedDocument = this.documentGetFocused();

		var isODPSubdomain = this.isODPSubdomain(this.getSubdomainFromURL(this.documentGetLocation(focusedDocument)));

		var aCategory = this.categoryGetFromDocument(focusedDocument);

		if (isODPSubdomain && aCategory == '')
			aCategory = this.categoryGetFromURL(this.documentGetLocation(focusedDocument));

		if (isODPSubdomain && aCategory != '')
			return aCategory;
		else
			return '';
	}
	//returns the category name for the document
	this.categoryGetFromDocument = function(aDoc) {
		var aCategory = '';

		//edit x pages

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

		if (aCategory == '')
			return '';

		aCategory = this.categorySanitize(aCategory);

		if (this.categoryStartsWithValidName(aCategory))
			return aCategory;
		else
			return '';
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
		return (aCategory.indexOf('%') != -1);
	}
	//returns true if the category is kids and teens
	this.categoryIsKidsAndTeens = function(aCategory) {
		if (aCategory.indexOf('Kids_and_Teens') == 0)
			return true;
		else
			return false;
	}
	//convert &amp; to ampersands & and remove slashs from the beggining and end.
	this.categorySanitize = function(aCategory) {
		return this.htmlSpecialCharsDecode(this.trim(this.decodeUTF8(aCategory))).replace(/%2F/gi, '/').replace(/\*$/, '').replace(/\\/g, '/').replace(/\/+/g, '/').replace(/^\//, '').replace(/\/$/, '').replace(/^Top\//, '');
	}
	//returns true if aCategory starts with a valid category name
	this.categoryStartsWithValidName = function(aCategory) {
		if (
			aCategory.indexOf('World') == 0 ||
			aCategory.indexOf('Regional') == 0 ||
			aCategory.indexOf('Bookmarks') == 0 ||
			aCategory.indexOf('Test') == 0 ||
			aCategory.indexOf('Top/') == 0 || //top should be followed by a a category
		aCategory.indexOf('Kids_and_Teens') == 0 ||
			aCategory.indexOf('Arts') == 0 ||
			aCategory.indexOf('Computers') == 0 ||
			aCategory.indexOf('Games') == 0 ||
			aCategory.indexOf('Health') == 0 ||
			aCategory.indexOf('Home') == 0 ||
			aCategory.indexOf('News') == 0 ||
			aCategory.indexOf('Recreation') == 0 ||
			aCategory.indexOf('Reference') == 0 ||
			aCategory.indexOf('Society') == 0 ||
			aCategory.indexOf('Sports') == 0 ||
			aCategory.indexOf('Science') == 0 ||
			aCategory.indexOf('Shopping') == 0 ||
			aCategory.indexOf('Business') == 0 ||
			aCategory.indexOf('Netscape') == 0 ||
			aCategory.indexOf('AOL') == 0 ||
			aCategory.indexOf('Adult') == 0)
			return true;
		else
			return false;
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
	this.editorGetFromURL = function(aURI) {
		var aFellowEditor = '';

		if (aURI.indexOf('editor=') != -1)
			aFellowEditor = aURI.replace(/^.*editor=(([a-z]|[0-9])+)[^\:]?[^\.]?[^\%]?[^a-z]?.*$/i, "$1");
		else if (aURI.indexOf('/profiles/') != -1)
			aFellowEditor = aURI.replace(/^.*\/profiles\/(([a-z]|[0-9])+)[^a-z]?.*$/, "$1");
		else if (aURI.indexOf('Bookmarks/') != -1)
			aFellowEditor = aURI.replace(/^.*Bookmarks\/.\/(([a-z]|[0-9])+)[^a-z]?.*$/, "$1");
		else if (aURI.indexOf('Test/') != -1) //the regular expression is not accepting the chinise characters! !?
			aFellowEditor = this.categoryGetFromURL(aURI).replace(/^.*\/(Редактори|编辑员|Redaktører|Editoren|Editores|Editoreak|Editeurs|Συντάκτες|Editori|Editors|Redacteuren|RedaktorzyРедакторы|Redaktörer)\/(.\/)?(([a-z]|[0-9])+)\/?.*$/i, "$3");

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
		}
		return false;
	}
	//opens a tab with a ODP search
	this.odpSearchGetURL = function(aString) {
		return 'http://www.dmoz.org/search?ebuttons=1&q=' + this.encodeUTF8(aString);
	}
	//returns the private URL for editing a site
	this.siteGetURLEdit = function(aURL, aCategory) {
		return 'http://www.dmoz.org/editors/editurl.cgi?cat=' + this.encodeUTF8(aCategory) + '&url=' + this.encodeUTF8(aURL);
	}

	return null;

}).apply(ODPExtension);
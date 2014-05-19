(function() {
	//sanitize the format of a category
	var categoryCheckFormatRegExp1 = /(\:|@|"|,|'| |#|>|<|\)|\(|\*|_)*$/;
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

		if (aCategory.indexOf('http') != -1)
			aCategory = aCategory.split('http')[0];

		//ending with
		aCategory = aCategory
			.replace(categoryCheckFormatRegExp1, '')


		//starts with
		.replace(categoryCheckFormatRegExp2, '');

		//Reference/Libraries/Library_and_Information_Science/Librarians/Ranganathan,_S._R>>.<<
		if(aCategory.indexOf(',') == -1)
			aCategory = aCategory.replace(/\.$/, '')

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

		//Reference/Libraries/Library_and_Information_Science/Librarians/Ranganathan,_S._R>>.<<
		if(aCategory.indexOf(',') == -1)
			aCategory = aCategory.replace(/\.$/, '')

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

		//this.dump('1'+aCategory);
		aCategory = this.categorySanitize(aCategory);
		//this.dump('2'+aCategory);

		//if multiples categories founds
		if (aCategory.indexOf('  ') != -1) {
			aCategory = aCategory.split('  ')[0]
		}
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
	//returns the category name, the parent and its parent for the last child of a category
	this.categoryGetLastThreeChildName = function(aCategory) {
		return aCategory.replace(/\/+$/, '').replace(/^.*\/([^\/]+\/[^\/]+\/[^\/]+)$/, "$1").replace(/^\//, '');
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
	this.categoryGetTop = function(aCategory) {
		var language = this.getLanguageNameFromCategory(aCategory)
		if(language == 'English')
			return aCategory.split('/')[0]
		else if (this.categoryIsAdult(aCategory))
			return 'Adult/World/'+language+'/';
		else if (this.categoryIsKidsAndTeens(aCategory))
			return 'Kids_and_Teens/International/'+language+'/';
		else
			return 'World/'+language+'/';
	}
	this.categoryIsRegional = function(aCategory){
			//Regional and altlangs
			if(
				aCategory.indexOf("Regional/") === 0 ||
				aCategory.indexOf("World/Afrikaans/Streke/") === 0 ||
				aCategory.indexOf("World/Arabic/إقليمـي/") === 0 ||
				aCategory.indexOf("World/Aragonés/Rechional/") === 0 ||
				aCategory.indexOf("World/Armenian/Շրջանային/") === 0 ||
				aCategory.indexOf("World/Asturianu/Rexonal/") === 0 ||
				aCategory.indexOf("World/Azerbaijani/Regional/") === 0 ||
				aCategory.indexOf("World/Bahasa_Indonesia/Daerah/") === 0 ||
				aCategory.indexOf("World/Bahasa_Melayu/Tempatan/") === 0 ||
				aCategory.indexOf("World/Bangla/Ancholik/") === 0 ||
				aCategory.indexOf("World/Bashkir/Региональ/") === 0 ||
				aCategory.indexOf("World/Belarusian/Краіны_і_рэгіёны/") === 0 ||
				aCategory.indexOf("World/Bosanski/Regionalno/") === 0 ||
				aCategory.indexOf("World/Brezhoneg/Rannvroel/") === 0 ||
				aCategory.indexOf("World/Bulgarian/Региони/") === 0 ||
				aCategory.indexOf("World/Català/Regional/") === 0 ||
				aCategory.indexOf("World/Česky/Státy_a_regiony/") === 0 ||
				aCategory.indexOf("World/Chinese_Simplified/地区/") === 0 ||
				aCategory.indexOf("World/Chinese_Traditional/區域/") === 0 ||
				aCategory.indexOf("World/Cymraeg/Rhanbarthol/") === 0 ||
				aCategory.indexOf("World/Dansk/Regional/") === 0 ||
				aCategory.indexOf("World/Deutsch/Regional/") === 0 ||
				aCategory.indexOf("World/Eesti/Regioonid/") === 0 ||
				aCategory.indexOf("World/Español/Regional/") === 0 ||
				aCategory.indexOf("World/Esperanto/Regionoj/") === 0 ||
				aCategory.indexOf("World/Euskara/Non/") === 0 ||
				aCategory.indexOf("World/Français/Régional/") === 0 ||
				aCategory.indexOf("World/Frysk/Regionaal/") === 0 ||
				aCategory.indexOf("World/Furlan/Regjonal/") === 0 ||
				aCategory.indexOf("World/Gaeilge/Réigiúnach/") === 0 ||
				aCategory.indexOf("World/Gàidhlig/Dùthchannan/") === 0 ||
				aCategory.indexOf("World/Galego/Rexional/") === 0 ||
				aCategory.indexOf("World/Greek/Κατά_Περιοχή/") === 0 ||
				aCategory.indexOf("World/Gujarati/ક્ષેત્રીય/") === 0 ||
				aCategory.indexOf("World/Hebrew/אזורי/") === 0 ||
				aCategory.indexOf("World/Hindi/क्षेत्रीय/") === 0 ||
				aCategory.indexOf("World/Hrvatski/Regionalno/") === 0 ||
				aCategory.indexOf("World/Interlingua/Regional/") === 0 ||
				aCategory.indexOf("World/Íslenska/Landshlutar/") === 0 ||
				aCategory.indexOf("World/Italiano/Regionale/") === 0 ||
				aCategory.indexOf("World/Japanese/地域/") === 0 ||
				aCategory.indexOf("World/Kannada/ಪ್ರಾಂತೀಯ/") === 0 ||
				aCategory.indexOf("World/Kaszëbsczi/Òbéńdowé/") === 0 ||
				aCategory.indexOf("World/Kazakh/Региондық/") === 0 ||
				aCategory.indexOf("World/Kiswahili/Mikoani/") === 0 ||
				aCategory.indexOf("World/Korean/지역,국가/") === 0 ||
				aCategory.indexOf("World/Kurdî/Herêmî/") === 0 ||
				aCategory.indexOf("World/Kyrgyz/Региондук/") === 0 ||
				aCategory.indexOf("World/Latviski/Valstis_un_reģioni/") === 0 ||
				aCategory.indexOf("World/Lëtzebuergesch/Regionaal/") === 0 ||
				aCategory.indexOf("World/Lietuvių/Regionai/") === 0 ||
				aCategory.indexOf("World/Lingua_Latina/Regionatim/") === 0 ||
				aCategory.indexOf("World/Magyar/Regionális/") === 0 ||
				aCategory.indexOf("World/Makedonski/Регионално/") === 0 ||
				aCategory.indexOf("World/Nederlands/Regionaal/") === 0 ||
				aCategory.indexOf("World/Nordfriisk/Regionool/") === 0 ||
				aCategory.indexOf("World/Norsk/Regionalt/") === 0 ||
				aCategory.indexOf("World/Occitan/Regionau/") === 0 ||
				aCategory.indexOf("World/Ossetian/Бæстæтæ_æмæ_регионтæ/") === 0 ||
				aCategory.indexOf("World/O'zbekcha/Hududiy/") === 0 ||
				aCategory.indexOf("World/Polski/Regionalne/") === 0 ||
				aCategory.indexOf("World/Português/Regional/") === 0 ||
				aCategory.indexOf("World/Română/Regional/") === 0 ||
				aCategory.indexOf("World/Rumantsch/Regiunal/") === 0 ||
				aCategory.indexOf("World/Russian/Страны_и_регионы/") === 0 ||
				aCategory.indexOf("World/Sardu/Regionale/") === 0 ||
				aCategory.indexOf("World/Seeltersk/Regionoal/") === 0 ||
				aCategory.indexOf("World/Shqip/Rajonal/") === 0 ||
				aCategory.indexOf("World/Sinhala/ප්‍රාදේශීය/") === 0 ||
				aCategory.indexOf("World/Slovensko/Regije/") === 0 ||
				aCategory.indexOf("World/Slovensky/Regionálne/") === 0 ||
				aCategory.indexOf("World/Srpski/Regionalno/") === 0 ||
				aCategory.indexOf("World/Suomi/Alueellinen/") === 0 ||
				aCategory.indexOf("World/Svenska/Regionalt/") === 0 ||
				aCategory.indexOf("World/Tagalog/Kapuluan/") === 0 ||
				aCategory.indexOf("World/Taiwanese/地區/") === 0 ||
				aCategory.indexOf("World/Tamil/வட்டாரம்/") === 0 ||
				aCategory.indexOf("World/Tatarça/Ölkälär/") === 0 ||
				aCategory.indexOf("World/Telugu/Praantheeyam/") === 0 ||
				aCategory.indexOf("World/Thai/ภูมิภาค/") === 0 ||
				aCategory.indexOf("World/Tiếng_Việt/Địa_phương/") === 0 ||
				aCategory.indexOf("World/Türkçe/Bölgesel/") === 0 ||
				aCategory.indexOf("World/Türkmençe/Regional/") === 0 ||
				aCategory.indexOf("World/Ukrainian/Країни_та_реґіони/") === 0 ||
				aCategory.indexOf("World/Uyghurche/Rayonluq/") === 0)
			return true;
		else
			return false;
	}
	this.categoryIsAboutCountry = function(aCategory){
		return this.categoryIsRegional(aCategory) && ( (aCategory.indexOf('Regional/') === 0 && this.subStrCount(aCategory, '/') > 3) || this.subStrCount(aCategory, '/') > 4 );
	}
	this.categoryGetCountryName = function(aCategory){
		if(this.categoryIsRegional(aCategory)){
			if(aCategory.indexOf('World/') === 0){
				return aCategory.replace(/^World\/([^\/]+)\/([^\/]+)\/([^\/]+)\/([^\/]+)\/.*/, '$4');
			} else if(aCategory.indexOf('Regional/') === 0){
				return aCategory.replace(/^Regional\/([^\/]+)\/([^\/]+)\/.*/, '$2');
			} else {
				return  '';
			}
		} else {
			return '';
		}
	}
	this.categoryGetCountryContinentName = function(aCategory){
		if(this.categoryIsRegional(aCategory)){
			if(aCategory.indexOf('World/') === 0){
				return aCategory.replace(/^World\/([^\/]+)\/([^\/]+)\/([^\/]+)\/([^\/]+)\/.*/, '$3');
			} else if(aCategory.indexOf('Regional/') === 0){
				return aCategory.replace(/^Regional\/([^\/]+)\/([^\/]+)\/.*/, '$1');
			} else {
				return  '';
			}
		} else {
			return '';
		}
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
	//var categorySanitizeRegExp4 = /\/+/g
	var categorySanitizeRegExp5 = /^\//
	var categorySanitizeRegExp6 = /\/$/
	var categorySanitizeRegExp7 = /^Top\//
	this.categorySanitize = function(aCategory) {
		return this.htmlSpecialCharsDecode(this.trim(this.decodeUTF8(aCategory)))
			.replace(categorySanitizeRegExp1, '/')
			.replace(categorySanitizeRegExp2, '')
			.replace(categorySanitizeRegExp3, '/')
		//	.replace(categorySanitizeRegExp4, '/')
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
	this.categoryGetURLEditU = function(aCategory) {
		return 'http://www.dmoz.org/editors/editunrev/listurl?cat=' + this.encodeUTF8(aCategory);
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
	/* COLOURS */
	//DARK
	this.odpColourUpdateD = function() {
		return '#8e44ad'; //'purple';
	}
	this.odpColourEditorD = function() {
		return '#27ae60'; //'green';
	}
	this.odpColourPublishedD = function() {
		return '#669933'; //'green odp';
	}
	this.odpColourErrorD = function() {
		return '#e74c3c'; //'red';
	}
	this.odpColourPublicD = function() {
		return '#3498db'; //'blue';
	}
	this.odpColourXMLD = function() {
		return '#f39c12'; //not sure
	}
	this.odpColourGreenbustD = function() {
		return '#16a085';//'greendark';
	}
	this.odpColourGreyD = function() {
		return '#7f8c8d'; //mm grey
	}
	//Light
	this.odpPurpleL = function() {
		return '#9b59b6'; //'rgba(128, 0, 128, 0.45)';
	}
	this.odpGreenL = function() {
		return '#2ecc71'; //'rgba(0, 128, 0, 0.45)';
	}
	this.odpRedL = function() {
		return '#e74c3c'; //'rgba(255, 0, 0, 0.45)';
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

	this.getLanguageNameFromCategory = function(aCategory){
		return (('English/'+aCategory)
					.replace(/^English\/Kids_and_Teens\/International\//, '')
					.replace(/^English\/World\//, '')
					.replace(/^English\/Adult\/World\//, '')
					.replace(/^English\/Test\/World_Test\/World\//, '')
					.replace(/^English\/Test\/World\//, '')
				).split('/')[0];
	}

	return null;

}).apply(ODPExtension);
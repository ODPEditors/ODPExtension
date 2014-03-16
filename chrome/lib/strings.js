(function() {
	//decodes a string
	this.decodeUTF8 = function (aString) {
		if (aString.indexOf('%') == -1)
			return aString;
		try {
			return decodeURIComponent(aString);
		} catch (e) {
			try {
				return decodeURI(aString);
			} catch (e) {
				return aString;
			}
		}
	};
	//decodes all chars encoded in a string
	var decodeUTF8RecursiveRegExp = /% +/g;
	this.decodeUTF8Recursive = function (aString) //recursion was optimized
	{
		while (aString.indexOf('%') != -1) {
			aString = aString.replace(decodeUTF8RecursiveRegExp, '%');

			var last = aString;

			try {
				aString = decodeURIComponent(aString);
			} catch (e) {
				try {
					aString = decodeURI(aString);
				} catch (e) {
					return aString;
				}
			}
			if (aString == last)
				break;
		}
		return aString;
	};
	//encodes a URI - Example: converts this http://www.dmoz.org/World/Español/ to  http://www.dmoz.org/World/Espa%C3%B1ol/
	this.encodeURI = function (aURI) {
		try {
			return encodeURI(aURI);
		} catch (e) {
			return aURI;
		}
	};
	//encodes a string
	this.encodeUTF8 = function (aString) {
		try {
			return encodeURIComponent(aString);
		} catch (e) {
			try {
				return encodeURI(aString);
			} catch (e) {
				return aString;
			}
		}
	};
	//fix the puntuation for a String
	this.fixPuntuation = function (aString) {
		return this.trim(
			this.string(aString)

			.replace(/ +/g, ' ') //REGEXP 1
			.replace(/(( *,+ *| *,+ *\.+|,+ *|,+|\.+ *,+)+)/g, ', ') //REGEXP 2
			.replace(/((,* *\.+ *\.*)+)/g, '. ') //REGEXP 3

			.replace(/ +/g, ' ') //REGEXP 1
			.replace(/(( *,+ *| *,+ *\.+|,+ *|,+|\.+ *,+)+)/g, ', ') //REGEXP 2
			.replace(/((,* *\.+ *\.*)+)/g, '. ') //REGEXP 3

			.replace(/ +/g, ' ') //REGEXP 1
			.replace(/(( *,+ *| *,+ *\.+|,+ *|,+|\.+ *,+)+)/g, ', ') //REGEXP 2
			.replace(/((,* *\.+ *\.*)+)/g, '. ') //REGEXP 3

		).replace(/^\.* *,+ */, '').replace(/\.* *,+ *\.*$/, '.');
	};
	this.htmlEntityDecode = function (aString) {
		//ODPExtension.dump(typeof(aString))
		if (aString.indexOf('&') != -1) {
			var aTemp = aString.replace('&amp;', '&').replace('&nbsp;', ' ').replace('&iexcl;', '¡').replace('&cent;', '¢').replace('&pound;', '£').replace('&curren;', '¤').replace('&yen;', '¥').replace('&brvbar;', '¦').replace('&sect;', '§').replace('&uml;', '¨').replace('&copy;', '©').replace('&ordf;', 'ª').replace('&laquo;', '«').replace('&not;', '¬').replace('&shy;', '­').replace('&reg;', '®').replace('&macr;', '¯').replace('&deg;', '°').replace('&plusmn;', '±').replace('&sup2;', '²').replace('&sup3;', '³').replace('&acute;', '´').replace('&micro;', 'µ').replace('&para;', '¶').replace('&middot;', '·').replace('&cedil;', '¸').replace('&sup1;', '¹').replace('&ordm;', 'º').replace('&raquo;', '»').replace('&frac14;', '¼').replace('&frac12;', '½').replace('&frac34;', '¾').replace('&iquest;', '¿').replace('&Agrave;', 'À').replace('&Aacute;', 'Á').replace('&Acirc;', 'Â').replace('&Atilde;', 'Ã').replace('&Auml;', 'Ä').replace('&Aring;', 'Å').replace('&AElig;', 'Æ').replace('&Ccedil;', 'Ç').replace('&Egrave;', 'È').replace('&Eacute;', 'É').replace('&Ecirc;', 'Ê').replace('&Euml;', 'Ë').replace('&Igrave;', 'Ì').replace('&Iacute;', 'Í').replace('&Icirc;', 'Î').replace('&Iuml;', 'Ï').replace('&ETH;', 'Ð').replace('&Ntilde;', 'Ñ').replace('&Ograve;', 'Ò').replace('&Oacute;', 'Ó').replace('&Ocirc;', 'Ô').replace('&Otilde;', 'Õ').replace('&Ouml;', 'Ö').replace('&times;', '×').replace('&Oslash;', 'Ø').replace('&Ugrave;', 'Ù').replace('&Uacute;', 'Ú').replace('&Ucirc;', 'Û').replace('&Uuml;', 'Ü').replace('&Yacute;', 'Ý').replace('&THORN;', 'Þ').replace('&szlig;', 'ß').replace('&agrave;', 'à').replace('&aacute;', 'á').replace('&acirc;', 'â').replace('&atilde;', 'ã').replace('&auml;', 'ä').replace('&aring;', 'å').replace('&aelig;', 'æ').replace('&ccedil;', 'ç');

			aTemp = aTemp.replace('&egrave;', 'è').replace('&eacute;', 'é').replace('&ecirc;', 'ê').replace('&euml;', 'ë').replace('&igrave;', 'ì').replace('&iacute;', 'í').replace('&icirc;', 'î').replace('&iuml;', 'ï').replace('&eth;', 'ð').replace('&ntilde;', 'ñ').replace('&ograve;', 'ò').replace('&oacute;', 'ó').replace('&ocirc;', 'ô').replace('&otilde;', 'õ').replace('&ouml;', 'ö').replace('&divide;', '÷').replace('&oslash;', 'ø').replace('&ugrave;', 'ù').replace('&uacute;', 'ú').replace('&ucirc;', 'û').replace('&uuml;', 'ü').replace('&yacute;', 'ý').replace('&thorn;', 'þ').replace('&yuml;', 'ÿ').replace('&quot;', '"').replace('&lt;', '<').replace('&gt;', '>').replace('&apos;', "'").replace('&OElig;', 'Œ').replace('&oelig;', 'œ').replace('&Scaron;', 'Š').replace('&scaron;', 'š').replace('&Yuml;', 'Ÿ').replace('&circ;', 'ˆ').replace('&tilde;', '˜').replace('&ensp;', '').replace('&emsp;', '').replace('&thinsp;', '').replace('&zwnj;', '‌').replace('&zwj;', '‍').replace('&lrm;', '‎').replace('&rlm;', '‏').replace('&ndash;', '–').replace('&mdash;', '—').replace('&lsquo;', '‘').replace('&rsquo;', '’').replace('&sbquo;', '‚').replace('&ldquo;', '“').replace('&rdquo;', '”').replace('&bdquo;', '„').replace('&dagger;', '†').replace('&Dagger;', '‡').replace('&permil;', '‰').replace('&lsaquo;', '‹').replace('&rsaquo;', '›').replace('&euro;', '€').replace('&fnof;', 'ƒ').replace('&Alpha;', 'Α').replace('&Beta;', 'Β').replace('&Gamma;', 'Γ').replace('&Delta;', 'Δ').replace('&Epsilon;', 'Ε').replace('&Zeta;', 'Ζ').replace('&Eta;', 'Η');

			aTemp = aTemp.replace('&Theta;', 'Θ').replace('&Iota;', 'Ι').replace('&Kappa;', 'Κ').replace('&Lambda;', 'Λ').replace('&Mu;', 'Μ').replace('&Nu;', 'Ν').replace('&Xi;', 'Ξ').replace('&Omicron;', 'Ο').replace('&Pi;', 'Π').replace('&Rho;', 'Ρ').replace('&Sigma;', 'Σ').replace('&Tau;', 'Τ').replace('&Upsilon;', 'Υ').replace('&Phi;', 'Φ').replace('&Chi;', 'Χ').replace('&Psi;', 'Ψ').replace('&Omega;', 'Ω').replace('&alpha;', 'α').replace('&beta;', 'β').replace('&gamma;', 'γ').replace('&delta;', 'δ').replace('&epsilon;', 'ε').replace('&zeta;', 'ζ').replace('&eta;', 'η').replace('&theta;', 'θ').replace('&iota;', 'ι').replace('&kappa;', 'κ').replace('&lambda;', 'λ').replace('&mu;', 'μ').replace('&nu;', 'ν').replace('&xi;', 'ξ').replace('&omicron;', 'ο').replace('&pi;', 'π').replace('&rho;', 'ρ').replace('&sigmaf;', 'ς').replace('&sigma;', 'σ').replace('&tau;', 'τ').replace('&upsilon;', 'υ').replace('&phi;', 'φ').replace('&chi;', 'χ').replace('&psi;', 'ψ').replace('&omega;', 'ω').replace('&thetasym;', 'ϑ').replace('&upsih;', 'ϒ').replace('&piv;', 'ϖ').replace('&bull;', '•').replace('&hellip;', '…').replace('&prime;', '′').replace('&Prime;', '″').replace('&oline;', '‾').replace('&frasl;', '⁄').replace('&weierp;', '℘').replace('&image;', 'ℑ').replace('&real;', 'ℜ').replace('&trade;', '™').replace('&alefsym;', 'ℵ').replace('&larr;', '←').replace('&uarr;', '↑').replace('&rarr;', '→').replace('&darr;', '↓').replace('&harr;', '↔').replace('&crarr;', '↵').replace('&lArr;', '⇐').replace('&uArr;', '⇑').replace('&rArr;', '⇒').replace('&dArr;', '⇓').replace('&hArr;', '⇔').replace('&forall;', '∀').replace('&part;', '∂').replace('&exist;', '∃').replace('&empty;', '∅').replace('&nabla;', '∇').replace('&isin;', '∈').replace('&notin;', '∉');

			aTemp = aTemp.replace('&ni;', '∋').replace('&prod;', '∏').replace('&sum;', '∑').replace('&minus;', '−').replace('&lowast;', '∗').replace('&radic;', '√').replace('&prop;', '∝').replace('&infin;', '∞').replace('&ang;', '∠').replace('&and;', '∧').replace('&or;', '∨').replace('&cap;', '∩').replace('&cup;', '∪').replace('&int;', '∫').replace('&there4;', '∴').replace('&sim;', '∼').replace('&cong;', '≅').replace('&asymp;', '≈').replace('&ne;', '≠').replace('&equiv;', '≡').replace('&le;', '≤').replace('&ge;', '≥').replace('&sub;', '⊂').replace('&sup;', '⊃').replace('&nsub;', '⊄').replace('&sube;', '⊆').replace('&supe;', '⊇').replace('&oplus;', '⊕').replace('&otimes;', '⊗').replace('&perp;', '⊥').replace('&sdot;', '⋅').replace('&lceil;', '⌈').replace('&rceil;', '⌉').replace('&lfloor;', '⌊').replace('&rfloor;', '⌋').replace('&lang;', '〈').replace('&rang;', '〉').replace('&loz;', '◊').replace('&spades;', '♠').replace('&clubs;', '♣').replace('&hearts;', '♥').replace('&diams;', '♦').replace('&#160;', ' ').replace('&#161;', '¡').replace('&#162;', '¢').replace('&#163;', '£').replace('&#164;', '¤').replace('&#165;', '¥').replace('&#166;', '¦').replace('&#167;', '§').replace('&#168;', '¨').replace('&#169;', '©').replace('&#170;', 'ª').replace('&#171;', '«').replace('&#172;', '¬').replace('&#173;', '­').replace('&#174;', '®').replace('&#175;', '¯').replace('&#176;', '°').replace('&#177;', '±').replace('&#178;', '²').replace('&#179;', '³').replace('&#180;', '´').replace('&#181;', 'µ').replace('&#182;', '¶').replace('&#183;', '·').replace('&#184;', '¸').replace('&#185;', '¹').replace('&#186;', 'º').replace('&#187;', '»').replace('&#188;', '¼').replace('&#189;', '½').replace('&#190;', '¾').replace('&#191;', '¿').replace('&#192;', 'À').replace('&#193;', 'Á').replace('&#194;', 'Â').replace('&#195;', 'Ã').replace('&#196;', 'Ä').replace('&#197;', 'Å').replace('&#198;', 'Æ');

			aTemp = aTemp.replace('&#199;', 'Ç').replace('&#200;', 'È').replace('&#201;', 'É').replace('&#202;', 'Ê').replace('&#203;', 'Ë').replace('&#204;', 'Ì').replace('&#205;', 'Í').replace('&#206;', 'Î').replace('&#207;', 'Ï').replace('&#208;', 'Ð').replace('&#209;', 'Ñ').replace('&#210;', 'Ò').replace('&#211;', 'Ó').replace('&#212;', 'Ô').replace('&#213;', 'Õ').replace('&#214;', 'Ö').replace('&#215;', '×').replace('&#216;', 'Ø').replace('&#217;', 'Ù').replace('&#218;', 'Ú').replace('&#219;', 'Û').replace('&#220;', 'Ü').replace('&#221;', 'Ý').replace('&#222;', 'Þ').replace('&#223;', 'ß').replace('&#224;', 'à').replace('&#225;', 'á').replace('&#226;', 'â').replace('&#227;', 'ã').replace('&#228;', 'ä').replace('&#229;', 'å').replace('&#230;', 'æ').replace('&#231;', 'ç').replace('&#232;', 'è').replace('&#233;', 'é').replace('&#234;', 'ê').replace('&#235;', 'ë').replace('&#236;', 'ì').replace('&#237;', 'í').replace('&#238;', 'î').replace('&#239;', 'ï').replace('&#240;', 'ð').replace('&#241;', 'ñ').replace('&#242;', 'ò').replace('&#243;', 'ó').replace('&#244;', 'ô').replace('&#245;', 'õ').replace('&#246;', 'ö').replace('&#247;', '÷').replace('&#248;', 'ø').replace('&#249;', 'ù').replace('&#250;', 'ú').replace('&#251;', 'û').replace('&#252;', 'ü').replace('&#253;', 'ý').replace('&#254;', 'þ').replace('&#255;', 'ÿ').replace('&#34;', '"').replace('&#38;', '&').replace('&#60;', '<').replace('&#62;', '>').replace('&#39;', "'").replace('&#338;', 'Œ').replace('&#339;', 'œ').replace('&#352;', 'Š').replace('&#353;', 'š').replace('&#376;', 'Ÿ').replace('&#710;', 'ˆ').replace('&#732;', '˜').replace('&#8194;', '').replace('&#8195;', '').replace('&#8201;', '').replace('&#8204;', '‌').replace('&#8205;', '‍').replace('&#8206;', '‎').replace('&#8207;', '‏').replace('&#8211;', '–').replace('&#8212;', '—').replace('&#8216;', '‘').replace('&#8217;', '’').replace('&#8218;', '‚').replace('&#8220;', '“').replace('&#8221;', '”').replace('&#8222;', '„').replace('&#8224;', '†');

			aTemp = aTemp.replace('&#8225;', '‡').replace('&#8240;', '‰').replace('&#8249;', '‹').replace('&#8250;', '›').replace('&#8364;', '€').replace('&#402;', 'ƒ').replace('&#913;', 'Α').replace('&#914;', 'Β').replace('&#915;', 'Γ').replace('&#916;', 'Δ').replace('&#917;', 'Ε').replace('&#918;', 'Ζ').replace('&#919;', 'Η').replace('&#920;', 'Θ').replace('&#921;', 'Ι').replace('&#922;', 'Κ').replace('&#923;', 'Λ').replace('&#924;', 'Μ').replace('&#925;', 'Ν').replace('&#926;', 'Ξ').replace('&#927;', 'Ο').replace('&#928;', 'Π').replace('&#929;', 'Ρ').replace('&#931;', 'Σ').replace('&#932;', 'Τ').replace('&#933;', 'Υ').replace('&#934;', 'Φ').replace('&#935;', 'Χ').replace('&#936;', 'Ψ').replace('&#937;', 'Ω').replace('&#945;', 'α').replace('&#946;', 'β').replace('&#947;', 'γ').replace('&#948;', 'δ').replace('&#949;', 'ε').replace('&#950;', 'ζ').replace('&#951;', 'η').replace('&#952;', 'θ').replace('&#953;', 'ι').replace('&#954;', 'κ').replace('&#955;', 'λ').replace('&#956;', 'μ').replace('&#957;', 'ν').replace('&#958;', 'ξ').replace('&#959;', 'ο').replace('&#960;', 'π').replace('&#961;', 'ρ').replace('&#962;', 'ς').replace('&#963;', 'σ').replace('&#964;', 'τ').replace('&#965;', 'υ').replace('&#966;', 'φ').replace('&#967;', 'χ').replace('&#968;', 'ψ').replace('&#969;', 'ω').replace('&#977;', 'ϑ').replace('&#978;', 'ϒ').replace('&#982;', 'ϖ').replace('&#8226;', '•').replace('&#8230;', '…').replace('&#8242;', '′').replace('&#8243;', '″').replace('&#8254;', '‾').replace('&#8260;', '⁄').replace('&#8472;', '℘').replace('&#8465;', 'ℑ').replace('&#8476;', 'ℜ').replace('&#8482;', '™').replace('&#8501;', 'ℵ').replace('&#8592;', '←').replace('&#8593;', '↑');

			aTemp = aTemp.replace('&#8594;', '→').replace('&#8595;', '↓').replace('&#8596;', '↔').replace('&#8629;', '↵').replace('&#8656;', '⇐').replace('&#8657;', '⇑').replace('&#8658;', '⇒').replace('&#8659;', '⇓').replace('&#8660;', '⇔').replace('&#8704;', '∀').replace('&#8706;', '∂').replace('&#8707;', '∃').replace('&#8709;', '∅').replace('&#8711;', '∇').replace('&#8712;', '∈').replace('&#8713;', '∉').replace('&#8715;', '∋').replace('&#8719;', '∏').replace('&#8721;', '∑').replace('&#8722;', '−').replace('&#8727;', '∗').replace('&#8730;', '√').replace('&#8733;', '∝').replace('&#8734;', '∞').replace('&#8736;', '∠').replace('&#8743;', '∧').replace('&#8744;', '∨').replace('&#8745;', '∩').replace('&#8746;', '∪').replace('&#8747;', '∫').replace('&#8756;', '∴').replace('&#8764;', '∼').replace('&#8773;', '≅').replace('&#8776;', '≈').replace('&#8800;', '≠').replace('&#8801;', '≡').replace('&#8804;', '≤').replace('&#8805;', '≥').replace('&#8834;', '⊂').replace('&#8835;', '⊃').replace('&#8836;', '⊄').replace('&#8838;', '⊆').replace('&#8839;', '⊇').replace('&#8853;', '⊕').replace('&#8855;', '⊗').replace('&#8869;', '⊥').replace('&#8901;', '⋅').replace('&#8968;', '⌈').replace('&#8969;', '⌉').replace('&#8970;', '⌊').replace('&#8971;', '⌋').replace('&#9001;', '〈').replace('&#9002;', '〉').replace('&#9674;', '◊').replace('&#9824;', '♠').replace('&#9827;', '♣').replace('&#9829;', '♥').replace('&#9830;', '♦');

			return aTemp;

		} else {
			return aString;
		}

	};
	//Decodes HTML special chars
	this.htmlSpecialCharsDecode = function(aString) {
		if (aString.indexOf('&') != -1)
			return aString.split('&lt;').join('<').split('&gt;').join('>').split('&quot;').join('"').split('&apos;').join("'").split('&amp;').join('&');
		else
			return aString;
	};
	//Encodes HTML special chars
	this.htmlSpecialCharsEncode = this.h = function (aString) {
		if (!aString)
			return '';
		return aString.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;').split("'").join('&apos;');
	};
	//matchs a regular expresion
	this.matchCompiled = [];

	this.match = function (aString, aREGEXP) {
		if (aREGEXP == '') {
			return false;
		}
		try {
			if (!this.matchCompiled[aREGEXP])
				this.matchCompiled[aREGEXP] = new RegExp(aREGEXP, 'i');
			if (this.matchCompiled[aREGEXP].test(aString))
				return true;
			else
				return false;
		} catch (e) {
			return false;
		}
	};
	//replaces new lines with space characters
	this.removeNewLines = function (aString) {
		return this.trim(aString).split('\r').join(' ').split('\n').join(' ').split('\t').join(' ');
	};
	//returns true if aString has bad spelling
	this.spellError = function (aString, aDictionary) {
		if (!aString || aString.length == 1)
			return false;

		var spell = this.service('spell');

		if (!aDictionary)
			spell.spellCheckEngine.dictionary = 'en-GB';
		else
			spell.spellCheckEngine.dictionary = aDictionary;

		if (
			spell.mPersonalDictionary.check(aString, aDictionary) || // if the user has added the word as correct to the personal dictionary
			spell.spellCheckEngine.check(aString, aDictionary) // if the word doens't have an spell error by looking at the normal dictionary
		)
			return false;
		else
			return true;
	};
	//returns the list of dictionaries
	this.spellGetDictionaryList = function () {
		var a = {};

		var spell = this.service('spell').spellCheckEngine;
		spell.getDictionaryList(a, {});

		return String(a.value).split(',');
	};
	//cast an object toString avoids null errors
	this.string = function (aString) {
		if (!aString)
			return '';
		else
			return aString.toString();
	};
	//stripTags from a string
	var stripTagsRegExp = /<[^>]*>/g;
	this.stripTags = function (aString, aReplacement) {
		if (!aString)
			return '';
		if (!aReplacement)
			return aString.replace(stripTagsRegExp, '');
		else
			return aString.replace(stripTagsRegExp, aReplacement);
	};
	//Count the number of substring occurrences
	this.subStrCount = function (aString, aStringToCount) {
		var a = 0;
		var pos = aString.indexOf(aStringToCount);
		while (pos != -1) {
			a++;
			pos = aString.indexOf(aStringToCount, pos + 1);
		}
		return a;
	};
	//trims a string
	var trimStart = /^\s+/;
	var trimEnd = /\s+$/
	this.trim = function (aString) {
		if (!aString)
			return '';
		return aString.replace(trimStart, '').replace(trimEnd, '');
	};
	//returns the string with the first char in uppercase
	this.ucFirst = function (aString) {
		if (!aString)
			return '';
		return aString.substring(0, 1).toUpperCase() + aString.substring(1, aString.length);
	};

	this.stringTranslate = function (text, aFunction, sourceLanguage, targetLanguage) {

		if (!sourceLanguage)
			sourceLanguage = 'auto'
		if (!targetLanguage)
			targetLanguage = 'en'

		ODPExtension.readURL('http://translate.google.com/translate_a/t?client=t&text=' + this.encodeUTF8(text) + '&hl=en&sl=' + sourceLanguage + '&tl=' + targetLanguage + '&ie=UTF-8&oe=UTF-8&otf=1&ssel=0&tsel=0&uptl=en&alttl=hi&sc=1', false, false, false, function (aData) {
			aData = aData.split('","')[0].replace(/^\[\[\[\"/, '')
			aFunction(aData)
		}, false, false);
	}

	this.detectLanguage = function (aString, aFunction) {
		this.worker(
		            "chrome://ODPExtension/content/lib-external/LanguageDetect.js",
		            {
            			"aData": aString.slice(0, 4096)
            		},
            		aFunction
		)
	}
	this.compress = function (aString, aFunction) {
		this.worker(
		            "chrome://ODPExtension/content/lib-external/lz-string-1.3.3.js",
		           {
	           			"aData": aString,
	           			"type": 'compress'
		           	},
            		aFunction
		)
	}

	var stringCompressor = new Components.utils.Sandbox("about:blank");
	this.uncompressSync = function (aString) {
		if (!stringCompressor.loaded) {
			Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
				.getService(Components.interfaces.mozIJSSubScriptLoader)
				.loadSubScript("chrome://ODPExtension/content/lib-external/lz-string-1.3.3.js", stringCompressor, "UTF-8");
			stringCompressor.loaded = true;
		}
		return stringCompressor.LZString.decompressFromUTF16(aString);
	}
	this.uncompress = function (aString) {
		this.worker(
		            "chrome://ODPExtension/content/lib-external/lz-string-1.3.3.js",
		           {
	           			"aData": aString,
	           			"type": 'uncompress'
		           	},
            		aFunction
		)
	}

	// !! http://stackoverflow.com/questions/11434747/javascript-library-to-align-tab-separated-data-like-elastictabstops/11437399#11437399
	this.tabs = function (aData) {
		var align;
		align = function (d) {
			var b, l, o, pad;
			b = [];
			l = [];
			d.split('\n').forEach(function (c) {
				var a;
				a = [];
				c.split(/(\t+|\s\s+)/).forEach(function (d) {
					if (d.match(/\w/)) {
						a.push(d.toString());
						if ((l[a.length - 1] != null) < d.length) {
							return l[a.length - 1] = d.length;
						}
					}
				});
				return b.push(a);
			});
			pad = function (txt, len) {
				while (txt.length < len) {
					txt += " ";
				}
				return txt;
			};
			o = "\n";
			b.forEach(function (d) {
				d.forEach(function (j, i) {
					o += pad(j.toString(), l[i]);
					return o += "\t";
				});
				return o += "\n";
			});
			return o;
		};
		var txt = '';
		for (var id in aData) {
			for (var i in aData[id]) {
				txt += aData[id][i] + '\t';
			}
			txt += '\n';
		}
		return align(txt);
	}
	return null;

}).apply(ODPExtension);
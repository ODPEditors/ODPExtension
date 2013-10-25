(function() {

	var debugingThisFile = true;

	this.searchEngine = function() {

		function SearchEngine() {
			return this;
		}

		SearchEngine.prototype = {
			url: 'https://www.google.com/search?client=ms-android-samsung&source=android-home&site=webhp&source=hp&safe=on&lr={lang}&q={query}&start={start}',
			search: function(aSearchTerm, aLanguage, aSearchNumber, aFunction, aStart) {

				if ( !! aStart)
					aStart = +aStart * 10;
				else
					aStart = '';

				var url = this.url.replace('{query}', encodeURIComponent(aSearchTerm)).replace('{start}', aStart).replace('{lang}', this.lang(aLanguage))
				var self = this;
				ODPExtension.readURL(url, false, false, false, function(aData) {
					aFunction(self.parseResults(aData, aSearchNumber));
				}, true, false);
			},
			parseResults: function(aResponse, aSearchNumber) {

				/*				try {
					var spell = $(aResponse).find('a.spell')
					if (spell && spell.text() && spell.text() != '') {
						document.querySelector('.spell').innerHTML = 'Did you mean: <b><i>' + spell.text() + '</i></b>';
					} else {
						document.querySelector('.spell').innerHTML = ''
					}
				} catch (e) {
					document.querySelector('.spell').innerHTML = ''
				}*/

				var parsing = ODPExtension.select('li.g', aResponse, this.url),
					results = [];
				for (var id in parsing) {
					try {

						var html = parsing[id].innerHTML;

						var aResult = {};
						aResult.url = ODPExtension.htmlEntityDecode(ODPExtension.select('.r a', html)[0].getAttribute('href'));
						aResult.title = ODPExtension.htmlEntityDecode(ODPExtension.htmlEntityDecode(ODPExtension.stripTags(ODPExtension.select('.r a', html)[0].innerHTML).trim()));
						aResult.description = ODPExtension.htmlEntityDecode(ODPExtension.htmlEntityDecode(ODPExtension.stripTags(ODPExtension.select('.st', html)[0].innerHTML).trim()));
						results[results.length] = aResult;

					} catch (e) {}
				}
				return results
			},

			lang: function(aLanguage) {

				switch (aLanguage) {
					case 'ar':
						return 'lang_ar';
					case 'bg':
						return 'lang_bg';
					case 'es':
						return 'lang_es';
					case 'en':
						return 'lang_en';
					case 'ca':
						return 'lang_ca';
					case 'dk':
						return 'lang_da';
					case 'de':
						return 'lang_de';
					case 'fr':
						return 'lang_fr';
					case 'ga':
						return '';
					case 'it':
						return 'lang_it';
					case 'nl':
						return 'lang_nl';
					case 'ro':
						return 'lang_ro';
					case 'pl':
						return 'lang_pl';
					case 'pt':
						return 'lang_pt';
					case 'ru':
						return 'lang_ru';
					case 'se':
						return 'lang_sw';
					case 'jp':
						return 'lang_ja';
					case 'ch':
						return 'lang_zh-CN';
					case 'uk':
						return 'lang_uk';
					case 'cz':
						return 'lang_cs';
					case 'mg':
						return 'lang_hu';
					case 'gr':
						return 'lang_el';
					default:
						return '';
				}
				return '';
			}
		}
		return new SearchEngine();
	}

	return null;

}).apply(ODPExtension);
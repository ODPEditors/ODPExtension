(function() {

	this.kataslice = function(aCategory, aFunction) {

		if ( !! aCategory) {

			aCategory = this.categoryGetFromURL(aCategory)
			var categories = this.categoriesTXTQuery(aCategory, aCategory).categories;

			/*if(categories.length > 50){
				this.notifyTab('Too many categories: '+categories.length+', restricting to the first 50')
				categories = categories.slice(0, 50)
			}*/

			if (categories.length > 50) {
				var cache = 'kataslice';
			}
			else {
				var cache = false;
			}

			var aSites = []

				function next() {

					aCategory = categories.pop()

					if (!aCategory) {
						aFunction(aSites);
					}
					else {

						var urlUnreview = ODPExtension.categoryGetURLEditU(aCategory);
						var urlList = ODPExtension.categoryGetURLEdit(aCategory);

						ODPExtension.readURL(urlUnreview, cache, false, false, function(aData) {

							if (aData.indexOf('<form action="login"') != -1) {
								ODPExtension.alert('You must be logged in to your dashboard to use this tool.');
								categories = []
							}
							else if (aData.indexOf('javascript:history.back') != -1) {
								ODPExtension.alert('Server busy.. or category too big, try again, F5 and give time.. or choose a smaller category')
								categories = []
							}
							else {

								ODPExtension.categoryParserGetCategoryU(aData, urlUnreview, aSites)

								ODPExtension.readURL(urlList, cache, false, false, function(aData) {

									if (aData.indexOf('<form action="login"') != -1) {
										ODPExtension.alert('You must be logged in to your dashboard to use this tool.');
										categories = []
									}
									else if (aData.indexOf('javascript:history.back') != -1) {
										ODPExtension.alert('Server busy.. or category too big, try again, F5 and give time.. or choose a smaller category')
										categories = []
									}
									else {
										ODPExtension.categoryParserGetCategoryL(aData, urlList, aSites)
									}
									next();

								}, true, true);
							}

						}, true, true);

					}
				}

			next();

		}
	}
	return null;

}).apply(ODPExtension);
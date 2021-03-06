(function () {

	this.addListener('userInterfaceLoad', function(aEnabled) {
		//if(ODPExtension.shared.me){
			var menus = ['context-from-category',
 			'context-from-categories',
 			'extension-icon-from-category',
 			'from-category',
 			'tab-context-from-category',
 			'tab-context-multiple-from-category']
 			var elements = [
 			 				'kataslice_unreviewed',
 				 			'kataslice_unreviewed_recursive',
 				 			'kataslice_unreviewed_separator',
 				 			'kataslice_reviewed',
 				 			'kataslice_reviewed_recursive',
 				 			'kataslice_reviewed_separator',
 				 			'kataslice',
 				 			'kataslice_separator',
 				 			'kataslice_recursive'
 			]
 			for(var id in menus){
 				for(var i in elements){
		 				document
		 					.getAnonymousElementByAttribute(
		 					                                ODPExtension.getElement(menus[id]).firstChild ||
		 					                                ODPExtension.getElement(menus[id]),
		 					                                "anonid", elements[i]
		 					).removeAttribute('hidden');
		 		}
	 		}
		//}
	});

	this.kataslice = function (aCategory, reviewed, recursive, aFunction) {

		if ( !! aCategory) {

			aCategory = this.categoryGetFromURL(aCategory)

			var categories = []
				categories[categories.length] = aCategory

			var cache = false;

			var aSites = []

				function next() {

					aCategory = categories.pop()

					if (!aCategory) {

						aFunction(aSites);

					} else {

						ODPExtension.runThreaded('kataslice.fetch.sites.', 1, function (onThreadDone) {

							var urlList = ODPExtension.categoryGetURLEdit(aCategory);
							ODPExtension.readURL(urlList, cache, false, false, function (aData) {

								if(recursive){
									var subcategories = ODPExtension.categoryParserGetCategorySubcategories(aData, urlList)
									for(var id in subcategories)
										categories[categories.length] = subcategories[id]
								}
								if (reviewed == '1' || reviewed == '2') {
									if (aData.indexOf('<form action="login"') != -1) {
										ODPExtension.dump(aCategory);
										ODPExtension.alert('You must be logged in to your dashboard to use this tool.');
										ODPExtension.readURLDeleteCache(urlList, cache)
										categories = []
									} else if (aData.indexOf('javascript:history.back') != -1) {
										ODPExtension.dump(aCategory);
										ODPExtension.alert('Server busy.. or category too big, try again, F5 and give time.. or choose a smaller category')
										ODPExtension.readURLDeleteCache(urlList, cache)
										categories = []
									} else {
										ODPExtension.categoryParserGetCategoryL(aData, urlList, aSites)
									}
									if (reviewed == '0' || reviewed == '2'){}
										else{
											next();
											onThreadDone()
										}
								}

								if (reviewed == '0' || reviewed == '2') {
									var urlUnreview = ODPExtension.categoryGetURLEditU(aCategory);
									ODPExtension.readURL(urlUnreview, cache, false, false, function (aData) {
										if (aData.indexOf('<form action="login"') != -1) {
											ODPExtension.dump(aCategory);
											ODPExtension.alert('You must be logged in to your dashboard to use this tool.');
											ODPExtension.readURLDeleteCache(urlUnreview, cache)
											categories = []
										} else if (aData.indexOf('javascript:history.back') != -1) {
											ODPExtension.dump(aCategory);
											ODPExtension.alert('Server busy.. or category too big, try again, F5 and give time.. or choose a smaller category')
											ODPExtension.readURLDeleteCache(urlUnreview, cache)
											categories = []
										} else {
											ODPExtension.categoryParserGetCategoryU(aData, urlUnreview, aSites)
											next();
										}
										onThreadDone()
									}, true, true);
								}
							}, true, true);
						});
					}
				}

			next();

		}
	}

	this.katasliceJSON = function (aFunction) {
		var aSites = []
			this.categoryParserGetCategoryUJSONSites(JSON.parse(this.fileRead('urls.json')), aSites)
		aFunction(aSites);
	}

	this.katasliceCleanCache = function(){
		this.fileRemove('/cached.request/kataslice/');
	}
	return null;

}).apply(ODPExtension);
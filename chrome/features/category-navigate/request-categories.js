(function() {

	//obtains the categories for contruct the navegables menus
	this.categoryBrowserNavigateRequestCategories = function(item) {
		item.setAttribute('done', true);
		item.removeAttribute('retrieving');

		var aCategory = item.getAttribute('value');

		//if the categories.txt does not exists, or if it is Test or bookmarks.
		if (!this.shared.categories.txt.exists || aCategory.indexOf('Test') === 0 || aCategory.indexOf('Bookmarks') === 0) {
			var Requester = new XMLHttpRequest();
			Requester.onload = function(aEvent) {
				if (
					Requester.status != '200' ||
					Requester.responseText == null ||
					Requester.responseText == '') {
					item.setAttribute('label', item.getAttribute('label') + '/');
				} else {
					var aCategories = ODPExtension.categoryParserGetCategorySubcategories(Requester.responseText, ODPExtension.categoryGetURL(aCategory));
					if (aCategories.length == 0) {
						item.setAttribute('label', item.getAttribute('label') + '/');
					} else {
						ODPExtension.categoryBrowserNavigateBuildSubMenu(item, aCategories);
					}
				}
			};
			Requester.open("GET", this.categoryGetURL(aCategory), true);
			Requester.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;
			Requester.send(null);
		} else {
			//if categories.txt exists, then try it, if the category is not Test or bookmarks.
			var anArrayResults = []
			if (this.shared.categories.txt.exists &&  aCategory.indexOf('Test') !== 0 && aCategory.indexOf('Bookmarks') !== 0){
				var aConnection = this.rdfDatabaseOpen();
				var query = aConnection.query('select category from categories_txt where parent = (select id from categories_txt where category = :category)');
					query.params('category', aCategory+'/');
				var row;
				for (var i = 0; row = aConnection.fetchObjects(query); i++) {
					anArrayResults.push(row.category.replace(/\/$/, ''));
				}
			}
			if (anArrayResults.length === 0)
				item.setAttribute('label', item.getAttribute('label') + '/');
			 else
				ODPExtension.categoryBrowserNavigateBuildSubMenu(item, anArrayResults);
		}
	}

	return null;

}).apply(ODPExtension);
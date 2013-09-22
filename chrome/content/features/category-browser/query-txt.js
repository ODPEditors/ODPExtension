(function() {

	//do a search in the categories.txt database
	this.categoryBrowserQueryTXT = function(aNode, aQuery, aDatabase) {
		//this.dump('categoryBrowserQueryTXT:aQuery:'+aQuery, true);
		//saving last selected
		this.preferenceSet('locked.advanced.local.category.finder.last.selected', aDatabase);

		if (!aQuery || aQuery == '')
			return;

		//avoids the same search to be appended to the menu twice
		if (!this.categoryBrowserCategories[aNode.getAttribute('id') + '-' + aQuery + '-' + aDatabase]) {} else
			return;
		this.categoryBrowserCategories[aNode.getAttribute('id') + '-' + aQuery + '-' + aDatabase] = true;

		aQuery = this.trim(aQuery).replace(/_/g, ' ');

		var aResult = this.categoriesTXTQuery(aQuery, aDatabase, null, true);
		var menus = [],
			aNodes, menu, menupopup, item, database;
		//SHOWING RESULTS
		if (aResult.count > 0) {
			//group the results by database
			for (var id in aResult.categories) {
				aNodes = aResult.categories[id].split('/');
				if (aResult.categories[id].indexOf('World') === 0)
					database = aNodes[0] + '/' + aNodes[1] + '/' + aNodes[2] + '/' + aNodes[3];
				else if (aResult.categories[id].indexOf('Regional') === 0)
					database = aNodes[0] + '/' + aNodes[1] + '/' + aNodes[2];
				else
					database = aNodes[0] + '/' + aNodes[1];
				if (!menus[database]) {
					menu = this.create('menu');
					//menu.setAttribute('locked', true);
					//menu.setAttribute('label', this.categoryAbbreviate(database));
					//menu.setAttribute('value', database);
					menupopup = this.create('menupopup');
					menu.appendChild(menupopup);
					menus[database] = menu;
				}
				item = this.create('menuitem');
				item.setAttribute('value', aResult.categories[id]);
				item.setAttribute('label', this.categoryAbbreviate(aResult.categories[id]) + '/');
				item.setAttribute('done', 'true');

				menus[database].firstChild.appendChild(item);
			}
			menus = menus.reverse();
			var count = 0;
			for (var id in menus) {
				count++;
				menus[id].setAttribute('label', this.getString('category.browser.search.in').replace('{QUERY}', aQuery).replace('{CAT}', this.categoryAbbreviate(id)).replace('{NUM_RESULTS}', menus[id].firstChild.childNodes.length));
				this.moveNodeBelow(menus[id], aNode);
				if (count > 60) //too many items for the menu
					break;
			}
			var separator = this.create('menuseparator');
			//	separator.setAttribute('locked', true);
			this.moveNodeBelow(separator, aNode);
		} else {
			aNode.setAttribute('hidden', true);
			this.notifyTab(this.getString('no.results').replace('{QUERY}', aQuery), 8);
		}
	}

	return null;

}).apply(ODPExtension);
(function() {

	//do a search in the menu child nodes or database
	this.categoryBrowserQueryMenu = function(aNode, aQuery, aTextbox) {
		//this.dump('categoryBrowserQueryMenu:aQuery:'+aQuery, true);
		//re-showing the elements
		aQuery = this.trim(aQuery).replace(/_/g, ' ');
		if (aQuery == '') {
			for (var i = 0; i < aNode.childNodes.length; i++) {
				if (aNode.childNodes[i].hasAttribute('anonid'))
					continue;
				this.elementShow(aNode.childNodes[i]);
			}
		} else {
			//searching in the childnodes
			var foundChildNodes = 0;

			for (var i = 0; i < aNode.childNodes.length; i++) {
				var item = aNode.childNodes[i];
				if (item.hasAttribute('anonid'))
					continue;
				if (item.hasAttribute('value')) {
					if (this.searchEngineSearch(aQuery, item.value.replace(/_/g, ' ').replace(/-/g, ' '))) {
						foundChildNodes++;
						this.elementShow(item);
					} else {
						this.elementHide(item);
					}
				} else {
					this.elementShow(item);
				}
			}

			//searching in the database if there is a few results
			var foundDatabase = false;
			if (foundChildNodes < 50) {
				//this.dump('categoryBrowserQueryMenu:database search ', true);
				var aCategories = [];
				var row;
				var db = this.categoriesHistoryDatabaseOpen();
				for (var i = 0; row = db.fetchObjects(this.categoryHistoryGetHistory); i++) {
					if (this.searchEngineSearch(aQuery, row.categories_history_category.replace(/_/g, ' ').replace(/-/g, ' '))) {
						foundDatabase = true;
						aCategories[aCategories.length] = row.categories_history_category;
						foundChildNodes++;
						if (foundChildNodes > 50)
							break;
					}
				}
				db.reset(this.categoryHistoryGetHistory);
			}
			if (foundDatabase) {
				//this.categoryBrowserAppendCategoriesAfter(aCategories.reverse(), this.getElement('category-browser-categories-history'));
				this.categoryBrowserAppendCategoriesAfter(aCategories.reverse(), this.getElement('category-browser').lastChild);
				this.getElement('category-browser-categories-history').setAttribute('hidden', false);
			} else {
				//this.getElement('category-browser-categories-history').setAttribute('hidden', true);
			}

			if (foundChildNodes < 1) {
				this.notifyTab(this.getString('no.results').replace('{QUERY}', aQuery), 8);
			}
		}
	}

	return null;

}).apply(ODPExtension);
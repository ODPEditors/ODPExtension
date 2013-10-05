(function() {


	//finds all the subcategories and the categories at the same level "sisters"
	this.categoryNavigatorToolbarbuttonUpdate = function(currentPopup, aEvent) {
		//only popupshowing for the original target
		if (aEvent.currentTarget != aEvent.originalTarget || currentPopup.hasAttribute('done')) //check if this menu was build
			return;

		//removeAttribute('onpopupshowing') is not working!.. probably because is a listener
		currentPopup.setAttribute('done', true);

		var aCategory = currentPopup.getAttribute('value').replace(/\/$/, '');
		var aCategoryNodes = aCategory.split('/');

		//for when displaying bookmarks and test
		if (aCategory.indexOf('Bookmarks') === 0 || aCategory.indexOf('Test') === 0) {
			/*var aPath = '';
			for (var id in aCategoryNodes) {
				if (id == aIndex) {
					aPath += aCategoryNodes[id] + '/';
					break;
				} else {
					aPath += aCategoryNodes[id] + '/';
				}
			}

			aCategory = aPath.replace(/\/$/, '');

			var Requester = new XMLHttpRequest();
			Requester.onload = function() {
				if (
					Requester.status != '200' ||
					Requester.responseText == null ||
					Requester.responseText == '') {
					currentPopup.parentNode.setAttribute('disabled', true);
					ODPExtension.stopEvent(aEvent);
				} else {
					var aCategories = ODPExtension.categoryParserGetCategorySubcategories(Requester.responseText, aCategory);
					//ODPExtension.dump(aCategories)
					if (aCategories.length == 0) {
						currentPopup.parentNode.setAttribute('disabled', true);
						ODPExtension.stopEvent(aEvent);
					} else {
						for (var id in aCategories) {
							var add = ODPExtension.create("menuitem");
							add.setAttribute("label", ODPExtension.categoryAbbreviate(ODPExtension.categoryGetLastChildName(aCategories[id])));
							add.setAttribute("value", aCategories[id]);
							currentPopup.appendChild(add);
						}
					}
				}
			};
			Requester.open("GET", this.categoryGetURL(aCategory), true);
			Requester.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;
			Requester.send(null);*/

		} else {
			//this.dump(currentPopup);

			//first finds all the subcategories
			var aConnection = this.categoriesTXTDatabaseOpen();
			var query = aConnection.query('select category from categories_txt where parent = (select id from categories_txt where category = :category)');
			query.params('category', aCategory + '/');
			var row, anArrayResults = [];
			for (var i = 0; row = aConnection.fetchObjects(query); i++) {
				anArrayResults[anArrayResults.length] = row.category.replace(/\/$/, '');
			}

			var somethingFound = false;
			var foundTopCategories = false;
			var aCategoryLastChild;

			//adding first the top categories
			for (var i = 0; i < anArrayResults.length; i++) {
				if (this.inArray(this.shared.category.top.categories, (aCategoryLastChild = this.categoryGetLastChildName(anArrayResults[i])))) {
					//this.dump(subcategories.categories[i]);
					var add = this.create("menuitem");
					add.setAttribute("label", this.categoryAbbreviate(aCategoryLastChild));
					add.setAttribute("value", anArrayResults[i].replace(/\/$/, ''));
					currentPopup.appendChild(add);
					somethingFound = true;
					foundTopCategories = true;
					anArrayResults[i] = '';
				}
			}
			if (foundTopCategories) {
				currentPopup.appendChild(this.create('menuseparator'));
			}

			//alphabar menu if any
			var menuAlphabar = this.create('menu');
			menuAlphabar.setAttribute('label', 'Alphabar');
			menuAlphabar.setAttribute('done', 'true');
			var menupopupAlphabar = this.create('menupopup');
			menupopupAlphabar.setAttribute('ignorekeys', true);

			if (this.categoryIsRTL(aCategory))
				menupopupAlphabar.setAttribute('direction', 'rtl');

			//adding the subcategories not top
			for (var i = 0; i < anArrayResults.length; i++) {
				if (anArrayResults[i] != '') {
					//this.dump(subcategories.categories[i]);
					var aCategoryLastChildName = this.categoryTitleLastChild(anArrayResults[i])
					var add = this.create("menuitem");
					add.setAttribute("label", aCategoryLastChildName);
					add.setAttribute("value", anArrayResults[i].replace(/\/$/, ''));
					if (aCategoryLastChildName.length == 1)
						menupopupAlphabar.appendChild(add);
					else
						currentPopup.appendChild(add);
					somethingFound = true;
				}
			}
			if (menupopupAlphabar.childNodes.length > 0) {
				currentPopup.appendChild(this.create('menuseparator'));
				menuAlphabar.appendChild(menupopupAlphabar);
				currentPopup.appendChild(menuAlphabar);
			}

			//find all the categories at the same level "sisters", restricted to the current category
			//example(the useful example) Regional/Africa/[^/]+/Arts_and_Entertainment/

			for (var i = 1; i < aCategoryNodes.length - 1; i++) {
				aCategoryNodes[i] = '[^/]+';
			}
			var aQuery = '^' + aCategoryNodes.join('/') + '$';

			var query = aConnection.query('select * from categories_txt where category GLOB :category and name = :name');
			query.params('category', aCategoryNodes[0] + '/*');
			query.params('name', aCategoryNodes[aCategoryNodes.length - 1]);

			aQuery = this.trim(aQuery).replace(/ /g, '_').replace(/\/*\$$/, '/\$');

			var row, addedSeparator = false;
			for (var i = 0; row = aConnection.fetchObjects(query); i++) {
				if (this.match(row.category, aQuery)) {
					if (row.category != aCategory + '/') {
						if (!addedSeparator) {
							addedSeparator = true;
							currentPopup.appendChild(this.create('menuseparator'));

						}
						var add = this.create("menuitem");
						add.setAttribute("label", this.categoryAbbreviate(row.category.replace(/\/$/, '')));
						add.setAttribute("value", row.category.replace(/\/$/, ''));
						currentPopup.appendChild(add);
						somethingFound = true;
					}
				}
			}

			if (!somethingFound) {
				this.stopEvent(aEvent);
				currentPopup.parentNode.setAttribute('disabled', true);
			}

		}
	}
	return null;

}).apply(ODPExtension);
(function() {

	//finds all the subcategories and the categories at the same level "sisters"
	this.categoryNavigatorToolbarbuttonUpdate = function(currentPopup, aEvent) {
		//only popupshowing for the original target
		if (aEvent.currentTarget != aEvent.originalTarget || currentPopup.hasAttribute('done')) //check if this menu was builded
			return;

		//this.dump('categoryNavigatorToolbarbuttonUpdate');

		//removeAttribute('onpopupshowing') is not working!.. probably because is a listener
		currentPopup.setAttribute('done', true);

		currentPopup.appendChild(this.create('menuseparator'));

		var aCategory = currentPopup.getAttribute('value');
		var aIndex = currentPopup.getAttribute('aCategoryIndex');
		var aCategoryNodes = aCategory.split('/');


		//fix for when displaying bookmarks and test
		if (aCategory.indexOf('Bookmarks') === 0 || aCategory.indexOf('Test') === 0) {
			var aPath = '';
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
			Requester.send(null);
		} else {
			//this.dump(currentPopup);

			//first finds all the subcategories

			var aQuery = '^';
			for (var id in aCategoryNodes) {
				if (id == aIndex) {
					aQuery += aCategoryNodes[id] + '/[^/]+$';
					break;
				} else {
					aQuery += aCategoryNodes[id] + '/';
				}
			}

			aQuery = aQuery.replace(/\/$/, '');

			//we need to search in a parent database in order to get the subcategories
			if (this.subStrCount(aQuery, '/') < 3)
				var aQueryCategory = aCategoryNodes[0] + '/';
			else if (this.subStrCount(aQuery, '/') < 4)
				var aQueryCategory = aCategoryNodes[0] + '/' + aCategoryNodes[1];
			else
				var aQueryCategory = aCategory;

			//this.dump(aQueryCategory);


			var somethingFound = false;

			var countFoundTopCategories = 0;

			var subcategories = this.categoriesTXTQuery(aQuery, null, aQueryCategory);
			var aCategoryLastChild;
			//	this.dump(subcategories.categories);
			//adding first the top categories
			for (var i = 0; i < subcategories.count; i++) {
				if (this.inArray(this.shared.category.top.categories, (aCategoryLastChild = this.categoryGetLastChildName(subcategories.categories[i])))) {
					//this.dump(subcategories.categories[i]);
					var add = this.create("menuitem");
					add.setAttribute("label", this.categoryAbbreviate(aCategoryLastChild));
					add.setAttribute("value", subcategories.categories[i]);
					currentPopup.appendChild(add);
					somethingFound = true;
					subcategories.categories[i] = '';
					countFoundTopCategories++;
				}
			}
			if (countFoundTopCategories > 0 && subcategories.count - countFoundTopCategories > 0) {
				//this.dump('agregando el menuseparator entre las top y las categorias');
				currentPopup.appendChild(this.create('menuseparator'));
			}

			//adding the subcategories not top
			for (var i = 0; i < subcategories.count; i++) {
				if (subcategories.categories[i] != '') {
					//this.dump(subcategories.categories[i]);
					var add = this.create("menuitem");
					add.setAttribute("label", this.categoryAbbreviate(this.categoryTitleLastChild(subcategories.categories[i])));
					add.setAttribute("value", subcategories.categories[i]);
					currentPopup.appendChild(add);
					somethingFound = true;
				}
			}


			//this.dump(currentPopup.childNodes.length);
			//find all the categories at the same level "sisters", restricted to the current category
			//example(the useful example) Regional/Africa/[^/]+/Arts_and_Entertainment/

			//skiping top categories & skiping the last category
			if (aIndex > 2 && aIndex != aCategoryNodes.length - 1) {

				var aQuery = '^';
				for (var id in aCategoryNodes) {
					if (id == aIndex)
						aQuery += '[^/]+/';
					else
						aQuery += aCategoryNodes[id] + '/';
				}
				aQuery = aQuery.replace(/\/$/, '');
				aQuery += '$';

				var results = this.categoriesTXTQuery(aQuery, null, aQueryCategory);
				//this.dump(results);
				if (subcategories.count > 0 && results.count > 1)
					currentPopup.appendChild(this.create('menuseparator'));
				if (results.count > 1) {
					for (var id in results.categories) {
						var add = this.create("menuitem");
						add.setAttribute("label", this.categoryAbbreviate(results.categories[id]));
						add.setAttribute("value", results.categories[id]);
						currentPopup.appendChild(add);

						somethingFound = true;
					}
					//this.dump(currentPopup);
				}
			}
			//this.dump(currentPopup.childNodes.length);
			if (!somethingFound) {
				this.shared.categories.sisters.no[aCategory] = true;
				this.stopEvent(aEvent);
				currentPopup.parentNode.setAttribute('disabled', true);
			}

		}
	}
	return null;

}).apply(ODPExtension);
(function() {
	//toolbar button that will show all the categories at the same level
	//finds all the categories at the same level

	var debugingThisFile = false; //sets debuging on/off for this JavaScript file
	var aButton;

	this.addListener('userInterfaceLoad', function(aEnabled) {
		ODPExtension.sistersCategoriesOnUserInterfaceLoad()
	});
	this.addListener('userInterfaceUpdate', function(aEnabled) {
		ODPExtension.sistersCategoriesOnUserInterfaceUpdate(aEnabled);
	});

	this.addListener('focusedCategoryChange', function(aCategory) {
		ODPExtension.sistersCategoriesButtonUpdate(aCategory);
	});

	this.addListener('toolbarsToggle', function(aClosed) {
		if (aClosed) {
			ODPExtension.toolbarOpenRemember(aButton);
		} else {
			ODPExtension.toolbarCloseRemember(aButton);
		}
	});


	this.sistersCategoriesOnUserInterfaceLoad = function() {
		this.dump('sistersCategoriesOnUserInterfaceLoad', debugingThisFile);

		aButton = this.getElement('toolbarbutton-sisters-categories');
	}
	this.sistersCategoriesMenuUpdate = function(currentPopup, aEvent) {
		this.dump('sistersCategoriesMenuUpdate', debugingThisFile);
		//only popupshowing for the original target
		if (aEvent.currentTarget != aEvent.originalTarget)
			return;

		this.dump('removeChilds', debugingThisFile);
		this.removeChilds(currentPopup);

		if (aButton.hasAttribute('disabled')) {
			this.dump('stopEvent', debugingThisFile);
			this.stopEvent(aEvent); //this is to avoid the menupopup to be openen when no results found!
			return;
		}

		var aCategory = currentPopup.getAttribute('value');
		var aCategoryNodes = aCategory.split('/');

		//find all the categories at the same level with same name ^Regional/Asia/[^/]+/[^/]+/...[^/]+/Arts$

		for(var i=1;i<aCategoryNodes.length-1;i++){
			aCategoryNodes[i] = '[^/]+';
		}
		var aQuery = '^'+aCategoryNodes.join('/')+'$';

		var somethingFound = false;

		var aConnection = this.rdfDatabaseOpen();
		var query = aConnection.query('select * from categories_txt where category GLOB :category and name = :name');
			query.params('category', aCategoryNodes[0] + '/*');
			query.params('name', aCategoryNodes[aCategoryNodes.length-1]);

			aQuery = this.trim(aQuery).replace(/ /g, '_').replace(/\/*\$$/, '/\$');

			var row;
			for (var i = 0; row = aConnection.fetchObjects(query); i++) {
				if (this.match(row.category, aQuery)) {
					if (row.category != aCategory+'/') {
						var add = this.create("menuitem");
							add.setAttribute("label", this.categoryAbbreviate(row.category.replace(/\/$/, '')));
							add.setAttribute("value", row.category.replace(/\/$/, ''));
						currentPopup.appendChild(add);
						somethingFound = true;
					}
				}
			}

		if (!somethingFound) {
			this.stopEvent(aEvent); //this is to avoid the menupopup to be openen when no results found!
			aButton.setAttribute('disabled', true);
		}
	}

	this.sistersCategoriesButtonUpdate = function(aCategory) {

		this.dump('sistersCategoriesButtonUpdate', debugingThisFile);
		this.dump(aCategory, debugingThisFile);

		if (this.shared.categories.txt.exists && aCategory != '') {
			this.dump('this.shared.categories.txt.exists', debugingThisFile);

			this.dump('aButton', debugingThisFile);
			aButton.removeAttribute('disabled');

			this.getElement('toolbarbutton-sisters-categories-menupopup').setAttribute('value', aCategory);

		} else {
			aButton.setAttribute('disabled', true);
		}
	}

	this.sistersCategoriesOnUserInterfaceUpdate = function(aEnabled) {
		this.dump('sistersCategoriesOnUserInterfaceUpdate', debugingThisFile);

		if (aEnabled && this.shared.categories.txt.exists) {
			aButton.setAttribute('hidden', false);
		} else {
			aButton.setAttribute('hidden', true);
		}
	}

	return null;

}).apply(ODPExtension);
(function() {
	//toolbar button that will show all the categories at the same level
	//finds all the categories at the same level

	var debugingThisFile = false; //sets debuging on/off for this JavaScript file
	var aButton;

	this.addListener('userInterfaceLoad', function() {
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

	this.addListener('preferencesLoadGlobal', function() {
		ODPExtension.sistersCategoriesOnPreferencesLoadGlobal();
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

		if (aButton.getAttribute('nocategories') == 'true') {
			this.dump('stopEvent', debugingThisFile);
			this.stopEvent(aEvent); //this is to avoid the menupopup to be openen when no results found!
			return;
		}

		var aCategory = currentPopup.getAttribute('value');
		var aCategoryNodes = aCategory.split('/');

		//find all the categories at the same level restricted to the first two mothers example ^Regional/Asia/[^/]+/[^/]+/...[^/]+/Arts$
		var aQuery = '^';
		aQuery += aCategoryNodes.shift() + '/';
		aQuery += aCategoryNodes.shift() + '/';
		var aChildCategory = aCategoryNodes.pop();

		for (var id in aCategoryNodes)
			aQuery += '[^/]+/';
		aQuery += aChildCategory;
		aQuery += '$';
		var somethingFound = false;
		var aResult = this.categoriesTXTQuery(aQuery, null, aCategory);
		for (var id in aResult.categories) {
			if (aResult.categories[id] != aCategory) {
				var add = this.create("menuitem");
				add.setAttribute("label", this.categoryAbbreviate(aResult.categories[id]));
				add.setAttribute("value", aResult.categories[id]);
				currentPopup.appendChild(add);
				somethingFound = true;
			}
		}
		if (!somethingFound) {
			this.stopEvent(aEvent); //this is to avoid the menupopup to be openen when no results found!
			if (aButton.hasAttribute('nocategories'))
				aButton.setAttribute('nocategories', true);
			this.shared.categories.sisters.focused.no[this.shared.categories.sisters.focused.no.length] = aCategory;
		}
	}

	this.sistersCategoriesButtonUpdate = function(aCategory) {

		this.dump('sistersCategoriesButtonUpdate', debugingThisFile);
		this.dump(aCategory, debugingThisFile);

		if (this.shared.categories.txt.exists && aCategory != '') {
			this.dump('this.shared.categories.txt.exists', debugingThisFile);

			this.dump('aButton', debugingThisFile);

			if (this.inArray(this.shared.categories.sisters.focused.no, aCategory))
				aButton.setAttribute('nocategories', true);
			else
				aButton.setAttribute('nocategories', false);

			this.getElement('toolbarbutton-sisters-categories-menupopup').setAttribute('value', aCategory);

		} else {
			aButton.setAttribute('nocategories', true);
		}

	}

	this.sistersCategoriesOnUserInterfaceUpdate = function(aEnabled) {
		this.dump('sistersCategoriesOnUserInterfaceUpdate', debugingThisFile);

		if (aEnabled && this.categoriesTXTExists()) {
			aButton.setAttribute('hidden', false);
		} else {
			aButton.setAttribute('hidden', true);
		}

	}

	this.sistersCategoriesOnPreferencesLoadGlobal = function() {
		this.dump('sistersCategoriesOnPreferencesLoadGlobal', debugingThisFile);

		if (!this.shared.categories.sisters.focused) {
			//holds categories that doenst have a sister category
			this.shared.categories.sisters.focused = {}
			this.shared.categories.sisters.focused.no = []
		}
	}

	return null;

}).apply(ODPExtension);
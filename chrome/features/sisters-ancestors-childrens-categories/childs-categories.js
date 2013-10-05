(function() {


	var debugingThisFile = false; //sets debuging on/off for this JavaScript file
	var aButton;

	this.addListener('userInterfaceLoad', function(aEnabled) {
		aButton = ODPExtension.getElement('toolbarbutton-childs-categories');
	});
	this.addListener('userInterfaceUpdate', function(aEnabled) {
		if (aEnabled && ODPExtension.shared.categories.txt.exists) {
			aButton.setAttribute('hidden', false);
		} else {
			aButton.setAttribute('hidden', true);
		}
	});

	this.addListener('focusedCategoryChange', function(aCategory) {
		ODPExtension.childCategoriesButtonUpdate(aCategory);
	});

	this.addListener('toolbarsToggle', function(aClosed) {
		if (aClosed) {
			ODPExtension.toolbarOpenRemember(aButton);
		} else {
			ODPExtension.toolbarCloseRemember(aButton);
		}
	});


	this.childCategoriesMenuUpdate = function(currentPopup, aEvent) {

		//only popupshowing for the original target
		if (aEvent.currentTarget != aEvent.originalTarget) //check if this menu was builded
			return;

		this.dump('removeChilds', debugingThisFile);
		this.removeChilds(currentPopup);

		if (aButton.hasAttribute('disabled')) {
			this.dump('stopEvent', debugingThisFile);
			this.stopEvent(aEvent); //this is to avoid the menupopup to be openen when no results found!
			return;
		}

		//removeAttribute('onpopupshowing') is not working!.. probably because is a listener

		var aCategory = currentPopup.getAttribute('value');
		var aCategoryNodes = aCategory.split('/');
		var aCategoryParent = this.categoryGetParent(aCategory);

		var somethingFound = false;

		var aConnection = this.categoriesTXTDatabaseOpen();
		var query = aConnection.query('select * from categories_txt where category GLOB :category and name = :name and depth > :depth');
		query.params('category', aCategoryParent + '/*');
		query.params('name', aCategoryNodes[aCategoryNodes.length - 1]);
		query.params('depth', this.subStrCount(aCategoryParent + '/', '/'));

		var row;
		for (var i = 0; row = aConnection.fetchObjects(query); i++) {
			if (row.category != aCategory + '/') {
				var add = this.create("menuitem");
				add.setAttribute("label", this.categoryAbbreviate(row.category.replace(/\/$/, '')));
				add.setAttribute("value", row.category.replace(/\/$/, ''));
				currentPopup.appendChild(add);
				somethingFound = true;
			}
		}

		//disabling the toolbarbutton because there is no results
		if (!somethingFound) {
			this.stopEvent(aEvent);
			aButton.setAttribute('disabled', true);
		}
	}

	this.childCategoriesButtonUpdate = function(aCategory) {

		this.dump('childCategoriesButtonUpdate', debugingThisFile);
		this.dump(aCategory, debugingThisFile);

		if (this.shared.categories.txt.exists && aCategory != '') {
			this.dump('this.shared.categories.txt.exists', debugingThisFile);

			this.dump('aButton', debugingThisFile);
			aButton.removeAttribute('disabled');

			this.getElement('toolbarbutton-childs-categories-menupopup').setAttribute('value', aCategory);

		} else {
			aButton.setAttribute('disabled', true);
		}
	}

	return null;

}).apply(ODPExtension);
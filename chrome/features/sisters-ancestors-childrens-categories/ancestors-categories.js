(function() {


	var debugingThisFile = false; //sets debuging on/off for this JavaScript file
	var aButton;

	this.addListener('userInterfaceLoad', function(aEnabled) {
		aButton = ODPExtension.getElement('toolbarbutton-ancestors-categories');
	});
	this.addListener('userInterfaceUpdate', function(aEnabled) {
		if (aEnabled && ODPExtension.categoriesTXTExists()) {
			aButton.setAttribute('hidden', false);
		} else {
			aButton.setAttribute('hidden', true);
		}
	});

	this.addListener('focusedCategoryChange', function(aCategory) {
		ODPExtension.ancestorsCategoriesButtonUpdate(aCategory);
	});

	this.addListener('toolbarsToggle', function(aClosed) {
		if (aClosed) {
			ODPExtension.toolbarOpenRemember(aButton);
		} else {
			ODPExtension.toolbarCloseRemember(aButton);
		}
	});

	var db, query;
	this.addListener('databaseReady', function() {
		db = ODPExtension.categoriesTXTDatabaseOpen();
		if(db.exists){
			query = db.query('select * from categories_txt where category GLOB :category and name = :name and depth < :depth limit 300');
		}
	});

	this.ancestorsCategoriesMenuUpdate = function(currentPopup, aEvent) {
		//only popupshowing for the original target
		if (aEvent.currentTarget != aEvent.originalTarget) //check if this menu was build
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

		var somethingFound = false;

		query.params('category', aCategoryNodes[0] + '/*');
		query.params('name', aCategoryNodes[aCategoryNodes.length - 1]);
		query.params('depth', this.subStrCount(aCategory + '/', '/'));

		var row;
		for (var i = 0; row = db.fetchObjects(query); i++) {
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

	this.ancestorsCategoriesButtonUpdate = function(aCategory) {

		this.dump('ancestorsCategoriesButtonUpdate', debugingThisFile);
		this.dump(aCategory, debugingThisFile);

		if (ODPExtension.categoriesTXTExists() && aCategory != '') {
			aButton.removeAttribute('disabled');

			this.getElement('toolbarbutton-ancestors-categories-menupopup').setAttribute('value', aCategory);

		} else {
			aButton.setAttribute('disabled', true);
		}
	}

	return null;

}).apply(ODPExtension);
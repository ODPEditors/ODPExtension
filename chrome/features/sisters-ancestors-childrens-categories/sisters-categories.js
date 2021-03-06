(function() {
	//toolbar button that will show all the categories at the same level
	//finds all the categories at the same level

	var debugingThisFile = false; //sets debuging on/off for this JavaScript file
	var aButton;

	this.addListener('userInterfaceLoad', function(aEnabled) {
		aButton = ODPExtension.getElement('toolbarbutton-sisters-categories');
	});

	this.addListener('userInterfaceUpdate', function(aEnabled) {
		if (aEnabled && ODPExtension.categoriesTXTExists()) {
			aButton.setAttribute('hidden', false);
		} else {
			aButton.setAttribute('hidden', true);
		}
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

	var db, query;
	this.addListener('databaseReady', function() {
		db = ODPExtension.categoriesTXTDatabaseOpen();
		if(db.exists){
			query = db.query('select * from categories_txt where category GLOB :category and name = :name limit 300');
		}
	});
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

		for (var i = 1; i < aCategoryNodes.length - 1; i++) {
			aCategoryNodes[i] = '[^/]+';
		}
		var aQuery = '^' + aCategoryNodes.join('/') + '$';

		var somethingFound = false;

		query.params('category', aCategoryNodes[0] + '/*');
		query.params('name', aCategoryNodes[aCategoryNodes.length - 1]);

		aQuery = this.trim(aQuery).replace(/ /g, '_').replace(/\/*\$$/, '/\$');

		var row;
		for (var i = 0; row = db.fetchObjects(query); i++) {
			if (this.match(row.category, aQuery)) {
				if (row.category != aCategory + '/') {
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

		if (ODPExtension.categoriesTXTExists() && aCategory != '') {
			aButton.removeAttribute('disabled');

			this.getElement('toolbarbutton-sisters-categories-menupopup').setAttribute('value', aCategory);

		} else {
			aButton.setAttribute('disabled', true);
		}
	}


	return null;

}).apply(ODPExtension);
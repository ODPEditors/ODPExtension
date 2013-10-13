(function() {

	this.addListener('preferencesLoadGlobal', function() {

		//session categories, categories that has been opened in this browser session
		if (!ODPExtension.shared.categories.session) {
			ODPExtension.shared.categories.session = {};
			ODPExtension.shared.categories.session.categories = [];
			ODPExtension.shared.categories.session.categoriesClipboard = [];
		}
	});

	this.addListener('focusedCategoryChange', function(aCategory) {
		if (aCategory != '' && !ODPExtension.inArray(ODPExtension.shared.categories.session.categories, aCategory))
			ODPExtension.shared.categories.session.categories[ODPExtension.shared.categories.session.categories.length] = aCategory;
	});

	//when the category browser popup is going to showing we look into the categoires that the user has opened and in the clipboard
	this.categoryBrowserOnPopupShowing = function(aEvent) {
		if (aEvent.originalTarget != aEvent.currentTarget)
			return

		var unique = []
		var aCategories = [];
		var aCategory = '';

		this.removeChildsWithAttribute(this.getElement('category-browser'), 'temporal', 'true');

		//categories from the clipboard
		var aTemp = (this.getClipboard().replace(/\r/g, '\n') + '\n').split('\n');
		for (var id in aTemp) {
			if ((aCategory = this.categoryGetFromURL(aTemp[id])) != '') {
				if(!unique[aCategory]){
					unique[aCategory] = true;
					ODPExtension.shared.categories.session.categoriesClipboard[ODPExtension.shared.categories.session.categoriesClipboard.length] = aCategory;
					if(ODPExtension.shared.categories.session.categoriesClipboard.length > 12)
						ODPExtension.shared.categories.session.categoriesClipboard.shift();
				}
			}
		}
		aCategories = this.arrayUnique(ODPExtension.shared.categories.session.categoriesClipboard).sort(this.sortLocale).reverse();
		if (aCategories.length > 0) {
			this.categoryBrowserAppendCategoriesAfter(aCategories, this.getElement('category-browser-categories-clipboard'), true);
			this.getElement('category-browser-categories-clipboard').setAttribute('hidden', false);
		} else {
			this.getElement('category-browser-categories-clipboard').setAttribute('hidden', true);
		}

		//filling opened categories looking in all the tabs of all the windows
		aCategories = [];
		var aTemp = this.windowsGetURLs();
		for (var id in aTemp) {
			if ((aCategory = this.categoryGetFromURL(aTemp[id])) != '') {
				if(!unique[aCategory]){
					unique[aCategory] = true;
					aCategories[aCategories.length] = aCategory;
				}
			}
		}
		aCategories = this.arrayUnique(aCategories).sort(this.sortLocale).reverse();
		if (aCategories.length > 0) {
			this.categoryBrowserAppendCategoriesAfter(aCategories, this.getElement('category-browser-categories-opened'), true);
			this.getElement('category-browser-categories-opened').setAttribute('hidden', false);
		} else {
			this.getElement('category-browser-categories-opened').setAttribute('hidden', true);
		}

		//categories for this session
		aCategories = [];
		for (var id in this.shared.categories.session.categories) {
			aCategory = this.shared.categories.session.categories[id]
			if(!unique[aCategory]){
				unique[aCategory] = true;
				aCategories[aCategories.length] = aCategory;
			}
		}
		if (aCategories > 0) {
			this.removeChilds(this.getElement('category-browser-session-categories'));
			this.getElement('category-browser-session-categories').parentNode.setAttribute('disabled', false);
			this.categoryBrowserAppendCategoriesAfter(aCategories.sort(this.sortLocale), this.getElement('category-browser-session-categories').firstChild, true);
		} else
			this.getElement('category-browser-session-categories').parentNode.setAttribute('disabled', true);

		document.getAnonymousElementByAttribute(this.getElement('category-browser'), "anonid", "ODPExtension-category-browser-textbox-data-xbl").focus();
	}
	return null;

}).apply(ODPExtension);
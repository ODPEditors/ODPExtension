(function() {

	//when the category browser popup is going to showing we look into the categoires that the user has opened and in the clipboard
	this.categoryBrowserOnPopupShowing = function(aEvent) {
		if (aEvent.originalTarget != aEvent.currentTarget)
			return

		//filling opened categories looking in all the tabs of all the windows

		this.removeChildsWithAttribute(this.getElement('category-browser'), 'temporal', 'true');

		var aTemp = this.windowsGetURLs();
		var aCategories = [];
		var aCategory = '';

		for (var id in aTemp) {
			if ((aCategory = this.categoryGetFromURL(aTemp[id])) != '') {
				aCategories[aCategories.length] = aCategory;
			}
		}
		aCategories = this.arrayUnique(aCategories).sort(this.sortLocale).reverse();

		if (aCategories.length > 0) {
			this.categoryBrowserAppendCategoriesAfter(aCategories, this.getElement('category-browser-categories-opened'), true);
			this.getElement('category-browser-categories-opened').setAttribute('hidden', false);
		} else {
			this.getElement('category-browser-categories-opened').setAttribute('hidden', true);
		}

		//categories from the clipboard

		aTemp = (this.getClipboard().replace(/\r/g, '\n') + '\n').split('\n');
		aCategories = [];
		for (var id in aTemp) {
			if ((aCategory = this.categoryGetFromURL(aTemp[id])) != '') {
				aCategories[aCategories.length] = aCategory;
			}
		}
		aCategories = this.arrayUnique(aCategories).sort(this.sortLocale).reverse();
		if (aCategories.length > 0) {
			this.categoryBrowserAppendCategoriesAfter(aCategories, this.getElement('category-browser-categories-clipboard'), true);
			this.getElement('category-browser-categories-clipboard').setAttribute('hidden', false);
		} else {
			this.getElement('category-browser-categories-clipboard').setAttribute('hidden', true);
		}

		//categories for this session

		if (this.shared.categories.session.categories.length > 0) {
			this.removeChilds(this.getElement('category-browser-session-categories'));
			this.getElement('category-browser-session-categories').parentNode.setAttribute('disabled', false);
			this.categoryBrowserAppendCategoriesAfter(this.shared.categories.session.categories.sort(this.sortLocale), this.getElement('category-browser-session-categories').firstChild, true);
		} else
			this.getElement('category-browser-session-categories').parentNode.setAttribute('disabled', true);


	}
	return null;

}).apply(ODPExtension);
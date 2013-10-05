(function() {

	this.addListener('userInterfaceLoad', function() {
		ODPExtension.categoryBrowserMenuUpdate();
	});
	//empties and recreate the category browser menu appending the categories that the user has "locked"
	this.categoryBrowserMenuUpdate = function() {
		//this.dump('categoryBrowserMenuUpdate', true);
		//to avoid adding of the same category twice or more
		this.categoryBrowserCategories = [];
		this.categoryBrowserRemoveChilds = [];

		this.removeChilds(this.getElement('category-browser'));

		//categories history

		var aCategories = [];
		var row;
		var i = 0;
		var db = this.categoriesHistoryDatabaseOpen();
		for (; row = db.fetchObjects(this.categoryHistoryGetMostVisitedLimit); i++) {
			aCategories[i] = row.categories_history_category;
		}

		if (i > 0) {
			this.categoryBrowserAppendCategoriesAfter(aCategories.reverse(), this.getElement('category-browser-categories-history'));
			this.getElement('category-browser-categories-history').setAttribute('hidden', false);
		} else {
			this.getElement('category-browser-categories-history').setAttribute('hidden', true);
		}
	}
	return null;

}).apply(ODPExtension);
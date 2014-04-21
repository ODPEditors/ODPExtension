

(function() {

	this.promptForCategory = function(aFunction) {

		this.fromCategoryAction = function(aCategories){
			aFunction(aCategories[0])
		}
		this.fromCategoryHideContextMenus();
		this.categoryBrowserOpen();
	}
	return null;

}).apply(ODPExtension);
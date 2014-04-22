(function() {
	var debugingThisFile = false; //sets debuging on/off for this JavaScript file

	this.categoryHistoryDelete = function(aCategory) {
		//delete a category from the history database
		this.deleteCategoryHistory.params('categories_history_category', aCategory+'*');
		this.categoriesHistoryDatabaseOpen().updateAsync(this.deleteCategoryHistory);
	}
	return null;

}).apply(ODPExtension);
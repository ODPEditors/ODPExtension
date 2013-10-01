(function() {

	var debugingThisFile = true;

	//load local objects

	this.preferencesLoadLocal = function() {
		//	this.dump('preferencesLoadLocal', debugingThisFile);

		//from category
		this.fromCategoryTimeout = null;
		this.fromCategorySelectedCategory = '';
		this.fromCategorySelectedCategories = [];
		this.fromCategoryUpdating = false;
		this.fromCategoryCanceledAutoPopup = false;

		//head of temporal files
		this.fileCreateTemporalHead = '<link rel="stylesheet" type="text/css" href="chrome://ODPExtension/content/html/@css.css"/>';
	}

	return null;

}).apply(ODPExtension);
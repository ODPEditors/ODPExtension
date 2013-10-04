(function() {

	var debugingThisFile = true;

	//load local objects
	this.addListener('beforeBrowserLoad', function() {
		ODPExtension.preferencesLoadLocal();
	});

	this.preferencesLoadLocal = function() {
		//	this.dump('preferencesLoadLocal', debugingThisFile);

		//initializing some vars..
		this.fromCategoryAction = '';

		//from categortye
		this.fromCategoryCanceledAutoPopupTimeout = null;
		//preferences are already loaded but some of them are changed for quickly usage or sanitized
		//also some are not really a preference but a global object
		//also maps some preferences to other objects

		//from category
		this.fromCategorySelectedCategory = '';
		this.fromCategorySelectedCategories = [];
		this.fromCategoryCanceledAutoPopup = false;

		//head of temporal files
		this.fileCreateTemporalHead = '<link rel="stylesheet" type="text/css" href="chrome://ODPExtension/content/html/@css.css"/>';

		this.dispatchEvent('preferencesLoadLocal');
	}

	return null;

}).apply(ODPExtension);
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

		//RDF
		this.rdfDatabaseFile = this.pathSanitize(this.extensionDirectory().path + '/RDF.sqlite');
		//head of temporal files
		this.fileCreateTemporalHead = '<link rel="stylesheet" type="text/css" href="chrome://ODPExtension/content/html/@css.css"/>';
	}

	return null;

}).apply(ODPExtension);
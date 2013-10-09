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
		this.readURL('chrome://odpextension/content/html/%40css.css', false, false,false, function(aCSS){
			ODPExtension.fileCreateTemporalHead = '<style>'+aCSS+'</style>';
			ODPExtension.fileCreateTemporalHead += '<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>';
			ODPExtension.readURL('chrome://odpextension/content/html/js.js', false, false,false, function(aJS){
				ODPExtension.fileCreateTemporalHead += '<script>'+aJS+'</script>';
			})
		})

		this.dispatchEvent('preferencesLoadLocal');
	}

	return null;

}).apply(ODPExtension);
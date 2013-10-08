(function() {

	var debugingThisFile = true;

	this.addListener('beforeBrowserLoad', function() {
		ODPExtension.focusedCategory = '';
	});
	this.addListener('onLocationChange', function(aLocation) {
		var focusedCategory = ODPExtension.categoryGetFocused();

		if (focusedCategory != ODPExtension.focusedCategory) {
			ODPExtension.focusedCategory = focusedCategory;

			ODPExtension.dispatchEvent('focusedCategoryChange', focusedCategory);
		}
	});

	return null;

}).apply(ODPExtension);
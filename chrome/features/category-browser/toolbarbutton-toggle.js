(function() {
	this.addListener('toolbarsToggle', function(aClosed) {
		if (aClosed) {
			ODPExtension.toolbarOpenRemember(ODPExtension.getElement('toolbarbutton-category-browser'));
		} else {
			ODPExtension.toolbarCloseRemember(ODPExtension.getElement('toolbarbutton-category-browser'));
		}
	});

	return null;

}).apply(ODPExtension);
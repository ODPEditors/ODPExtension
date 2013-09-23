(function() {
	this.addListener('toolbarsToggle', function(aClosed) {
		if (aClosed) {
			ODPExtension.toolbarOpenRemember(ODPExtension.getElement('toolbar-local-category-finder'));
		} else {
			ODPExtension.toolbarCloseRemember(ODPExtension.getElement('toolbar-local-category-finder'));
		}
	});

	return null;

}).apply(ODPExtension);
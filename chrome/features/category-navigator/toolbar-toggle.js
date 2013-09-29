(function() {
	this.addListener('toolbarsToggle', function(aClosed) {
		if (aClosed) {
			ODPExtension.toolbarOpenRemember(ODPExtension.getElement('toolbar-category-navigator'));
		} else {
			ODPExtension.toolbarCloseRemember(ODPExtension.getElement('toolbar-category-navigator'));
		}
	});

	return null;

}).apply(ODPExtension);
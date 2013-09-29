(function() {

	this.addListener('toolbarsToggle', function(aClosed) {
		if (aClosed) {
			ODPExtension.toolbarOpenRemember(ODPExtension.getElement('toolbarbutton-add-to-open-directory'));
		} else {
			ODPExtension.toolbarCloseRemember(ODPExtension.getElement('toolbarbutton-add-to-open-directory'));
		}
	});

	return null;

}).apply(ODPExtension);
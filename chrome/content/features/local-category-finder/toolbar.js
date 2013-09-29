(function() {
	this.addListener('toolbarsToggle', function(aClosed) {
		if (aClosed) {
			ODPExtension.toolbarOpenRemember(ODPExtension.getElement('toolbar-local-category-finder'));
		} else {
			ODPExtension.toolbarCloseRemember(ODPExtension.getElement('toolbar-local-category-finder'));
		}
	});

	this.addListener('userInterfaceLoad', function(aEnabled) {
		//setting local category finder to autocomplete based on browser detection
		ODPExtension.setAutocomplete(ODPExtension.getElement('local-category-finder-textbox'));
		ODPExtension.setAutocomplete(ODPExtension.getElement('local-category-finder-textbox-where'));
	});
	return null;

}).apply(ODPExtension);
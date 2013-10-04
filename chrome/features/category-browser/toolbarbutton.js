(function() {
	this.addListener('toolbarsToggle', function(aClosed) {
		if (aClosed) {
			ODPExtension.toolbarOpenRemember(ODPExtension.getElement('toolbarbutton-category-browser'));
		} else {
			ODPExtension.toolbarCloseRemember(ODPExtension.getElement('toolbarbutton-category-browser'));
		}
	});

	this.addListener('userInterfaceUpdate', function(aEnabled) {
		ODPExtension.getElement('toolbarbutton-category-browser').setAttribute('hidden', !aEnabled);

		document.getAnonymousElementByAttribute(
			ODPExtension.getElement('category-browser'),
			"anonid",
			"ODPExtension-category-browser-menulist-data-xbl").setAttribute('hidden', !ODPExtension.shared.categories.txt.exists);
	});
	return null;

}).apply(ODPExtension);
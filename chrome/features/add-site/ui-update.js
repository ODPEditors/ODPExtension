(function() {

	this.addListener('userInterfaceUpdate', function(aEnabled) {
		ODPExtension.getElement('toolbarbutton-add-to-open-directory').setAttribute('hidden', !aEnabled);
	});

	return null;

}).apply(ODPExtension);
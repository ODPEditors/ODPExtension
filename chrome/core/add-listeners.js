(function() {

	var debugingThisFile = true;

	this.addListeners = function() {
		//this.dump('addListeners', debugingThisFile);

		this.addListener('onLocationChange', function() {
			ODPExtension.setFocusedLocation();
		});
		this.addListener('onLocationChange', function() {
			ODPExtension.setFocusedCategory();
		});

	}

	return null;

}).apply(ODPExtension);
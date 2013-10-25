(function() {

	var debugingThisFile = true;

	this.addListener('beforeBrowserLoad', function() {
		ODPExtension.focusedURL = '';
	});
	this.addListener('onLocationChangeNotDocumentLoad', function(aLocation) {
		ODPExtension.focusedURL = aLocation;
	});


	return null;

}).apply(ODPExtension);
(function() {

	var debugingThisFile = true;

	this.addListener('beforeBrowserLoad', function() {
		ODPExtension.focusedURL = '';
		ODPExtension.focusedDomain = '';
		ODPExtension.focusedSubdomain = '';
	});
	this.addListener('onLocationChangeNotDocumentLoad', function() {
		ODPExtension.focusedURL = ODPExtension.focusedLocation();
		ODPExtension.focusedDomain = ODPExtension.getDomainFromURL(ODPExtension.focusedURL);
		ODPExtension.focusedSubdomain = ODPExtension.getSubdomainFromURL(ODPExtension.focusedURL);
	});

	return null;

}).apply(ODPExtension);
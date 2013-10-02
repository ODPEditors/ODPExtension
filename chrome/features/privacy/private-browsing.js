(function() {

	var debugingThisFile = true;

	//check for private browsing, add-on should be disabled
	this.addListener('onPrivateBrowsingEnter', function() {
		if (ODPExtension.preferenceGet('privacy.private.browsing.on')) {
			ODPExtension.preferenceSet('last.enabled', ODPExtension.preferenceGet('enabled')); //preferenceSet will no dispatch the event onPreferenceSet
			ODPExtension.preferenceChange('enabled', false); //preferenceChange  will dispatch the event
		}
	});

	//check for private browsing exit, add-on should back to previous state
	this.addListener('onPrivateBrowsingExit', function() {
		if (ODPExtension.preferenceGet('privacy.private.browsing.on')) {
			ODPExtension.preferenceChange('enabled', ODPExtension.preferenceGet('last.enabled'));
		}
	});

	return null;

}).apply(ODPExtension);
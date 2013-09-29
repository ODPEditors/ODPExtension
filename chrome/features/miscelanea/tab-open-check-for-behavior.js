(function() {
	//opens a tab looking at the user preferences
	this.tabOpenCheckForBehavior = function(aURL, aEvent, aUserPreference, aPostData) {
		if (!aEvent) {
			aEvent = {};
			aEvent.button = false;
			aEvent.ctrlKey = false;
		}

		this.openURL(
			aURL,
			this.preferenceGet('tab.behavior.' + aUserPreference + '.tab.new.tab') || aEvent.button == 1,
			this.preferenceGet('tab.behavior.' + aUserPreference + '.tab.new.window') || aEvent.ctrlKey,
			this.preferenceGet('tab.behavior.' + aUserPreference + '.tab.selected'),
			aPostData);
	}
	return null;

}).apply(ODPExtension);
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
			true, //aEvent.button == 1, //in new tab
			aEvent.ctrlKey, //in new window
			false, //select the tab
			aPostData);
	}
	return null;

}).apply(ODPExtension);
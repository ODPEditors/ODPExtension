(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//open a tab or panel for the selected word

	this.wordReference = function(aEvent) {
		var aString = this.getSelectedTextOrPrompt(false);
		if (aString == '')
			return;

		var referenceURLs = this.preferenceGet('advanced.urls.word.reference').split('\n');

		//fix for when there is many urls for reference to open but the user has not checked open in new tab
		//if is no chekd the user will open all the urls in the same tab causing only the last one to be displayed
		if (referenceURLs.length > 1)
			aEvent.button = 1;

		for (var id in referenceURLs) {
			if (referenceURLs[id] != '') {
				this.tabOpenCheckForBehavior(
					this.URLToolsApply(referenceURLs[id].replace(/={SELECTED_TEXT}/g, '=' + this.encodeUTF8(aString)).replace(/{SELECTED_TEXT}/g, aString)),
					aEvent,
					'word.reference');
			}
		}
	}

	return null;

}).apply(ODPExtension);
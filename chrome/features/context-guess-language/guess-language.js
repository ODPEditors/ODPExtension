(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.addListener('userInterfaceUpdate', function(aEnable) {
		ODPExtension.getElement('guess-language').setAttribute('hidden', !aEnable || !ODPExtension.preferenceGet('ui.context.menu.guess.language'));

	});
	//open a tab or panel for the selected word

	this.guessLanguage = function(aEvent) {
		var aString = this.getSelectedTextOrPrompt(false);
		if (aString == '')
			return;

		this.detectLanguage(aString, function(aData){
			ODPExtension.alert('Looks like: '+(aData));
		});

	}

	return null;

}).apply(ODPExtension);
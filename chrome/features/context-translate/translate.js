(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//translate the selected text or ask the user for input
	//it also replaces the "_" for " " nice for translate category names
	this.translate = function(aEvent) {
		//fix bug for when the menuitem were moved, don't no why
		this.stopEvent(aEvent);

		//the selected text
		var aString = this.getSelectedTextOrPrompt(false);

		if (aString != '' && aString.indexOf('http') !== 0) {
			this.tabOpenCheckForBehavior('http://translate.google.com/',
				aEvent,
				'translate',
				'text=' + this.encodeUTF8(aString.replace(/_/g, ' ').replace(/\//g, ' / ').replace(/World\//g, ' ')) + '&langpair=auto|' + aEvent.originalTarget.getAttribute('value') + '&ie=UTF-8&oe=UTF-8');
		} else {

			//the linked url
			if (aString == '')
				aString = this.getSelectedLinkURL();

			//the focused url
			if (aString == '') {
				if (!this.prompt('Translate focused URL!?', this.focusedURL))
					return;
				aString = this.focusedURL;
			}
			if (aString != '')
				this.tabOpenCheckForBehavior('http://translate.google.com/translate?sl=auto&tl=' + aEvent.originalTarget.getAttribute('value') + '&js=n&prev=_t&hl=en&ie=UTF-8&u=' + this.encodeUTF8(aString),
					aEvent,
					'translate');
		}
	}
	return null;

}).apply(ODPExtension);
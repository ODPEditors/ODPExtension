(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.addListener('DOMContentLoadedNoFrames', function (aDoc) {
		if(aDoc && aDoc.location && (
		   	aDoc.location.href && String(aDoc.location.href).indexOf('https://translate.google.') == 0 ||
		   	String(aDoc.location.href).indexOf('http://translate.google.') == 0)){
			var aElement = aDoc.getElementById('source');
			if(aElement)
				aElement.setAttribute('spellcheck', true);
		}
	});

	//translate the selected text or ask the user for input
	//it also replaces the "_" for " " nice for translate category names

	this.translate = function(aEvent) {

		//fix bug for when the menuitem were moved, don't no why
		this.stopEvent(aEvent);

		var aURL = this.getSelectedLinkURL();
		if(!aURL)
			aURL = this.focusedURL

		//the selected text
		var aString = this.getSelectedTextOrPrompt(false, aURL);

		if (aString != '' && aString.indexOf('http') !== 0) {
			this.tabOpenCheckForBehavior('https://translate.google.com/',
				aEvent,
				'translate',
				'text=' + this.encodeUTF8(aString.replace(/World\//g, ' ').replace(/_/g, ' ').replace(/\//g, ' / ')) + '&langpair=auto|' + aEvent.originalTarget.getAttribute('value') + '&ie=UTF-8&oe=UTF-8');
		} else {

			if (aString.indexOf('http') === 0)
				this.tabOpenCheckForBehavior('https://translate.google.com/translate?sl=auto&tl=' + aEvent.originalTarget.getAttribute('value') + '&js=n&prev=_t&hl=en&ie=UTF-8&u=' + this.encodeUTF8(aString),
					aEvent,
					'translate');

		}
	}
	return null;

}).apply(ODPExtension);
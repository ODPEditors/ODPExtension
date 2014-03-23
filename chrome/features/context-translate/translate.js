(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.addListener('DOMContentLoadedNoFrames', function (aDoc) {
		var aLocation = ODPExtension.documentGetLocation(aDoc)
		if(aLocation != '' && ( aLocation.indexOf('https://translate.google.') == 0 || aLocation.indexOf('http://translate.google.') == 0)){
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

		var lang;
		if(this.focusedCategory != '')
			lang = this.getLanguageFromCategory(this.focusedCategory).code

		if(!lang || lang == '')
			lang = 'auto';

		//the selected text
		var aString = this.getSelectedTextOrPrompt(false, aURL);
		if (aString != '' && aString.indexOf('http') !== 0) {

			aString = aString.replace(/World\/[^\/]+\//g, ' ').replace(/_/g, ' ').replace(/\//g, ' / ').replace(/\[[^\]+]\]/gi, '').trim()
			this.tabOpenCheckForBehavior('https://translate.google.com/',
				aEvent,
				'translate',
				'text=' + this.encodeUTF8(aString) + '&langpair='+lang+'|' + aEvent.originalTarget.getAttribute('value') + '&ie=UTF-8&oe=UTF-8');
		} else {

			if (aString.indexOf('http') === 0)
				this.tabOpenCheckForBehavior('http'+(aString.indexOf('https') === 0 ? '' : '')+'://translate.google.com/translate?sl='+lang+'&tl=' + aEvent.originalTarget.getAttribute('value') + '&js=n&prev=_t&hl=en&ie=UTF-8&u=' + this.encodeUTF8(aString)+'&sandbox=0&act=url',
					aEvent,
					'translate');

		}
	}
	return null;

}).apply(ODPExtension);
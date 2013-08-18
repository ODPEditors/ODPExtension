(function()
{

		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

		//translate the selected text or ask the user for input
		//it also replaces the "_" for " " nice for translate category names
			this.translate = function(aEvent)
			{
				//fix bug for when the menuitem were moved, don't no why
				this.stopEvent(aEvent);

				//the selected text
					var aString = this.getSelectedText(false);

				//the linked url
					if(aString == '')
						aString = this.getSelectedLink();

				//ask the user
					if(aString == '')
						aString = this.getSelectedTextOrPrompt(false);

					if(aString != '')
						this.tabOpenCheckForBehavior('http://translate.google.com/translate_t',
													aEvent,
													'translate',
													'text='+this.encodeUTF8(aString.replace(/_/g, ' ').replace(/\//g, ' / ').replace(/World\//g, ' '))+'&langpair=auto|'+aEvent.originalTarget.getAttribute('value')+'&ie=UTF-8&oe=UTF-8'
													);
			}
	return null;

}).apply(ODPExtension);

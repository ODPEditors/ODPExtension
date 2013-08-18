(function()
{

		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

		//toggle the preferences in the ODP Notes toolbarbutton

			this.odpURLNotesToolbarbuttonsOptionsUpdate = function()
			{
				this.getElement('toolbarbutton-odp-url-notes-form-submit').setAttribute('checked', this.preferenceGet('url.notes.form.submit'));
				this.getElement('toolbarbutton-odp-url-notes-form-submit-confirm').setAttribute('checked', this.preferenceGet('url.notes.form.submit.confirm'));
			}
			this.odpURLNotesToolbarbuttonsOptionsChange = function(item)
			{
				this.preferenceSet(item.getAttribute('value'), (item.getAttribute("checked") == "true"));
			}
			
	return null;

}).apply(ODPExtension);

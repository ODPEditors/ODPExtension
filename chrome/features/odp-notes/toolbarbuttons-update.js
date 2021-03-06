(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//updates show or hide the ODP URL Notes toolbarbuttons
	this.addListener('onLocationChange', function(aLocation) {
		ODPExtension.odpURLNotesToolbarbuttonsUpdate();
	});

	//hides or shows the toolbatbuttons (update,unreview,delete,options) when the user hits the edit url form

	this.odpURLNotesToolbarbuttonsUpdate = function() {

		var aSubdomain = this.getSubdomainFromURL(this.documentFocusedGetLocation())
		//when the location change we empty the cache of documents selected with multiple tab handler
		this.odpURLNotesMultipleTabHandlerSelectedDocuments = [];

		if (aSubdomain == 'www.dmoz.org' && this.editingFormURLExists(this.documentGetFocused()) && this.preferenceGet('enabled')) {
			this.getElement('toolbarbutton-odp-url-notes-update').removeAttribute('hidden');
			this.getElement('toolbarbutton-odp-url-notes-unreview').removeAttribute('hidden');
			this.getElement('toolbarbutton-odp-url-notes-delete').removeAttribute('hidden');

			this.getElement('toolbarbutton-odp-url-notes-move-publish').removeAttribute('hidden');
			this.getElement('toolbarbutton-odp-url-notes-move-unreview').removeAttribute('hidden');
			this.getElement('toolbarbutton-odp-url-notes-copy-publish').removeAttribute('hidden');
			this.getElement('toolbarbutton-odp-url-notes-copy-unreview').removeAttribute('hidden');

			this.getElement('toolbarbutton-odp-url-notes-update-label').removeAttribute('hidden');
			this.getElement('toolbarbutton-odp-url-notes-unreview-label').removeAttribute('hidden');
			this.getElement('toolbarbutton-odp-url-notes-delete-label').removeAttribute('hidden');

			this.getElement('toolbarbutton-odp-url-notes-move-publish-label').removeAttribute('hidden');
			this.getElement('toolbarbutton-odp-url-notes-move-unreview-label').removeAttribute('hidden');
			this.getElement('toolbarbutton-odp-url-notes-copy-publish-label').removeAttribute('hidden');
			this.getElement('toolbarbutton-odp-url-notes-copy-unreview-label').removeAttribute('hidden');

			this.getElement('toolbarbutton-odp-url-notes-notes').removeAttribute('hidden');
		} else {
			this.getElement('toolbarbutton-odp-url-notes-update').setAttribute('hidden', true);
			this.getElement('toolbarbutton-odp-url-notes-unreview').setAttribute('hidden', true);
			this.getElement('toolbarbutton-odp-url-notes-delete').setAttribute('hidden', true);

			this.getElement('toolbarbutton-odp-url-notes-move-publish').setAttribute('hidden', true);
			this.getElement('toolbarbutton-odp-url-notes-move-unreview').setAttribute('hidden', true);
			this.getElement('toolbarbutton-odp-url-notes-copy-publish').setAttribute('hidden', true);
			this.getElement('toolbarbutton-odp-url-notes-copy-unreview').setAttribute('hidden', true);

			this.getElement('toolbarbutton-odp-url-notes-update-label').setAttribute('hidden', true);
			this.getElement('toolbarbutton-odp-url-notes-unreview-label').setAttribute('hidden', true);
			this.getElement('toolbarbutton-odp-url-notes-delete-label').setAttribute('hidden', true);

			this.getElement('toolbarbutton-odp-url-notes-move-publish-label').setAttribute('hidden', true);
			this.getElement('toolbarbutton-odp-url-notes-move-unreview-label').setAttribute('hidden', true);
			this.getElement('toolbarbutton-odp-url-notes-copy-publish-label').setAttribute('hidden', true);
			this.getElement('toolbarbutton-odp-url-notes-copy-unreview-label').setAttribute('hidden', true);

			this.getElement('toolbarbutton-odp-url-notes-notes').setAttribute('hidden', true);
		}
	}
	return null;

}).apply(ODPExtension);
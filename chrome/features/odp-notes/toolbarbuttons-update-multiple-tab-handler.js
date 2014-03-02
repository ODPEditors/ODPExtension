(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.addListener('userInterfaceLoad', function(aEnabled) {
		//Apply note to selected sites //in multiple tab handler
		if (ODPExtension.getBrowserElement('multipletab-selection-menu')) {
			ODPExtension.getBrowserElement('multipletab-selection-menu').addEventListener("popupshowing", function(event) {
				if (event.originalTarget == event.currentTarget) {
					// this will cache the documents selected with MTH to next apply a ODP Note
					ODPExtension.odpURLNotesToolbarbuttonsUpdateMultipleTabHandler(event);
				}
			}, false);
		}
	});

	//sets "Apply URL notes to selected tabs" When using mutiple tab handler

	this.odpURLNotesToolbarbuttonsUpdateMultipleTabHandler = function(aEvent) {
		var showButtons = false;
		var aTabs = this.multipleTabHandlerSelectedTabs();
		this.odpURLNotesMultipleTabHandlerSelectedDocuments = [];
		for (var id in aTabs) {
			if (this.editingFormURLExists(this.documentGetFromTab(aTabs[id]))) {
				this.odpURLNotesMultipleTabHandlerSelectedDocuments[this.odpURLNotesMultipleTabHandlerSelectedDocuments.length] = this.documentGetFromTab(aTabs[id]);
				showButtons = true;
			}
		}

		this.getElement('toolbarbutton-odp-url-notes-update').setAttribute('hidden', !showButtons);
		this.getElement('toolbarbutton-odp-url-notes-unreview').setAttribute('hidden', !showButtons);
		this.getElement('toolbarbutton-odp-url-notes-delete').setAttribute('hidden', !showButtons);

		this.getElement('toolbarbutton-odp-url-notes-move-publish').setAttribute('hidden', !showButtons);
		this.getElement('toolbarbutton-odp-url-notes-move-unreview').setAttribute('hidden', !showButtons);
		this.getElement('toolbarbutton-odp-url-notes-copy-publish').setAttribute('hidden', !showButtons);
		this.getElement('toolbarbutton-odp-url-notes-copy-unreview').setAttribute('hidden', !showButtons);

		this.getElement('toolbarbutton-odp-url-notes-update-label').setAttribute('hidden', !showButtons);
		this.getElement('toolbarbutton-odp-url-notes-unreview-label').setAttribute('hidden', !showButtons);
		this.getElement('toolbarbutton-odp-url-notes-delete-label').setAttribute('hidden', !showButtons);

		this.getElement('toolbarbutton-odp-url-notes-move-publish-label').setAttribute('hidden', !showButtons);
		this.getElement('toolbarbutton-odp-url-notes-move-unreview-label').setAttribute('hidden', !showButtons);
		this.getElement('toolbarbutton-odp-url-notes-copy-publish-label').setAttribute('hidden', !showButtons);
		this.getElement('toolbarbutton-odp-url-notes-copy-unreview-label').setAttribute('hidden', !showButtons);

		this.getElement('toolbarbutton-odp-url-notes-notes').setAttribute('hidden', !showButtons);
	}
	return null;

}).apply(ODPExtension);
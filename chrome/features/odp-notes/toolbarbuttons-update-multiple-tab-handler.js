(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.addListener('userInterfaceLoad', function() {
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

		if (showButtons) {
			this.getElement('toolbarbutton-odp-url-notes-update').removeAttribute('hidden');
			this.getElement('toolbarbutton-odp-url-notes-unreview').removeAttribute('hidden');
			this.getElement('toolbarbutton-odp-url-notes-delete').removeAttribute('hidden');
			this.getElement('toolbarbutton-odp-url-notes-notes').removeAttribute('hidden');
			this.getElement('toolbarbutton-odp-url-notes-move-publish').removeAttribute('hidden');
			this.getElement('toolbarbutton-odp-url-notes-move-unreview').removeAttribute('hidden');
			this.getElement('toolbarbutton-odp-url-notes-copy-publish').removeAttribute('hidden');
			this.getElement('toolbarbutton-odp-url-notes-copy-unreview').removeAttribute('hidden');
		} else {
			this.getElement('toolbarbutton-odp-url-notes-update').setAttribute('hidden', true);
			this.getElement('toolbarbutton-odp-url-notes-unreview').setAttribute('hidden', true);
			this.getElement('toolbarbutton-odp-url-notes-delete').setAttribute('hidden', true);
			this.getElement('toolbarbutton-odp-url-notes-notes').setAttribute('hidden', true);
			this.getElement('toolbarbutton-odp-url-notes-move-publish').setAttribute('hidden', true);
			this.getElement('toolbarbutton-odp-url-notes-move-unreview').setAttribute('hidden', true);
			this.getElement('toolbarbutton-odp-url-notes-copy-publish').setAttribute('hidden', true);
			this.getElement('toolbarbutton-odp-url-notes-copy-unreview').setAttribute('hidden', true);
		}
	}
	return null;

}).apply(ODPExtension);
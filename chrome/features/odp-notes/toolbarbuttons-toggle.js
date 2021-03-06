(function() {
	this.addListener('toolbarsToggle', function(aClosed) {
		if (aClosed) {
			ODPExtension.toolbarOpenRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-update'));
			ODPExtension.toolbarOpenRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-unreview'));
			ODPExtension.toolbarOpenRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-delete'));
			ODPExtension.toolbarOpenRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-move-unreview'));
			ODPExtension.toolbarOpenRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-move-publish'));
			ODPExtension.toolbarOpenRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-copy-publish'));
			ODPExtension.toolbarOpenRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-copy-unreview'));

			ODPExtension.toolbarOpenRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-update-label'));
			ODPExtension.toolbarOpenRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-unreview-label'));
			ODPExtension.toolbarOpenRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-delete-label'));
			ODPExtension.toolbarOpenRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-move-unreview-label'));
			ODPExtension.toolbarOpenRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-move-publish-label'));
			ODPExtension.toolbarOpenRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-copy-publish-label'));
			ODPExtension.toolbarOpenRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-copy-unreview-label'));

			ODPExtension.toolbarOpenRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-notes'));
		} else {
			ODPExtension.toolbarCloseRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-update'));
			ODPExtension.toolbarCloseRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-unreview'));
			ODPExtension.toolbarCloseRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-delete'));
			ODPExtension.toolbarCloseRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-move-unreview'));
			ODPExtension.toolbarCloseRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-move-publish'));
			ODPExtension.toolbarCloseRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-copy-publish'));
			ODPExtension.toolbarCloseRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-copy-unreview'));

			ODPExtension.toolbarCloseRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-update-label'));
			ODPExtension.toolbarCloseRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-unreview-label'));
			ODPExtension.toolbarCloseRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-delete-label'));
			ODPExtension.toolbarCloseRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-move-unreview-label'));
			ODPExtension.toolbarCloseRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-move-publish-label'));
			ODPExtension.toolbarCloseRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-copy-publish-label'));
			ODPExtension.toolbarCloseRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-copy-unreview-label'));

			ODPExtension.toolbarCloseRemember(ODPExtension.getElement('toolbarbutton-odp-url-notes-notes'));
		}
	});

	return null;

}).apply(ODPExtension);
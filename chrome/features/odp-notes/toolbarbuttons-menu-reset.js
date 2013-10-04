(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.addListener('userInterfaceUpdate', function() {

		ODPExtension.odpURLNotesToolbarbuttonsMenuReset('update');
		ODPExtension.odpURLNotesToolbarbuttonsMenuReset('unreview');
		ODPExtension.odpURLNotesToolbarbuttonsMenuReset('delete');

		ODPExtension.odpURLNotesToolbarbuttonsMenuReset('move-publish');
		ODPExtension.odpURLNotesToolbarbuttonsMenuReset('move-unreview');
		ODPExtension.odpURLNotesToolbarbuttonsMenuReset('copy-publish');
		ODPExtension.odpURLNotesToolbarbuttonsMenuReset('copy-unreview');
	});
	//notify to the function that builds the menu, that the next time the menu should be recreated, because has new items

	this.odpURLNotesToolbarbuttonsMenuReset = function(aType) {
		if (this.getElement('toolbarbutton-odp-url-notes-' + aType))
			this.getElement('toolbarbutton-odp-url-notes-' + aType + '-menupopup').setAttribute('build', 'false');
	}
	return null;

}).apply(ODPExtension);
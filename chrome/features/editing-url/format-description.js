(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//formats a description in the "edit URL" form even if it is framed
	//first letter upper case, and remove unwanted chars.

	this.editingFormURLFormatDescription = function() {
		//if the rigth clicked document is framed..
		if (gContextMenu && gContextMenu.inFrame)
			var aDoc = gContextMenu.target.ownerDocument;
		else
			var aDoc = this.documentGetFocused();

		var anElement = this.getElementNamed('newdesc', aDoc) || this.getElementNamed('desc', aDoc);

		if (!anElement) {} else {
			anElement.value = this.autoCorrect(anElement.value);
		}
	}
	return null;

}).apply(ODPExtension);
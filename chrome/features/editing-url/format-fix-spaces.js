(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//fixes the puntuation in the description and title

	this.editingFormURLFormatFixSpaces = function() {
		this.editingFormURLFormatFixSpacesElement('newdesc');
		this.editingFormURLFormatFixSpacesElement('desc');
		this.editingFormURLFormatFixSpacesElement('newtitle');
		this.editingFormURLFormatFixSpacesElement('title');
	}
	this.editingFormURLFormatFixSpacesElement = function(aName) {
		//if the rigth clicked document is framed..
		if (gContextMenu && gContextMenu.inFrame)
			var aDoc = gContextMenu.target.ownerDocument;
		else
			var aDoc = this.documentGetFocused();

		var anElement = this.getElementNamed(aName, aDoc);

		if (!anElement) {} else {
			anElement.value = this.fixPuntuation(this.removeNewLines(anElement.value));
		}
	}
	this.editingFormURLFormatFixSpacesElementCharter = function(aName) {
		//if the rigth clicked document is framed..
		if (gContextMenu && gContextMenu.inFrame)
			var aDoc = gContextMenu.target.ownerDocument;
		else
			var aDoc = this.documentGetFocused();

		var anElement = this.getElementNamed(aName, aDoc);

		if (!anElement) {} else {
			anElement.value = this.fixPuntuation(anElement.value);
		}
	}
	return null;

}).apply(ODPExtension);
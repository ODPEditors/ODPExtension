(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//formats an input in the "edit URL" form to lowercase

	this.editingFormURLFormatLowerCase = function(aName) {
		//if the rigth clicked document is framed..
		if (gContextMenu && gContextMenu.inFrame)
			var aDoc = gContextMenu.target.ownerDocument;
		else
			var aDoc = this.documentGetFocused();

		var anElement = this.getElementNamed(aName, aDoc);

		if (!anElement) {} else {
			this.editingFormURLFormatFixSpaces(); //do espacios

			var value = this.ucFirst(anElement.value.toLowerCase());

			//fix sentence uppercase
			value = value.split('. ');
			for (var id in value)
				value[id] = this.ucFirst(value[id]);
			anElement.value = value.join('. ');
		}
	}
	return null;

}).apply(ODPExtension);
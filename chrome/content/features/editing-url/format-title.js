(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//formats a title in the "edit URL" form

	this.editingFormURLFormatTitle = function(aType) {
		//if the rigth clicked document is framed..
		if (gContextMenu && gContextMenu.inFrame)
			var aDoc = gContextMenu.target.ownerDocument;
		else
			var aDoc = this.documentGetFocused();

		var anElement = this.getElementNamed('newtitle', aDoc);

		if (!anElement) {} else {
			var aString = this.fixPuntuation(this.removeNewLines(anElement.value)).toLowerCase();

			//apply format
			if (aType == 'The title') {
				anElement.value = this.ucFirst(aString);
			} else if (aType == 'The Title') {
				var a = 0;
				aString = aString.split(' ');
				for (var aPosition in aString) {
					if (a == 0 || aString[aPosition].length > 3) //upper case the first letter or to the word if has more than 3 chars
					{
						aString[aPosition] = this.ucFirst(aString[aPosition]);
					}
					a++;
				}
				anElement.value = aString.join(' ');
			} else if (aType == 'THE TITLE') {
				anElement.value = aString.toUpperCase();
			} else if (aType == 'Title, The') {
				aString = aString.split(' ');
				for (var aPosition in aString) {
					aString[aPosition] = this.ucFirst(aString[aPosition]);
				}
				anElement.value = aString.join(' ').replace(/(.*)\s(.*)/, '$2, $1'); //from rp bookmarklets
			}
			anElement.value = this.fixPuntuation(anElement.value).replace(/\.+$/, '');
		}
	}
	return null;

}).apply(ODPExtension);
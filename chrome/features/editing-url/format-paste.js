(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//paste and formats a string in the "edit URL"

	this.editingFormURLFormatPaste = function() {
		var aString = this.autoCorrect(this.getClipboard());
		this.copyToClipboard(aString);
		goDoCommand('cmd_paste');

		this.editingFormURLFormatFixSpaces();
	}
	return null;

}).apply(ODPExtension);
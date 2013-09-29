(function() {
	//copy to the clipboard aString
	this.copyToClipboard = function(aString) {
		var clipboard = Components.classes["@mozilla.org/widget/clipboardhelper;1"]
			.getService(Components.interfaces.nsIClipboardHelper);
		clipboard.copyString(aString);
	}
	//gets the clipboard as a String
	this.getClipboard = function() {
		var pastetext = '';

		var clip = Components.classes["@mozilla.org/widget/clipboard;1"].getService(Components.interfaces.nsIClipboard);
		if (!clip || clip == false)
			return '';

		var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
		if (!trans || trans == false)
			return '';

		trans.addDataFlavor("text/unicode");

		clip.getData(trans, clip.kGlobalClipboard);

		var str = new Object();
		var strLength = new Object();

		try {
			trans.getTransferData("text/unicode", str, strLength);
		} catch (e) {
			return '';
		}

		if (str)
			str = str.value.QueryInterface(Components.interfaces.nsISupportsString);
		if (str)
			pastetext = str.data.substring(0, strLength.value / 2);
		return pastetext;
	}

	return null;

}).apply(ODPExtension);
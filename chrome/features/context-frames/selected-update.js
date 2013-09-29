(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//updates the selected frame menuitem by looking in the "clicked" frame

	this.frameSelectedUpdate = function() {
		var menuitem = this.getElement('context-frame');

		//update the visibility of "open frame in new tab"
		if (gContextMenu && gContextMenu.inFrame) {
			var framedURL = this.string(gContextMenu.target.ownerDocument.location.href);
			if (framedURL != '') {
				menuitem.setAttribute('label', menuitem.getAttribute('original_label').replace('{URL}', this.decodeUTF8Recursive(this.getURLForLabel(framedURL))));
				menuitem.setAttribute('tooltiptext', this.decodeUTF8Recursive(framedURL));
				menuitem.setAttribute('hidden', false);
			} else {
				menuitem.setAttribute('hidden', true);
			}
		} else {
			menuitem.setAttribute('hidden', true);
		}
	}
	return null;

}).apply(ODPExtension);
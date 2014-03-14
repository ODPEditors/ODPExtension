(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//show or hide the formater context menu
	this.addListener('contextMenuShowing', function() {
		ODPExtension.editingFormURLMenuUpdate();
	});

	//updates show or hide the formater context menu when switching tabs (if the context menu is opened)
	this.addListener('onLocationChange', function(aLocation) {
		if (ODPExtension.contentAreaContextMenu().state == 'open')
			ODPExtension.editingFormURLMenuUpdate();
	});

	//hides or shows the "formater" content menu if the focused domain is editors.dmoz.org and if the "edit URL" form exists

	this.editingFormURLMenuUpdate = function() {
		//if the rigth clicked document is framed..
		if (gContextMenu && gContextMenu.inFrame) {
			var aSubdomain = this.getSubdomainFromURL(this.IDNDecodeURL(this.string(gContextMenu.target.ownerDocument.location.href)));
			var aDoc = gContextMenu.target.ownerDocument;
		} else {
			var aDoc = this.documentGetFocused();
			var aSubdomain = this.getSubdomainFromURL(this.documentFocusedGetLocation())
		}

		if (aSubdomain == 'www.dmoz.org' && this.editingFormURLExists(aDoc)) {
			this.getElement('context-editing-form-url-formater').setAttribute('hidden', false);
		} else {
			this.getElement('context-editing-form-url-formater').setAttribute('hidden', true);
		}
	}
	return null;

}).apply(ODPExtension);
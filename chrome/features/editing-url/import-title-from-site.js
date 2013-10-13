(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//paste and formats a string in the "edit URL"

	this.editingFormURLImportTitleFromSite = function() {
		//if the rigth clicked document is framed..
		if (gContextMenu && gContextMenu.inFrame)
			var aDoc = gContextMenu.target.ownerDocument;
		else
			var aDoc = this.documentGetFocused();

		var aURL = this.getElementNamed('newurl', aDoc) || this.getElementNamed('url', aDoc);
		var aTitle = this.getElementNamed('newtitle', aDoc) || this.getElementNamed('title', aDoc);

		if (!aURL || !aTitle) {} else {
			this.readURL(aURL.value, false, false, false, function(aData){
				var title =  ODPExtension.stripTags(ODPExtension.htmlEntityDecode(aData.replace(/\n/g, ' ').replace(/.*title>(.+)<\/title.*/i, '$1').trim()));
				if(title!='')
					aTitle.value = title;
			}, true)
		}
	}
	return null;

}).apply(ODPExtension);

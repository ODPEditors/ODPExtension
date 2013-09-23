(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//updates the frame menu by looking in all the frames of the current document and it's sub documents

	this.frameMenuUpdate = function() {
		var menu = this.getElement('context-frames-menu');
		var menupopup = this.getElement('context-frames-menupopup');

		var framesURLs = [];

		this.foreachFrame(this.windowGetFromTab(this.tabGetFocused()), function(aDoc) {
			framesURLs[framesURLs.length] = ODPExtension.documentGetLocation(aDoc);
		})

		framesURLs = this.arrayUnique(framesURLs);

		this.removeChilds(menupopup);

		var menuIsEmpty = true;
		for (var id in framesURLs) {
			var aURL = framesURLs[id];
			if (aURL != '' && aURL != this.focusedURL && this.isPublicURL(aURL)) {
				var add = this.create("menuitem");
				add.setAttribute("label", this.decodeUTF8Recursive(aURL));
				add.setAttribute("value", aURL);
				menupopup.appendChild(add);
				menuIsEmpty = false;
			}
		}
		if (menuIsEmpty)
			menu.setAttribute('hidden', true);
		else
			menu.setAttribute('hidden', false);
	}

	return null;

}).apply(ODPExtension);
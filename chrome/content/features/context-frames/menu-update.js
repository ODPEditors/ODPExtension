(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//updates the frame menu by looking in all the frames of the current document and it's sub documents

	this.frameMenuUpdate = function() {
		var menu = this.getElement('context-frames-menu');
		var menupopup = this.getElement('context-frames-menupopup');

		this.framesURLs = [];

		this.foreachFrame(this.windowGetFromTab(this.tabGetFocused()), function(aDoc) {
			ODPExtension.frameMenuGetURL(aDoc);
		})

		this.framesURLs = this.arrayUnique(this.framesURLs);

		this.removeChilds(menupopup);

		var menuIsEmpty = true;
		for (var id in this.framesURLs) {
			var aURL = this.framesURLs[id];

			if (aURL != '' && aURL != this.focusedURL && this.isPublicURL(aURL) && !this.isGarbageURL(aURL)) {
				var add = this.create("menuitem");
				add.setAttribute("label", this.decodeUTF8Recursive(aURL));
				add.setAttribute("value", aURL);
				menupopup.appendChild(add);
				menuIsEmpty = false;
			}
		}

		this.framesURLs = [];

		if (menuIsEmpty)
			menu.setAttribute('hidden', true);
		else
			menu.setAttribute('hidden', false);
	}

	this.frameMenuGetURL = function(aDoc) {
		this.framesURLs[this.framesURLs.length] = this.documentGetLocation(aDoc);
	}
	return null;

}).apply(ODPExtension);
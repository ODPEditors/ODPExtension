(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.addListener('userInterfaceUpdate', function(aEnabled) {
		ODPExtension.getElement('context-frames-menu').setAttribute('hidden', !aEnabled || !ODPExtension.preferenceGet('ui.context.menu.frames'));
		ODPExtension.getElement('context-frame').setAttribute('hidden', !aEnabled || !ODPExtension.preferenceGet('ui.context.menu.frame.selected'));
	});

	//build, show or hide the frames context menu and selected context menu
	this.addListener('contextMenuShowing', function(event) {
		if (ODPExtension.preferenceGet('ui.context.menu.frames'))
			ODPExtension.frameMenuUpdate();
	});

	//the user has opened the context menu, the menu of frames was builded,
	//but maybe the current document was not loaded complety and there is more frames
	this.addListener('DOMContentLoadedWithFrames', function(aDoc) {
		//only update the menu of frames if the context menu is opened
		if (ODPExtension.preferenceGet('ui.context.menu.frames') && ODPExtension.contentAreaContextMenu().state == 'open') {
			var focusedTab = ODPExtension.tabGetFocused();
			//and if the focused page has frames
			//and if the loaded document is from this tab
			if (ODPExtension.tabHasFrames(focusedTab) && focusedTab == ODPExtension.tabGetFromDocument(aDoc))
				ODPExtension.frameMenuUpdate();
		}
	});
	//the user has opened the context menu, the menu of frames was builded,
	//but maybe the user switched from tab and there is o no frames
	this.addListener('onLocationChange', function(aLocation) {
		if (ODPExtension.preferenceGet('ui.context.menu.frames') && ODPExtension.contentAreaContextMenu().state == 'open') {
			ODPExtension.frameMenuUpdate();
		}
	});

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
			if (aURL != '' && aURL != this.focusedURL) {
				var add = this.create("menuitem");
				add.setAttribute("label", this.decodeUTF8Recursive(aURL));
				add.setAttribute('tooltiptext', this.decodeUTF8Recursive(aURL));
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
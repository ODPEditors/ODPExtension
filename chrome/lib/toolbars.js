(function() {
	//closes a toolbar
	this.toolbarClose = function(aToolbar) {
		aToolbar.collapsed = true;
		document.persist(aToolbar.getAttribute('id'), "collapsed");
	}
	//closes a toolbar if it was opened and remembers the state
	this.toolbarCloseRemember = function(aToolbar) {
		if (aToolbar.collapsed == false) {
			aToolbar.collapsed = true;
			document.persist(aToolbar.getAttribute('id'), "collapsed");
		}
	}
	//opens a toolbar if was closed and remembers the state
	this.toolbarOpenRemember = function(aToolbar) {
		if (aToolbar.collapsed == true) {
			aToolbar.collapsed = false;
			document.persist(aToolbar.getAttribute('id'), "collapsed");
		}
	}
	//Opens a toolbar button automatically if another toolbar button is open on the toolbar
	this.toolbarbuttonOpen = function(aToolbarbutton, aEvent) {
		/*from webdeveloper extension*/
		// If the toolbar button is set and is not open
		if (aToolbarbutton && !aToolbarbutton.open && aEvent.originalTarget == aEvent.currentTarget) {
			var toolbarButton = null;
			var toolbarButtons = aToolbarbutton.parentNode.getElementsByTagName("toolbarbutton");
			var toolbarButtonsLength = toolbarButtons.length;
			// Loop through the toolbar buttons
			for (var i = 0; i < toolbarButtonsLength; i++) {
				toolbarButton = toolbarButtons.item(i);
				// If the toolbar button is set, is not the same toolbar button and is open
				if (toolbarButton && toolbarButton != aToolbarbutton && toolbarButton.open) {
					toolbarButton.open = false;
					aToolbarbutton.open = true;
					break;
				}
			}
		}
	}

	return null;

}).apply(ODPExtension);
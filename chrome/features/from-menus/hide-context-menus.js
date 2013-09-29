(function() {
	//hides all problematic contexts menus

	this.fromCategoryHideContextMenus = function() {
		try {
			//hidding context
		//	if (gContextMenu)
		//		gContextMenu.shouldDisplay = false;

		//	this.contentAreaContextMenu().hidePopup();
		//	this.contentAreaContextMenu().setAttribute('hidden', true);
		} catch (e) {

		}

		this.tabContextMenu().hidePopup();
		this.tabContextMenu().setAttribute('hidden', true);

		if (this.getBrowserElement('multipletab-selection-menu')) {
			this.getBrowserElement('multipletab-selection-menu').hidePopup();
			this.getBrowserElement('multipletab-selection-menu').setAttribute('hidden', true);
			this.getBrowserElement('multipletab-selection-menu').hidePopup();
		}

		setTimeout(function() {
			ODPExtension.contentAreaContextMenu().setAttribute('hidden', false);

			ODPExtension.tabContextMenu().setAttribute('hidden', false);
			if (ODPExtension.getBrowserElement('multipletab-selection-menu'))
				ODPExtension.getBrowserElement('multipletab-selection-menu').setAttribute('hidden', false);

		}, 0);
	}

	return null;

}).apply(ODPExtension);
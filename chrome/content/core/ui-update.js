(function() {

	var debugingThisFile = true;

	//this function is called to show or hide the UI of this extension
	//this function will be automatically called for each window that is opened when a preference change or at window startup
	this.userInterfaceUpdate = function() {
		//this.dump('userInterfaceUpdate', debugingThisFile);

		this.extensionIconUpdatePosition();
		this.categoryBrowserMenuUpdate();

		//odp notes
		this.odpURLNotesToolbarbuttonsMenuReset('update');
		this.odpURLNotesToolbarbuttonsMenuReset('unreview');
		this.odpURLNotesToolbarbuttonsMenuReset('delete');
		this.odpURLNotesToolbarbuttonsMenuReset('move-publish');
		this.odpURLNotesToolbarbuttonsMenuReset('move-unreview');
		this.odpURLNotesToolbarbuttonsMenuReset('copy-publish');
		this.odpURLNotesToolbarbuttonsMenuReset('copy-unreview');

		if (this.preferenceGet('ui.informative.panel.categories.align.left')) {
			this.getElement('panel-related-categories').setAttribute('data-align', 'left');
			var categoryCrop = 'end';
		} else {
			this.getElement('panel-related-categories').setAttribute('data-align', 'right');
			var categoryCrop = 'start';
		}
		for (var i = 0; i < this.getElement('panel-related-categories').childNodes.length; i++) {
			this.getElement('panel-related-categories').childNodes[i].setAttribute('crop', categoryCrop);
		}

		if (!this.preferenceGet('enabled')) {
			//context menu
			this.translateMenuUpdate();
			this.getElement('word-reference').setAttribute('hidden', true);
			this.URLToolsMenuUpdate();
			this.getElement('context-frames-menu').setAttribute('hidden', true);
			this.getElement('context-frame').setAttribute('hidden', true);
			this.getElement('context-separator').setAttribute('hidden', true);

			this.getElement('context-from-category').setAttribute('hidden', true);
			this.getElement('context-from-categories').setAttribute('hidden', true);
			this.getElement('context-from-editor').setAttribute('hidden', true);
			this.getElement('context-from-editors').setAttribute('hidden', true);
			//toolbar
			this.getElement('toolbar-local-category-finder').setAttribute('hidden', true);
			this.getElement('toolbar-category-navigator').setAttribute('hidden', true);
			//toolbarbuttons

			this.getElement('toolbarbutton-category-browser').setAttribute('hidden', true);
			if (this.getElement('toolbarbutton-odp-url-notes-update'))
				this.getElement('toolbarbutton-odp-url-notes-update').setAttribute('hidden', true);
			if (this.getElement('toolbarbutton-odp-url-notes-unreview'))
				this.getElement('toolbarbutton-odp-url-notes-unreview').setAttribute('hidden', true);
			if (this.getElement('toolbarbutton-odp-url-notes-delete'))
				this.getElement('toolbarbutton-odp-url-notes-delete').setAttribute('hidden', true);
			if (this.getElement('toolbarbutton-odp-url-notes-notes'))
				this.getElement('toolbarbutton-odp-url-notes-notes').setAttribute('hidden', true);
			if (this.getElement('toolbarbutton-odp-url-notes-move-publish'))
				this.getElement('toolbarbutton-odp-url-notes-move-publish').setAttribute('hidden', true);
			if (this.getElement('toolbarbutton-odp-url-notes-move-unreview'))
				this.getElement('toolbarbutton-odp-url-notes-move-unreview').setAttribute('hidden', true);
			if (this.getElement('toolbarbutton-odp-url-notes-copy-publish'))
				this.getElement('toolbarbutton-odp-url-notes-copy-publish').setAttribute('hidden', true);
			if (this.getElement('toolbarbutton-odp-url-notes-copy-unreview'))
				this.getElement('toolbarbutton-odp-url-notes-copy-unreview').setAttribute('hidden', true);


			//forms css
			this.cssRemove('forms.css');

		} else {
			//context menu

			var showContextMenuSeparator = false;

			//translate menu
			this.translateMenuUpdate();
			if (this.preferenceGet('ui.context.menu.translate'))
				showContextMenuSeparator = true;

			//word reference
			if (this.preferenceGet('ui.context.menu.word.reference')) {
				showContextMenuSeparator = true;
				this.getElement('word-reference').setAttribute('hidden', false);
			} else
				this.getElement('word-reference').setAttribute('hidden', true);

			//url tools
			this.URLToolsMenuUpdate();
			if (this.preferenceGet('ui.context.menu.url.tools'))
				showContextMenuSeparator = true;

			//frames
			if (this.preferenceGet('ui.context.menu.frames'))
				showContextMenuSeparator = true;
			else
				this.getElement('context-frames-menu').setAttribute('hidden', true);
			//frame selected
			if (this.preferenceGet('ui.context.menu.frame.selected'))
				showContextMenuSeparator = true;
			else
				this.getElement('context-frame').setAttribute('hidden', true);

			//the separator
			if (showContextMenuSeparator)
				this.getElement('context-separator').setAttribute('hidden', false);
			else
				this.getElement('context-separator').setAttribute('hidden', true);

			//tools based on categoriesTXT data

			if (this.categoriesTXTExists()) {
				this.shared.categories.txt.exists = true;
				this.shared.categories.txt.databases = this.folderListContent('categories.txt/');

				this.categoryFinderMenuListUpdate(this.getElement('local-category-finder-database-list'));
				this.categoryFinderMenuListUpdate(document.getAnonymousElementByAttribute(this.getElement('category-browser'), "anonid", "ODPExtension-local-category-finder-database-list-xbl"));

				//toolbars
				this.getElement('toolbar-local-category-finder').setAttribute('hidden', false);
				this.getElement('toolbar-category-navigator').setAttribute('hidden', false);
				//category browser menulist y search button
				document.getAnonymousElementByAttribute(this.getElement('category-browser'), "anonid", "ODPExtension-category-browser-menulist-data-xbl").setAttribute('hidden', false);
			} else {
				this.shared.categories.txt.exists = false;
				this.shared.categories.txt.databases = [];
				//toolbars
				this.getElement('toolbar-local-category-finder').setAttribute('hidden', true);
				this.getElement('toolbar-category-navigator').setAttribute('hidden', true);
				//category browser menulist y search button
				document.getAnonymousElementByAttribute(this.getElement('category-browser'), "anonid", "ODPExtension-category-browser-menulist-data-xbl").setAttribute('hidden', true);
			}

			//toolbarbuttons
			this.getElement('toolbarbutton-category-browser').setAttribute('hidden', false);

			//forms css
			if (this.preferenceGet('forms.css'))
				this.cssAppend('forms.css', 'chrome://odpextension/content/features/browser/dmoz.org.css');
			else
				this.cssRemove('forms.css');

		}

		this.dispatchEvent('userInterfaceUpdate', this.preferenceGet('enabled'));
	}
	return null;

}).apply(ODPExtension);
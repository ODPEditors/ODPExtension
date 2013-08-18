(function()
{
	//hides or shows all the toolbars and toolbars buttons
	this.toolbarsToggle = function()
	{
		if(this.preferenceGet('toolbars.toggle'))
		{
			//toolbars buttons
			if(this.getElement('toolbarbutton-category-browser'))
				this.toolbarOpenRemember(this.getElement('toolbarbutton-category-browser'));
			if(this.getElement('toolbarbutton-sisters-categories'))
				this.toolbarOpenRemember(this.getElement('toolbarbutton-sisters-categories'));
			if(this.getElement('toolbarbutton-add-to-open-directory'))
				this.toolbarOpenRemember(this.getElement('toolbarbutton-add-to-open-directory'));
			if(this.getElement('toolbarbutton-odp-url-notes-update'))
				this.toolbarOpenRemember(this.getElement('toolbarbutton-odp-url-notes-update'));
			if(this.getElement('toolbarbutton-odp-url-notes-unreview'))
				this.toolbarOpenRemember(this.getElement('toolbarbutton-odp-url-notes-unreview'));
			if(this.getElement('toolbarbutton-odp-url-notes-delete'))
				this.toolbarOpenRemember(this.getElement('toolbarbutton-odp-url-notes-delete'));
			if(this.getElement('toolbarbutton-odp-url-notes-notes'))
				this.toolbarOpenRemember(this.getElement('toolbarbutton-odp-url-notes-notes'));
			if(this.getElement('toolbarbutton-odp-url-notes-move-unreview'))
				this.toolbarOpenRemember(this.getElement('toolbarbutton-odp-url-notes-move-unreview'));
			if(this.getElement('toolbarbutton-odp-url-notes-move-publish'))
				this.toolbarOpenRemember(this.getElement('toolbarbutton-odp-url-notes-move-publish'));
			if(this.getElement('toolbarbutton-odp-url-notes-copy-publish'))
				this.toolbarOpenRemember(this.getElement('toolbarbutton-odp-url-notes-copy-publish'));
			if(this.getElement('toolbarbutton-odp-url-notes-copy-unreview'))
				this.toolbarOpenRemember(this.getElement('toolbarbutton-odp-url-notes-copy-unreview'));

			//toolbars
			this.toolbarOpenRemember(this.getElement('toolbar'));
			this.toolbarOpenRemember(this.getElement('toolbar-category-navigator'));
			this.toolbarOpenRemember(this.getElement('toolbar-local-category-finder'));
		}
		else
		{
			//toolbars
			this.toolbarCloseRemember(this.getElement('toolbar'));
			this.toolbarCloseRemember(this.getElement('toolbar-category-navigator'));
			this.toolbarCloseRemember(this.getElement('toolbar-local-category-finder'));

			//toolbars buttons
			if(this.getElement('toolbarbutton-category-browser'))
				this.toolbarCloseRemember(this.getElement('toolbarbutton-category-browser'));
			if(this.getElement('toolbarbutton-sisters-categories'))
				this.toolbarCloseRemember(this.getElement('toolbarbutton-sisters-categories'));
			if(this.getElement('toolbarbutton-add-to-open-directory'))
				this.toolbarCloseRemember(this.getElement('toolbarbutton-add-to-open-directory'));
			if(this.getElement('toolbarbutton-odp-url-notes-update'))
				this.toolbarCloseRemember(this.getElement('toolbarbutton-odp-url-notes-update'));
			if(this.getElement('toolbarbutton-odp-url-notes-unreview'))
				this.toolbarCloseRemember(this.getElement('toolbarbutton-odp-url-notes-unreview'));
			if(this.getElement('toolbarbutton-odp-url-notes-delete'))
				this.toolbarCloseRemember(this.getElement('toolbarbutton-odp-url-notes-delete'));
			if(this.getElement('toolbarbutton-odp-url-notes-notes'))
				this.toolbarCloseRemember(this.getElement('toolbarbutton-odp-url-notes-notes'));
			if(this.getElement('toolbarbutton-odp-url-notes-move-publish'))
				this.toolbarCloseRemember(this.getElement('toolbarbutton-odp-url-notes-move-publish'));
			if(this.getElement('toolbarbutton-odp-url-notes-move-unreview'))
				this.toolbarCloseRemember(this.getElement('toolbarbutton-odp-url-notes-move-unreview'));
			if(this.getElement('toolbarbutton-odp-url-notes-copy-publish'))
				this.toolbarCloseRemember(this.getElement('toolbarbutton-odp-url-notes-copy-publish'));
			if(this.getElement('toolbarbutton-odp-url-notes-copy-unreview'))
				this.toolbarCloseRemember(this.getElement('toolbarbutton-odp-url-notes-copy-unreview'));
		}
		
		this.categoryNavigatorToolbarUpdate(this.categoryGetFocused());
		
		this.preferenceSet('toolbars.toggle', !this.preferenceGet('toolbars.toggle'))
	}
	return null;

}).apply(ODPExtension);

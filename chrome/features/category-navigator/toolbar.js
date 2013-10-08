(function() {


	this.addListener('userInterfaceLoad', function(aEnabled) {
		//detecting when one of the toolbars are selected to collapse or not
		//this is useful to update the content of the toolbars when these are shown
		//but still can't update the content if the user open the toolbar from other menuitem like View -> Toolbar -> My toolbar. arr!!! toolbar collapse event?
		if (ODPExtension.getBrowserElement('toolbar-context-menu')) {
			ODPExtension.getBrowserElement('toolbar-context-menu').addEventListener('popuphidden', function() {
				ODPExtension.categoryNavigatorToolbarUpdate(ODPExtension.categoryGetFocused())
			}, false);
		}
		ODPExtension.categoryNavigatorToolbarUpdate(ODPExtension.categoryGetFocused());
	});

	this.addListener('userInterfaceUpdate', function(aEnabled) {
		ODPExtension.getElement('toolbar-category-navigator').setAttribute('hidden', !aEnabled || !ODPExtension.categoriesTXTExists());
	});

	this.addListener('focusedCategoryChange', function(aCategory) {
		if (ODPExtension.categoriesTXTExists()) {
			if (!ODPExtension.getElement('toolbar-category-navigator').collapsed)
				ODPExtension.categoryNavigatorToolbarUpdate(aCategory);
		}
	});

	this.addListener('toolbarsToggle', function(aClosed) {
		if (aClosed) {
			ODPExtension.toolbarOpenRemember(ODPExtension.getElement('toolbar-category-navigator'));
		} else {
			ODPExtension.toolbarCloseRemember(ODPExtension.getElement('toolbar-category-navigator'));
		}
		ODPExtension.categoryNavigatorToolbarUpdate(ODPExtension.categoryGetFocused());
	});

	//this is the functino that builds the category navigator( or ODP breadcrumb )
	//for each category node will show a toolbar button
	//has some tricks.
	//by default for a category will show the subcategories
	//but will show the sisters categories too.
	this.categoryNavigatorToolbarUpdate = function(aCategory) {
		var container = this.getElement('toolbar-category-navigator-container');

		this.removeChilds(container);

		if (this.categoryIsRTL(aCategory))
			container.setAttribute('style', 'direction:rtl');
		else
			container.setAttribute('style', 'direction:ltr');

		var aCategoryNodes = aCategory.split('/');
		var path = '';
		if (aCategory != '' && aCategory.indexOf('Bookmarks/') !== 0  && aCategory.indexOf('Test/') !== 0) {
			for (var id = 0; id < aCategoryNodes.length; id++) {
				path += aCategoryNodes[id] + '/';

				var toolbarbutton = this.create('toolbarbutton');
				toolbarbutton.setAttribute('type', 'menu');
				toolbarbutton.setAttribute('label', this.categoryTitle(aCategoryNodes[id]));
				toolbarbutton.setAttribute('context', 'ODPExtension-from-category');
				toolbarbutton.setAttribute('onclick', 'if(event.button==1 && event.originalTarget == this)ODPExtension.categoryBrowserClick(event)'); //only allows middle click on the toobalbutton to open the category in a new tab, that's all
				toolbarbutton.setAttribute('onmouseover', 'ODPExtension.toolbarbuttonOpen(this, event)'); //only allows middle click on the toobalbutton to open the category in a new tab, that's all
				toolbarbutton.setAttribute('value', path.replace(/\/$/, ''));
				if (this.categoryIsRTL(path))
					toolbarbutton.setAttribute('direction', 'rtl');
				else
					toolbarbutton.setAttribute('direction', 'ltr');

				var popup = this.create('menupopup');
				popup.setAttribute('value', path);
				popup.setAttribute('onpopupshowing', 'ODPExtension.categoryNavigatorToolbarbuttonUpdate(this, event)');
				//makes the category navegable and filterable by setting a few attributes
				this.categoryBrowserNavigateMakeMenuPopupNavegable(popup);
				toolbarbutton.appendChild(popup);
				container.appendChild(toolbarbutton);
			}
		} else {
			var description = this.create('toolbarbutton');
			description.setAttribute('label', this.getString('no.categories.found.to.show.in.the.category.navigator'));
			description.setAttribute('class', 'ODPExtension-description');
			container.appendChild(description);
		}
	}

	return null;

}).apply(ODPExtension);
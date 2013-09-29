(function() {

	//this is the functino that builds the category navigator( or ODP breadcrumb )
	//for each category node will show a toolbar button
	//has some tricks.
	//by default for a category will show the subcategories
	//but will show the sisters categories too.
	this.categoryNavigatorToolbarUpdate = function(aCategory) {
		var container = this.getElement('toolbar-category-navigator-container');

		this.removeChilds(container);

		var aCategoryNodes = aCategory.split('/');
		var path = '';
		if (aCategory != '') {
			for (var id = 0;id<aCategoryNodes.length;id++) {
				path += aCategoryNodes[id] + '/';

				var toolbarbutton = this.create('toolbarbutton');
				toolbarbutton.setAttribute('type', 'menu');
				toolbarbutton.setAttribute('label', this.categoryTitle(aCategoryNodes[id]));
				toolbarbutton.setAttribute('context', 'ODPExtension-from-category');
				toolbarbutton.setAttribute('onclick', 'if(event.button==1 && event.originalTarget == this)ODPExtension.categoryBrowserClick(event)'); //only allows middle click on the toobalbutton to open the category in a new tab, that's all
				toolbarbutton.setAttribute('value', path.replace(/\/$/, ''));

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
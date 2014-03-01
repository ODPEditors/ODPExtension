(function() {
	//This handle the click on the From category menu and lanches the category browser if no category was found

	/*
			DONT FORGET TO SET THIS VARS WHEN CALLING THIS FUNCTION:
				If the command comes from a menu the menu should be closed first. ( unless the command is for context menu ), if not the category browser will not popups
				ODPExtension.fromCategoryClickType = 'single';//the click type single (onecategory) or multiple for many categories
				ODPExtension.fromCategorySelectedCategory = '';//clean previous selected category when single
				ODPExtension.fromCategorySelectedCategories = [];//cleans previous selected categories when multiple
		*/
	this.fromCategoryClick = function(aEvent) {
		//this.dump('fromCategoryClick');

		var item = aEvent.originalTarget;

		//this.dump('fromCategoryClick:action:'+item.getAttribute('action'));
		//this.dump('fromCategoryClick:fromCategorySelectedCategory:'+this.fromCategorySelectedCategory);
		//this.dump('fromCategoryClick:fromCategorySelectedCategory:'+this.fromCategorySelectedCategories);

		var aCategories = [];

		this.fromCategoryAction = item.getAttribute('action');

		if (item.hasAttribute('secondary'))
			this.fromCategorySecondaryValue = item.getAttribute('secondary');
		else
			this.fromCategorySecondaryValue = '';

		//if the click come from a popup node, toolbarbutton or click on the category browser
		if (document.popupNode && document.popupNode.hasAttribute('value') && this.categoryGetFromURL(document.popupNode.getAttribute('value')) != '') {
			//this.dump('popupNode');

			//this.dump('popup node:'+document.popupNode.getAttribute('value'))
			this.fromCategorySelectedCategory = this.categoryGetFromURL(document.popupNode.getAttribute('value'));
			this.closeMenus(document.popupNode);
		} else {
			//this.dump('else');
			if (this.fromCategoryAction.indexOf('command_') == -1) {
				//this.dump('command_');
				if (this.fromCategorySelectedCategory == '' && this.fromCategorySelectedCategories.length === 0) {
					//this.dump('no categor');
					//this.dump('no category');
					//hide the popups
					this.fromCategoryHideContextMenus();
					this.getElement('from-category').hidePopup();
					this.getElement('extension-icon-context').hidePopup();
					//no info about category, shsould open the category browser
					this.categoryBrowserOpen();
					//this.dump('open poiup categor');
					return;
				}
			}
		}
		//this.dump('fromCategoryCommand');
		//action and value set, hide the popups
		this.fromCategoryHideContextMenus();
		this.getElement('from-category').hidePopup();
		this.getElement('extension-icon-context').hidePopup();

		//do the actions
		this.fromCategoryCommand(aEvent);

	}
	return null;

}).apply(ODPExtension);
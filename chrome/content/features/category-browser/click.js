(function() {

	//handle the clicks on the category browser
	this.categoryBrowserClick = function(aEvent) {
		//this.dump('categoryBrowserClick');
		/*
			aEvent.originalTarget = the current item that was clicked, can be a menu, menuitem, or toolbarbutton
			aEvent.currentTarget = the original item  where this "onclick" event was attached

			look at the names "originalTarget" and "currentTarget" seems to be reverse eh! don't drink while writting standars!!
		*/

		var item = aEvent.originalTarget;


		//saving the category to give priority

		if (item.hasAttribute('value'))
			this.categoryHistoryInsert(item.getAttribute('value'), 'categoryBrowserClick', this.date());


		if (!item.hasAttribute('value')) {
			//dont close the menu if the clicked target do not contains a value
			//this.dump('click!!+!item.hasAttribute(value)');
			//this.stopEvent(aEvent);
			//don't show the context menu if there is no category selected
			if (aEvent.button == 2)
				this.stopEvent(aEvent);
		} else if (aEvent.button == 2) {
			//the contextual menu will open
			//this.dump('click!!+aEvent.button+2');
		}
		//deafult action is copy to clipboard
		else if (aEvent.button == 0 || (!aEvent.button && aEvent.type == 'command')) {
			//this.dump('click!!+aEvent.button+0');
			//when user press click + ctrl in the first level of the menu popup is requesting that the category should be removed from the menu
			//we first hide the element for the user, and when the popup is closed (onpopuphidding) the element is removed [ this is to avoid colission betewen the menu generator and the request of removal]

			if (aEvent.ctrlKey && item.parentNode == aEvent.currentTarget) {
				this.stopEvent(aEvent);

				//this.dump('click!!+aEvent.button+ctrl');
				this.categoryBrowserRemoveChilds[this.categoryBrowserRemoveChilds.length] = item;
				item.setAttribute('hidden', true);
				//remove the element from the database
				this.categoryHistoryDelete(item.getAttribute('value'));
				//this.dump('click!!+aEvent.button+ctrl:tagname'+item.tagName);
				//when a "menuitem" is clicked the popuphide it selfs and we here want the popup open
				if (this.tagName(item) == 'menuitem') {
					aEvent.currentTarget.hidePopup();
					aEvent.currentTarget.showPopup();
				} else {
					//this.dump('click!!+aEvent.button+ctrl:tagname'+item.tagName);
				}
			} else {
				//this.dump('click!!+aEvent.button+this.copyToClipboard');

				if (this.fromCategoryAction != '') {
					this.fromCategorySelectedCategory = item.getAttribute('value');
					this.fromCategoryClickType = 'single';
					this.fromCategoryCommand();
				} else {
					this.copyToClipboard(item.getAttribute('value'));
				}
				//when a "menu" is clicked the popup don't close it self
				aEvent.currentTarget.hidePopup();
			}
		} else if (aEvent.button == 1) {
			//this.dump('click!!+aEvent.button+1+!=');
			this.openURL(this.categoryGetURL(item.getAttribute('value')), true, false, true);

			//if the click is on the toolbar this will fail because is not a popup
			try {
				aEvent.currentTarget.hidePopup();
			} catch (e) { /*shhhh*/ }
		} else //just in case
		{
			//this.dump('click!!+dont know:aEvent.button:'+aEvent.button+':aEvent.type:'+aEvent.type);
			//this.dump('click!!+dont know');
			this.stopEvent(aEvent);
		}
	}
	return null;

}).apply(ODPExtension);
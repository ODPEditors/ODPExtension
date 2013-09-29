(function() {

	//replaces a menuitem that is equivalent to a category, for a menu with the category as label and as childs the subcategories
	//very cool!!!
	this.categoryBrowserNavigate = function(aEvent) {
		var item = aEvent.originalTarget; //the hovered menuitem

		var tagName = this.tagName(item);

		if ((tagName == 'xul:menu' || tagName == 'menu' || tagName == 'menuitem') && item.hasAttribute('value')) {
			if (aEvent.type == 'mouseover')
				item.setAttribute('isFocused', true);
			else if (aEvent.type == 'mouseout')
				item.removeAttribute('isFocused');

			if (!item.hasAttribute('done')) {
				if (aEvent.type == 'mouseover' && !item.hasAttribute('retrieving')) {
					item.setAttribute('retrieving', true);
					var aCategory = item.getAttribute('value');
					//if the overed category is test or bookmarks, wait a little more to see if the user has mouseout the menuitem
					//test and bookmarks check this will avoid innecesary requests to the editor servers
					if (!this.shared.categories.txt.exists || aCategory.indexOf('Test') === 0 || aCategory.indexOf('Bookmarks') === 0)
						item.interval = setTimeout(function() {
							ODPExtension.categoryBrowserNavigateRequestCategories(item);
						}, 300);
					else
						item.interval = setTimeout(function() {
							ODPExtension.categoryBrowserNavigateRequestCategories(item);
						}, 190);
				} else if (aEvent.type == 'mouseout') {
					clearTimeout(item.interval);
					item.removeAttribute('retrieving');
				}
			}
			/*else if((tagName == 'menu'  || tagName == 'xul:menu' ) && (item.hasAttribute('isFocused')) )
			{
				//item.firstChild.openPopup(item, 'end_before');
			}*/
		}
		return true;
	}

	return null;

}).apply(ODPExtension);
(function() {

	//when the category browser is closed we look into the categoires that the user has requested to be removed
	//also we remove excess of item in the menu
	this.categoryBrowserOnPopupHidden = function(aEvent) {
		if (aEvent.originalTarget != aEvent.currentTarget)
			return

		for (var id in this.categoryBrowserRemoveChilds) {
			var item = this.categoryBrowserRemoveChilds[id];

			//allow to re-add the category again
			if (item.hasAttribute('value'))
				this.categoryBrowserCategories[item.getAttribute('value')] = false;

			this.removeElement(item);
			//this.dump('element removed')
		}
		this.categoryBrowserRemoveChilds = [];

		//removing excess of items in the menu
		var toRemove = [];
		var item = aEvent.currentTarget;
		for (var i = 0; i < item.childNodes.length; i++) {
			if (i < 300 || item.childNodes[i].hasAttribute('anonid'))
				continue;
			toRemove[toRemove.length] = item.childNodes[i];

			//allow to re-add the category again
			if (item.childNodes[i].hasAttribute('value'))
				this.categoryBrowserCategories[item.childNodes[i].getAttribute('value')] = false;
		}
		for (var i = 0; i < toRemove.length; i++)
			this.removeElement(toRemove[i]);
	}
	return null;

}).apply(ODPExtension);
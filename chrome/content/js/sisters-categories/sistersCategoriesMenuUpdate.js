(function()
{

	//toolbar button that will show all the categories at the same level
	//finds all the categories at the same level

	this.sistersCategoriesMenuUpdate = function(currentPopup, aEvent)
	{
		//this.dump('updating sisters categories');
		//only popupshowing for the original target
		if(aEvent.currentTarget != aEvent.originalTarget)
			return;

		this.removeChilds(currentPopup);

		if(currentPopup.parentNode.getAttribute('nocategories')=='true')
		{
			this.stopEvent(aEvent);//this is to avoid the menupopup to be openen when no results found!
			return;
		}

		var aCategory = currentPopup.getAttribute('value');
		var aCategoryNodes = aCategory.split('/');

		//find all the categories at the same level restricted to the first two mothers example ^Regional/Asia/[^/]+/[^/]+/...[^/]+/Arts$
		var aQuery = '^';
			aQuery += aCategoryNodes.shift()+'/';
			aQuery += aCategoryNodes.shift()+'/';
		var aChildCategory = aCategoryNodes.pop();

		for(var id in aCategoryNodes)
			aQuery += '[^/]+/';
		aQuery += aChildCategory;
		aQuery += '$';
		var somethingFound = false;
		var aResult = this.categoriesTXTQuery(aQuery, null, aCategory);
		for(var id in aResult.categories)
		{
			if(aResult.categories[id] != aCategory)
			{
			var add = this.create("menuitem");
				add.setAttribute("label", this.categoryAbbreviate(aResult.categories[id]));
				add.setAttribute("value", aResult.categories[id]);
				currentPopup.appendChild(add);
				somethingFound = true;
			}
		}
		if(!somethingFound)
		{
			this.stopEvent(aEvent);//this is to avoid the menupopup to be openen when no results found!
			if(currentPopup.parentNode.hasAttribute('nocategories'))
				 currentPopup.parentNode.setAttribute('nocategories', true);
			 this.shared.categories.sisters.focused.no[this.shared.categories.sisters.focused.no.length] = aCategory;
		}
	}
	return null;

}).apply(ODPExtension);

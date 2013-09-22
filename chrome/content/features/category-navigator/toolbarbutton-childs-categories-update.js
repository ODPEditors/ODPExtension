(function()
{

	//finds all parent categories with the same name
	this.categoryNavigatorToolbarbuttonChildsCategoriesUpdate = function(currentPopup, aEvent)
	{
		//only popupshowing for the original target
		if(aEvent.currentTarget != aEvent.originalTarget || currentPopup.hasAttribute('done'))//check if this menu was builded
			return;

		//this.dump('categoryNavigatorToolbarbuttonParentCategoriesUpdate');

		//removeAttribute('onpopupshowing') is not working!.. probably because is a listener
		currentPopup.setAttribute('done', true);

		var aCategory = currentPopup.getAttribute('value');

		//this.dump('obtener todos los parientes de ¿+'+aCategory);

		var aCategoryNodes = aCategory.split('/');
		var aCategoryLastChild = this.categoryGetLastChildName(aCategory);
		var aCategoryLastTwoChild = this.categoryGetLastTwoChildName(aCategory);
		var aCategoryParent = this.categoryGetParent(aCategory);
		//this.dump(aCategoryParent);
		//first finds all the paths
			var aQueries = aCategoryParent+'/.*?'+aCategoryLastChild+'([^/]*)?$';

		//	this.dump(aQueries);

			//aQueries = this.arrayUnique(aQueries);
			var somethingFound = false;

			currentPopup.appendChild(this.create('menuseparator'));

		//search the database, push the items
				//this.dump(aQueries);
				var aResult = this.categoriesTXTQuery(aQueries, null, aCategoryParent);
				for(var id in aResult.categories)
				{
					if(aCategory != aResult.categories[id])
					{
						//this.dump(aResult.categories[id]);
						var add = this.create("menuitem");
							add.setAttribute("label", this.categoryAbbreviate(aResult.categories[id]));
							add.setAttribute("value", aResult.categories[id]);
							currentPopup.appendChild(add);
						somethingFound = true;
					}
				}
		//disabling the toolbarbutton because there is no results
			if(!somethingFound)
			{
				this.shared.categories.childs.no[aCategory] = true;
				this.stopEvent(aEvent);
				currentPopup.parentNode.setAttribute('disabled', true);
			}
	}
	return null;

}).apply(ODPExtension);

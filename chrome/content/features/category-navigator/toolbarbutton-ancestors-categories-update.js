(function()
{

	//finds all parent categories with the same name
	this.categoryNavigatorToolbarbuttonAncestorsCategoriesUpdate = function(currentPopup, aEvent)
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
		//	this.dump(aCategoryNodes[0]+'/'+aCategoryNodes[1]);

		//first finds all the paths
			var aQueries = [];
			var path = '^';
				for(var id in aCategoryNodes)
				{
					if(id<1)
					{
						path += aCategoryNodes[id]+'/'
						continue;
					}
					//skiping this same category for the one child search
					if(id==aCategoryNodes.length-2)
						break;
					path += aCategoryNodes[id]+'/'
					aQueries[aQueries.length] = path+'[^/]*'+aCategoryLastChild+'[^/]*$';

					//skiping this same category for the two childs search
					if(id==aCategoryNodes.length-3){}
					else
						aQueries[aQueries.length] = path+'[^/]*'+aCategoryLastTwoChild+'[^/]*$';
				//	this.dump(aQueries[aQueries.length-1])
					//this.dump(aQueries[aQueries.length-2])
				}
			aQueries = this.arrayUnique(aQueries);
			var somethingFound = false;

			currentPopup.appendChild(this.create('menuseparator'));

		//search the database, push the items
			for(var id in aQueries)
			{
				var aResult = this.categoriesTXTQuery(aQueries[id], null, aCategoryNodes[0]+'/'+aCategoryNodes[1]);
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
			}
		//disabling the toolbarbutton because there is no results
			if(!somethingFound)
			{
				this.shared.categories.ancestors.no[aCategory] = true;
				this.stopEvent(aEvent);
				currentPopup.parentNode.setAttribute('disabled', true);
			}
	}
	return null;

}).apply(ODPExtension);

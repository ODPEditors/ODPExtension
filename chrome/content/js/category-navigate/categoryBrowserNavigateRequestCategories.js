(function()
{

	//obtains the categories for contruct the navegables menus
	this.categoryBrowserNavigateRequestCategories = function(item)
	{
		item.setAttribute('done', true);
		item.removeAttribute('retrieving');

		var aCategory = item.getAttribute('value');

		//private categories will read private odp urls
		//public categoires will read public odp urls
		//will avoid to read public pages if the categories txt database exists
		//also... if the category is exactly world or regional make a request is much better for the performance of the browser
		//also bookmarks is not in the categories txt database
		if(!this.shared.categories.txt.exists || aCategory.indexOf('Test') === 0 || aCategory.indexOf('Bookmarks') === 0 || aCategory === 'World' || aCategory === 'Regional')
		{
			var Requester = new XMLHttpRequest();
				Requester.onload = function(aEvent)
				{
					if(
					   Requester.status != '200' ||
					   Requester.responseText == null ||
					   Requester.responseText == ''
					   )
					{
						item.setAttribute('label', item.getAttribute('label')+'/');
					}
					else
					{
						var aCategories = ODPExtension.categoryParserGetCategorySubcategories(Requester.responseText, ODPExtension.categoryGetURL(aCategory));
						if(aCategories.length == 0)
						{
							item.setAttribute('label', item.getAttribute('label')+'/');
						}
						else
						{
							ODPExtension.categoryBrowserNavigateBuildSubMenu(item, aCategories);
						}
					}
				};
				Requester.open("GET", this.categoryGetURL(aCategory), true);
				Requester.setRequestHeader("Cache-Control", "no-cache");
				Requester.setRequestHeader("Pragma", "no-cache");
				Requester.send(null);
		}
		else
		{
			var aResult = this.categoriesTXTQuery('^'+aCategory+'/[^/]+$', null, aCategory);

			if(aResult.count == 0)
			{
				item.setAttribute('label', item.getAttribute('label')+'/');
			}
			else
			{
				ODPExtension.categoryBrowserNavigateBuildSubMenu(item, aResult.categories);
			}
		}
	}

	return null;

}).apply(ODPExtension);

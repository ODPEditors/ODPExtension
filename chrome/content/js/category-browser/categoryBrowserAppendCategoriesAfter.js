(function()
{
	
	//appends categories to the category browser below aPreviousNode
	this.categoryBrowserAppendCategoriesAfter = function(aCategories, aPreviousNode, aTemporalNode)
	{
		for(var id in aCategories)
		{
			//avoiding appending the same category twice
			if(!this.categoryBrowserCategories[aCategories[id]] || aTemporalNode)
			{
				//allows these categories to appear on search results
				if(!aTemporalNode)
					this.categoryBrowserCategories[aCategories[id]] = true;
				var add = this.create("menuitem");
					add.setAttribute("label", this.categoryAbbreviate(aCategories[id]));
					add.setAttribute("value", aCategories[id]);
					if(aTemporalNode)
						add.setAttribute("temporal", true);
				this.moveNodeBelow(add, aPreviousNode);
			}
		}
	}

	return null;

}).apply(ODPExtension);

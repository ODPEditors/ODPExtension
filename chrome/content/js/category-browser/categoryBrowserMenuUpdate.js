(function()
{
	
	//empties and recreate the category browser menu appending the categories that the user has "locked"
	this.categoryBrowserMenuUpdate = function()
	{
		//this.dump('categoryBrowserMenuUpdate', true);
			//to avoid adding of the same category twice or more 
			this.categoryBrowserCategories = [];
			this.categoryBrowserRemoveChilds = [];

			this.removeChilds(this.getElement('category-browser'));

		//locked categories
		
			var aTemp = this.preferenceGet('category.browser').split('\n');
			var aCategories = [];
			var aCategory = '';
			for(var id in aTemp)
			{
				if((aCategory = this.categoryGetFromURL(aTemp[id])) != '')
				{
					aCategories[aCategories.length] = aCategory;
				}
			}
			aCategories = this.arrayUnique(aCategories).sort(this.sortLocale).reverse();
			if(aCategories.length > 0)
			{
				this.categoryBrowserAppendCategoriesAfter(aCategories, this.getElement('category-browser-categories-locked'));
				this.getElement('category-browser-categories-locked').setAttribute('hidden', false);
			}
			else
			{
				this.getElement('category-browser-categories-locked').setAttribute('hidden', true);
			}
			
		//categories history
		
			aCategories = [];
			var row;
			var i=0;
			if(this.isMinFirefox35)
			{
				for(;row = this.db.fetchObjects(this.categoryHistoryGetMostVisitedLimit);i++)
				{
					aCategories[i] = row.categories_history_category;
				}
			}
			
			if(i>0)
			{
				this.categoryBrowserAppendCategoriesAfter(aCategories.reverse(), this.getElement('category-browser-categories-history'));
				this.getElement('category-browser-categories-history').setAttribute('hidden', false);
			}
			else
			{
				this.getElement('category-browser-categories-history').setAttribute('hidden', true);
			}
	}
	return null;

}).apply(ODPExtension);

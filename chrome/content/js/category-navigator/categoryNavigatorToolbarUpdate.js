(function()
{

	//this is the functino that builds the category navigator( or ODP breadcumb )
	//for each category node will show a toolbar button 
	//has some tricks.
	//by default for a category will show the subcategories
	//but will show the sisters categories too.
	//and for the last node will show all the Ancestors nodes that contains the same name
	//and also will add another toolbar button  with the childs categories with the same name, ah! very useful!
	this.categoryNavigatorToolbarUpdate = function(aCategory)
	{
		var container = this.getElement('toolbar-category-navigator-container');

		this.removeChilds(container);

		var aCategoryNodes = aCategory.split('/');
		var path = '';
		if(aCategory != '')
		{
			for(var id in aCategoryNodes)
			{
				path += aCategoryNodes[id]+'/';
				
				if(aCategoryNodes.length-1 == id && aCategoryNodes.length>1)
				{
					//Last category on list
						var toolbarbutton = this.create('toolbarbutton');
							toolbarbutton.setAttribute('type', 'menu');
							toolbarbutton.setAttribute('label', this.categoryTitle(aCategoryNodes[id]));
							toolbarbutton.setAttribute('context', 'ODPExtension-from-category');
							toolbarbutton.setAttribute('onclick', 'if(event.button==1 && event.originalTarget == this)ODPExtension.categoryBrowserClick(event)');//only allows middle click on the toobalbutton to open the category in a new tab, that's all
							toolbarbutton.setAttribute('value', path.replace(/\/$/, ''));
	
						var popup = this.create('menupopup');
							popup.setAttribute('value', aCategory);
							if(this.shared.categories.sisters.no[aCategory])//cached result
								toolbarbutton.setAttribute('disabled', true);
		
							popup.setAttribute('onpopupshowing', 'ODPExtension.categoryNavigatorToolbarbuttonUpdate(this, event)');
							popup.setAttribute('aCategoryIndex', id);
							//makes the category navegable and filterable by setting a few attributes
							this.categoryBrowserNavigateMakeMenuPopupNavegable(popup);
							toolbarbutton.appendChild(popup);
							container.appendChild(toolbarbutton);
					
					if(aCategory.indexOf('Bookmarks') !== 0 && aCategory.indexOf('Test') !== 0)
					{
					//Ancestors
						var toolbarbutton = this.create('toolbarbutton');
							toolbarbutton.setAttribute('type', 'menu');
							toolbarbutton.setAttribute('label', this.categoryTitle(aCategoryNodes[id]));
							toolbarbutton.setAttribute('value', aCategoryNodes[id]);
							toolbarbutton.setAttribute('context', 'ODPExtension-from-category');
							toolbarbutton.setAttribute('onclick', 'if(event.button==1 && event.originalTarget == this)ODPExtension.categoryBrowserClick(event)');//only allows middle click on the toobalbutton to open the category in a new tab, that's all
							toolbarbutton.setAttribute('value', path.replace(/\/$/, ''));
		
							var popup = this.create('menupopup');
								popup.setAttribute('value', aCategory);
								popup.setAttribute('onpopupshowing', 'ODPExtension.categoryNavigatorToolbarbuttonAncestorsCategoriesUpdate(this, event)');
								toolbarbutton.setAttribute('label', '"'+this.categoryTitle(aCategoryNodes[id])+'" Similar Ancestors');
								//if no result were found in the last query
								if(this.shared.categories.ancestors.no[aCategory] || id < 2)//cached result
									toolbarbutton.setAttribute('disabled', true);
								
							//makes the category navegable and filterable by setting a few attributes
							this.categoryBrowserNavigateMakeMenuPopupNavegable(popup);
							toolbarbutton.appendChild(popup);
							container.appendChild(toolbarbutton);
							
					//childs
						var toolbarbutton = this.create('toolbarbutton');
							toolbarbutton.setAttribute('type', 'menu');
							toolbarbutton.setAttribute('label', this.categoryTitle(aCategoryNodes[id]));
							toolbarbutton.setAttribute('context', 'ODPExtension-from-category');
							toolbarbutton.setAttribute('onclick', 'if(event.button==1 && event.originalTarget == this)ODPExtension.categoryBrowserClick(event)');//only allows middle click on the toobalbutton to open the category in a new tab, that's all
							toolbarbutton.setAttribute('value', path.replace(/\/$/, ''));
	
						var popup = this.create('menupopup');
							popup.setAttribute('value', aCategory);
							popup.setAttribute('onpopupshowing', 'ODPExtension.categoryNavigatorToolbarbuttonChildsCategoriesUpdate(this, event)');
							toolbarbutton.setAttribute('label', '"'+this.categoryTitle(aCategoryNodes[id])+'" Similar Childs');
							//if no result were found in the last query
							if(this.shared.categories.childs.no[aCategory])//cached result
								toolbarbutton.setAttribute('disabled', true);
								
							//makes the category navegable and filterable by setting a few attributes
							this.categoryBrowserNavigateMakeMenuPopupNavegable(popup);
							toolbarbutton.appendChild(popup);
							container.appendChild(toolbarbutton);
					}
				}
				else
				{
					var toolbarbutton = this.create('toolbarbutton');
						toolbarbutton.setAttribute('type', 'menu');
						toolbarbutton.setAttribute('label', this.categoryTitle(aCategoryNodes[id]));
						toolbarbutton.setAttribute('context', 'ODPExtension-from-category');
						toolbarbutton.setAttribute('onclick', 'if(event.button==1 && event.originalTarget == this)ODPExtension.categoryBrowserClick(event)');//only allows middle click on the toobalbutton to open the category in a new tab, that's all
						toolbarbutton.setAttribute('value', path.replace(/\/$/, ''));

					var popup = this.create('menupopup');
						popup.setAttribute('value', aCategory);
						if(this.shared.categories.sisters.no[aCategory])//cached result
							toolbarbutton.setAttribute('disabled', true);
	
						popup.setAttribute('onpopupshowing', 'ODPExtension.categoryNavigatorToolbarbuttonUpdate(this, event)');
						popup.setAttribute('aCategoryIndex', id);
					//makes the category navegable and filterable by setting a few attributes
					this.categoryBrowserNavigateMakeMenuPopupNavegable(popup);
					toolbarbutton.appendChild(popup);
					container.appendChild(toolbarbutton);
				}
			}
		}
		else
		{
			var description = this.create('toolbarbutton');
				description.setAttribute('label', this.getString('no.categories.found.to.show.in.the.category.navigator'));
				description.setAttribute('class', 'ODPExtension-description');
				container.appendChild(description);
		}
	}

	return null;

}).apply(ODPExtension);

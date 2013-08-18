(function()
{

			var debugingThisFile = true;

		//checks if the focused tab has a valid category and acomodate the UI for that category
		
			this.setFocusedCategory = function(forceRefresh)
			{
				var focusedCategory = this.categoryGetFocused();
				
				//if focusedCategory != '' but also avoid to rebuild the menus if the category is the same as the last focused
				//but allow forced refresh, example when the user allowed a button (that appareance or content of the button depends on focused category) to appear from a preference 
				if(focusedCategory != '' && (forceRefresh || focusedCategory != this.focusedCategory))
				{
					this.focusedCategory = focusedCategory;
					
					if(this.isMinFirefox35)
					{
						//saving the category to the table of categories history
						this.categoryHistoryInsert(focusedCategory, this.focusedURL, this.date());
					}
					
					if(this.shared.categories.txt.exists)
					{
						//toolbar buttons
							//sisters categories
							if(this.getElement('toolbarbutton-sisters-categories'))
							{
								if(this.inArray(this.shared.categories.sisters.focused.no, focusedCategory))
									this.getElement('toolbarbutton-sisters-categories').setAttribute('nocategories', true);
								else
									this.getElement('toolbarbutton-sisters-categories').setAttribute('nocategories', false);
								this.getElement('toolbarbutton-sisters-categories').firstChild.setAttribute('value', focusedCategory);
							}

						//toolbars
							//category navigator
									//update toolbar contents
									if(!this.getElement('toolbar-category-navigator').collapsed)
										this.categoryNavigatorToolbarUpdate(focusedCategory);
					}
					if(!this.inArray(this.shared.categories.session.categories, focusedCategory))
						this.shared.categories.session.categories[this.shared.categories.session.categories.length] = focusedCategory;
				}
				else if(focusedCategory == '')
				{
					this.focusedCategory = '';
					
					if(this.shared.categories.txt.exists)
					{
						//toolbar buttons
							//sisters categories
							if(this.getElement('toolbarbutton-sisters-categories'))
								this.getElement('toolbarbutton-sisters-categories').setAttribute('nocategories', true);
								
						//toolbars
							//category navigator
							if(!this.getElement('toolbar-category-navigator').collapsed)
								this.categoryNavigatorToolbarUpdate(focusedCategory);
								//this.getElement('toolbar-category-navigator').setAttribute('hidden', true);
					}
					
				}
			}

	return null;

}).apply(ODPExtension);

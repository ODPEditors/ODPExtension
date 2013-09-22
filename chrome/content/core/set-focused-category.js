(function()
{

			var debugingThisFile = true;

			//checks if the focused tab has a valid category and acomodate the UI for that category
			this.setFocusedCategory = function()
			{
				var focusedCategory = this.categoryGetFocused();

				if(focusedCategory != this.focusedCategory)
				{
					this.focusedCategory = focusedCategory;

					this.dispatchEvent('focusedCategoryChange', focusedCategory);

					//saving the category to the table of categories history
					this.categoryHistoryInsert(focusedCategory, this.focusedURL, this.date());

					if(this.shared.categories.txt.exists)
					{
						//toolbars
							//category navigator
									//update toolbar contents
									if(!this.getElement('toolbar-category-navigator').collapsed)
										this.categoryNavigatorToolbarUpdate(focusedCategory);
					}
					if(focusedCategory!= '' && !this.inArray(this.shared.categories.session.categories, focusedCategory))
						this.shared.categories.session.categories[this.shared.categories.session.categories.length] = focusedCategory;
				}

			}

	return null;

}).apply(ODPExtension);

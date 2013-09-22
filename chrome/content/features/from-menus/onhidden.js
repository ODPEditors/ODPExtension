(function()
{
			//cancels for a while the appear of the auto-popup
			this.fromCategoryOnHidden = function()
			{
				//don't open the auto-popup again for a while
				//this avoid when the user quickly click again the page, and the text with a valid category still is selected

				if(this.fromCategoryAutoPopupPreventAppearAgain)
				{
					this.fromCategoryCanceledAutoPopup = true;

					clearTimeout(this.fromCategoryCanceledAutoPopupTimeout);

					this.fromCategoryCanceledAutoPopupTimeout = setTimeout(function(){
										ODPExtension.fromCategoryCanceledAutoPopup=false;
										ODPExtension.fromCategoryAutoPopupPreventAppearAgain=false;
										}, 800);
				}
			}
	return null;

}).apply(ODPExtension);

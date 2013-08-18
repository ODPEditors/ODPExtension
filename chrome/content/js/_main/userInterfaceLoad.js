(function()
{

			var debugingThisFile = true;

		//setups some elements

			this.userInterfaceLoad = function()
			{
				//this.dump('userInterfaceLoad', debugingThisFile);

				//setting local category finder to autocomplete based on browser detection
					this.setAutocomplete(this.getElement('local-category-finder-textbox'));

				//context menu
					this.tabContextMenu().appendChild(this.getElement('tab-context-from-category'));
			}

	return null;

}).apply(ODPExtension);

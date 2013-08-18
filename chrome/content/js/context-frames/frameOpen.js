(function()
{

		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

		//opens the frames from the context menu
		
			this.frameOpen = function(aEvent)
			{
				this.tabOpenCheckForBehavior(aEvent.originalTarget.getAttribute('value'), aEvent, 'frame.from.menu');
			}
			
			this.frameOpenSelected = function(aEvent)
			{
				this.tabOpenCheckForBehavior(this.string(gContextMenu.target.ownerDocument.location.href), aEvent, 'frame.selected');
			}
	return null;

}).apply(ODPExtension);

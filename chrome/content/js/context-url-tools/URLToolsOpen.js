(function()
{

		//sets debuging on/off for this JavaScript file

			var debugingThisFile = false;

		//opens a URL Tool

			this.URLToolsOpen = function(aEvent)
			{
					var item = aEvent.originalTarget;
					if(!item.hasAttribute('value'))
						return;

					//ok, array here too
					var urlTools = [];
					var urlTool = item.getAttribute('value');
					if(urlTool == 'all')
					{
						for(var i=0;i<item.parentNode.childNodes.length;i++)
						{
							if(item.parentNode.childNodes[i].hasAttribute('value') &&  item.parentNode.childNodes[i].getAttribute('value') != 'all')
								urlTools[urlTools.length] = item.parentNode.childNodes[i].getAttribute('value');
						}
					}
					else
					{
						urlTools[urlTools.length] = urlTool;
					}
				//selected links
					var links = this.getSelectedLinksURLs();

				//selected link
					if(links.length < 1)
					{
						if(this.getSelectedLinkURL() !='')
							links[links.length] = this.getSelectedLinkURL();
					}

				//selected text
					if(links.length < 1)
					{
						var selected = this.getSelectedText(false);
						if(selected!='')
							links[links.length] = selected;
					}

				//focused location
					if(links.length < 1)
						links[links.length] = this.focusedURL;

				//fix for when there is many urls to open but the user has not checked open in new tab on tab behaviour
				//if it is no checked the user will open all the urls in the same tab causing only the last one to be displayed
				links = this.arrayUnique(links);
				if(links.length > 1)
					aEvent.button = 1;

				//open the links
				var tools = [];
					for(var urlTool in urlTools)
					{
						for(var id in links)
						{
							if(urlTools[urlTool].indexOf('command_') === 0)
							{
								this.extensionIconClickCommand(urlTools[urlTool].replace('command_', ''));
								break;
							}
							else if(links[id]!='')
							{
								tools[tools.length] = this.URLToolsApply(urlTools[urlTool], links[id]);
							}
						}
					}

					tools = this.arrayUnique(tools);
					for(var id in tools)
						this.tabOpenCheckForBehavior(tools[id], aEvent, 'url.tools');

			}
	return null;

}).apply(ODPExtension);

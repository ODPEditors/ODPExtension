(function()
{
			//switch the selected site, categories, titles and urls by moving the mouse wheel

			this.panelInformativeRelatedWriteSelectedSite = function(aSelected)
			{
				for(var i=0;i<32;i++)
				{
					this.getElement('panel-related-titles-'+i).removeAttribute('selected');
					this.getElement('panel-related-uris-'+i).removeAttribute('selected');
					this.getElement('panel-related-categories-'+i).removeAttribute('selected');
				}
				this.getElement('panel-related-titles-'+aSelected).setAttribute('selected', true);
				this.getElement('panel-related-uris-'+aSelected).setAttribute('selected', true);
				this.getElement('panel-related-categories-'+aSelected).setAttribute('selected', true);
			}
			this.panelInformativeSwitchSelectedSite = function(aEvent)
			{
				ODPExtension.stopEvent(aEvent);//dom scroll fire for every element hovered

			//	ODPExtension.dump('panelInformativeSwitchSelectedSite:'+aEvent.originalTarget.tagName);
				var delta = false;
				if (aEvent.wheelDelta)
					delta = aEvent.wheelDelta/120;
				else if (aEvent.detail)
					delta = -aEvent.detail/3;

				if(delta)
				{
					if(delta > 0)
					{
						var aSelected = ODPExtension.getElement('panel-header').getAttribute('panel-header-selected');
							aSelected--;
							if(ODPExtension.listingInformationData[aSelected] == null)
							{
								var newSelected = (ODPExtension.listingInformationData.length)-1;
								ODPExtension.panelInformativeRelatedWriteSelectedSite(newSelected);
								ODPExtension.panelInformationBuildHeader(newSelected);
							}
							else
							{
								ODPExtension.panelInformativeRelatedWriteSelectedSite(aSelected);
								ODPExtension.panelInformationBuildHeader(aSelected);
							}
					}
					else
					{
						var aSelected = ODPExtension.getElement('panel-header').getAttribute('panel-header-selected');
							aSelected++;
							if(ODPExtension.listingInformationData[aSelected] == null)
							{
								ODPExtension.panelInformativeRelatedWriteSelectedSite(0);
								ODPExtension.panelInformationBuildHeader(0);
							}
							else
							{
								ODPExtension.panelInformativeRelatedWriteSelectedSite(aSelected);
								ODPExtension.panelInformationBuildHeader(aSelected);
							}
					}
				}
			}


			this.panelInformativeSwitchSelectedRelated = function(aEvent)
			{
				var delta = false;
				if (aEvent.wheelDelta)
					delta = aEvent.wheelDelta/120;
				else if (aEvent.detail)
					delta = -aEvent.detail/3;

				if(delta)
				{
					var options = ['panel-related-titles', 'panel-related-uris', 'panel-related-categories'];
					var selected;
					if(delta > 0)
					{
						var aSelected = ODPExtension.getElement('panel-related').getAttribute('panel-related-selected');
						aSelected--;
						if(options[aSelected] == null)
							selected = options.length-1;
						else
							selected = aSelected;
					}
					else
					{
						var aSelected = ODPExtension.getElement('panel-related').getAttribute('panel-related-selected');
						aSelected++;
						if(options[aSelected] == null)
							selected = 0;
						else
							selected = aSelected;
					}
					for(var id in options)
					{
						ODPExtension.getElement(options[id]).setAttribute('hidden', true)
					}
					ODPExtension.getElement(options[selected]).setAttribute('hidden', false)

					ODPExtension.getElement('panel-related').setAttribute('panel-related-selected', selected);
				}
			}

	return null;

}).apply(ODPExtension);

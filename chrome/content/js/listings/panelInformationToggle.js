(function()
{
			
			//toggle the visibility of the panel
			
			this.panelInformationToggle = function(closed, saveStatus)
			{
				if(closed)
				{
					this.getElement('panel-subcontainer').setAttribute('hidden', false);
					this.getElement('panel-move').setAttribute('status', 'opened');
					if(saveStatus)
						this.preferenceSet('ui.informative.panel.closed', false);
				}
				else
				{
					this.getElement('panel-subcontainer').setAttribute('hidden', true);
					this.getElement('panel-move').setAttribute('status', 'closed');
					if(saveStatus)
						this.preferenceSet('ui.informative.panel.closed', true);
				}
			}

	return null;

}).apply(ODPExtension);

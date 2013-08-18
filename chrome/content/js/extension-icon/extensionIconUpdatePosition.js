(function()
{

		//update the position of the icon

			this.extensionIconUpdatePosition = function()
			{
				if(this.preferenceGet('ui.icon.position.no.icon'))
				{
					this.getElement('status-bar').setAttribute('hidden', true);
					this.getElement('extension-icon').setAttribute('hidden', true);
				}
				else if(this.preferenceGet('ui.icon.position.status.bar'))
				{
					this.getElement('extension-icon').setAttribute('hidden', false);
					this.getElement('status-bar').setAttribute('hidden', false);

					this.getElement('status-bar').appendChild(this.getElement('extension-icon'));
				}
				else
				{
					this.getElement('extension-icon').setAttribute('hidden', false);
					this.getElement('status-bar').setAttribute('hidden', true);

					this.getBrowserElement('urlbar-icons').appendChild(this.getElement('extension-icon'));
				}
			}
	return null;

}).apply(ODPExtension);

(function()
{

		//update the status of the icon

			this.extensionIconUpdateStatus = function()
			{
				var tooltip = this.getElement('extension-icon-tooltip-data');
				this.removeChilds(tooltip);
				var label = this.create('label');

				if(!this.preferenceGet('enabled'))
				{
					this.getElement('extension-icon').setAttribute('status', 'disabled');
					label.setAttribute('value', this.getString('disabled'));
				}
				else
				{
					var status = 'nada';

					if(this.cantLeakURL(this.focusedURL))
					{
						status = 'private';
						label.setAttribute('value', this.getString('private.url'));
					}
					else if(this.listingInformation != '')
					{
						status = this.listingInformation;
						if(status == 'error')
							label.setAttribute('value', this.getString('bad.response.from.data.server'));
						else
						{
							if(this.focusedCategory != '')
								label.setAttribute('value', this.categoryAbbreviate(this.focusedCategory));
							else
								label.setAttribute('value', this.listingInformationURL);
						}
					}
					else
					{
						if(this.focusedCategory != '')
							label.setAttribute('value', this.categoryAbbreviate(this.focusedCategory));
						else
							label.setAttribute('value', this.decodeUTF8Recursive(this.focusedURL));
					}

					if(this.documentHasFrameSet())
					{
						status = status+'-frameset';
						var labelFrameSet = this.create('label');
							labelFrameSet.setAttribute('value', this.getString('document.under.frameset'));
							tooltip.appendChild(labelFrameSet);
					}

					this.getElement('extension-icon').setAttribute('status', status);
				}
				tooltip.appendChild(label);
			}
	return null;

}).apply(ODPExtension);

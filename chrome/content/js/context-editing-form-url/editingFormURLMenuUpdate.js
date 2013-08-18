(function()
{

		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

		//hides or shows the "formater" content menu if the focused domain is editors.dmoz.org and if the "edit URL" form exists

			this.editingFormURLMenuUpdate = function(aSubdomain)
			{
				//if the rigth clicked document is framed..
				if(gContextMenu && gContextMenu.inFrame)
				{
					var aSubdomain =  this.getSubdomainFromURL(this.string(gContextMenu.target.ownerDocument.location.href));
					var aDoc =  gContextMenu.target.ownerDocument;
				}
				else
				{
					var aDoc =  this.documentGetFocused();
				}

				if((aSubdomain == 'editors.dmoz.org' || aSubdomain == 'www.dmoz.org' ) && this.editingFormURLExists(aDoc))
				{
					this.getElement('context-editing-form-url-formater').setAttribute('hidden', false);
				}
				else
				{
					this.getElement('context-editing-form-url-formater').setAttribute('hidden', true);
				}
			}
	return null;

}).apply(ODPExtension);

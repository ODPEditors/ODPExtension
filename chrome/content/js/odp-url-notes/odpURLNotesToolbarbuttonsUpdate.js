(function()
{

		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

		//hides or shows the toolbatbuttons (update,unreview,delete,options) when the user hits the edit url form

			this.odpURLNotesToolbarbuttonsUpdate = function(aSubdomain)
			{
				//when the location change we empty the cache of documents selected with multiple tab handler
				this.odpURLNotesMultipleTabHandlerSelectedDocuments = [];

				if((aSubdomain == 'editors.dmoz.org' || aSubdomain == 'www.dmoz.org' ) && this.editingFormURLExists(this.documentGetFocused()))
				{
					if(this.getElement('toolbarbutton-odp-url-notes-update'))
						this.getElement('toolbarbutton-odp-url-notes-update').setAttribute('hidden', false);
					if(this.getElement('toolbarbutton-odp-url-notes-unreview'))
						this.getElement('toolbarbutton-odp-url-notes-unreview').setAttribute('hidden', false);
					if(this.getElement('toolbarbutton-odp-url-notes-delete'))
						this.getElement('toolbarbutton-odp-url-notes-delete').setAttribute('hidden', false);
					if(this.getElement('toolbarbutton-odp-url-notes-notes'))
						this.getElement('toolbarbutton-odp-url-notes-notes').setAttribute('hidden', false);
					if(this.getElement('toolbarbutton-odp-url-notes-move-publish'))
						this.getElement('toolbarbutton-odp-url-notes-move-publish').setAttribute('hidden', false);
					if(this.getElement('toolbarbutton-odp-url-notes-move-unreview'))
						this.getElement('toolbarbutton-odp-url-notes-move-unreview').setAttribute('hidden', false);
					if(this.getElement('toolbarbutton-odp-url-notes-copy-publish'))
						this.getElement('toolbarbutton-odp-url-notes-copy-publish').setAttribute('hidden', false);
					if(this.getElement('toolbarbutton-odp-url-notes-copy-unreview'))
						this.getElement('toolbarbutton-odp-url-notes-copy-unreview').setAttribute('hidden', false);

					this.odpNotesButtonsHidden = false;
				}
				else
				{
					//cache the state of the odp note buttons.
					if(!this.odpNotesButtonsHidden)
					{
						if(this.getElement('toolbarbutton-odp-url-notes-update'))
							this.getElement('toolbarbutton-odp-url-notes-update').setAttribute('hidden', true);
						if(this.getElement('toolbarbutton-odp-url-notes-unreview'))
							this.getElement('toolbarbutton-odp-url-notes-unreview').setAttribute('hidden', true);
						if(this.getElement('toolbarbutton-odp-url-notes-delete'))
							this.getElement('toolbarbutton-odp-url-notes-delete').setAttribute('hidden', true);
						if(this.getElement('toolbarbutton-odp-url-notes-notes'))
							this.getElement('toolbarbutton-odp-url-notes-notes').setAttribute('hidden', true);
						if(this.getElement('toolbarbutton-odp-url-notes-move-publish'))
							this.getElement('toolbarbutton-odp-url-notes-move-publish').setAttribute('hidden', true);
						if(this.getElement('toolbarbutton-odp-url-notes-move-unreview'))
							this.getElement('toolbarbutton-odp-url-notes-move-unreview').setAttribute('hidden', true);
						if(this.getElement('toolbarbutton-odp-url-notes-copy-publish'))
							this.getElement('toolbarbutton-odp-url-notes-copy-publish').setAttribute('hidden', true);
						if(this.getElement('toolbarbutton-odp-url-notes-copy-unreview'))
							this.getElement('toolbarbutton-odp-url-notes-copy-unreview').setAttribute('hidden', true);

						this.odpNotesButtonsHidden = true;
					}
				}
			}
	return null;

}).apply(ODPExtension);

(function()
{

		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

		//sets "Apply URL notes to selected tabs" When using mutiple tab handler

			this.odpURLNotesToolbarbuttonsUpdateMultipleTabHandler = function(aEvent)
			{
				var showButtons = false;
				var aTabs = this.multipleTabHandlerSelectedTabs();
				this.odpURLNotesMultipleTabHandlerSelectedDocuments = [];
				for(var id in aTabs)
				{
					if(this.editingFormURLExists(this.documentGetFromTab(aTabs[id])) )
					{
						this.odpURLNotesMultipleTabHandlerSelectedDocuments[this.odpURLNotesMultipleTabHandlerSelectedDocuments.length] = this.documentGetFromTab(aTabs[id]);
						showButtons = true;
					}
				}

				if(showButtons)
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

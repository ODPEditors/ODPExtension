(function()
{

		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

		//formats a description in the "edit URL" form even if it is framed
		//first letter upper case, and remove unwanted chars.

			this.editingFormURLFormatDescription = function()
			{
				//if the rigth clicked document is framed..
				if(gContextMenu && gContextMenu.inFrame)
					var aDoc =  gContextMenu.target.ownerDocument;
				else
					var aDoc =  this.documentGetFocused();

				var anElement = this.getElementNamed('newdesc', aDoc);

				if(!anElement){}
				else
				{
					var value =  this.ucFirst(this.editingFormURLCleanChars(anElement.value).toLowerCase());

					//fix sentence uppercase
					value = value.split('. ');
					for(var id in value)
						value[id] = this.ucFirst(value[id]);
					anElement.value = value.join('. ');
				}
			}
	return null;

}).apply(ODPExtension);

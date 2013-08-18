(function()
{

		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

		//paste and formats a string in the "edit URL" 

			this.editingFormURLFormatPaste = function()
			{
				var aString = this.ucFirst(this.trim(this.editingFormURLCleanChars( this.getClipboard().toLowerCase() )));
									
					//fix sentence uppercase
					aString = aString.split('. ');
					for(var id in aString)
						aString[id] = this.ucFirst(aString[id]);
					aString = aString.join('. ');

				this.copyToClipboard(aString);
				
				goDoCommand('cmd_paste');
				
				this.editingFormURLFormatFixSpaces();
			}
	return null;

}).apply(ODPExtension);

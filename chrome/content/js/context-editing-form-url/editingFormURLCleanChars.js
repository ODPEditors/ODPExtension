(function()
{

		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

		//fix the puntuation and replace some unwanted chars from a String

			this.editingFormURLCleanChars = function(aString)
			{
				return this.fixPuntuation(
													  this.trim(
																this.string(aString)
																	.replace(/\|/g, ', ')
																	.replace(/\#/g, ', ')
																	.replace(/\*/g, ', ')
																	.replace(/ -/g, ', ')
																	.replace(/\t/g, ', ')
																	.replace(/\r/g, ', ')
																	.replace(/\n/g, ', ')
													  			)
														)
			}
	return null;

}).apply(ODPExtension);

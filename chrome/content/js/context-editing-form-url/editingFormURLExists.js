(function()
{

		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

		//check if the "edit URL" form exits on aDoc

			this.editingFormURLExists = function(aDoc)
			{
				var aLocation = this.documentGetLocation(aDoc);
				if(
				   aLocation.indexOf('http://http://www.dmoz.org/editors/editunrev/editurl?') === 0||
				   aLocation.indexOf('http://http://www.dmoz.org/editors/editurl/edit?') === 0||
				   aLocation.indexOf('http://http://www.dmoz.org/editors/editurl/add?') === 0
				) {}
				else
					return false;

				var exist = 0;

				if(!aDoc.forms || !aDoc.forms[1] || !aDoc.forms[1].elements)
					return false;
				var aForm = aDoc.forms[1].action == 'http://www.dmoz.org/editors/editunrev/resolveurlerror' ? aDoc.forms[2] : aDoc.forms[1];

				for(var i = 0; i < aForm.elements.length; i++)
				{
					if(!aForm.elements[i] || !aForm.elements[i].name)
						continue;
					if(
						aForm.elements[i].name=='newurl' ||
						aForm.elements[i].name=='newtitle' ||
						aForm.elements[i].name=='newdesc' ||
						aForm.elements[i].name=='newnote' ||
						aForm.elements[i].name=='newuksite' ||
						aForm.elements[i].name=='newcontenttype' ||
						aForm.elements[i].name=='newcat' ||
						aForm.elements[i].name=='typecat' ||
						aForm.elements[i].name=='operation'
					)
					{
						exist = exist+1;
					}
				}
				if(exist >= 5)
					return true;
				else
					return false;
			}
	return null;

}).apply(ODPExtension);

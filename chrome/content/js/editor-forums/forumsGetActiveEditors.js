(function()
{

	/*
		feature request by ottodv
		show inactive user on forums as inactive
	*/
	this.forumsGetActiveEditors = function()
	{
		if(this.shared.editors.active.length === 0)
		{
		  /*
			var Requester = new XMLHttpRequest();
				Requester.overrideMimeType('text/plain');
				Requester.open("GET", 'http://www.dmoz.org/edoc/editorlist.txt', true);
				Requester.setRequestHeader("Cache-Control", "no-cache");
				Requester.setRequestHeader("Pragma", "no-cache");

				Requester.onerror = function (){};

				Requester.onload = function ()
				{
					if(Requester.status=='404' ||
					   Requester.responseText == -1 ||
					   Requester.responseText == null ||
					   Requester.responseText == '' ||
					   Requester.responseText.indexOf('<') != -1 ||
					   Requester.responseText.indexOf('>') != -1
					){}
					else
					{
						ODPExtension.shared.editors.active = Requester.responseText.split('\n');
					}
				};
				Requester.send(null);
		  */
		}
	}
	return null;

}).apply(ODPExtension);

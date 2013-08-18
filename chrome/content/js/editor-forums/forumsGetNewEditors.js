(function()
{

	/* 
		semi-feature request by kgendler
		show new editors on forums as newbies
	*/
	this.forumsGetNewEditors = function()
	{
		if(this.shared.editors.newbies.length === 0)
		{
			/*var Requester = new XMLHttpRequest();
				Requester.overrideMimeType('text/plain'); 
				Requester.open("GET", 'http://www.godzuki.info/editors.php', true);
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
						ODPExtension.shared.editors.newbies = Requester.responseText.split('\n');
					}
				};
				Requester.send(null);*/
		}
	}

	

	return null;

}).apply(ODPExtension);

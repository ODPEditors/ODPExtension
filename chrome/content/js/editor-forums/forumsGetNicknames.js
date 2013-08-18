(function()
{

	this.forumsGetNicknames = function()
	{
		if(this.shared.editors.nicknames.length === 0)
		{
			/*var Requester = new XMLHttpRequest();
				Requester.overrideMimeType('text/plain'); 
				Requester.open("GET", 'http://godzuki.info/forums.strings.php', true);
				Requester.setRequestHeader("Cache-Control", "no-cache");
				Requester.setRequestHeader("Pragma", "no-cache");
				Requester.onerror = function(){};
				Requester.onload = function()
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
						var nicknames = Requester.responseText.split('\n');
						for(var id in nicknames)
						{
							var tmp = nicknames[id].split('	');//\t
							if(!tmp[0]){}
							else
							{
								ODPExtension.shared.editors.nicknames[tmp[0]] = ODPExtension.stripTags(tmp[1]);
							}
						}
					}
				};
				Requester.send(null);*/
		}
	}

	return null;

}).apply(ODPExtension);

(function()
{
	/* original from itubert's greasemonkey script | rewriting  for ODPExtension */

	// JavaScript Document
	// ==UserScript==
	// @name          editor info
	// @namespace     http://odp.tubert.org/gm
	// @description   Show editor privileges in forum threads
	// @include       http://forums.dmoz.org/forum/viewtopic.php?t=*
	// @include       http://forums.dmoz.org/forum/viewtopic.php?p=*
	// ==/UserScript==

	/*
		feature request by ottodv
		show inactive user on forums as inactive
	*/

	/*
		semi-feature request by kgendler
		show new editors on forums as newbies
	*/
	this.addListener('preferencesLoadGlobal', function(){ ODPExtension.editorForumsOnPreferencesLoadGlobal(); });

	this.editorForumsOnPreferencesLoadGlobal = function(){

		this.shared.editors.nicknames = [];
		if(this.preferenceGet('enabled')){
			this.forumsGetStrings();
		}
	}

	this.forumsGetStrings = function()
	{
		if(this.preferenceGet('ui.forum.pages.custom.nicknames') && this.shared.editors.nicknames.length === 0)
		{
			var Requester = new XMLHttpRequest();
				Requester.overrideMimeType('text/plain');
				Requester.open("GET", 'http://www.godzuki.com.uy/mimizu/service/forum-permissions.php', true);
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
							else {
								var editor = tmp.shift();
								ODPExtension.shared.editors.nicknames[editor] = ODPExtension.stripTags(tmp.join('\t').trim());
							}
						}
					}
				};
				Requester.send(null);
		}
	}

	this.forumsSetStrings = function(aDoc)
	{
		if(this.preferenceGet('ui.forum.pages.custom.nicknames') && this.documentGetLocation(aDoc).indexOf('http://forums.dmoz.org/forum/viewtopic.php') === 0)
		{
			if(aDoc.body.hasAttribute('data-odpextension'))
				return;

			aDoc.body.setAttribute('data-odpextension', true);

			var i;
			var name;
			var seen = {};
			var ret = [];
			var a = aDoc.getElementsByTagName('span');

			for (i = 0; i < a.length; i++)
			{
				if (a[i].className == 'name')
				{
					var span = a[i];
					var b = span.getElementsByTagName('b')[0];
					var name = b.innerHTML;

					if(span.hasAttribute('modified'))
						continue;
					span.setAttribute('modified', true);

					var privs = aDoc.createElement('span');

					if(typeof(this.shared.editors.nicknames[name]) == 'undefined'){
						privs.innerHTML = "("+this.getString('forums.strings.inactive')+")";
						b.style.color = "#777";
					} else if(this.shared.editors.nicknames[name] != ''){
						privs.innerHTML = this.shared.editors.nicknames[name].replace(/\t/g, '<br>');
						if(this.shared.editors.nicknames[name].trim() == 'admin')
							b.style.color='#000000';
						else if(this.shared.editors.nicknames[name].trim() == 'staff')
							b.style.color='#669933';
					}

					privs.style.color="#777";
					privs.style.fontSize="x-small";
					span.parentNode.appendChild(privs);
				}
			}
		}
	}



	return null;

}).apply(ODPExtension);

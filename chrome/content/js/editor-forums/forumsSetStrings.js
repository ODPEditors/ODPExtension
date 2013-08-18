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
	
	this.forumsSetStrings = function(aDoc)
	{
		if(this.documentGetLocation(aDoc).indexOf('http://forums.dmoz.org/forum/viewtopic.php') === 0)
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
					var name = (span.getElementsByTagName('b'))[0].innerHTML;
					
					if(span.hasAttribute('modified'))
						continue;
					if(this.preferenceGet('ui.forum.pages.custom.nicknames') && this.shared.editors.nicknames[name])
					{
						var privs = aDoc.createElement('span');
							privs.innerHTML = "(" + this.shared.editors.nicknames[name] + ")";
							privs.style.color="#777";
							privs.style.fontSize="x-small";
							span.parentNode.appendChild(privs);
							span.setAttribute('modified', true);
					}
					
					if(this.preferenceGet('ui.forum.pages.show.newbies') && this.inArray(this.shared.editors.newbies, name))
					{
						var privs = aDoc.createElement('span');
							if(span.hasAttribute('modified'))
								privs.innerHTML = "<br>("+this.getString('forums.strings.newbie')+")";
							else
								privs.innerHTML = "("+this.getString('forums.strings.newbie')+")";
							privs.style.color="#777";
							privs.style.fontSize="x-small";
							span.parentNode.appendChild(privs);
							span.setAttribute('modified', true);
					}
					else if(this.preferenceGet('ui.forum.pages.show.inactive') && !this.inArray(this.shared.editors.active, name))
					{
						var privs = aDoc.createElement('span');
							if(span.hasAttribute('modified'))
								privs.innerHTML = "<br>("+this.getString('forums.strings.inactive')+")";
							else
								privs.innerHTML = "("+this.getString('forums.strings.inactive')+")";
							privs.style.color="#777";
							privs.style.fontSize="x-small";
							span.parentNode.appendChild(privs);
							span.setAttribute('modified', true);
					}
				}
			}
		}
	}
	
	

	return null;

}).apply(ODPExtension);

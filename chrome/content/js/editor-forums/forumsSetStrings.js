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
					var b = span.getElementsByTagName('b')[0];
					var name = b.innerHTML;

					if(span.hasAttribute('modified'))
						continue;
					span.setAttribute('modified', true);

					var privs = aDoc.createElement('span');

					if(this.shared.editors.nicknames[name])
						privs.innerHTML = this.shared.editors.nicknames[name].replace(/\t/g, '<br>');
					else {
						privs.innerHTML = "("+this.getString('forums.strings.inactive')+")";
						b.style.color = "#777";
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

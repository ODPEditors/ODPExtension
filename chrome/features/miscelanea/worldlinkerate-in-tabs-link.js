(function() {
	// JavaScript Document
	//opens a tab looking at the user preferences
	this.worldlinkerateInTabsLink = function(aDoc) {
		var aURL = this.documentGetLocation(aDoc);

		if (
			aURL == 'http://odp.rpfuller.org/worldlinkerator/go.cgi' || //org
		aURL == 'http://odp.rpfuller.com/worldlinkerator/go.cgi' //com
		) {
			var links = aDoc.getElementsByTagName('a');
			for (var i = 0; i < links.length; i++) {
				if (links[i].hasAttribute('href') && links[i].href.indexOf('awl.cgi') != -1) {
					if (links[i].hasAttribute('link-added'))
						break;
					links[i].setAttribute('link-added', true);
					var link = aDoc.createElement('a')
					link.setAttribute('href', 'javascript://');
					link.setAttribute('onclick',
						'		function worldlinkerateInTabs()	' +
						'		{	' +
						'			var links = document.getElementsByTagName("a");	' +
						'			for(var i=0;i<links.length;i++)	' +
						'			{	' +
						'				if(links[i].hasAttribute("href") && links[i].href.indexOf("editrelation") != -1)\	' +
						'					window.open(links[i].href);	' +
						'			}	' +
						'		}	' +
						'		worldlinkerateInTabs();	');
					link.innerHTML = '<b>Autoworldlinkerate in tabs</b>';

					var span = aDoc.createElement('span')
					span.appendChild(link);
					span.appendChild(aDoc.createTextNode(' - '));
					span.appendChild(links[i].cloneNode(true));

					links[i].parentNode.replaceChild(span, links[i])
					break;
				}
			}
		}
	}
	return null;

}).apply(ODPExtension);
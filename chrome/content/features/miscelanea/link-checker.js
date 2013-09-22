(function()
{
		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

			this.linkChecker = function()
			{
				var aResult = {};
						aResult.domain = this.focusedDomain;
						aResult.data = [];

				var oRedirectionAlert = this.redirectionAlert();
				var self = this;
				var progress = this.progress('link.cheker.'+oRedirectionAlert.id, function(){ self.linkCheckerDoneGraph(aResult); });
					progress.reset();
					progress.progress();

				//look at selected links
				var items = this.getLinksPreferSelected(this.tabGetFocused());
				if(items.length > 0) 	{
					for(var id in items)
						this.linkCheckerItem(items[id], oRedirectionAlert, aResult);
				}
			}
			//general blacklisting..
			this.linkCheckerItem = function(item, oRedirectionAlert, aResult)
			{
				if(
					!item.href ||
					this.isGarbage(item.href) ||
					!this.canFollowURL(item.href, this.focusedDomain)
				)
					return;

				var tooltiptext = this.decodeUTF8Recursive(item.href);
				item.setAttribute('tooltiptext', tooltiptext);
				item.setAttribute('title', tooltiptext);
				if(!item.hasAttribute('original_text'))
					item.setAttribute('original_text', item.innerHTML);
				else
					item.innerHTML = item.getAttribute('original_text');

				var progress = this.progress('link.cheker.'+oRedirectionAlert.id);
					progress.add();
					progress.progress();

					this.runThreaded('link.checker.'+oRedirectionAlert.id, this.preferenceGet('link.checker.threads')*2, function(onThreadDone){

						item.style.setProperty('border', '1px solid green', 'important');
						item.style.setProperty('padding', '2px', 'important');
						item.style.removeProperty('background-color');
						item.style.removeProperty('color');

						oRedirectionAlert.check(item.href, function(aData, aURL){ ODPExtension.linkCheckerCheckDone(aData, aURL, item, oRedirectionAlert, aResult); onThreadDone(); });
					});
			}

			this.linkCheckerCheckDone = function(aData, aURL, item, oRedirectionAlert, aResult)
			{
				aResult.data[aResult.data.length] = aData;

				var progress = this.progress('link.cheker.'+oRedirectionAlert.id);
						progress.remove();
						progress.progress();

				if(!item)
					return;

				var tooltiptext = ODPExtension.decodeUTF8((aData.urlRedirections.join('\n'))+'\n'+(aData.status.match || ''))

				item.setAttribute('title', tooltiptext.trim()+'\n'+aData.txt.substr(0, 255));

				if(aData.status.suspicious.length){
					//orange
					item.style.setProperty('color', 'white', 'important');
					item.style.setProperty('background-color', 'orange', 'important');
				} else if(aData.status.error && aData.status.delete) {
					//red
					item.style.setProperty('color', 'white', 'important');
					item.style.setProperty('background-color', '#EB6666', 'important');
				/*} else if(aData.status.error && aData.status.unreview) {
					//yellow sharp
					item.style.setProperty('background-color', '#FEFF7F', 'important');
					item.style.setProperty('color', 'black', 'important');
					*/
				} else if(aData.status.error && aData.status.unreview) {
					//purple
					item.style.setProperty('color', 'white', 'important');
					item.style.setProperty('background-color', '#6F6FFC', 'important');

				} else if(aData.statuses[aData.statuses.length-1]=='200' && aData.status.error === false) {
					//green
					item.style.setProperty('color', 'white', 'important');
					item.style.setProperty('background-color', '#669933', 'important');

				} else {
					//yellow light
					item.style.setProperty('color', 'black', 'important');
					item.style.setProperty('background-color', '#FFFFCC', 'important');
				}

				/*aData.html = '';
				aData.headers = '';
				ODPExtension.dump(JSON.stringify(aData));*/
				item.innerHTML = '['
													+aData.statuses.join(', ')
													+' | '+aData.status.code
													+' | '+aData.status.errorString
													+' | '+aData.ip
													+' | '+aData.language
													+'] '+
													item.getAttribute('original_text');

				item.setAttribute('note', ''+aData.statuses.join(', ')+' | '+aData.status.code+' | '+aData.status.errorString);
				item.setAttribute('error', aData.status.code);
				item.setAttribute('newurl', aData.urlRedirections[aData.urlRedirections.length-1]);
				if(aData.status.suspicious.length)
					item.setAttribute('title', item.getAttribute('title')+'\n'+aData.status.suspicious.join('\n'));
		}

		this.linkCheckerDoneGraph = function(aResult){

			aResult.domain = (aResult.domain || 'graph').toUpperCase();
			var blackListGraphLink = ['google.com', 'twitter.com', 'wikipedia.org', 'facebook.com', 'youtube.com', 'aol.com', 'bing.com', 'gigablast.com', 'yahoo.com', 'adobe.com', 'blogger.com', 'blogspot.com', 'feedburner.com', 'yippy.com','ask.com', 'univision.com', 'creativecommons.org', 'w3.org']

			//trace links
			var links = [];
			for(var id in aResult.data){
				var site = aResult.data[id];
  			if(blackListGraphLink.indexOf(site.domain) != -1)
  				continue;
  			links.push({source: aResult.domain, target: site.ip, type: "green"});
  			links.push({source: site.ip, target: site.domain, type: "black"});
  			for(var link in site.linksExternal){
  				if(blackListGraphLink.indexOf(site.linksExternal[link].domain) == -1)
  					links.push({source: site.domain, target: site.linksExternal[link].domain, type: "dotted"});
  			}
			}

			//multiple links to same domain should be removed, to allow the graph count properly the weight
			links = this.arrayUniqueObjects(links, function(o) { return o.source+'_'+o.target; } );

			this.tabOpen('chrome://ODPExtension/content/html/graphs/forced-directed.html#'+JSON.stringify(links))
		}
	return null;

}).apply(ODPExtension);

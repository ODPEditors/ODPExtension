(function()
{
		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

			this.linkChecker = function()
			{
				var oRedirectionAlert = this.redirectionAlert();

				var progress = this.progress('link.cheker.'+oRedirectionAlert.id);
					progress.reset();
					progress.progress();
				//look at selected links
				var items = this.getBrowserSelectionObjects('a');
				if(items.length > 0)
				{
					for(var id in items)
						this.linkCheckerItem(items[id], oRedirectionAlert);
				}
				//look at all the link in the page
				else
				{
					this.foreachFrame(this.windowGetFromTab(this.tabGetFocused()), function(aDoc){ODPExtension.linkCheckerDoc(aDoc, oRedirectionAlert);})
				}
			}
			//looking a the doc
			this.linkCheckerDoc = function(aDoc, oRedirectionAlert)
			{
				var len_a =  aDoc.getElementsByTagName("a").length;
				for(var i = 0; i < len_a; i++)
					this.linkCheckerItem(aDoc.getElementsByTagName("a").item(i), oRedirectionAlert);
			}
			//general blacklisting..
			this.linkCheckerItem = function(item, oRedirectionAlert)
			{
				if(
					!item.href ||
					this.isGarbage(item.href) ||
					this.isPrivateURL(item.href) ||
					item.href.indexOf('dmoz.') != -1 ||
					item.href.indexOf('pmoz.') != -1 ||
					item.href.indexOf('.domaintools.com') != -1 ||
					(this.focusedURLDomain.indexOf('google.') != -1 && item.href.indexOf('google.') != -1) ||
					(this.focusedURLDomain.indexOf('yahoo.') != -1 && item.href.indexOf('yahoo.') != -1 ) ||
					(this.focusedURLDomain.indexOf('bing.') != -1 && item.href.indexOf('.bing') != -1 ) ||
					((this.focusedURLDomain.indexOf('live.') != -1 || this.focusedURLDomain.indexOf('msn.') != -1) && (item.href.indexOf('msn.') != -1 || item.href.indexOf('live.') != -1 || item.href.indexOf('msnscache.') != -1))	||
					(this.focusedURLDomain.indexOf('google.') != -1 && (item.href.indexOf('cache:') != -1 || item.href.indexOf('related:') != -1 || item.href.indexOf('site:') != -1))
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

						oRedirectionAlert.check(item.href, function(aData, aURL){ ODPExtension.linkCheckerDone(aData, aURL, item, oRedirectionAlert); onThreadDone(); });
					});
			}

			this.linkCheckerDone = function(aData, aURL, item, oRedirectionAlert)
			{
				var progress = this.progress('link.cheker.'+oRedirectionAlert.id);
						progress.remove();
						progress.progress();

				if(!item)
					return;

				var tooltiptext = ODPExtension.decodeUTF8((aData.urlRedirections.join('\n'))+'\n'+(aData.status.match || ''))

				item.setAttribute('tooltiptext', tooltiptext.trim());
				item.setAttribute('title', tooltiptext.trim());

				if(aData.status.error && aData.status.delete) {
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

				//aData.html = '';
				//aData.headers = '';
				//ODPExtension.dump(JSON.stringify(aData));
				item.innerHTML = '['+aData.statuses.join(', ')+' | '+aData.status.code+' | '+aData.status.errorString+'] '+item.getAttribute('original_text');
				item.setAttribute('note', ''+aData.statuses.join(', ')+' | '+aData.status.code+' | '+aData.status.errorString);
				item.setAttribute('code', aData.status.code);
		}

	return null;

}).apply(ODPExtension);

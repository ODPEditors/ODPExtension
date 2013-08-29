(function()
{
		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

			this.linkChecker = function()
			{
				var oRedirectionAlert = this.redirectionAlert();

				var progress = this.progress('link.cheker');
					progress.reset();
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

				item.style.setProperty('border', '1px solid green', 'important');
				item.style.setProperty('padding', '2px', 'important');

				var progress = this.progress('link.cheker');
					progress.add();

					oRedirectionAlert.check(item.href, function(aData, aURL){ ODPExtension.linkCheckerDone(aData, aURL, item); });
			}

			this.linkCheckerDone = function(aData, aURL, item)
			{
				var progress = this.progress('link.cheker');
						progress.remove();
						progress.progress();

				if(!item)
					return;
				item.setAttribute('tooltiptext', ODPExtension.decodeUTF8(aURL+'\n'+aData.redirectionsLog));
				item.setAttribute('title',  ODPExtension.decodeUTF8(aURL+'\n'+aData.redirectionsLog));

				if(aData.firstStatus=='200') {
					item.style.setProperty('color', 'white', 'important');
					item.style.setProperty('background-color', '#669933', 'important');
				} else if(aData.firstStatus=='-1' || aData.latestStatus =='-1') {
					item.style.setProperty('color', 'white', 'important');
					item.style.setProperty('background-color', '#EB6666', 'important');
				}
				else if(
						aData.firstStatus=='500' ||
						aData.latestStatus=='500' ||
						aData.firstStatus=='404' ||
						aData.latestStatus=='404' ||
						aData.firstStatus=='401' ||
						aData.latestStatus=='401'
				)
				{
					item.style.setProperty('background-color', '#FEFF7F', 'important');
					item.style.setProperty('color', 'black', 'important');
				} else {
					item.style.setProperty('color', 'black', 'important');
					item.style.setProperty('background-color', '#FFFFCC', 'important');
				}
				item.innerHTML = '['+aData.firstStatus+''+aData.statusLog+'] '+item.getAttribute('original_text');
		}

	return null;

}).apply(ODPExtension);

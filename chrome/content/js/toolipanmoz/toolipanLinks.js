(function()
{

		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

			this.toolipanLinks = function()
			{
				this.alert('sorry this feature was not implemented yet!');

				return;

				var progress = this.progress('links.status');
					progress.reset();
				//look at selected links
				var items = this.getBrowserSelectionObjects('a');
				if(items.length > 0)
				{
					for(var id in items)
						this.toolipanLinksItem(items[id]);
				}
				//look at all the links in the page
				else
				{
					this.foreachFrame(this.windowGetFromTab(this.tabGetFocused()), function(aDoc){ODPExtension.toolipanLinksDoc(aDoc);})
				}
			}
			//looking a the doc
			this.toolipanLinksDoc = function(aDoc)
			{
				var len_a =  aDoc.getElementsByTagName("a").length;
				for(var i = 0; i < len_a; i++)
					this.toolipanLinksItem(aDoc.getElementsByTagName("a").item(i));
			}
			//general blacklisting..
			this.toolipanLinksItem = function(item)
			{
				if(
					!item.href ||
					this.isGarbage(item.href) ||
					this.isPrivateURL(item.href) ||
					item.href.indexOf('dmoz.') != -1 ||
					item.href.indexOf('pmoz.info') != -1 ||
					item.href.indexOf('.domaintools.com') != -1 ||
					(this.focusedURLDomain.indexOf('google.') != -1 && item.href.indexOf('google.') != -1) ||
					(this.focusedURLDomain.indexOf('yahoo.') != -1 && item.href.indexOf('yahoo.') != -1 ) ||
					((this.focusedURLDomain.indexOf('live.') != -1 || this.focusedURLDomain.indexOf('msn.') != -1) && (item.href.indexOf('msn.') != -1 || item.href.indexOf('live.') != -1 || item.href.indexOf('msnscache.') != -1))	||
					(this.focusedURLDomain.indexOf('google.') != -1 && (item.href.indexOf('cache:') != -1 || item.href.indexOf('related:') != -1 || item.href.indexOf('site:') != -1))
				)
					return;
				item.setAttribute('tooltiptext', this.decodeUTF8Recursive(item.href));
				item.setAttribute('title', this.decodeUTF8Recursive(item.href));
				item.style.setProperty('border', '1px solid green', 'important');
				item.style.setProperty('padding', '2px', 'important');

			var progress = this.progress('listings.highlight');
				progress.add();

				this.readURL(
							 this.preferenceGet('advanced.urls.rdf').replace('{URL}', this.encodeUTF8(this.removeSchema(item.href))),
							 'listings.information/responses/',
							 null,
							 null,
							 function(){ ODPExtension.listingsHighlightRetreiveInformationForItem(arguments[0],arguments[1]);}, item);//variable num of arguments
			}


	return null;

}).apply(ODPExtension);

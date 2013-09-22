(function()
{
		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

			this.listingsHighlight = function()
			{
				var progress = this.progress('listings.highlight');
					progress.reset();
				//look at selected links
				var items = this.getBrowserSelectionObjects('a');
				if(items.length > 0)
				{
					for(var id in items)
						this.listingsHighlightItem(items[id]);
				}
				//look at all the link in the page
				else
				{
					this.foreachFrame(this.windowGetFromTab(this.tabGetFocused()), function(aDoc){ODPExtension.listingsHighlightDoc(aDoc);})
				}
			}
			//looking a the doc
			this.listingsHighlightDoc = function(aDoc)
			{
				var len_a =  aDoc.getElementsByTagName("a").length;
				for(var i = 0; i < len_a; i++)
					this.listingsHighlightItem(aDoc.getElementsByTagName("a").item(i));
			}
			//general blacklisting..
			this.listingsHighlightItem = function(item)
			{
				if(
				   !item.href ||
				   this.isGarbage(item.href) ||
				   this.cantLeakURL(item.href)
				)
					return;

				var tooltiptext = this.decodeUTF8Recursive(this.anonymizeForListingChecking(item.href));
				item.setAttribute('tooltiptext', tooltiptext);
				item.setAttribute('title', tooltiptext);
				item.style.setProperty('border', '1px solid green', 'important');
				item.style.setProperty('padding', '2px', 'important');

			var progress = this.progress('listings.highlight');
				progress.add();

				this.readURL(
							 this.preferenceGet('advanced.urls.rdf').replace('{URL}', this.encodeUTF8(this.removeSchema(this.anonymizeForListingChecking(item.href)))),
							 'listings.information/responses/',
							 null,
							 null,
							 function(){ ODPExtension.listingsHighlightRetreiveInformationForItem(arguments[0],arguments[1],arguments[2]);}, item , tooltiptext);//variable num of arguments
			}

			//retreiving information about listings for item
			this.listingsHighlightRetreiveInformationForItem = function(aData, item, tooltiptext)
			{
				//first syling
					item.style.setProperty('color', 'black', 'important');
					item.style.setProperty('background-color', '#FFFFCC', 'important');

				//progress
				var progress = this.progress('listings.highlight');
					progress.remove();

				//vars
					var responseURL = '', responseCategory = '', results = 0, itemSubdomain = this.removeWWW(this.getSubdomainFromURL(item.href)), itemDomain = this.getDomainFromURL(item.href);
					var foundDomain = false;
					aData = this.trim(aData).split('\n');
					for(var id in aData)
					{
						var data = aData[id].split('\t');
						if(!data[1])
						{
							responseURL = '';
							responseCategory = '';
							continue;
						}
						else
						{
							responseURL = data[1];
							responseCategory = data[0];
						}

						if(this.decodeUTF8Recursive(this.removeSchema(this.shortURL(item.href).replace(/\/+$/, ''))).replace(/\/$/, '').toLowerCase()==this.decodeUTF8Recursive(this.removeSchema(this.shortURL(responseURL).replace(/\/+$/, ''))).replace(/\/$/, '').toLowerCase())
						{
							item.style.setProperty('color', 'white', 'important');
							item.style.setProperty('background-color', '#669933', 'important');
							item.setAttribute('title', this.categoryTitle(this.categoryAbbreviate(responseCategory))+'\n'+tooltiptext);
							item.setAttribute('tooltiptext', this.categoryTitle(this.categoryAbbreviate(responseCategory))+'\n'+tooltiptext);
							item.setAttribute('category', this.encodeUTF8(responseCategory));
							item.setAttribute('onclick', "if(event.ctrlKey){window.open('"+this.categoryGetURL(responseCategory)+"', '_blank');return false;}");
							break;
						}

						else if(itemSubdomain == this.removeWWW(this.getSubdomainFromURL(responseURL)))
						{
							foundDomain = true;
							item.style.setProperty('color', 'white', 'important');
							item.style.setProperty('background-color', '#626CAF', 'important');
							item.setAttribute('title', this.categoryTitle(this.categoryAbbreviate(responseCategory))+'\n'+tooltiptext);
							item.setAttribute('tooltiptext', this.categoryTitle(this.categoryAbbreviate(responseCategory))+'\n'+tooltiptext);
							item.setAttribute('category', this.encodeUTF8(responseCategory));
							item.setAttribute('onclick', "if(event.ctrlKey){window.open('"+this.categoryGetURL(responseCategory)+"', '_blank');return false;}");
						}
						else if(itemDomain == this.getDomainFromURL(responseURL))
						{
							foundDomain = true;
							item.style.setProperty('color', 'white', 'important');
							item.style.setProperty('background-color', '#626CAF', 'important');
							item.setAttribute('title', this.categoryTitle(this.categoryAbbreviate(responseCategory))+'\n'+tooltiptext);
							item.setAttribute('tooltiptext', this.categoryTitle(this.categoryAbbreviate(responseCategory))+'\n'+tooltiptext);
							item.setAttribute('category', this.encodeUTF8(responseCategory));
							item.setAttribute('onclick', "if(event.ctrlKey){window.open('"+this.categoryGetURL(responseCategory)+"', '_blank');return false;}");
						}
						else if(!foundDomain)
						{
							item.style.setProperty('color', 'white', 'important');
							item.style.setProperty('background-color', '#666666', 'important');
							item.setAttribute('title', this.categoryTitle(this.categoryAbbreviate(responseCategory))+'\n'+tooltiptext);
							item.setAttribute('tooltiptext', this.categoryTitle(this.categoryAbbreviate(responseCategory))+'\n'+tooltiptext);
							item.setAttribute('category', this.encodeUTF8(responseCategory));
							item.setAttribute('onclick', "if(event.ctrlKey){window.open('"+this.categoryGetURL(responseCategory)+"', '_blank');return false;}");
						}
				}
		}

	return null;

}).apply(ODPExtension);

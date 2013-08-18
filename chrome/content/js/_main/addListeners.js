(function()
{

			var debugingThisFile = true;

		//listeners of this extension

			this.addListeners = function()
			{
				//this.dump('addListeners', debugingThisFile);
				
				//check for private browsing, add-on should be disabled
				this.addListener('onPrivateBrowsingEnter', 
									function()
									{
										if(ODPExtension.preferenceGet('privacy.private.browsing.on'))
										{
											ODPExtension.preferenceSet('last.enabled', ODPExtension.preferenceGet('enabled'));//preferenceSet will no dispatch the event onPreferenceSet
											ODPExtension.preferenceChange('enabled', false);							//preferenceChange  will dispatch the event
										}
									}
								);
				//check for private browsing exit, add-on should back to previous state
				this.addListener('onPrivateBrowsingExit', 
								 function()
								 {
										if(ODPExtension.preferenceGet('privacy.private.browsing.on'))
										{
											 ODPExtension.preferenceChange('enabled', ODPExtension.preferenceGet('last.enabled'));
										}
								 });
				
				//open the change log file on first run
				this.addListener('firstRunForThisVesion', 
								 function()
								 {
									setTimeout(function(){ODPExtension.openURL('https://addons.mozilla.org/en-US/firefox/addons/versions/176740#version-3.130816.56', true, false, true);}, 5000);
								 });
				
				//changes some ui elements if the current focused document is a category
				this.addListener('onLocationChange', function() { ODPExtension.setFocusedLocation(); });
				//changes some ui elements if the current focused document is a category
				this.addListener('onLocationChange', function() { ODPExtension.setFocusedCategory(); });
				//updates the icon of the extension
				this.addListener('onLocationChange', function() { ODPExtension.extensionIconUpdateStatus(); });
				//1 - check for updates on the categories.txt file
				//2 - vacuum the database for quickly usage
				//this should not take to much time
				this.addListener('onIdle', function(){
													 if(ODPExtension.isMinFirefox35)
														ODPExtension.db.vacuum();
													 if(ODPExtension.preferenceGet('advanced.categories.txt.auto.update'))
													 	ODPExtension.categoriesTXTUpdate();
													});
				
				//referrer modification
				this.addListener('onModifyRequest', function(aSubject){ODPExtension.privacyRemoveReferrer(aSubject)});

			//informative popup
					//updates the content when switching tabs
					this.addListener('onLocationChange', function() { ODPExtension.listingGetInformation(ODPExtension.focusedURL); });
					
			//worldlinkerate in tabs
				this.addListener('DOMContentLoadedNoFrames', function(aDoc) { ODPExtension.worldlinkerateInTabsLink(aDoc); });

			//odp URL notes
					//updates show or hide the ODP URL Notes toolbarbuttons
					this.addListener('onLocationChange', function() { ODPExtension.odpURLNotesToolbarbuttonsUpdate(ODPExtension.focusedURLSubdomain); });
					//Apply note to selected sites //in multiple tab handler
					if(this.getBrowserElement('multipletab-selection-menu'))
					{
						this.getBrowserElement('multipletab-selection-menu').addEventListener("popupshowing",  function(event){
																			if(event.originalTarget == event.currentTarget)
																			{
																				// this will cache the documents selected with MTH to next apply a ODP Note
																				 ODPExtension.odpURLNotesToolbarbuttonsUpdateMultipleTabHandler(event);
																			}																											
																		 }, false );
					}

			//formater menu
					//show or hide the formater context menu
					this.addListener('contextMenuShowing', function(){ ODPExtension.editingFormURLMenuUpdate(ODPExtension.focusedURLSubdomain); } );
					//updates show or hide the formater context menu when switching tabs (if the context menu is opened)
					this.addListener('onLocationChange', function() { if(ODPExtension.contentAreaContextMenu().state == 'open')ODPExtension.editingFormURLMenuUpdate(ODPExtension.focusedURLSubdomain); });

			//frames menu
					//build, show or hide the frames context menu and selected context menu
					this.addListener('contextMenuShowing', function(event){
																	 if(ODPExtension.preferenceGet('ui.context.menu.frame.selected'))
																	 	ODPExtension.frameSelectedUpdate();
																	 if(ODPExtension.preferenceGet('ui.context.menu.frames'))
																	 	ODPExtension.frameMenuUpdate();
																	 } );
					//show custom nicknames and innactive editors for forum pages
					this.addListener('DOMContentLoadedNoFrames', function(aDoc)
																	 {
																		 if(
																			ODPExtension.preferenceGet('ui.forum.pages.custom.nicknames') || 
																			ODPExtension.preferenceGet('ui.forum.pages.show.newbies') || 
																			ODPExtension.preferenceGet('ui.forum.pages.show.inactive')
																		)
																		 {
																			ODPExtension.forumsSetStrings(aDoc);
																		 }
																	 }
									);
					//the user has opened the context menu, the menu of frames was builded, 
					//but maybe the current document was not loaded complety and there is more frames
					this.addListener('DOMContentLoadedWithFrames', function(aDoc)
																	 {
																		 //only update the menu of frames if the context menu is opened
																		 if(ODPExtension.preferenceGet('ui.context.menu.frames') && ODPExtension.contentAreaContextMenu().state == 'open')
																		 {
																			var focusedTab = ODPExtension.tabGetFocused();
																			//and if the focused page has frames
																			//and if the loaded document is from this tab
																			if(ODPExtension.tabHasFrames(focusedTab) && focusedTab == ODPExtension.tabGetFromDocument(aDoc))
																				ODPExtension.frameMenuUpdate();
																		 }
																	 }
									);
					//the user has opened the context menu, the menu of frames was builded, 
					//but maybe the user switched from tab and there is o no frames
					this.addListener('onLocationChange', function() {  if(ODPExtension.preferenceGet('ui.context.menu.frames') && ODPExtension.contentAreaContextMenu().state == 'open'){ODPExtension.frameMenuUpdate(); }});

			//one keypress action
					this.getBrowserElement("content").addEventListener('keypress', function(event)
																					{
																						if(
																						    !event.originalTarget 
																						   || !event.originalTarget.tagName 
																						   || !event.originalTarget.ownerDocument 
																						   || event.originalTarget.ownerDocument != ODPExtension.documentGetFocused()
																						   || !ODPExtension.preferenceGet('single.key.command') 
																						   || event.ctrlKey 
																						   || event.shiftKey 
																						   || event.altKey 
																						   || ODPExtension.preferenceBrowserGet('accessibility.typeaheadfind')
																						){}
																						else
																						{
																							
																							if(event.originalTarget.tagName.toLowerCase() == 'html')
																							{
																								ODPExtension.fromCategoryUpdateMenu(event, 'from-category', true);
																								
																								//getting categories selected/focused
																								var aCategories = [];
																								if(ODPExtension.fromCategorySelectedCategories.length > 0)
																									aCategories = ODPExtension.fromCategorySelectedCategories;
																								else if(ODPExtension.fromCategorySelectedCategory != '')
																									aCategories[0] = ODPExtension.fromCategorySelectedCategory;
																								else if(ODPExtension.focusedCategory != '')
																									aCategories[0] = ODPExtension.focusedCategory;
																								//if there is categories go
																								if(aCategories.length > 0)
																									ODPExtension.onSingleKeyShortCut(event.charCode, aCategories);
																								//every page
																								if(event.charCode == 113 ) //Q - close tab
																									ODPExtension.tabClose(ODPExtension.tabGetFocused());
																								else if(event.charCode == 116 ) //T - open tab
																									ODPExtension.tabOpen('about:blank', true);
																								else if(event.charCode == 103 ) //G - google
																								{
																									var searchFor;
																									if( (searchFor = ODPExtension.prompt(ODPExtension.getString('search.ellipsis')) ) != '' )
																									{
																										if(ODPExtension.focusedURLSubdomain != '')
																											ODPExtension.openURL('http://www.google.com/search?q='+ODPExtension.encodeUTF8('site:'+ODPExtension.removeWWW(ODPExtension.focusedURLSubdomain))+'+'+ODPExtension.encodeUTF8(searchFor).replace(/%20/g, '+'), true,  null, true);
																										else
																											ODPExtension.openURL('http://www.google.com/search?q='+ODPExtension.encodeUTF8(searchFor).replace(/%20/g, '+'), true, null, true);
																									}
																								}
																								else if(event.charCode == 241 ) //Ñ - español
																								{
																									ODPExtension.openURL(ODPExtension.encodeURI('http://www.dmoz.org/World/Español/'), inNewTab);
																								} 


																							}																							
																						}
																					}, false);

			//from category menu
				//opens the "from" category menu on page rigth dblclick
					this.getBrowserElement("content").addEventListener("dblclick", function(event){if(event.button==2){ODPExtension.fromCategoryUpdateMenu(event, 'from-category')}}, false);
				//the set timeout is there to avoid multiples clicks
					this.getBrowserElement("content").addEventListener("mouseup", function(event)
																						   {
																							   if(event.button==0)
																							   {
																								   clearTimeout(ODPExtension.fromCategoryTimeout);
																								   ODPExtension.fromCategoryTimeout = setTimeout(function(){ODPExtension.fromCategoryUpdateMenu(event, 'from-category');}, 200);
																								}
																							   else if (event.button==2 && ODPExtension.tagName(event.originalTarget) == 'select')
																							   {
																								   setTimeout(function(){ODPExtension.fromCategoryUpdateMenu(event, 'from-category');}, 50);
																								}
																						   }, false);

				//in content area context menu
					this.addListener('contextMenuShowing', function(event){
																		// this will update the label of the "from category" menu on context menu
																			ODPExtension.fromCategoryUpdateMenu(event, 'context-from-category');
																	 } );
				//in tabs
					this.addListener('tabContextMenuShowing', function(event){
																		// this will update the label of the "from category" menu on context menu
																		 ODPExtension.fromCategoryUpdateMenu(event, 'tab-context-from-category');
																	 } );
				//in multiple tab handler
				if(this.getBrowserElement('multipletab-selection-menu'))
				{
					this.getBrowserElement('multipletab-selection-menu').addEventListener("popupshowing",  function(event){
																		if(event.originalTarget == event.currentTarget)
																		{
																			// this will update the label of the "from category" menu on context menu
																			 ODPExtension.fromCategoryUpdateMenu(event,'tab-context-multiple-from-category');
																		}																											
																	 }, false );
				}
				//in extension icon
					this.getElement('extension-icon-context').addEventListener("popupshowing",  function(event){
																		if(event.originalTarget == event.currentTarget)
																		{
																			// this will update the label of the "from category" menu on context menu
																			 ODPExtension.fromCategoryUpdateMenu(event, 'extension-icon-from-category');
																		}																											
																	 }, false );

			//detecting when one of the toolbars are selected to collapse or not
			//this is useful to update the content of the toolbars when these are shown
			//but still can't update the content if the user open the toolbar from other menuitem like View -> Toolbar -> My toolbar. arr!!! toolbar collapse event?
				if(this.getBrowserElement('toolbar-context-menu'))
					this.getBrowserElement('toolbar-context-menu').addEventListener('popuphidden', function(){ODPExtension.categoryNavigatorToolbarUpdate(ODPExtension.categoryGetFocused())}, false);
				/*informative panel*/
				this.getElement('panel-header').addEventListener('DOMMouseScroll', ODPExtension.panelInformativeSwitchSelectedSite, false);
				this.getElement('panel-related').addEventListener('DOMMouseScroll', ODPExtension.panelInformativeSwitchSelectedRelated, false);


		}

	return null;

}).apply(ODPExtension);
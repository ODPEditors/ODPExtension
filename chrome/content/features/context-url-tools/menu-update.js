(function()
{

		//sets debuging on/off for this JavaScript file

			var debugingThisFile = false;

		//updates the URL Tool menu

			this.URLToolsMenuUpdate = function()
			{
				var menu = this.getElement('context-url-tools-menu');
				var menupopup = this.getElement('context-url-tools-menupopup');

				var urls = this.trim(this.preferenceGet('url.tools.urls'));

				//empty the menu
					this.removeChilds(menupopup);

				//if the menu is disabled
					if(!this.preferenceGet('ui.context.menu.url.tools') || !this.preferenceGet('enabled') || urls == '')
					{
						menu.setAttribute('hidden', true);
						return;
					}
					else
					{
						menu.setAttribute('hidden', false);
					}

					if(urls != '')
						urls = (urls+'\n--nada\n-\na|http://nada.com').split('\n');
					else
						return;

					var rootPopup = this.getElement('context-url-tools-menupopup');
					var currentPopup = rootPopup;
					for(var id in urls)
					{
						if(urls[id].indexOf('--') === 0)
						{
							//addding the previous tools assigned
							if(!menuToolPopup){}
							else
							{
								menuTool.appendChild(menuToolPopup);
								rootPopup.appendChild(menuTool);
							}
							var menuTool = this.create("menu");
								menuTool.setAttribute('class', 'menu-non-iconic');
								menuTool.setAttribute("label", urls[id].replace(/^--/, ''));
								//menuTool.setAttribute("class", 'menu-iconic');
							var menuToolPopup = this.create("menupopup");
								menuToolPopup.setAttribute('class', 'menupopup-non-iconic');
							var currentPopup = menuToolPopup;
							var add = this.create("menuitem");
								add.setAttribute('class', 'menuitem-iconic');
								add.setAttribute("image", "chrome://ODPExtension/content/features/context-url-tools/img/open-all.png");
								add.setAttribute("label", this.getString('open.all.url.tools'));
								add.setAttribute("value", 'all');
								currentPopup.appendChild(add);
								currentPopup.appendChild(this.create('menuseparator'));
						}
						else if(urls[id].indexOf('-') === 0)
						{
							currentPopup.appendChild(this.create('menuseparator'));
						}
						else if(urls[id] == '')
						{
							if(!menuToolPopup){}
							else
							{
								menuTool.appendChild(menuToolPopup);
								rootPopup.appendChild(menuTool);
							}
							currentPopup = rootPopup;
						}
						else
						{
							var add = this.create("menuitem");
								add.setAttribute('class', 'menuitem-iconic');

						//adding a pretty icon
							//moz
								if(urls[id].indexOf('tubert.org') != -1)
									add.setAttribute("image", "chrome://ODPExtension/content/features/context-url-tools/img/tubert.png");
								else if(urls[id].indexOf('rpfuller.com') != -1 || urls[id].indexOf('rpfuller.org') != -1)
									add.setAttribute("image", "chrome://ODPExtension/content/features/context-url-tools/img/rp.png");
								else if(urls[id].indexOf('pmoz.info') != -1)
									add.setAttribute("image", "chrome://ODPExtension/content/features/context-url-tools/img/pmoz.png");
								else if(urls[id].indexOf('mathmos') != -1)
									add.setAttribute("image", "chrome://ODPExtension/content/features/context-url-tools/img/mathmos.png");
								else if(
										urls[id].indexOf('moz') != -1 ||
										urls[id].indexOf('odp') != -1 ||
										urls[id].indexOf('jtlabs.net') != -1 ||
										urls[id].indexOf('dlugan.com') != -1 ||
										urls[id].indexOf('sfromis') != -1 ||
										urls[id].indexOf('danielmclean') != -1
										)
									add.setAttribute("image", "chrome://ODPExtension/content/features/context-url-tools/img/odp.png");
								else if(urls[id].indexOf('godzuki.com.uy') != -1)
									add.setAttribute("image", "chrome://ODPExtension/content/features/context-url-tools/img/godzuki.png");
							//commands
								else if(urls[id].indexOf('command_') != -1)
									add.setAttribute("image", "chrome://ODPExtension/content/icon/icon16.png");
							//tools
								else if(urls[id].indexOf('domaintools') != -1)
									add.setAttribute("image", "chrome://ODPExtension/content/features/context-url-tools/img/domaintools.png");
								else if(urls[id].indexOf('w3.') != -1)
									add.setAttribute("image", "chrome://ODPExtension/content/features/context-url-tools/img/w3c.ico");
							//archive
								else if(urls[id].indexOf('archive.org') != -1)
									add.setAttribute("image", "chrome://ODPExtension/content/features/context-url-tools/img/archive.ico");
							//search engines
								else if(urls[id].indexOf('wolfram') != -1)
									add.setAttribute("image", "chrome://ODPExtension/content/features/context-url-tools/img/wolfram.ico");
								else if(
										urls[id].indexOf('yahoo') != -1 ||
										urls[id].indexOf('google') != -1 ||
										urls[id].indexOf('ask.com') != -1 ||
										urls[id].indexOf('bing') != -1
										)
									add.setAttribute("image", "chrome://ODPExtension/content/features/context-url-tools/img/spider.png");
							//blank
								else
									add.setAttribute("image", "chrome://ODPExtension/content/features/context-url-tools/img/blank.png");

								//if the url tool has a title for the menuitem
								if(/^[^\:]+\|/.test(urls[id]))
								{
									add.setAttribute("label", this.decodeUTF8Recursive(urls[id].replace(/\|.+$/, '')));
									add.setAttribute("tooltiptext", this.decodeUTF8Recursive(urls[id].replace(/^[^\|]+\|/, '')));
									add.setAttribute("value",  urls[id].replace(/^[^\|]+\|/, ''));
								}
								else
								{
									add.setAttribute("label", this.decodeUTF8Recursive(this.removeWWW(this.removeSchema(urls[id]))).replace(/^[^\/]+\//, ''));
									add.setAttribute("tooltiptext", this.decodeUTF8Recursive(urls[id]));
									add.setAttribute("value",  urls[id]);
								}

							currentPopup.appendChild(add);
						}
					}
					if(!menuToolPopup){}
					else
					{
						//menuTool.appendChild(menuToolPopup);
					//	rootPopup.appendChild(menuTool);
					}

					if(this.tagName(rootPopup.firstChild) == 'menuseparator')
					{
						this.removeElement(rootPopup.firstChild);
					}

					if(this.tagName(rootPopup.lastChild) == 'menuseparator')
					{
						this.removeElement(rootPopup.lastChild);
					}

				/*
				//get domains for building groups
					var domainTools = [];
					var domain = '';
					for(var id in urls)
					{
						//if the url tool has a title for the menuitem
						if(/^[^\:]+\|/.test(urls[id]))
							domain = this.getDomainFromURL(urls[id].replace(/^[^\|]+\|/, ''));
						else
							domain = this.getDomainFromURL(urls[id]);

						if(!domainTools[domain])
							domainTools[domain] = [];
						domainTools[domain][domainTools[domain].length] = urls[id];
					}
				//building groups by domains if contains more than 3 urls the domain
					for (var domain in domainTools)
					{
						if(domainTools[domain].length >= 3)
						{
							//constructing the menu
								var menuDomain = this.create("menu");
									menuDomain.setAttribute("label", domain);
									menuDomain.setAttribute("class", 'menu-iconic');
							//adding a pretty icon
								if(domain.indexOf('tubert.org') != -1)
									menuDomain.setAttribute("image", "chrome://ODPExtension/content/features/context-url-tools/img/tubert.png");
								else if(domain.indexOf('rpfuller.com') != -1 || domain.indexOf('rpfuller.org') != -1)
									menuDomain.setAttribute("image", "chrome://ODPExtension/content/features/context-url-tools/img/rp.png");
								else if(domain.indexOf('pmoz.info') != -1)
									menuDomain.setAttribute("image", "chrome://ODPExtension/content/features/context-url-tools/img/pmoz.png");
								else if(domain.indexOf('mathmos') != -1)
									menuDomain.setAttribute("image", "chrome://ODPExtension/content/features/context-url-tools/img/mathmos.png");
								else if(
										domain.indexOf('moz') != -1 ||
										domain.indexOf('odp') != -1 ||
										domain.indexOf('jtlabs.net') != -1 ||
										domain.indexOf('dlugan.com') != -1 ||
										domain.indexOf('sfromis') != -1 ||
										domain.indexOf('danielmclean') != -1
										)
									menuDomain.setAttribute("image", "chrome://ODPExtension/content/features/context-url-tools/img/odp.png");
								else
									menuDomain.setAttribute("image", "chrome://ODPExtension/content/features/context-url-tools/img/spider.png");
							//adding the items
								var tmp = this.create("menupopup");

								for(var id in domainTools[domain])
								{
									var add = this.create("menuitem");
										//if the url tool has a title for the menuitem
										if(/^[^\:]+\|/.test(domainTools[domain][id]))
										{
											add.setAttribute("label", domainTools[domain][id].replace(/\|.+$/, ''));
											add.setAttribute("value",  domainTools[domain][id].replace(/^[^\|]+\|/, ''));
										}
										else
										{
											add.setAttribute("label", this.decodeUTF8Recursive(this.removeWWW(this.removeSchema(domainTools[domain][id]))).replace(/^[^\/]+\//, ''));
											add.setAttribute("value",  domainTools[domain][id]);
										}
									tmp.appendChild(add);
								}
								menuDomain.appendChild(tmp);
							//adding the submenu to the menu
								this.getElement('context-url-tools-menupopup').appendChild(menuDomain);
						}
					}
				//domains with less than 3 urls will show directly in the menu
					for (var domain in domainTools)
					{
						if(domainTools[domain].length >= 3){}
						else
						{
							for(var id in domainTools[domain])
							{
								var add = this.create("menuitem");
									//if the url tool has a title for the menuitem
									if(/^[^\:]+\|/.test(domainTools[domain][id]))
									{
										add.setAttribute("label", domainTools[domain][id].replace(/\|.+$/, ''));
										add.setAttribute("value",  domainTools[domain][id].replace(/^[^\|]+\|/, ''));
									}
									else
									{
										add.setAttribute("label", this.decodeUTF8Recursive(this.removeWWW(this.removeSchema(domainTools[domain][id]))));
										add.setAttribute("value",  domainTools[domain][id]);
									}
								this.getElement('context-url-tools-menupopup').appendChild(add);
							}
						}
					}*/
			}
	return null;

}).apply(ODPExtension);

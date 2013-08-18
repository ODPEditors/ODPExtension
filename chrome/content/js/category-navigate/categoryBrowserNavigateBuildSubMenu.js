(function()
{
	//build the XUL for the menu that is currently browseable
	this.categoryBrowserNavigateBuildSubMenu = function(item, aCategories)
	{
			//normal menu
			var menu = this.create('menu');
				menu.setAttribute('label', item.getAttribute('label'));
				menu.setAttribute('value', item.getAttribute('value'));
				menu.setAttribute('done', 'true');

			var menupopup = this.create('menupopup');
				menupopup.setAttribute('ignorekeys', true);

			//alphabar menu if any
			var menuAlphabar = this.create('menu');
				menuAlphabar.setAttribute('label', 'Alphabar');
				menuAlphabar.setAttribute('done', 'true');
				//menuAlphabar.setAttribute('value', item.getAttribute('value'));

			var menupopupAlphabar = this.create('menupopup');
				menupopupAlphabar.setAttribute('ignorekeys', true);

			var aCategoryLastChildName;
			//adding the categories
				for(var id in aCategories)
				{
					aCategoryLastChildName = this.categoryGetLastChildName(aCategories[id]);
						var add = this.create("menuitem");
							add.setAttribute("label", this.categoryAbbreviate(aCategoryLastChildName));
							add.setAttribute("value", aCategories[id]);

					if(aCategoryLastChildName.length == 1)
						menupopupAlphabar.appendChild(add);
					else
						menupopup.appendChild(add);
				}
				//if there is an Alphabar put the alphabar in a submenu
				if(menupopupAlphabar.childNodes.length > 0)
				{
					//but if there is only an alphabar or there is less than 5 elements
					//not put the alphabar in a submenu
					if(menupopup.childNodes.length === 0 || menupopupAlphabar.childNodes.length < 5)
					{
						while(menupopupAlphabar.firstChild)
						{
							menupopup.appendChild(menupopupAlphabar.firstChild);
						}
					}
					else
					{
						menupopup.appendChild(this.create('menuseparator'));
						menuAlphabar.appendChild(menupopupAlphabar);
						menupopup.appendChild(menuAlphabar);
					}
				}
				menu.appendChild(menupopup);

			//parents menu
			if(this.subStrCount(item.getAttribute('value'), '/') > 0)
			{
				var menuParents = this.create('menu');
					menuParents.setAttribute('label', 'Parents');
					menuParents.setAttribute('style', 'font-weight:bold;');
					menuParents.setAttribute('done', 'true');

				var menupopupParents = this.create('menupopup');
					menupopupParents.setAttribute('ignorekeys', true);

				var aNodes = item.getAttribute('value').split('/');
				var path = '';
				for(var id in aNodes)
				{
					if(id==aNodes.length-1)
						break;
					path += aNodes[id]+'/';
					var add = this.create('menuitem');
						add.setAttribute('value', path.replace(/\/$/, ''));
						add.setAttribute('label', this.categoryAbbreviate(path).replace(/\/$/, ''));
						menupopupParents.appendChild(add);
				}
				menuParents.appendChild(menupopupParents);
				menupopup.appendChild(this.create('menuseparator'));
				menupopup.appendChild(menuParents);
			}


			//appending the menus
			if(item && item.hasAttribute('isFocused'))
			{
				if(item && item.parentNode)
				{
					if(item.hasAttribute('id'))
					{
						menu.setAttribute('id', item.getAttribute('id'));
						menu.setAttribute('style', item.getAttribute('style'));
					}
					if(item.hasAttribute('temporal'))
						menu.setAttribute('temporal', item.getAttribute('temporal'));

					try
					{
						item.parentNode.replaceChild(menu, item);
					}
					catch(e)
					{
						item.appendChild(menupopup);
					}
					menupopup.openPopup(menu, 'end_before');
				}
			}
			else
			{
				if(item && item.parentNode)
				{
					if(item.hasAttribute('id'))
					{
						menu.setAttribute('id', item.getAttribute('id'));
						menu.setAttribute('style', item.getAttribute('style'));
					}
					if(item.hasAttribute('temporal'))
						menu.setAttribute('temporal', item.getAttribute('temporal'));

					try
					{
						item.parentNode.replaceChild(menu, item);
					}
					catch(e)
					{
						item.appendChild(menupopup);
					}
				}
			}
	}
	return null;

}).apply(ODPExtension);

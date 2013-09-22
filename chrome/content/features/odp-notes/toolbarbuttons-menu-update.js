(function()
{

		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

		//when some of the menus popups (update,unreview,delete) checks if the menu should be filled with the data.
		//it build the menu one time. But if some preference change, it builds the menu again.

			this.odpURLNotesToolbarbuttonsMenuUpdate = function(aMenu, aEvent)
			{
				//this.dump('odpURLNotesToolbarbuttonsMenuUpdate', debugingThisFile);

				if(aMenu.getAttribute('build') == 'false')
				{
					//this.dump('odpURLNotesToolbarbuttonsMenuUpdate:build', debugingThisFile);

					this.removeChilds(aMenu);

					var notes = this.preferenceGet('url.notes.'+aMenu.getAttribute('value').replace(/\..*$/, '')).split('\n');
					var cache = [];
					for(var id in notes)
					{
						if(notes[id] != '')
						{
							var words = notes[id].split(' ');
							var word = words[0].replace(/(,|\.)+$/, '');
							if(!cache[word])
							{
								cache[word] = this.create('menupopup');
							}
							var menuitem = this.create('menuitem');
								menuitem.setAttribute('label', notes[id]);
								menuitem.setAttribute('class', 'menuitem-iconic');
								menuitem.setAttribute("image", "chrome://ODPExtension/content/features/odp-notes/img/word.png");

							//cache[word].appendChild(menuitem);
							aMenu.appendChild(menuitem);
						}
					}
				/*	for(var id in cache)
					{
						var menu = this.create('menu');
							menu.appendChild(cache[id]);
							menu.setAttribute('label', id);
							menu.setAttribute('class', 'menu-iconic');
							menu.setAttribute("image", "chrome://ODPExtension/content/features/context-url-tools/img/open-all.png");

						aMenu.appendChild(menu);
					}*/

					aMenu.setAttribute('build', true);
				}
				else
				{
				//	this.dump('odpURLNotesToolbarbuttonsMenuUpdate'+aMenu.getAttribute('build'), debugingThisFile);
				}

			}
	return null;

}).apply(ODPExtension);

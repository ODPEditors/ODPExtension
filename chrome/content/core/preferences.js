/*
	PREFERENCES - LOAD, FILL, SET AND OBSERVE PREFERENCES
	tito (ed:development) <tito.bouzout@gmail.com>
*/
	(function()
	{
		/*ODPExtension global variables*/
			//preferences names
			this.preferences = {};

			this.preferences.bools = [];
			this.preferences.radios = [];

			this.preferences.ints = [];

			this.preferences.colors = [];
			this.preferences.strings = [];
			this.preferences.stringsMultiline = [];
			this.preferences.stringsMultilineSort = [];

			this.preferences.menuList = [];

		/*this function local variables*/
			var debugingThisFile = false;//sets debuging on/off for this JavaScript file

  /*shared*/var branch;//a reference to preferencesManagerComponent.wrappedJSObject.branchs['ODPExtension']
  /*shared*/var pref;//a reference to preferencesManagerComponent.wrappedJSObject.prefs['ODPExtension']

		/*the preference manager*/
			var preferencesManagerComponent = Components.classes['@particle.universe.tito/PreferencesManager;7']
                                    			.getService().wrappedJSObject;

			this.addListener('browserInstantiated', function (){ODPExtension.preferencesInit()});//this is the very first listener called by the extension
			this.addListener('browserLoad', function (){ODPExtension.preferencesBrowserLoad()});//this is the second listener called by the extension

		//called just when a new instance of firefox is created (no window, many windows can be from one instance)
			this.preferencesInit = function()
			{
				this.dump('preferencesInit', debugingThisFile);

				//calls the references to branchs and prefs
				branch = preferencesManagerComponent.getBranch('ODPExtension');
				pref = preferencesManagerComponent.getPref('ODPExtension');
				//fills the pref reference
				this.preferencesLoad();

			}
		//called when a new window is created
			this.preferencesBrowserLoad = function()
			{
				this.dump('preferencesBrowserLoad', debugingThisFile);
				//calls the references to branchs and prefs
				branch = preferencesManagerComponent.getBranch('ODPExtension');
				pref = preferencesManagerComponent.getPref('ODPExtension');
				//if this window/dialog is the preferences window fill the form
				if(this.getElement('preferences-window'))
				{
					this.preferencesFill();
					if(this.preferenceExists('preferences.font.size', 'char'))
						this.preferencesChangeFontSize(this.preferenceGet('preferences.font.size'));
				}
			}
			this.preferencesChangeFontSize = function(aFontSize)
			{
				var textbox = document.getElementsByTagName('textbox');
				for(var id in textbox)
				{
					if(textbox[id].style)
						textbox[id].style.setProperty("font-size", aFontSize+'px', "important");
				}
			}
		//
		//sets the referenced array with all the preferences
			this.preferencesLoad = function ()
			{
				this.dump('preferencesLoad', debugingThisFile);

				for(var id in this.preferences.bools)
					pref[this.preferences.bools[id]] = branch.getBoolPref(this.preferences.bools[id]);

				for(var id in this.preferences.radios)
					pref[this.preferences.radios[id]] = branch.getBoolPref(this.preferences.radios[id]);

				for(var id in this.preferences.ints)
					pref[this.preferences.ints[id]] = branch.getIntPref(this.preferences.ints[id]);

				for(var id in this.preferences.colors)
					pref[this.preferences.colors[id]] = this.decodeUTF8(branch.getCharPref(this.preferences.colors[id]));

				for(var id in this.preferences.strings)
					pref[this.preferences.strings[id]] = this.decodeUTF8(branch.getCharPref(this.preferences.strings[id]));

				for(var id in this.preferences.stringsMultiline)
					pref[this.preferences.stringsMultiline[id]] = this.decodeUTF8(branch.getCharPref(this.preferences.stringsMultiline[id]));

				for(var id in this.preferences.stringsMultilineSort)
					pref[this.preferences.stringsMultilineSort[id]] = this.decodeUTF8(branch.getCharPref(this.preferences.stringsMultilineSort[id]));

				for(var id in this.preferences.menuList)
					pref[this.preferences.menuList[id]] = this.decodeUTF8(branch.getCharPref(this.preferences.menuList[id]));
			};
		//fills the preferences dialog/window
			this.preferencesFill = function ()
			{
				this.dump('preferencesFill', debugingThisFile);

				for(var id in this.preferences.bools)
				{
					var item = this.getBrowserElement(this.preferences.bools[id]);
					if(item)//if the preference is editable
						item.setAttribute("checked",  pref[this.preferences.bools[id]]);
				}

				for(var id in this.preferences.radios)
				{
					var item = this.getBrowserElement(this.preferences.radios[id]);
					if(item)//if the preference is editable
					{
						var value = pref[this.preferences.radios[id]];
						if(value===true)
							item.click();
					}
				}

				for(var id in this.preferences.ints)
				{
					var item = this.getBrowserElement(this.preferences.ints[id]);
					if(item)//if the preference is editable
						item.value = pref[this.preferences.ints[id]];
				}

				for(var id in this.preferences.colors)
				{
					var item = this.getBrowserElement(this.preferences.colors[id]);
					if(item)//if the preference is editable
						item.color = this.trim(pref[this.preferences.colors[id]]);
				}

				for(var id in this.preferences.strings)
				{
					var item = this.getBrowserElement(this.preferences.strings[id]);
					if(item)//if the preference is editable
						item.value = this.trim(pref[this.preferences.strings[id]]);
				}

				for(var id in this.preferences.stringsMultiline)
				{
					var item = this.getBrowserElement(this.preferences.stringsMultiline[id]);
					if(item)//if the preference is editable
						item.value = this.trim(pref[this.preferences.stringsMultiline[id]])+'\n';
				}

				for(var id in this.preferences.stringsMultilineSort)
				{
					var item = this.getBrowserElement(this.preferences.stringsMultilineSort[id]);
					if(item)//if the preference is editable
						item.value = this.trim(pref[this.preferences.stringsMultilineSort[id]])+'\n';
				}

				for(var id in this.preferences.menuList)
				{
					var item = this.getBrowserElement(this.preferences.menuList[id]);
					if(item)//if the preference is editable
					{
						var menuList = item.firstChild;
						for(var i in menuList.childNodes)
						{
							if(menuList.childNodes[i].getAttribute('value') == pref[this.preferences.menuList[id]])
							{
								item.selectedItem = menuList.childNodes[i];
								break;
							}
						}
					}
				}

				this.dispatchEvent('onPreferencesFilled');
			};
		//when the window or dialog that holds the preferences is closed this event is fired
			this.preferencesWindowClosed = function()
			{
				this.dump('preferencesWindowClosed', debugingThisFile);

				this.dispatchEvent('onPreferencesWindowClosed');
			}
		//saves and apply the preferences
			this.preferencesSave = function ()
			{
				this.dump('preferencesSave', debugingThisFile);

				preferencesManagerComponent.removeObserver('ODPExtension');

				var value;

				for(var id in this.preferences.bools)
				{
					if(this.preferences.bools[id].indexOf('locked.') !== 0)
					{
						var item = this.getBrowserElement(this.preferences.bools[id]);
						if(item)
						{
							//if the preference is editable
							value = (item.getAttribute("checked") == "true");
							branch.setBoolPref(this.preferences.bools[id],  value);
							pref[this.preferences.bools[id]] = value;
						}
					}
				}

				for(var id in this.preferences.radios)
				{
					if(this.preferences.radios[id].indexOf('locked.') !== 0)
					{
						var item = this.getBrowserElement(this.preferences.radios[id]);
						if(item)
						{
							value = (item.getAttribute("selected") == "true");
							branch.setBoolPref(this.preferences.radios[id], value);
							pref[this.preferences.radios[id]] = value;
						}
					}
				}

				for(var id in this.preferences.ints)
				{
					if(this.preferences.ints[id].indexOf('locked.') !== 0)
					{
						var item = this.getBrowserElement(this.preferences.ints[id]);
						if(item)
						{
							value = item.value;
							branch.setIntPref(this.preferences.ints[id], value);
							pref[this.preferences.ints[id]] = value;
						}
					}
				}

				for(var id in this.preferences.colors)
				{
					if(this.preferences.colors[id].indexOf('locked.') !== 0)
					{
						var item = this.getBrowserElement(this.preferences.colors[id]);
						if(item)
						{
							value = this.trim(item.color);
							branch.setCharPref(this.preferences.colors[id], this.encodeUTF8(value));
							pref[this.preferences.colors[id]] = value;
						}
					}
				}

				for(var id in this.preferences.strings)
				{
					if(this.preferences.strings[id].indexOf('locked.') !== 0)
					{
						var item = this.getBrowserElement(this.preferences.strings[id]);
						if(item)
						{
							value = this.trim(item.value);
							branch.setCharPref(this.preferences.strings[id], this.encodeUTF8(value));
							pref[this.preferences.strings[id]] = value;
						}
					}
				}

				for(var id in this.preferences.stringsMultiline)
				{
					if(this.preferences.stringsMultiline[id].indexOf('locked.') !== 0)
					{
						var item = this.getBrowserElement(this.preferences.stringsMultiline[id]);
						if(item)
						{
							value = this.trim(item.value);
							branch.setCharPref(this.preferences.stringsMultiline[id], this.encodeUTF8(value));
							pref[this.preferences.stringsMultiline[id]] = value;
						}
					}
				}

				for(var id in this.preferences.stringsMultilineSort)
				{
					if(this.preferences.stringsMultilineSort[id].indexOf('locked.') !== 0)
					{
						var item = this.getBrowserElement(this.preferences.stringsMultilineSort[id]);
						if(item)
						{
							value = this.trim(this.arrayUnique(this.trim(item.value).split('\n')).sort(this.sortLocale).join('\n'));
							branch.setCharPref(this.preferences.stringsMultilineSort[id], this.encodeUTF8(value));
							pref[this.preferences.stringsMultilineSort[id]] = value;
						}
					}
				}

				for(var id in this.preferences.menuList)
				{
					if(this.preferences.menuList[id].indexOf('locked.') !== 0)
					{
						var item = this.getBrowserElement(this.preferences.menuList[id]);
						if(item)
						{
							value = item.selectedItem.value;
							branch.setCharPref(this.preferences.menuList[id], this.encodeUTF8(value));
							pref[this.preferences.menuList[id]] = value;
						}
					}
				}

				this.dispatchEvent('onPreferencesSaved');

				preferencesManagerComponent.addObserver('ODPExtension');
			};
		//apply the preferences
			//users are not allowed to change preferences starting with locked via preferences window
			this.preferencesApply = function ()
			{
				this.dump('preferencesApply', debugingThisFile);

				for(var id in this.preferences.bools)
				{
					if(this.preferences.bools[id].indexOf('locked.') !== 0 && this.getBrowserElement(this.preferences.bools[id]))//if the preference is editable
						pref[this.preferences.bools[id]] = (this.getBrowserElement(this.preferences.bools[id]).getAttribute("checked") == "true");
				}

				for(var id in this.preferences.radios)
				{
					if(this.preferences.radios[id].indexOf('locked.') !== 0 && this.getBrowserElement(this.preferences.radios[id]))//if the preference is editable
						pref[this.preferences.radios[id]] = (this.getBrowserElement(this.preferences.radios[id]).getAttribute("selected") == "true");
				}

				for(var id in this.preferences.ints)
				{
					if(this.preferences.ints[id].indexOf('locked.') !== 0 && this.getBrowserElement(this.preferences.ints[id]))//if the preference is editable
						pref[this.preferences.ints[id]] = this.getBrowserElement(this.preferences.ints[id]).value;
				}

				for(var id in this.preferences.colors)
				{
					if(this.preferences.colors[id].indexOf('locked.') !== 0 && this.getBrowserElement(this.preferences.colors[id]))//if the preference is editable
						pref[this.preferences.colors[id]] = this.trim(this.getBrowserElement(this.preferences.colors[id]).color);
				}

				for(var id in this.preferences.strings)
				{
					if(this.preferences.strings[id].indexOf('locked.') !== 0 && this.getBrowserElement(this.preferences.strings[id]))//if the preference is editable
						pref[this.preferences.strings[id]] = this.trim(this.getBrowserElement(this.preferences.strings[id]).value);
				}

				for(var id in this.preferences.stringsMultiline)
				{
					if(this.preferences.stringsMultiline[id].indexOf('locked.') !== 0 && this.getBrowserElement(this.preferences.stringsMultiline[id]))//if the preference is editable
						pref[this.preferences.stringsMultiline[id]] = this.trim(this.getBrowserElement(this.preferences.stringsMultiline[id]).value);
				}

				for(var id in this.preferences.stringsMultilineSort)
				{
					if(this.preferences.stringsMultilineSort[id].indexOf('locked.') !== 0 && this.getBrowserElement(this.preferences.stringsMultilineSort[id]))//if the preference is editable
						pref[this.preferences.stringsMultilineSort[id]] = this.trim(this.arrayUnique(this.trim(this.getBrowserElement(this.preferences.stringsMultilineSort[id]).value).split('\n')).sort().join('\n'));
				}

				for(var id in this.preferences.menuList)
				{
					if(this.preferences.menuList[id].indexOf('locked.') !== 0 && this.getBrowserElement(this.preferences.menuList[id]))//if the preference is editable
					{
						var menuList = this.getBrowserElement(this.preferences.menuList[id]);
						pref[this.preferences.menuList[id]] = menuList.selectedItem.value;
					}
				}

				this.dispatchEvent('onPreferencesApplied');
			};
		//saves a preference, if dontRemoveObserver is set to true will cause to dispatch the event onpreferencesset to all the windows
			this.preferenceSet = function (aName, aValue, dontRemoveObserver)
			{
				this.dump('preferenceSet:aName:'+aName+':aValue:'+aValue, debugingThisFile);

				if(!dontRemoveObserver)
					preferencesManagerComponent.removeObserver('ODPExtension');

				if(this.inArray(this.preferences.bools, aName))
				{
					if(aValue === 'true')
						aValue = true;
					else if(aValue === 'false')
						aValue = false;

					branch.setBoolPref(aName, aValue);
					pref[aName] = aValue;
				}
				else if(this.inArray(this.preferences.radios, aName))
				{
					if(aValue === 'true')
						aValue = true;
					else if(aValue === 'false')
						aValue = false;

					branch.setBoolPref(aName, aValue);
					pref[aName] = aValue;
				}
				else if(this.inArray(this.preferences.ints, aName))
				{
					branch.setIntPref(aName, aValue);
					pref[aName] = aValue;
				}
				else if(this.inArray(this.preferences.colors, aName))
				{
					branch.setCharPref(aName, this.encodeUTF8(this.trim(aValue)));
					pref[aName] = aValue;
				}
				else if(this.inArray(this.preferences.strings, aName))
				{
					branch.setCharPref(aName, this.encodeUTF8(this.trim(aValue)));
					pref[aName] = aValue;
				}
				else if(this.inArray(this.preferences.stringsMultiline, aName))
				{
					branch.setCharPref(aName, this.encodeUTF8(this.trim(aValue)));
					pref[aName] = aValue;
				}
				else if(this.inArray(this.preferences.stringsMultilineSort, aName))
				{
					branch.setCharPref(aName, this.encodeUTF8(this.trim(this.arrayUnique(this.trim(aValue).split('\n')).sort(this.sortLocale).join('\n'))));
					pref[aName] = this.trim(this.arrayUnique(this.trim(aValue).split('\n')).sort(this.sortLocale).join('\n'));
				}
				else if(this.inArray(this.preferences.menuList, aName))
				{
					branch.setCharPref(aName, this.encodeUTF8(aValue));
					pref[aName] = aValue;
				}
				else
				{
					this.dump('preferenceSet:preferenceNotFound:aName:'+aName, debugingThisFile);
				}
				if(!dontRemoveObserver)
					preferencesManagerComponent.addObserver('ODPExtension');
			};

		//returns the value of a browser's preference
			this.preferenceBrowserGet = function(aName)
			{
				try
				{
					switch(aName)
					{
						case 'accessibility.typeaheadfind' :
						{
							return this.service('pref', 'accessibility').getBoolPref('typeaheadfind');
						}
					}
				}
				catch(e)
				{
					return '';
				}
			};
		//returns the value of the referenced preference
			this.preferenceGet = function(aName)
			{
				if(!(aName in pref))
					this.error('Trying to obtain an unknow preference:"'+aName+'"');

				this.dump('preferenceGet:aName:'+aName+':pref[aName]:'+pref[aName], debugingThisFile);
				return pref[aName];
			};
		//changes the value of a preference and dispatch the event onpreferenceset
			this.preferenceChange = function(aName, aValue)
			{
				this.dump('preferenceChanged:aName:'+aName+':pref[aName]:'+pref[aName], debugingThisFile);

				this.preferenceSet(aName, aValue, true);
			};
		//creates a preference
			this.preferenceCreate = function(aName, aValue, aType)
			{
				if(aType=='bool')
				{
					branch.setBoolPref(aName, aValue);
					this.preferences.bools[this.preferences.bools.length] = aName;
					pref[aName] = aValue;
				}
				else if(aType=='char')
				{
					branch.setCharPref(aName, aValue);
					this.preferences.strings[this.preferences.strings.length] = aName;
					pref[aName] = aValue;
				}
			}
		//checks if a preference exists
			this.preferenceExists = function(aName, aType)
			{
				if(aType=='bool')
				{
					try
					{
						var aValue = branch.getBoolPref(aName);
					}
					catch(e)
					{
						return false;
					}
					if(!this.inArray(this.preferences.bools, aName))
						this.preferences.bools[this.preferences.bools.length] = aName;
					pref[aName] = aValue;
					return true;
				}
				if(aType=='char')
				{
					try
					{
						var aValue = branch.getCharPref(aName);
					}
					catch(e)
					{
						return false;
					}
					if(!this.inArray(this.preferences.strings, aName))
						this.preferences.strings[this.preferences.strings.length] = aName;
					pref[aName] = this.decodeUTF8(aValue);
					return true;
				}
			}
		//open the preferences window, also bring focus if unfocused and is already opened
			this.preferencesOpen = function()
			{
				//avoids lose focus of the selected pane if the window is open
				//also avoids open the window again
				if(this.preferencesWindow && !this.preferencesWindow.closed)
					this.preferencesWindow.focus();
				else
					this.preferencesWindow = window.open("chrome://ODPExtension/content/xul/preferences/preferences.xul", "ODPExtension-preferences", "centerscreen,chrome,resizable");
			}

		//set to defaults the preferences
			this.preferencesDefault = function()
			{
				var branchDefault = preferencesManagerComponent.getDefaultBranch('ODPExtension');

				for(var id in this.preferences.bools)
					this.preferenceSet(this.preferences.bools[id], branchDefault.getBoolPref(this.preferences.bools[id]));

				for(var id in this.preferences.radios)
					this.preferenceSet(this.preferences.radios[id], branchDefault.getBoolPref(this.preferences.radios[id]));

				for(var id in this.preferences.ints)
					this.preferenceSet(this.preferences.ints[id], branchDefault.getIntPref(this.preferences.ints[id]));

				for(var id in this.preferences.colors)
					this.preferenceSet(this.preferences.colors[id], this.decodeUTF8(branchDefault.getCharPref(this.preferences.colors[id])));

				for(var id in this.preferences.strings)
					this.preferenceSet(this.preferences.strings[id], this.decodeUTF8(branchDefault.getCharPref(this.preferences.strings[id])));

				for(var id in this.preferences.stringsMultiline)
					this.preferenceSet(this.preferences.stringsMultiline[id],  this.decodeUTF8(branchDefault.getCharPref(this.preferences.stringsMultiline[id])));

				for(var id in this.preferences.stringsMultilineSort)
					this.preferenceSet(this.preferences.stringsMultilineSort[id],  this.decodeUTF8(branchDefault.getCharPref(this.preferences.stringsMultilineSort[id])));

				for(var id in this.preferences.menuList)
					this.preferenceSet(this.preferences.menuList[id],  this.decodeUTF8(branchDefault.getCharPref(this.preferences.menuList[id])));

				if(this.getElement('preferences-window'))
				{
					this.preferencesFill();
				}
			}
		//set to defaults the preferences
			this.preferencesExport = function()
			{
				if(this.getElement('preferences-window'))
				{
					this.preferencesSave();
				}

				this.dump('preferencesExport', debugingThisFile);

				var forExport = '';

				for(var id in this.preferences.bools)
				{
					if(this.preferences.bools[id].indexOf('locked.') !== 0 && (!this.getElement('preferences-window') || this.getBrowserElement(this.preferences.bools[id])))//if the preference is editable
						forExport += this.preferences.bools[id]+' = '+this.encodeUTF8(pref[this.preferences.bools[id]])+'\n';
				}

				for(var id in this.preferences.radios)
				{
					if(this.preferences.radios[id].indexOf('locked.') !== 0 && (!this.getElement('preferences-window') ||  this.getBrowserElement(this.preferences.radios[id])))//if the preference is editable
						forExport += this.preferences.radios[id]+' = '+this.encodeUTF8(pref[this.preferences.radios[id]])+'\n';
				}

				for(var id in this.preferences.ints)
				{
					if(this.preferences.ints[id].indexOf('locked.') !== 0 && (!this.getElement('preferences-window') ||  this.getBrowserElement(this.preferences.ints[id])))//if the preference is editable
						forExport += this.preferences.ints[id]+' = '+this.encodeUTF8(pref[this.preferences.ints[id]])+'\n';
				}

				for(var id in this.preferences.colors)
				{
					if(this.preferences.colors[id].indexOf('locked.') !== 0 && (!this.getElement('preferences-window') ||  this.getBrowserElement(this.preferences.colors[id])))//if the preference is editable
						forExport += this.preferences.colors[id]+' = '+this.encodeUTF8(pref[this.preferences.colors[id]])+'\n';
				}

				for(var id in this.preferences.strings)
				{
					if(this.preferences.strings[id].indexOf('locked.') !== 0 && (!this.getElement('preferences-window') ||  this.getBrowserElement(this.preferences.strings[id])))//if the preference is editable
						forExport += this.preferences.strings[id]+' = '+this.encodeUTF8(pref[this.preferences.strings[id]])+'\n';
				}

				for(var id in this.preferences.stringsMultiline)
				{
					if(this.preferences.stringsMultiline[id].indexOf('locked.') !== 0 && (!this.getElement('preferences-window') ||  this.getBrowserElement(this.preferences.stringsMultiline[id])))//if the preference is editable
						forExport += this.preferences.stringsMultiline[id]+' = '+this.encodeUTF8(pref[this.preferences.stringsMultiline[id]])+'\n';
				}

				for(var id in this.preferences.stringsMultilineSort)
				{
					if(this.preferences.stringsMultilineSort[id].indexOf('locked.') !== 0 && (!this.getElement('preferences-window') || this.getBrowserElement(this.preferences.stringsMultilineSort[id])))//if the preference is editable
						forExport += this.preferences.stringsMultilineSort[id]+' = '+this.encodeUTF8(pref[this.preferences.stringsMultilineSort[id]])+'\n';
				}
				for(var id in this.preferences.menuList)
				{
					if(this.preferences.menuList[id].indexOf('locked.') !== 0 && (!this.getElement('preferences-window') || this.getBrowserElement(this.preferences.menuList[id])))//if the preference is editable
					{
						forExport += this.preferences.menuList[id]+' = '+this.encodeUTF8(pref[this.preferences.menuList[id]])+'\n';
					}
				}

				var aPath = this.fileWrite('preferences.backup.txt', forExport);
				var aFile = this.fileAskUserFileSave("ODPExtension", 'txt');
				if(aFile)
					this.fileCopy(aPath, aFile.file.path);
			}
		//import the preferences from a file
			this.preferencesImport = function()
			{
				var aFile = this.fileAskUserFileOpen("ODPExtension", 'txt');
				if(aFile)
				{
					this.fileCopy(aFile.file.path, this.extensionDirectory().path+'/imported.preferences.txt');
					var toImport =  this.fileRead('/imported.preferences.txt').split('\n');
					for(var id in toImport)
					{
						if(this.trim(toImport[id]) != '')
						{
							this.preferenceSet(toImport[id].split(' = ')[0], this.decodeUTF8(toImport[id].split(' = ')[1]));
						}
					}
					if(this.getElement('preferences-window'))
					{
						this.preferencesFill();
					}
				}
			}

		return null;

	}).apply(ODPExtension);
	/*

 force import functions from the compiler.
  this.sortLocale(

	*/
(function()
{
	this.service = function(aName, aSome)
	{
		if(!this.services)
			this.services = {};

		if(!this.services[aName])
		{
			switch(aName)
			{
				case 'ios':
				{
					this.services[aName] = Components.classes["@mozilla.org/network/io-service;1"]
												.getService(Components.interfaces.nsIIOService);
					break;
				}
				case 'fs':
				{
					this.services[aName] = Components.classes["@mozilla.org/browser/favicon-service;1"]
                              					.getService(Components.interfaces.nsIFaviconService);
					break;
				}
				case 'sss':
				{
					this.services[aName] = Components.classes["@mozilla.org/content/style-sheet-service;1"]
												.getService(Components.interfaces.nsIStyleSheetService);
					break;
				}
				case 'hsgh2':
				{
					this.services[aName] = Components.classes["@mozilla.org/browser/nav-history-service;1"]
                               					.getService(Components.interfaces.nsIGlobalHistory2);
					break;
				}
				case 'pref':
				{
					aName = aName+'.'+aSome;
					if(!this.services[aName])
					{
						this.services[aName] = Components.classes["@mozilla.org/preferences-service;1"]
													.getService(Components.interfaces.nsIPrefService).getBranch(aSome+'.');
						this.services[aName].QueryInterface(Components.interfaces.nsIPrefBranch2);

						return this.services[aName];
					}
					return this.services[aName];
					break;
				}
				case 'spell':
				{
					var spellclass = "@mozilla.org/spellchecker/myspell;1";
					if ("@mozilla.org/spellchecker/hunspell;1" in Components.classes)
						spellclass = "@mozilla.org/spellchecker/hunspell;1";
					if ("@mozilla.org/spellchecker/engine;1" in Components.classes)
						spellclass = "@mozilla.org/spellchecker/engine;1";

					this.services[aName] = {};
					//this one check if a word is misspelled looking at the normal dictionary
					this.services[aName].spellCheckEngine = Components.classes[spellclass]
																.createInstance(Components.interfaces.mozISpellCheckingEngine);
					//THIS one.. check if a word is misspelled by looking at the PERSONAL dictionary
					//( maybe a non-recognized(by the normal dict) word was added as CORRECT to the personal dictionary )
					this.services[aName].mPersonalDictionary = Components.classes["@mozilla.org/spellchecker/personaldictionary;1"]
																.getService(Components.interfaces.mozIPersonalDictionary);
					break;
				}
			}
		}
		return this.services[aName];
  	}

	return null;

}).apply(ODPExtension);

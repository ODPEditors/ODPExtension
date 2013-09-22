(function()
{

		//sets debuging on/off for this JavaScript file

			var debugingThisFile = false;//sets debuging on/off for this JavaScript file

		//Extension initialization
			//when the browser load...
			this.addListener('browserInstantiated', function(){ODPExtension.browserInstantiated()});
			this.addListener('browserLoad', function(){ODPExtension.ODPExtension()});

			//a new browser was instantiaded ( not window, many window can be from the same profile or browser instance)
			this.browserInstantiated = function()
			{
				// this.dump('browserInstantiated', debugingThisFile);

				//db initialization
				this.db = this.databaseGet('ODPExtension');
				//tables creation if these no exists
				this.categoryHistoryCreateTable();
			}

			//a new window has been created, this will be executed only one time per window
			this.ODPExtension = function()
			{
				//this.dump('ODPExtension', debugingThisFile);

				//db
				this.db = this.databaseGet('ODPExtension');
				this.categoryHistoryStatements();

				//initializing some vars..
				this.focusedURL = '';
				this.focusedDomain = '';
				this.focusedURLSubdomain = '';

				this.focusedCategory = '';
				this.fromCategoryAction = '';

				//panel dragging
				this.panelInformationDragX = 0;
				this.panelInformationDragY = 0;
				this.panelInformationDragTimeout = null;
				this.panelInformationDragging = false;
				//from categortye
				this.fromCategoryCanceledAutoPopupTimeout = null;
				//listeners are added to the queue, wait for the shoot "initListeners"
				this.addListeners();
				//preferences are already loaded but some of them are changed for quickly usage or sanitized
				//also some are not really a preference but a global object
				//also maps some preferences to other objects
				this.preferencesLoadGlobal();//global for all the instances of this browser
				this.preferencesLoadLocal();//local for every window of this browser instance
				//UI

				this.userInterfaceLoad();//loads to memory references to elements and setup some basic UI
				this.userInterfaceUpdate();//updates the interface based on user preferences

				//extension loaded ¡yay! start the listeners! wait the extension maybe is disabled, check the listeners
				this.checkListeners();

				//every extension(that uses urlbaricon)  installed after this extension will cause to our icon to move to the left
				//then and I want the icon to the rigth! (to avoid icon moves when switching tabs that hide some urlbaricons but keep our icon show)
				setTimeout(function(){ODPExtension.extensionIconUpdatePosition();}, 500);
			}

			this.extensionToggle = function()
			{
				this.preferenceChange('enabled', !this.preferenceGet('enabled'));//the listener for this pref will do the work
			}

			this.checkListeners = function()
			{
				if(this.preferenceGet('enabled'))
					this.initListeners();
				else
					this.removeListeners();
			}

	return null;

}).apply(ODPExtension);

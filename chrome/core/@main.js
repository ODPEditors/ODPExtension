(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true; //sets debuging on/off for this JavaScript file

	this.addListener('onFirstRun', function() {

		ODPExtension.alert('First run! Welcome to ODPExtension :), We will run 3 basic steps for the first run, five minutes, please be patient.');

		ODPExtension.alert('Step 1: Deleting old data from previous versions... (if any)');
		var oldData = ODPExtension.folderListContent('')
		for (var id in oldData) {
			if (oldData[id] != 'ODPExtension.sqlite' && oldData[id] != 'CategoriesTXT.sqlite')
				ODPExtension.fileRemove(oldData[id]);
		}

		ODPExtension.alert('Step 1 done!, Step 2: Importing categories to the "category browser"');
		ODPExtension.categoryHistoryImportCategoriesHistory();

		ODPExtension.alert('Step 2 done!, Last step! : Downloading a copy of "categories.txt", check the statusbar');
		ODPExtension.categoriesTXTUpdate(true);
	});

	this.addListener('afterBrowserLoad', function() {
		//loads to memory references to elements and setup some basic UI
		ODPExtension.dispatchEvent('userInterfaceLoad', ODPExtension.preferenceGet('enabled'));

		ODPExtension.dispatchEvent('userInterfaceUpdate', ODPExtension.preferenceGet('enabled'));

		ODPExtension.checkListeners();

		ODPExtension.dispatchEvent('onLocationChangeNotDocumentLoad', ODPExtension.documentFocusedGetLocation());
		ODPExtension.dispatchEvent('onLocationChange', ODPExtension.documentFocusedGetLocation());
	});

	this.extensionToggle = function() {
		this.preferenceChange('enabled', !this.preferenceGet('enabled')); //the listener for this pref will do the work
	}

	this.checkListeners = function() {
		if (this.preferenceGet('enabled'))
			this.initListeners();
		else
			this.removeListeners();
	}

	return null;

}).apply(ODPExtension);
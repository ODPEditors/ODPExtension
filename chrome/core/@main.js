(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true; //sets debuging on/off for this JavaScript file

	this.addListener('onFirstRun', function() {

		var oldData = ODPExtension.folderListContent('')
		for (var id in oldData) {
			if (oldData[id] != 'ODPExtension.sqlite')
				ODPExtension.fileRemove(oldData[id]);
		}

		ODPExtension.categoriesTXTDatabaseOpen();
		ODPExtension.rdfDatabaseOpen();

		ODPExtension.dispatchGlobalEvent('databaseCreate');
		ODPExtension.dispatchGlobalEvent('databaseReady');
		ODPExtension.categoryHistoryImportCategoriesHistory();
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
(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true; //sets debuging on/off for this JavaScript file

	this.addListener('afterBrowserLoad', function() {
		//loads to memory references to elements and setup some basic UI
		ODPExtension.dispatchEvent('userInterfaceLoad', ODPExtension.preferenceGet('enabled'));

		ODPExtension.dispatchEvent('userInterfaceUpdate', ODPExtension.preferenceGet('enabled'));

		ODPExtension.checkListeners();

		ODPExtension.dispatchEvent('onLocationChange', ODPExtension.focusedURL);
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
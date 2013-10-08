(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//handle the single click over the "d"

	var extensionIconClickTimeout = false;
	this.extensionIconClick = function(aEvent, waitForClick) {
		//allows double click wihtout firing click alone twice, tricky.
		if (!waitForClick) {
			//clears the timeout of the first click and add another for the dblclick, which will be cleared in the dblclick funtion
			clearTimeout(extensionIconClickTimeout);
			extensionIconClickTimeout = setTimeout(function() {
				ODPExtension.extensionIconClick(aEvent, true);
			}, 333);
		} else {
			//event mapping
			if (aEvent.button == 0) {
				if (aEvent.ctrlKey)
					this.extensionIconClickCommand('copyLocationPHPBB');
				else if (aEvent.shiftKey)
					this.extensionIconClickCommand('copyLocationHTML');
				else if (aEvent.altKey)
					this.extensionIconClickCommand('');
				else
					this.extensionIconClickCommand('copyLocation');
			} else if (aEvent.button == 1) {
				if (aEvent.ctrlKey)
					this.extensionIconClickCommand('');
				else if (aEvent.shiftKey)
					this.extensionIconClickCommand('');
				else if (aEvent.altKey)
					this.extensionIconClickCommand('');
				else
					this.extensionIconClickCommand('domainSiteSE');
			} else if (aEvent.button == 2) {
				if (aEvent.ctrlKey)
					this.extensionIconClickCommand('');
				else if (aEvent.shiftKey)
					this.extensionIconClickCommand('');
				else if (aEvent.altKey)
					this.extensionIconClickCommand('');
				else
					this.extensionIconClickCommand('openDContextMenu');
			}
		}
	}

	//handle the double click over the "d"

	this.extensionIconClickDouble = function(aEvent) {
		clearTimeout(extensionIconClickTimeout);

		//event mapping
		if (aEvent.button == 0) {
			if (aEvent.ctrlKey)
				this.extensionIconClickCommand('domainSiteSE');
			else if (aEvent.shiftKey)
				this.extensionIconClickCommand('');
			else if (aEvent.altKey)
				this.extensionIconClickCommand('');
			else
				this.extensionIconClickCommand('domainSiteODP');
		} else if (aEvent.button == 1) {
			if (aEvent.ctrlKey)
				this.extensionIconClickCommand('');
			else if (aEvent.shiftKey)
				this.extensionIconClickCommand('');
			else if (aEvent.altKey)
				this.extensionIconClickCommand('');
			else
				this.extensionIconClickCommand('');
		} else if (aEvent.button == 2) {
			if (aEvent.ctrlKey)
				this.extensionIconClickCommand('');
			else if (aEvent.shiftKey)
				this.extensionIconClickCommand('');
			else if (aEvent.altKey)
				this.extensionIconClickCommand('');
			else
				this.extensionIconClickCommand('highlightListings');
		}
	}

	return null;

}).apply(ODPExtension);
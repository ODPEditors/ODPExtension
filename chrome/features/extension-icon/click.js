(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//handle the single click over the "d"

	this.extensionIconClick = function(aEvent, waitForClick) {
		//allows double click wihtout firing click alone twice, tricky.
		if (!waitForClick) {
			//clears the timeout of the first click and add another for the dblclick, which will be cleared in the dblclick funtion
			try {
				clearTimeout(this.clickWaitDoubleClick);
			} catch (e) { /*shhh*/ }
			this.clickWaitDoubleClick = setTimeout(function() {
				ODPExtension.extensionIconClick(aEvent, true);
			}, 333);
		} else {
			//event mapping
			if (aEvent.button == 0) {
				if (aEvent.ctrlKey)
					this.extensionIconClickCommand(this.preferenceGet('event.click.icon.left.single.ctrl'));
				else if (aEvent.shiftKey)
					this.extensionIconClickCommand(this.preferenceGet('event.click.icon.left.single.shift'));
				else if (aEvent.altKey)
					this.extensionIconClickCommand(this.preferenceGet('event.click.icon.left.single.alt'));
				else
					this.extensionIconClickCommand(this.preferenceGet('event.click.icon.left.single'));
			} else if (aEvent.button == 1) {
				if (aEvent.ctrlKey)
					this.extensionIconClickCommand(this.preferenceGet('event.click.icon.middle.single.ctrl'));
				else if (aEvent.shiftKey)
					this.extensionIconClickCommand(this.preferenceGet('event.click.icon.middle.single.shift'));
				else if (aEvent.altKey)
					this.extensionIconClickCommand(this.preferenceGet('event.click.icon.middle.single.alt'));
				else
					this.extensionIconClickCommand(this.preferenceGet('event.click.icon.middle.single'));
			} else if (aEvent.button == 2) {
				if (aEvent.ctrlKey)
					this.extensionIconClickCommand(this.preferenceGet('event.click.icon.right.single.ctrl'));
				else if (aEvent.shiftKey)
					this.extensionIconClickCommand(this.preferenceGet('event.click.icon.right.single.shift'));
				else if (aEvent.altKey)
					this.extensionIconClickCommand(this.preferenceGet('event.click.icon.right.single.alt'));
				else
					this.extensionIconClickCommand(this.preferenceGet('event.click.icon.right.single'));
			}
		}
	}

	//handle the double click over the "d"

	this.extensionIconClickDouble = function(aEvent) {
		clearTimeout(this.clickWaitDoubleClick);

		//event mapping
		if (aEvent.button == 0) {
			if (aEvent.ctrlKey)
				this.extensionIconClickCommand(this.preferenceGet('event.click.icon.left.double.ctrl'));
			else if (aEvent.shiftKey)
				this.extensionIconClickCommand(this.preferenceGet('event.click.icon.left.double.shift'));
			else if (aEvent.altKey)
				this.extensionIconClickCommand(this.preferenceGet('event.click.icon.left.double.alt'));
			else
				this.extensionIconClickCommand(this.preferenceGet('event.click.icon.left.double'));
		} else if (aEvent.button == 1) {
			if (aEvent.ctrlKey)
				this.extensionIconClickCommand(this.preferenceGet('event.click.icon.middle.double.ctrl'));
			else if (aEvent.shiftKey)
				this.extensionIconClickCommand(this.preferenceGet('event.click.icon.middle.double.shift'));
			else if (aEvent.altKey)
				this.extensionIconClickCommand(this.preferenceGet('event.click.icon.middle.double.alt'));
			else
				this.extensionIconClickCommand(this.preferenceGet('event.click.icon.middle.double'));
		} else if (aEvent.button == 2) {
			if (aEvent.ctrlKey)
				this.extensionIconClickCommand(this.preferenceGet('event.click.icon.right.double.ctrl'));
			else if (aEvent.shiftKey)
				this.extensionIconClickCommand(this.preferenceGet('event.click.icon.right.double.shift'));
			else if (aEvent.altKey)
				this.extensionIconClickCommand(this.preferenceGet('event.click.icon.right.double.alt'));
			else
				this.extensionIconClickCommand(this.preferenceGet('event.click.icon.right.double'));
		}
	}

	return null;

}).apply(ODPExtension);
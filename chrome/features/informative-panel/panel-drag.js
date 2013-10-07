(function() {

	//allows move the panel from its position, by holding the "d" a little of time

	//panel dragging
	var panelInformationDragR = 0;
	var panelInformationDragB = 0;
	var panelInformationDragTimeout = null;
	var panelInformationDragging = false;
	var panelInformationDragHiddenStatus = false;

	//wait for the user to see if they want moves the panel
	this.panelInformationDragCheckStart = function() {
		panelInformationDragR = 0;
		panelInformationDragB = 0;
		panelInformationDragTimeout = setTimeout(ODPExtension.panelInformationDragStartDrag, 100);
		window.document.addEventListener('mouseup', ODPExtension.panelInformationDragCheckStop, false);
	}

	//the user want moves the panel, add the mousemove listener
	this.panelInformationDragStartDrag = function() {
		panelInformationDragging = true;
		panelInformationDragHiddenStatus = (ODPExtension.getElement('panel-subcontainer').getAttribute('hidden') == 'true');
		ODPExtension.panelInformationToggle(false, false);
		//ODPby('ODPSite-window-infopopup2').hidden=true;
		window.document.addEventListener('mousemove', ODPExtension.panelInformationDrag, false);

		ODPExtension.getElement('panel-move').style.setProperty("cursor", "move", "important");
	}

	//the panel is not going to be moved
	//or the panel was drop into a position
	this.panelInformationDragCheckStop = function(event) {
		ODPExtension.stopEvent(event);
		clearTimeout(panelInformationDragTimeout);
		try {
			window.document.removeEventListener('mousemove', ODPExtension.panelInformationDrag, false);
		} catch (e) {}
		try {
			window.document.removeEventListener('mouseup', ODPExtension.panelInformationDragCheckStop, false);
		} catch (e) {}
		ODPExtension.getElement('panel-move').style.setProperty("cursor", "pointer", "important");
		if (panelInformationDragging) {
			panelInformationDragging = false;
			ODPExtension.panelInformationToggle(panelInformationDragHiddenStatus, false);
		}
		//move the popup to the new position in all the windows, by calling preferenceChange
		if (
			panelInformationDragR == 0 ||
			panelInformationDragB == 0) {} else {
			ODPExtension.preferenceSet('ui.informative.panel.r', panelInformationDragR);
			ODPExtension.preferenceSet('ui.informative.panel.b', panelInformationDragB);
		}
	}
	//move the panel to the desired position
	this.panelInformationDrag = function(event) {
		panelInformationDragging = true;

		//ODPExtension.getElement('panel').hidePopup(); //showld hide the popup to move it! WTF!
		//ODPExtension.getElement('panel').setAttribute('hidden', true); //showld hide the popup to move it! WTF!
		if (event.target.ownerDocument instanceof HTMLDocument) {
			panelInformationDragR = window.document.width - event.clientX;
			panelInformationDragB = window.document.height - event.clientY;
			var panel = ODPExtension.getElement('panel');

			panel.setAttribute('style', 'bottom:' + panelInformationDragB + 'px;right:' + panelInformationDragR + 'px;');
			//panel.setAttribute('hidden', false);
		}
	}
	//resets the position of the panel
	this.panelInformationResetPosition = function() {
		this.preferenceSet('ui.informative.panel.r', 250);
		this.preferenceSet('ui.informative.panel.b', 60);
	}

	return null;

}).apply(ODPExtension);
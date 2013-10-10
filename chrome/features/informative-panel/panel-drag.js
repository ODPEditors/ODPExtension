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
		panelInformationDragTimeout = setTimeout(ODPExtension.panelInformationDragStartDrag, 300);
		window.addEventListener('mouseup', ODPExtension.panelInformationDragCheckStop, false);
	}

	//the user want moves the panel, add the mousemove listener
	this.panelInformationDragStartDrag = function() {
		panelInformationDragging = true;
		panelInformationDragHiddenStatus = (ODPExtension.getElement('panel').getAttribute('hidden') == 'true');
		ODPExtension.panelInformationToggle(false, false);
		window.addEventListener('mousemove', ODPExtension.panelInformationDrag, true);
		ODPExtension.getElement('panel-move').style.setProperty("cursor", "move", "important");
	}

	//the panel is not going to be moved
	//or the panel was drop into a position
	this.panelInformationDragCheckStop = function(event) {
		ODPExtension.stopEvent(event);
		clearTimeout(panelInformationDragTimeout);
		try {
			window.removeEventListener('mousemove', ODPExtension.panelInformationDrag, true);
		} catch (e) {}
		try {
			window.removeEventListener('mouseup', ODPExtension.panelInformationDragCheckStop, false);
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

	var panel, panel_move, panel_move_height, panel_move_width;
	this.addListener('userInterfaceLoad', function() {
		panel = ODPExtension.getElement('panel');

		panel_move = ODPExtension.getElement('panel-move');

		panel_move_height     = panel_move.boxObject.height;
		panel_move_width      = panel_move.boxObject.width;
	});

	//move the panel to the desired position
	this.panelInformationDrag = function(event) {
		panelInformationDragging = true;

		var document_width = window.document.width;
		var document_height  = window.document.height;

/*		if(event.pageX >=(document_width/2))
			var screen_zone_left_right = 'right';
		else
			var screen_zone_left_right = 'left';
		if(event.pageY>=(document_height/2))
			var screen_zone_above_below = 'below';
		else
			var screen_zone_above_below = 'above';*/

	//posicion relativa a la derecha inferior de la pantalla
		var new_x = document_width-event.pageX ;
		var new_y = document_height-event.pageY;
		var half_button_size = 12;

		//12 = half button size
			//right normalize
				if(new_x<=half_button_size)
					new_x = half_button_size;
			//left normalize
				else if(new_x>document_width-half_button_size)
					new_x = document_width-half_button_size;
			//bottom normalize
				if(new_y<=half_button_size)
					new_y = half_button_size;
			//top normalize
				else if(new_y>document_height-half_button_size)
					new_y = document_height-half_button_size;

				panel.style.setProperty("right", (new_x-half_button_size)+'px', "important");
				panel.style.setProperty("bottom", (new_y+panel_move_height+half_button_size)+'px', "important");

				panelInformationDragR = (new_x-half_button_size)
				panelInformationDragB = (new_y+panel_move_height+half_button_size)

				panel_move.style.setProperty("right", (new_x-half_button_size)+'px', "important");
				panel_move.style.setProperty("bottom", (new_y-half_button_size)+'px', "important");

	}
	//resets the position of the panel
	this.panelInformationResetPosition = function() {
		this.preferenceSet('ui.informative.panel.r', 250);
		this.preferenceSet('ui.informative.panel.b', 60);
	}

	return null;

}).apply(ODPExtension);
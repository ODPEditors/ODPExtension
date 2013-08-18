(function()
{
		
		//allows move the panel from its position, by holding the "d" a little of time
			
			//wait for the user to see if they want moves the panel
			this.panelInformationDragCheckStart = function()
			{
				ODPExtension.panelInformationDragX = 0;
				ODPExtension.panelInformationDragY = 0;
				ODPExtension.panelInformationDragTimeout = setTimeout(ODPExtension.panelInformationDragStartDrag, 333);
				window.addEventListener('mouseup', ODPExtension.panelInformationDragCheckStop, false);
			}
			
			//the user want moves the panel, add the mousemove listener
			this.panelInformationDragStartDrag = function()
			{
				ODPExtension.panelInformationDragging = true;
				ODPExtension.panelInformationDragHiddenStatus=(ODPExtension.getElement('panel-subcontainer').getAttribute('hidden') == 'true');
				ODPExtension.panelInformationToggle(false, false);
				//ODPby('ODPSite-window-infopopup2').hidden=true;
				window.addEventListener('mousemove', ODPExtension.panelInformationDrag, false);
				
				ODPExtension.getElement('panel-move').style.setProperty("cursor", "move", "important");
			}
			
			//the panel is not going to be moved
			//or the panel was drop into a position
			this.panelInformationDragCheckStop = function(event)
			{
				ODPExtension.stopEvent(event);
				clearTimeout(ODPExtension.panelInformationDragTimeout);
				try{window.removeEventListener('mousemove', ODPExtension.panelInformationDrag, false);}catch(e){}
				try{window.removeEventListener('mouseup', ODPExtension.panelInformationDragCheckStop, false);}catch(e){}
				ODPExtension.getElement('panel-move').style.setProperty("cursor", "pointer", "important");
				if(ODPExtension.panelInformationDragging)
				{
					ODPExtension.panelInformationDragging = false;
					ODPExtension.panelInformationToggle(ODPExtension.panelInformationDragHiddenStatus, false);
				}
				//move the popup to the new position in all the windows, by calling preferenceChange
				if(
				    ODPExtension.panelInformationDragX == 0 ||
				    ODPExtension.panelInformationDragY == 0 
				   ){}
				else
				{
					ODPExtension.preferenceSet('ui.informative.panel.x', ODPExtension.panelInformationDragX);
					ODPExtension.preferenceSet('ui.informative.panel.y', ODPExtension.panelInformationDragY);
				}
			}
			//move the panel to the desired position
			this.panelInformationDrag = function(event)
			{
				ODPExtension.panelInformationDragging = true;

				//stupid bug - can't move panels which are posicionated to the rigth bottom. ODPExtension.getElement('panel').moveTo((event.pageX-ODPExtension.getElement('panel').popupBoxObject.width)+11, (event.pageY-ODPExtension.getElement('panel').popupBoxObject.height)+49);//
				
				ODPExtension.getElement('panel').hidePopup();//showld hide the popup to move it! WTF!
				ODPExtension.panelInformationDragX = (((window.document.width-event.pageX)+350)*-1)+11;
				ODPExtension.panelInformationDragY = ((window.document.height-event.pageY)*-1)+31;
				ODPExtension.getElement('panel').openPopup(ODPExtension.getBrowserElement('main-window'), 'end_after', ODPExtension.panelInformationDragX, ODPExtension.panelInformationDragY, false);
				//ODPExtension.getElement('panel').moveTo(, );

			//	ODPExtension.dump('dragging x'+(((window.width-event.pageX)+350)*-1)+' y'+((window.height-event.pageY)*-1) );
			}
			//resets the position of the panel
			this.panelInformationResetPosition = function()
			{
				this.preferenceSet('ui.informative.panel.x', -390);
				this.preferenceSet('ui.informative.panel.y', -51);
			}
			
	return null;

}).apply(ODPExtension);

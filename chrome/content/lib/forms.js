(function()
{
	//shows a custom alert
	this.alert = function(aString)
	{
		var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                        .getService(Components.interfaces.nsIPromptService);

		prompts.alert(null, "ODP Extension", aString);
	}
	//shows a custom confirm
	this.confirm = function(aString)
	{
		var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
							.getService(Components.interfaces.nsIPromptService);
		return prompts.confirm(null, "ODP Extension", aString);
	}
	//creates and shows in the middle of the screen a custom pannel (form) with N xul elements and buttons
	this.form = function(anID, aTitle, anArrayXUL, anArrayButtons, rebuild, noautohide, height, width, icon16)
	{
		var idPanel = this.sha256(anID);
		var panel = this.getBrowserElement('ODPExtension-panel-'+idPanel);
		//if the panel exists just show the panel
		if(panel)
		{
			//if the panel show be re buileded
			if(rebuild)
			{
				this.removeElement(panel);
			}
			else
			{
				this.promptCenter(panel);
				return;
			}
		}
		//panel
		var panel = this.create('vbox');



			panel.setAttribute('style', 'padding:8px;');


		//title
			var hbox = this.create('hbox');
				hbox.setAttribute('style', 'border-bottom:1px black groove;margin-bottom:7px;cursor:pointer;');
				hbox.setAttribute('onclick', 'this.nextSibling.hidden=!this.nextSibling.hidden;this.nextSibling.nextSibling.hidden=!this.nextSibling.nextSibling.hidden;');
			var toolbarbutton = this.create('toolbarbutton');
				if(!icon16)
				  toolbarbutton.setAttribute('image', 'chrome://ODPExtension/content/icon/icon16.png');
				else
				  toolbarbutton.setAttribute('image', icon16);

				toolbarbutton.setAttribute('label', aTitle);
				toolbarbutton.setAttribute('style', 'padding:0px;border:0px;margin:0px;font-size:16px;');
				var spacer = this.create('spacer');
					spacer.setAttribute('flex', 1);
				hbox.appendChild(toolbarbutton);
				hbox.appendChild(spacer);

			panel.appendChild(hbox);

		//XULs
		var content = this.create('vbox');
			content.setAttribute('style', 'overflow:auto;');
			if(!width)
			 content.setAttribute('width', 400);
			else
			  content.setAttribute('width', width);
			if(anArrayXUL)
			{
				for(var id in anArrayXUL)
				{
					anArrayXUL[id].setAttribute('style', 'margin-bottom:8px;'+anArrayXUL[id].getAttribute('style'));
					content.appendChild(anArrayXUL[id]);
				}
			}
			panel.appendChild(content);
		//buttons container
			var hbox = this.create('hbox');
				hbox.setAttribute('style', 'margin-top:10px;margin-bottom:3px;');
			var spacer = this.create('spacer');
				spacer.setAttribute('flex', 1);
			hbox.appendChild(spacer);
			//buttons
				var defaultButton = false;
				if(anArrayButtons)
				{
					for(var id in anArrayButtons)
					{
						var button = this.create('button');
							button.setAttribute('label', anArrayButtons[id][0]);
							if(!anArrayButtons[id][1])
								button.setAttribute('oncommand', 'try{this.parentNode.parentNode.parentNode.hidePopup();}catch(e){}');
							else
								button.setAttribute('oncommand', '('+anArrayButtons[id][1].toString()+')(ODPExtension.formValues(this.parentNode.parentNode.parentNode));try{this.parentNode.parentNode.parentNode.hidePopup();}catch(e){}');
						if(!defaultButton)
						{
							defaultButton = true;
							button.setAttribute('default', 'true');
						}
						hbox.appendChild(button);

					}
				}
			panel.appendChild(hbox);

		//real panel
		var container = this.create('panel');
			container.setAttribute('id', 'ODPExtension-panel-'+idPanel);

			//to noautohide at least one button should be present
			if(noautohide && anArrayButtons)
				container.setAttribute('noautohide', true);
			//container.setAttribute('noautofocus', true);
			//focus the first textbox
			container.setAttribute('onpopupshown', 'try{this.getElementsByTagName("textbox")[0].focus();}catch(e){}this.addEventListener("keypress", function(event){ if(event.keyCode == event.DOM_VK_RETURN && !(event.originalTarget instanceof HTMLTextAreaElement)){this.getElementsByTagName("button")[0].click()}else if(event.keyCode == event.DOM_VK_ESCAPE){try{this.hidePopup();}catch(e){}}}, false);');


			container.appendChild(panel);

			if(this.getBrowserElement('main-window'))
				this.getBrowserElement('main-window').appendChild(container);
			else if(this.getBrowserElement('messengerWindow'))
				this.getBrowserElement('messengerWindow').appendChild(container);

		//open panel
		try
		{
		  var aDoc = window.document;
		  window.focus();
		}catch(e){}

			if(!height)
			  height = 100;

		container.setAttribute('style', 'opacity:0');
		container.openPopup(null, '', 0, 0, false, false);
		var popupH = container.boxObject.height;//789-popup
		//var childH = container.firstChild.boxObject.height;//789-popup

		//ODPExtension.dump(height);
		//ODPExtension.dump(popupH);//789-popup

		container.hidePopup();
		container.removeAttribute('style');

		if(popupH < height){}
		else
		  content.setAttribute('height', height);

		container.setAttribute('style', 'opacity:0');
		container.openPopup(null, '', 0, 0, false, false);
		var popupH = container.boxObject.height;//789-popup
		container.hidePopup();
		container.removeAttribute('style');

		container.openPopup(null, '',
							((this.screenGetDocumentW(aDoc)-container.boxObject.width)/2)-3,
							((this.screenGetDocumentH(aDoc)-container.boxObject.height)/2), false, false);
		container.addEventListener('popuphidden', function(event){ODPExtension.removeElement(event.currentTarget);}, false);
	 }
	//returns an array with all the values of a panel form
	this.formValues = function(aForm)
	{
		var values = [];

		//textbox
			var inputs = aForm.getElementsByTagName('textbox');
			for(var a=0;a<inputs.length;a++)
			{
				if(inputs[a].getAttribute('name') != '')
				{
					values[inputs[a].getAttribute('name')] = inputs[a].value;
				}
			}
		//menulist

			var inputs = aForm.getElementsByTagName('menulist');
			for(var a=0;a<inputs.length;a++)
			{
				if(inputs[a].selectedItem && inputs[a].selectedItem.value && inputs[a].selectedItem.value != '')
				{
					values[inputs[a].getAttribute('name')] = inputs[a].selectedItem.value;
				}
			}
		//checkbox...
		//radios...

		return values;
	}
	//creates and shows a notification in all the tabs behind the tabbar
	/*
		example:
			var buttons = [];

			var button = [];
				button[0] = 'Click to alert 1';
				button[1] = function(){alert('Cliked one!')}

			buttons[buttons.length] = button;

			var button = [];
				button[0] = 'Click to alert 2';
				button[1] = function(){alert('Cliked two!')}

			buttons[buttons.length] = button;
			this.notifyTabs('This is the mensajitoooooooooooooooo o o o o ooooooo ', '', buttons, 4);

	*/
	this.notifyTabs = function(aString, aType, anArrayButtons, aTime)
	{
		if(!anArrayButtons || anArrayButtons == '')
			anArrayButtons = [];
		var id = 'ODPExtension-notifyTabs-'+this.sha256(aString);
		/*
		var notification = this.getBrowserElement(id);
		if(notification)
		{
			notification.setAttribute('hidden', false);
			//hidding the notification
			if(aTime)
				setTimeout(function(){notification.setAttribute('hidden', true);}, aTime);
			return;
		}*/
		//the container
		var hbox = this.create('hbox');
			hbox.setAttribute('class', 'notification-inner outset');
			hbox.setAttribute('style', 'max-width:100% !important;width:100% !important;');
			hbox.setAttribute('id', id);
		//the icon and the name of the extension
		var toolbarbutton = this.create('toolbarbutton');
			toolbarbutton.setAttribute('image', 'chrome://ODPExtension/content/icon/icon16.png');
			toolbarbutton.setAttribute('label', "ODP Extension : ");
			toolbarbutton.setAttribute('style', 'border:1px solid transparent !important;margin:2px !important;padding:0px !important;-moz-appearance: none;margin-left:6px !important;');
			hbox.appendChild(toolbarbutton);

		//the icon of the message
		var toolbarbutton = this.create('toolbarbutton');
			if(aType == 'warning')//warning image
				toolbarbutton.setAttribute('image', 'chrome://ODPExtension/content/lib/forms/notifyTabs/warning.png');
			else if(aType == 'error')//error image
				toolbarbutton.setAttribute('image', 'chrome://ODPExtension/content/lib/forms/notifyTabs/error.png');
			else//info image
				toolbarbutton.setAttribute('image', 'chrome://ODPExtension/content/lib/forms/notifyTabs/info.png');
			//toolbarbutton.setAttribute('label', aString);
			toolbarbutton.setAttribute('style', 'border:1px solid transparent !important;margin:0px !important;padding:0px !important;-moz-appearance: none;');

			hbox.appendChild(toolbarbutton);

		// the message to display
			if(aString instanceof XULElement)
			{
				var description = aString;
				var msgContainer = this.create('hbox');
					msgContainer.setAttribute("flex", '1');
					msgContainer.setAttribute("style", 'padding-top:3px;');
					msgContainer.appendChild(description)
			}
			else
			{
				var description = this.create('description');
					description.appendChild(this.createText(aString));
					description.setAttribute("wrap", 'true');
				var msgContainer = this.create('vbox');
					msgContainer.setAttribute("flex", '1');
					msgContainer.setAttribute("style", 'padding-top:3px;');
					msgContainer.appendChild(description)
			}
			hbox.appendChild(msgContainer);


		//the buttons
		var defaultButton = false;
		if(anArrayButtons)
		{
			for(var id in anArrayButtons)
			{
				var toolbarbutton = this.create('button');
					toolbarbutton.setAttribute('label', anArrayButtons[id][0]);
					if(!defaultButton)
					{
						defaultButton = true;
						toolbarbutton.setAttribute('default', 'true');
					//	var focus = toolbarbutton;
					}
					toolbarbutton.setAttribute('oncommand', '('+anArrayButtons[id][1].toString()+')();ODPExtension.removeElement(this.parentNode)');
					toolbarbutton.setAttribute('style', 'font-size:11px;margin-bottom:0px !important;margin-top:0px !important;');
					hbox.appendChild(toolbarbutton);
			}
		}
		//the close button
		var toolbarbutton = this.create('toolbarbutton');
		if(this.isSeaMonkey())
		{
			toolbarbutton.setAttribute('image', 'chrome://ODPExtension/content/lib/forms/notifyTabs/close-seamonkey.png');
			toolbarbutton.setAttribute('style', 'border:1px solid transparent !important;margin:0px !important;padding:0px !important;-moz-appearance: none;margin-right:1px !important');
		}
		else
		{
			toolbarbutton.setAttribute('image', 'chrome://ODPExtension/content/lib/forms/notifyTabs/close-firefox.png');
			toolbarbutton.setAttribute('style', 'border:1px solid transparent !important;margin:0px !important;padding:0px !important;-moz-appearance: none;margin-right:6px !important');
		}
		toolbarbutton.setAttribute('oncommand', 'ODPExtension.removeElement(this.parentNode)');
		hbox.appendChild(toolbarbutton);

		//apppending the element to the tabbar
		this.appendToTabbar(hbox);
		//focusing the first button
		//if(focus)
		//	focus.focus();
		//hidding the notification
		if(aTime)
			setTimeout(function(){hbox.setAttribute('hidden', true);}, aTime*1000);

		return hbox;
	}
	//shows a custom prompt
	this.prompt = function(aString, aDefault)
	{
		if(!aDefault)
			aDefault = '';

		var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                        .getService(Components.interfaces.nsIPromptService);

		var check = {value: false};                  // default the checkbox to false

		var input = {value: aDefault};                  // default the edit field to Bob

		var result = prompts.prompt(null, "ODP Extension", aString, input, null, check);

		if(result)
			return this.string(input.value);
		else
			return '';
	}

	return null;

}).apply(ODPExtension);

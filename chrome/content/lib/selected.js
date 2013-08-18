(function()
{
	//returns the selection that the focused window is returning or the selection of the top document if the window is not focused
	this.getBrowserSelection = function()
	{
		var aSelection = '';

		var focusedWindow = document.commandDispatcher.focusedWindow;
			aSelection = focusedWindow.getSelection();
			if(aSelection != '' && aSelection != null)
				return aSelection;

		aSelection = window.content.getSelection();

		return aSelection;
	};
	//returns the selection that the focused window is returning was an object with the node
	this.getBrowserSelectionObjects = function(tagName)
	{
		//inspired by linky		
		var items = document.commandDispatcher.focusedWindow.document.getElementsByTagNameNS("*", tagName);
		var objs = [];
		if (items && items.length)
		{
			var aSelection = this.getBrowserSelection();
			if(aSelection != '')
			{
				for (var i = 0; i < items.length; i++)
				{
					if(aSelection.containsNode(items[i], true))
						objs[objs.length] = items[i];
				}
			}
		}
		return objs;
	};
	//returns the selected text of a focused element (if any)
	this.getFocusedElementSelection = function()
	{
		//http://forums.mozillazine.org/viewtopic.php?t=570720 and max1millon again! thanks
		
		var aTextSelection = '';
		
		if(!document.commandDispatcher || !document.commandDispatcher.focusedElement)
			return '';

		var tBox = document.commandDispatcher.focusedElement;
		if(!tBox.value || tBox.value == '')
			return '';
		try
		{
			aTextSelection = this.trim(tBox.value.substring(tBox.selectionStart, tBox.selectionEnd));
		}
		catch(e){}
		
		return aTextSelection;
	};
	//returns the selection that the browser is returning looking in every frame until something found
	//this function should be used when is called from an element that makes the window lose focus
	this.getFramesSelectionRecursive = function(win)
	{
		var aSelection = '';
		if(!win)
			win = window.content;
		if(!win){}
		else
		{
			//checking window content
			aSelection = win.getSelection();

			if(aSelection != '' && aSelection != null)
				return aSelection;
				
			//checking content of frames
			if(win.frames.length  > 0)
			{
				//getting selection from frames
				for (var a = 0; a < win.frames.length; a++)
				{
					if(!win.frames[a])
						continue;
					aSelection = win.frames[a].getSelection();
					
					if(aSelection != '' && aSelection != null)
						return aSelection;
					if(win.frames[a].frames.length  > 0)
					{
						aSelection = this.getFramesSelectionRecursive(win.frames[a]);
						if(aSelection != '' && aSelection != null)
							return aSelection;
					}
				}
			}
		}
		return aSelection;
	};
	//returns the href of the selected link
	this.getSelectedLink = function()
	{
		if(this.isSeaMonkey())
		{
			if(gContextMenu && gContextMenu.link)
				return this.string(gContextMenu.linkURL());
			else
				return '';
		}
		else
		{
			if(gContextMenu && gContextMenu.linkURL)
				return this.string(gContextMenu.linkURL);
			else
				return '';
		}
	};
	//returns an array of the URLs of the selected links
	this.getSelectedLinksURLs = function(forced)
	{
		//inspired by extended copy menu, linky and some mutations
		var aSelection = this.getBrowserSelection();	
		var links = [];
		if((aSelection == '' || aSelection == null) && forced)
		{
			aSelection = this.getFramesSelectionRecursive();
		}
		for(var i=0;i<aSelection.rangeCount;i++)
		{
			var objRange = aSelection.getRangeAt(i);

			var objClone = objRange.cloneContents();
			
			var objDiv = this.documentGetFocused().createElement('div');
				objDiv.appendChild(objClone);
			var lk = objDiv.getElementsByTagName('a');
	
			for (var a=0;a<lk.length;a++)
			{
				if(lk[a].hasAttribute('href'))
				{
					links[links.length] = String(lk[a].href);
				}
			}
		}
		return links;
	};
	//gets the selected text of a document looking in focused elements (window, textinputs)
	//if forced === true
		//and if nothing is retreived will try to get some selection from frames and text inputs of the top document
		//force should be used when this function is called from an element that makes the window lose focus
	this.getSelectedText = function(forced)
	{
			var aTextSelection = '';
		//gets focused input selection
			aTextSelection = this.getFocusedElementSelection();
			if(aTextSelection != '')
				return aTextSelection;

		//gets focused document selection
			var aSelection = this.getBrowserSelection();
			if(aSelection.rangeCount>1)
			{
				for(var i=0;i<aSelection.rangeCount;i++)
				{
					aTextSelection += this.trim(this.string(aSelection.getRangeAt(i)))+this.__NEW_LINE__;
				}
				if(aTextSelection != '')
					return this.trim(aTextSelection);
			}
			else
			{
				aTextSelection = this.trim(this.string(aSelection));
				if(aTextSelection != '')
					return aTextSelection;
			}
	//code behind this will run if the call to this function (getSelectedText) comes from an element that cause the lose of the focus in the window
			if(!forced)
				return aTextSelection;
		
		//gets selection from frames document
			aTextSelection = this.trim(this.string(this.getFramesSelectionRecursive()));
			if(aTextSelection != '')
				return aTextSelection;
			
		//gets selection in inputs of the top document
			var win = window.content;
			if(!win){}
			else
			{
				if(!win.document.forms){}
				else
				{
					for(var a = 0; a < win.document.forms.length; a++)
					{
						var win_form = win.document.forms[a];
						for(var b = 0; b < win_form.elements.length; b++)
						{
							var element = win_form.elements[b];
							if(
							   this.tagName(element) == 'input' &&
							   (
								this.match(element.type, 'text') ||
								this.match(this.tagName(element), 'textarea')
							   )
							)
							{
								try
								{
									aTextSelection =  this.trim(element.value.substring(element.selectionStart, element.selectionEnd));
								}
								catch(e){}
								if(aTextSelection != '')
									return aTextSelection;
							}
						}
					}
				}
			}

		//getting selection from form inputs from frames (NOT RECURSIVE)
			var win = window.content;
			if(!win){}
			else
			{
				if(win.frames.length  > 0)
				{
					//getting selection from frames form inputs
					for (var a = 0; a < win.frames.length; a++)
					{
						if(!win.frames[a].document)
							continue;
							
						var win_frame = win.frames[a];
						if(!win_frame.document.forms){}
						else
						{
							for(var b = 0; b < win_frame.document.forms.length; b++)
							{
								var doc_form = win_frame.document.forms[b];
								for(var c = 0; c < doc_form.elements.length; c++)
								{
									var element = doc_form.elements[c];
									if(
									   this.tagName(element) == 'input' &&
									   (
										this.match(element.type, 'text') ||
										this.match(this.tagName(element), 'textarea')
									   )
									)
									{
										try
										{
											aTextSelection =  this.trim(element.value.substring(element.selectionStart, element.selectionEnd));
										}
										catch(e){}
										if(aTextSelection != '')
											return aTextSelection;
									}
								}
							}
						}
					}
				}
			}
		return aTextSelection;
	};
	//gets the selected text HTML of a document 
	this.getSelectedTextHTML = function()
	{
		var aTextSelection = '';
		var focusedDocument = this.documentGetFocused();
		
		if(focusedDocument instanceof HTMLDocument)
		{
			var objDiv = this.documentGetFocused().createElement('div');
			
		//gets focused document selection
			var aSelection = this.getBrowserSelection();
			var objClone;
			if(aSelection.rangeCount>0)
			{
				for(var i=0;i<aSelection.rangeCount;i++)
				{	
						objClone = aSelection.getRangeAt(i);
						objClone = objClone.cloneContents();
						objDiv.appendChild(objClone);
						objDiv.innerHTML += this.__NEW_LINE__;
				}
			}
			return objDiv.innerHTML;
		}
		else
		{
			return aTextSelection;
		}
	};
	//gets the selected text of a document looking in focused elements (window, textinputs)
	//if forced === true
		//and if nothing is retreived will try to get some selection from frames and text inputs of the top document
		//force should be used when this function is called from an element that makes the window lose focus
		//if nothing is reterived will prompt the user for input
	this.getSelectedTextOrPrompt = function(forced, aDefaultPrompt)
	{
		var selectedText = this.getSelectedText(forced);
		if(selectedText=='')
			selectedText = this.prompt(this.getString('there.is.no.selected.text.in.the.page.do.you.want.write.some'), aDefaultPrompt);
		
		return selectedText;
	};
	//decodes the selected text
	this.selectionDecode = function()
	{
		var items = this.getBrowserSelectionObjects('a');
		for(var id in items)
		{
			items[id].innerHTML = this.decodeUTF8Recursive(items[id].innerHTML);
		}
	};
	//encodes the selected text
	this.selectionEncode = function()
	{
		var items = this.getBrowserSelectionObjects('a');
		for(var id in items)
		{
			items[id].innerHTML = this.encodeUTF8(items[id].innerHTML);
		}
	};

	return null;

}).apply(ODPExtension);
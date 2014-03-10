(function() {
	//returns the selection that the focused window is returning or the selection of the top document if the window is not focused
	this.getBrowserSelection = function() {
		var aSelection = '';

		var focusedWindow = document.commandDispatcher.focusedWindow;
		aSelection = focusedWindow.getSelection();
		if (aSelection != '' && aSelection != null)
			return aSelection;

		return window.content.getSelection();
	};
	//returns the selection that the focused window is returning as an object with the node
	//inspired by linky
	this.getBrowserSelectionObjects = function(tagName) {
		var objs = [];
		var aSelection = this.getBrowserSelection();
		if (aSelection != '') {
			var items = document.commandDispatcher.focusedWindow.document.getElementsByTagNameNS("*", tagName);
			var length = items.length;
			if (items && length) {
				for (var i = 0; i < length; i++) {
					if (aSelection.containsNode(items[i], true))
						objs[objs.length] = items[i];
				}
			}
		}
		return objs;
	};
	//returns the selected text of a focused element (if any)
	this.getFocusedElementSelection = function() {
		//http://forums.mozillazine.org/viewtopic.php?t=570720 and max1millon again! thanks

		var aTextSelection = '';

		if (!document.commandDispatcher || !document.commandDispatcher.focusedElement)
			return '';

		var tBox = document.commandDispatcher.focusedElement;
		if (!tBox.value || tBox.value == '')
			return '';
		try {
			aTextSelection = this.trim(tBox.value.substring(tBox.selectionStart, tBox.selectionEnd));
		} catch (e) {}

		return aTextSelection;
	};
	//returns the selection that the browser is returning looking in every frame until something found
	//this function should be used when is called from an element that makes the window lose focus
	this.getFramesSelectionRecursive = function(win) {
		var aSelection = '';
		if (!win)
			win = window.content;
		if (!win) {} else {
			//checking window content
			aSelection = win.getSelection();

			if (aSelection != '' && aSelection != null)
				return aSelection;

			//checking content of frames
			if (win.frames.length > 0) {
				//getting selection from frames
				for (var a = 0; a < win.frames.length; a++) {
					if (!win.frames[a])
						continue;
					aSelection = win.frames[a].getSelection();

					if (aSelection != '' && aSelection != null)
						return aSelection;
					if (win.frames[a].frames.length > 0) {
						aSelection = this.getFramesSelectionRecursive(win.frames[a]);
						if (aSelection != '' && aSelection != null)
							return aSelection;
					}
				}
			}
		}
		return aSelection;
	};
	//returns the href of the selected link
	this.getSelectedLinkURL = function() {
		var link = this.getSelectedLinkItem()
		if (!link)
			return '';
		else
			return this.string(link.href);
	};
	//returns the A tags of the selected link
	this.getSelectedLinkItem = function() {
		if (gContextMenu && gContextMenu.link)
			return gContextMenu.link;
		else
			return null;
	};
	//returns an array of the A of the selected links
	this.getSelectedLinksItems = function(forced) {
		var links = [];
		var lk = this.getBrowserSelectionObjects('a');
		for (var a = 0; a < lk.length; a++) {
			if (lk[a].href) {
				links[links.length] = lk[a];
			}
		}
		var lk = this.getBrowserSelectionObjects('area');
		for (var a = 0; a < lk.length; a++) {
			if (lk[a].href) {
				links[links.length] = lk[a];
			}
		}
		return links;
	};
	//returns an array of the URLs of the selected links
	this.getSelectedLinksURLs = function(forced) {
		var links = []
		var items = this.getSelectedLinksItems();
		for (var id in items) {
			if (items[id].href)
				links[links.length] = String(items[id].href);
		}
		if (!links || !links.length) {
			var link = this.getSelectedLinkURL()
			if (link != '')
				return [link]
			else
				return []
		} else
			return links;
	};
	this.getAllLinksItemsPreferSelected = function(aTab) {
		var links = [];
		if (!links || !links.length)
			links = this.getSelectedLinksItems();
		var link = this.getSelectedLinkItem();
		if ((!links || !links.length) && ( !! link))
			links[links.length] = link;
		if (!links || !links.length)
			links = this.getAllLinksItems(aTab);
		return links;
	}
	this.getAllLinksItems = function(aTab) {
		var links = [],
			aWindow;
		if (aTab.ownerDocument && aTab.ownerDocument instanceof XULDocument)
			aWindow = this.windowGetFromTab(aTab);
		else {
			try {
				aWindow = aTab.defaultView.top;
			} catch (e) {
				try {
					ODPExtension.dump('getAllLinksItems fallo con 1 ' + aTab.location);
					//ODPExtension.dump('getAllLinksItems fallo con 1 ' + aTab.defaultView.document.location);
				} catch (e) {
					//ODPExtension.dump('getAllLinksItems fallo con 2 ' + aTab.location);
				}
				try {
					aWindow = aTab.defaultView;
				} catch (e) {
					return [];
				}
			}
		}

		this.foreachFrame(aWindow, function(aDoc) {
			var a = aDoc.getElementsByTagName("a");
			var length = a.length;
			for (var i = 0; i < length; i++) {
				if (a[i].href)
					links[links.length] = a[i];
			}
			var a = aDoc.getElementsByTagName("area");
			var length = a.length;
			for (var i = 0; i < length; i++) {
				if (a[i].href)
					links[links.length] = a[i];
			}
		})
		return links;
	}
	this.getAllLinksHrefs = function(aTab) {
		var links = [],
			aWindow;
		if (aTab.ownerDocument && aTab.ownerDocument instanceof XULDocument)
			aWindow = this.windowGetFromTab(aTab);
		else {
			try {
				aWindow = aTab.defaultView.top;
			} catch (e) {
				try {
					ODPExtension.dump('getAllLinksHrefs fallo con 1 ' + aTab.location);
					//ODPExtension.dump('getAllLinksHrefs fallo con 1 ' + aTab.top);
					//ODPExtension.dump('getAllLinksHrefs fallo con 1 ' + aTab.defaultView.document.location);
				} catch (e) {
					//ODPExtension.dump('getAllLinksHrefs fallo con 2 ' + aTab.location);
				}
				try {
					aWindow = aTab.defaultView;
				} catch (e) {
					return [];
				}
			}
		}

		this.foreachFrame(aWindow, function(aDoc) {
			var a = aDoc.getElementsByTagName("a");
			var length = a.length;
			for (var i = 0; i < length; i++) {
				if (a[i].href)
					links[links.length] = String(a[i].href);
			}
			var a = aDoc.getElementsByTagName("area");
			var length = a.length;
			for (var i = 0; i < length; i++) {
				if (a[i].href)
					links[links.length] = String(a[i].href);
			}
		})
		return links;
	}



	//gets the selected text of a document looking in focused elements (window, textinputs)
	//if forced === true
	//and if nothing is retreived will try to get some selection from frames and text inputs of the top document
	//force should be used when this function is called from an element that makes the window lose focus
	this.getSelectedText = function(forced) {
		var aTextSelection = '';
		//gets focused input selection
		aTextSelection = this.getFocusedElementSelection();
		if (aTextSelection != '')
			return aTextSelection;

		//gets focused document selection
		var aSelection = this.getBrowserSelection();
		if (aSelection.rangeCount > 1) {
			for (var i = 0; i < aSelection.rangeCount; i++) {
				aTextSelection += this.trim(this.string(aSelection.getRangeAt(i))) + this.__NEW_LINE__;
			}
			if (aTextSelection != '')
				return this.trim(aTextSelection);
		} else {
			aTextSelection = this.trim(this.string(aSelection));
			if (aTextSelection != '')
				return aTextSelection;
		}
		//code behind this will run if the call to this function (getSelectedText) comes from an element that cause the lose of the focus in the window
		if (!forced)
			return aTextSelection;

		//gets selection from frames document
		aTextSelection = this.trim(this.string(this.getFramesSelectionRecursive()));
		if (aTextSelection != '')
			return aTextSelection;

		//gets selection in inputs of the top document
		var win = window.content;
		if (!win) {} else {
			if (!win.document.forms) {} else {
				for (var a = 0; a < win.document.forms.length; a++) {
					var win_form = win.document.forms[a];
					for (var b = 0; b < win_form.elements.length; b++) {
						var element = win_form.elements[b];
						if (
							this.tagName(element) == 'input' &&
							(
							this.match(element.type, 'text') ||
							this.match(this.tagName(element), 'textarea'))) {
							try {
								aTextSelection = this.trim(element.value.substring(element.selectionStart, element.selectionEnd));
							} catch (e) {}
							if (aTextSelection != '')
								return aTextSelection;
						}
					}
				}
			}
		}

		//getting selection from form inputs from frames (NOT RECURSIVE)
		var win = window.content;
		if (!win) {} else {
			if (win.frames.length > 0) {
				//getting selection from frames form inputs
				for (var a = 0; a < win.frames.length; a++) {
					if (!win.frames[a].document)
						continue;

					var win_frame = win.frames[a];
					if (!win_frame.document.forms) {} else {
						for (var b = 0; b < win_frame.document.forms.length; b++) {
							var doc_form = win_frame.document.forms[b];
							for (var c = 0; c < doc_form.elements.length; c++) {
								var element = doc_form.elements[c];
								if (
									this.tagName(element) == 'input' &&
									(
									this.match(element.type, 'text') ||
									this.match(this.tagName(element), 'textarea'))) {
									try {
										aTextSelection = this.trim(element.value.substring(element.selectionStart, element.selectionEnd));
									} catch (e) {}
									if (aTextSelection != '')
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
	this.getSelectedTextHTML = function() {
		var aTextSelection = '';
		var focusedDocument = this.documentGetFocused();

		if (focusedDocument instanceof HTMLDocument) {
			var objDiv = this.documentGetFocused().createElement('div');

			//gets focused document selection
			var aSelection = this.getBrowserSelection();
			var objClone;
			if (aSelection.rangeCount > 0) {
				for (var i = 0; i < aSelection.rangeCount; i++) {
					objClone = aSelection.getRangeAt(i);
					objClone = objClone.cloneContents();
					objDiv.appendChild(objClone);
					objDiv.innerHTML += this.__NEW_LINE__;
				}
			}
			return objDiv.innerHTML;
		} else {
			return aTextSelection;
		}
	};
	//gets the selected text of a document looking in focused elements (window, textinputs)
	//if forced === true
	//and if nothing is retreived will try to get some selection from frames and text inputs of the top document
	//force should be used when this function is called from an element that makes the window lose focus
	//if nothing is reterived will prompt the user for input
	this.getSelectedTextOrPrompt = function(forced, aDefaultPrompt) {
		var selectedText = this.getSelectedText(forced);
		if (selectedText == '')
			selectedText = this.prompt(this.getString('there.is.no.selected.text.in.the.page.do.you.want.write.some'), aDefaultPrompt);

		return selectedText;
	};
	//decodes the selected text
	this.selectionDecode = function() {
		var items = this.getBrowserSelectionObjects('a');
		for (var id in items) {
			items[id].innerHTML = this.decodeUTF8Recursive(items[id].innerHTML);
		}
	};
	//encodes the selected text
	this.selectionEncode = function() {
		var items = this.getBrowserSelectionObjects('a');
		for (var id in items) {
			items[id].innerHTML = this.encodeUTF8(items[id].innerHTML);
		}
	};

	return null;

}).apply(ODPExtension);
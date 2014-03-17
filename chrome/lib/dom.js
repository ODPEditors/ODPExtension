(function() {
	//appends an element to the tabbar
	this.appendToTabbar = function(anElement) {
		var container = this.getElement('appendToTabbar-container')
		if (container) {
			if (this.isThereTreeStyleTab() || this.isThereTabKit() || this.isThereVertTabbar()) //append the container to the bottom
			{
				container.insertBefore(anElement, container.firstChild);
				this.shortChilds(container, 8, true);
			} else {
				container.appendChild(anElement);
				this.shortChilds(container, 8);
			}
		} else {
			container = this.create('hbox');

			var subcontainer = this.create('vbox');
			subcontainer.setAttribute('id', 'ODPExtension-appendToTabbar-container');

			subcontainer.appendChild(anElement)

			if (this.isThereTreeStyleTab() || this.isThereTabKit() || this.isThereVertTabbar()) //append the container to the bottom
			{
				var panelcontainer = this.getBrowserElement('appcontent');
				//var panelcontainer = document.getAnonymousElementByAttribute(this.getBrowserElement('content'), "anonid", "tabbox");
				//panelcontainer.parentNode.insertBefore(subcontainer, panelcontainer);
				panelcontainer.appendChild(subcontainer);
			} else {
				var panelcontainer = document.getAnonymousElementByAttribute(this.getBrowserElement('content'), "anonid", "panelcontainer");
				panelcontainer.parentNode.insertBefore(subcontainer, panelcontainer.parentNode.lastChild);
			}
		}
	}
	/**
	 * Communicator Shared Utility Library
	 * for shared application glue for the Communicator suite of applications
	 **/
	// Closes all popups that are ancestors of the node.
	this.closeMenus = function(node) {
		if (node && "tagName" in node) {
			if (node.namespaceURI == "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul" && (node.tagName == "menupopup" || node.tagName == "popup"))
				node.hidePopup();

			this.closeMenus(node.parentNode);
		}
	}
	//return the context menu of the content area
	this.contentAreaContextMenu = function() {
		return this.getBrowserElement('contentAreaContextMenu');
	}
	//returns a new element
	this.create = function(elementName) {
		return document.createElement(elementName);
	}
	//returns a new textbox that is hidden ( work like type="hidden" on HTML )
	this.createFormHiddenInput = function(anID, aDefault) {
		var aTextbox = this.create('textbox');

		aTextbox.setAttribute('id', 'ODPExtension-' + anID);
		aTextbox.setAttribute('name', anID);
		aTextbox.setAttribute('hidden', true);

		if (aDefault)
			aTextbox.setAttribute('value', aDefault);

		return aTextbox;
	}
	//returns a new label for a form
	this.createFormLabel = function(aValue) {
		var aLabel = this.createLabel(aValue);
		aLabel.setAttribute('style', 'color:#666666');

		return aLabel;
	}
	//returns a new label
	this.createLabel = function(aValue) {
		var aLabel = this.create('label');
		aLabel.setAttribute('value', aValue);

		return aLabel;
	}
	//returns a new text node
	this.createText = function(aString) {
		return document.createTextNode(aString);
	}
	//returns a new textbox
	this.createTextbox = function(anID, aDefault, autoComplete) {
		var aTextbox = this.create('textbox');

		aTextbox.setAttribute('id', 'ODPExtension-' + anID);
		aTextbox.setAttribute('name', anID);

		if (aDefault)
			aTextbox.setAttribute('value', aDefault);

		if (autoComplete)
			aTextbox = this.setAutocomplete(aTextbox);
		return aTextbox;
	}
	//Hides a element and return true if the element was hidden. It will return false if the element is protected
	this.elementHide = function(aElement) {
		if (!aElement.hasAttribute('protected')) {
			if (aElement.hasAttribute('hidden') && aElement.getAttribute('hidden') == 'true') {
				return false;
			} else {
				aElement.setAttribute('hidden', true);
				aElement.setAttribute('ODPExtension-Hidden', true);
				return true;
			}
		}
		return false;
	}
	//Hides a element and return true if the element was hidden. It will return false if the element is protected
	this.elementShow = function(aElement) {
		if (aElement.hasAttribute('ODPExtension-Hidden')) {
			aElement.setAttribute('hidden', false);
			aElement.removeAttribute('ODPExtension-Hidden');
			return true;
		}
		return false;
	}
	//filter child nodes base on an attribute
	this.filterNodeBasedOnAttribute = function(aNode, aTextbox, anAttribute) {
		var childNodes = aNode.childNodes;
		var found = false;
		for (var i = 0; i < childNodes.length; i++) {
			if (childNodes[i].hasAttribute(anAttribute)) {
				if (aTextbox.value == '' || this.searchEngineSearch(aTextbox.value, childNodes[i].getAttribute(anAttribute))) {
					childNodes[i].setAttribute('hidden', false);
					found = true;
				} else
					childNodes[i].setAttribute('hidden', true);
			}
		}
	}
	//focus an Element, if the tab for the element is hidden will be focused too
	this.focusElement = function(anElement) {
		try {
			if (anElement.ownerDocument)
				this.tabSelect(this.tabGetFromDocument(anElement.ownerDocument));

			anElement.focus();
		} catch (e) {
			try {
				anElement.focus();
			} catch (e) {}
		}
	}
	//returns true if the focused element is a textbox
	this.focusedElementIsTextbox = function() {
		if (!document.commandDispatcher || !document.commandDispatcher.focusedElement)
			return false;

		var tBox = document.commandDispatcher.focusedElement;

		if (
		    	(this.tagName(tBox) == 'input' && (!tBox.hasAttribute('type') || tBox.getAttribute('type') == 'text'))
		    	|| this.tagName(tBox) == 'textarea'
		    	|| tBox.hasAttribute('contenteditable')
		)
			return true;
		else
			return false;
	}
	//calls a function for each frame in a window
	this.foreachFrame = function(aWindow, aFunction) {
		var win = aWindow;
		if (!win) {} else {
			if (!win.document) {} else
				aFunction(win.document);
			if (win.frames && win.frames.length > 0)
				this.foreachFrameFrame(win, aFunction);
		}
	}
	this.foreachFrameFrame = function(frame, aFunction, done) {
		if(!done)
			var done = []
		var frames = frame.frames;
		if(done.indexOf(frames) === -1){
			done.push(frames)
			for (var i = 0; i < frames.length; i++) {
				if (!frames[i] || !frames[i].document)
					continue;
				aFunction(frames[i].document);
				this.foreachFrameFrame(frames[i], aFunction, done);
			}
		}
	}
	//calls a function for each frame window in a window
	this.foreachFrameWindow = function(aWindow, aFunction) {
		var win = aWindow;
		if (!win) {} else {
			if (win.frames.length > 0) {
				this.foreachFrameFrameWindow(win, aFunction);
				if (!win) {} else
					aFunction(win);
			} else {
				if (!win) {} else
					aFunction(win);
			}
		}
	}
	this.foreachFrameFrameWindow = function(frame, aFunction) {
		var frames = frame.frames;
		for (var i = 0; i < frames.length; i++) {
			if (!frames[i])
				continue;
			aFunction(frames[i]);
			this.foreachFrameFrameWindow(frames[i], aFunction);
		}
	}
	//shortcut for document.getElementById
	this.getBrowserElement = function(anID) {
		return document.getElementById(anID);
	}
	//return an element of this extension
	this.getElement = function(anID) {
		return this.getBrowserElement('ODPExtension-' + anID);
	}
	//return a named element of the content document
	this.getElementNamed = function(aName, aDoc) {
		if (!('getElementsByName' in aDoc))
			return null;

		var anElements = aDoc.getElementsByName(aName);
		if (anElements.length > 0)
			return anElements[0];
		else
			return null;
	}
	//return a named element of the content document
	this.getElementNamedWithValue = function(aName, aValue, aDoc) {
		if (!('getElementsByName' in aDoc))
			return null;

		var anElements = aDoc.getElementsByName(aName);
		if (anElements.length > 0){
			for(var a=0;a<anElements.length;a++){
				if(anElements[a].value == aValue)
					return anElements[a];
			}
		}
		else
			return null;
	}
	//closes all the children popups opened
	this.hideChildrensPopupsOpened = function(aNode) {
		for (var i = 0; i < aNode.childNodes.length; i++) {
			if (this.tagName(aNode.childNodes[i]) == 'menu' && aNode.childNodes[i].firstChild.state == 'open') {
				aNode.childNodes[i].firstChild.hidePopup();
				break;
			}
		}
	}
	//moves aNode below aTargetNode
	this.moveNodeBelow = function(aNode, aTargetNode) {
		try {
			aTargetNode.parentNode.insertBefore(aNode, aTargetNode.nextSibling);
		} catch (e) {
			aTargetNode.parentNode.insertBefore(aNode, aTargetNode.previousSibling);
		}

	}
	this.isVisible = function(aNode) {
		return !(aNode && aNode.offsetWidth === 0 && aNode.offsetHeight === 0)
	}
	//hides the non selected item
	this.paginate = function(aNode) {
		var childNodes = aNode.parentNode.childNodes;
		for (var i = 0; i < childNodes.length; i++) {
			if (childNodes[i].hasAttribute('paginate'))
				aNode.ownerDocument.getElementById(childNodes[i].getAttribute('paginate')).setAttribute('hidden', true);
		}
		aNode.ownerDocument.getElementById(aNode.getAttribute('paginate')).setAttribute('hidden', false);
	}
	//removes all non locked childs from a node
	this.removeChilds = function(anElement) {
		if (anElement.hasChildNodes()) {
			var deletion = []
			var length = anElement.childNodes.length;
			for (var a = 0; a < length; a++) {
				if (!anElement.childNodes[a].hasAttribute('locked'))
					deletion[deletion.length] = anElement.childNodes[a];
			}
			for (var id in deletion)
				anElement.removeChild(deletion[id]);
		}
	}
	//removes all childs based on an attribute
	this.removeChildsWithAttribute = function(anElement, aAttribute, aValue) {
		if (anElement.hasChildNodes()) {
			var deletion = []
			var length = anElement.childNodes.length;
			for (var a = 0; a < length; a++) {
				if (anElement.childNodes[a].hasAttribute(aAttribute) && anElement.childNodes[a].getAttribute(aAttribute) == aValue)
					deletion[deletion.length] = anElement.childNodes[a];
			}
			for (var id in deletion)
				anElement.removeChild(deletion[id]);
		}
	}
	//removes an element from the dom
	this.removeElement = function(anElement) {
		if (anElement && anElement.parentNode) //Sometimes the element was removed.
			anElement.parentNode.removeChild(anElement);
	}
	this.saveAutocomplete = function(aTextbox) {
		try {
			var aValue = this.trim(aTextbox.value);
			if (aValue != '')
				Components.classes["@mozilla.org/satchel/form-history;1"].getService(Components.interfaces.nsIFormHistory2).addEntry(aTextbox.getAttribute('autocompletesearchparam'), aTextbox.value);
		} catch (e) {}
	}
	//this selects nodes ala "jquery" using querySelectorAll on any HTML string.
	this.select = function(aQuery, anHTML, anURI) {

		var aBaseHREF = '<base href="' + anURI + '" />';
		if (
			anHTML.indexOf('<html') != -1 || anHTML.indexOf('<HTML') != -1 ||
			anHTML.indexOf('<head') != -1 || anHTML.indexOf('<HEAD') != -1 ||
			anHTML.indexOf('<body') != -1 || anHTML.indexOf('<BODY') != -1) {
			if (anHTML.indexOf('<base') != -1 || anHTML.indexOf('<BASE') != -1) {} else {
				anHTML = anHTML
					.replace('</HEAD>', aBaseHREF + '</HEAD>')
					.replace('</head>', aBaseHREF + '</head>')
					.replace('<HEAD>', '<HEAD>' + aBaseHREF)
					.replace('<head>', '<head>' + aBaseHREF)
					.replace('<html>', '<html>' + aBaseHREF)
					.replace('<body>', aBaseHREF + '<body>')
					.replace('<BODY>', aBaseHREF + '<BODY>');
			}
		} else {
			anHTML = '<html><head>' + aBaseHREF + '</head><body>' + anHTML + '</body></html>';
		}

		var aDoc = document.implementation.createHTMLDocument("parser");
		aDoc.documentElement.innerHTML = anHTML;

		/*
		//resolving relative paths
		//relative paths are not resolved by "parseFragment" when strict XML is false.
		var linkedAttributes = ['href', 'HREF', 'src', 'SRC'];
		for (var id in linkedAttributes) {
			if (anHTML.indexOf(linkedAttributes[id] + '="') != -1) {
				anHTML = anHTML.split(linkedAttributes[id] + '="');
				for (var i = 1; i < anHTML.length; i++) {
					if (anHTML[i].indexOf('"') !== 0) {
						anHTML[i] = anHTML[i].split('"');
						anHTML[i][0] = this.newURI(anURI).resolve(anHTML[i][0]);
						anHTML[i] = anHTML[i].join('"');
					}
				}
				anHTML = anHTML.join(linkedAttributes[id] + '="');
			}
		}

		//creating fragment

		var aDoc = document.implementation.createDocument('http://www.w3.org/1999/xhtml', "html", null);
		var body = document.createElementNS('http://www.w3.org/1999/xhtml', "body");
		aDoc.documentElement.appendChild(body);

		//escaping content/converting to dom
		anHTML = '<base href="' + anURI + '" />' + anHTML;
		anHTML = this.trim(anHTML.replace(/href/gi, 'href').replace(/<!DOCTYPE[^>]+>/gi, '').replace(/<html[^>]+>/gi, '<html>'));

		body.appendChild(Components.classes["@mozilla.org/feed-unescapehtml;1"]
			.getService(Components.interfaces.nsIScriptableUnescapeHTML)
			.parseFragment(anHTML, false, this.newURI(anURI), body));
*/
		//doing query

		var found = aDoc.querySelectorAll(aQuery);

		//converting the nodeList to an array

		var elements = [];
		for (var i = 0; i < found.length; i++)
			elements[elements.length] = found[i];
		return elements;
	}
	//this selects nodes ala "jquery" using querySelectorAll on any HTML string.
	this.toDOM = function(anHTML, anURI) {

		var aBaseHREF = '<base href="' + anURI + '" odp-extension="true"/>';
		if (
			anHTML.indexOf('<html') != -1 || anHTML.indexOf('<HTML') != -1 ||
			anHTML.indexOf('<head') != -1 || anHTML.indexOf('<HEAD') != -1 ||
			anHTML.indexOf('<body') != -1 || anHTML.indexOf('<BODY') != -1) {
			if (anHTML.indexOf('<base') != -1 || anHTML.indexOf('<BASE') != -1) {} else {
				anHTML = anHTML
					.replace('</HEAD>', aBaseHREF + '</HEAD>')
					.replace('</head>', aBaseHREF + '</head>')
					.replace('<HEAD>', '<HEAD>' + aBaseHREF)
					.replace('<head>', '<head>' + aBaseHREF)
					.replace('<html>', '<html>' + aBaseHREF)
					.replace('<body>', aBaseHREF + '<body>')
					.replace('<BODY>', aBaseHREF + '<BODY>');
			}
		}

		var aDoc = document.implementation.createHTMLDocument("parser");
		aDoc.documentElement.innerHTML = anHTML;
		return aDoc;
	}
	this.setAutocomplete = function(aTextbox) {
		aTextbox.setAttribute('type', 'autocomplete');
		aTextbox.setAttribute('autocompletesearchparam', 'ODPExtension#' + aTextbox.getAttribute('id') + '-' + aTextbox.getAttribute('anonid'));
		aTextbox.setAttribute('autocompletesearch', 'form-history');
		aTextbox.setAttribute('maxrows', '20');
		aTextbox.setAttribute('tabscrolling', true);
		aTextbox.setAttribute('minresultsforpopup', 1);

		if (this.isSeaMonkey()) {
			aTextbox.setAttribute('disablehistory', true); //hide the arrow of the history
			aTextbox.setAttribute('showpopup', true);
			aTextbox.setAttribute('autofill', true);
			aTextbox.setAttribute('autofillaftermatch', true);
		} else {
			aTextbox.setAttribute('autocompletepopup', 'PopupAutoComplete');
			aTextbox.setAttribute('completeselectedindex', true);
			aTextbox.setAttribute('completedefaultindex', true);
			aTextbox.setAttribute('enablehistory', true);
		}
		return aTextbox;
	}
	//shorts the childs elements of a node to maxChilds elements
	this.shortChilds = function(anElement, maxChilds, fromTop) {
		if (anElement.hasChildNodes()) {
			var nodesForDeletion = []
			var length = anElement.childNodes.length;
			if (length <= maxChilds)
				return;
			var nodesToRemove = length - maxChilds;
			var nodesRemoved = 0;

			if (fromTop) {
				for (var a = length - 1; a >= 0; a--) {
					if (!anElement.childNodes[a].hasAttribute('locked')) {
						nodesForDeletion[nodesForDeletion.length] = anElement.childNodes[a];
						nodesRemoved++;
						if (nodesRemoved == nodesToRemove)
							break;
					}
				}
			} else {
				for (var a = 0; a < length; a++) {
					if (!anElement.childNodes[a].hasAttribute('locked')) {
						nodesForDeletion[nodesForDeletion.length] = anElement.childNodes[a];
						nodesRemoved++;
						if (nodesRemoved == nodesToRemove)
							break;
					}
				}
			}
			for (var id in nodesForDeletion)
				anElement.removeChild(nodesForDeletion[id]);
		}
	}
	//stopPropagation and preventDefault
	this.stopEvent = function(event) {
		event.stopPropagation();
		event.preventDefault();
	}
	//returns the tag name of a node in upper case
	this.tagName = function(aNode) {
		if (aNode && aNode.tagName) {
			var copy = aNode.tagName;
			return String(copy).toLowerCase();
		} else
			return '';
	}

	this.domTree = function(element, object) {
		var object = {
			t: element.tagName
		};
		var children = element.childNodes, length = children.length;
		if (length) {
			var b = 0;
			for (var i = 0; i < length; i++) {
				if (children[i].nodeType == 1) {
					if (!object.c)
						object.c = [];
					object.c[b++] = this.domTree(children[i], object.c);
				}
			}
		}
		return object;
	}

	this.removeComments = function(element) {
		var childs = element.childNodes,
			length = childs.length;
		for (var i = 0; i < childs.length; i++) {
			var child = childs[i];
			switch (child.nodeType) {
				case 8:
					element.removeChild(child);
					i--;
					break;
				case 1:
					this.removeComments(child);
					break;
			}
		}
	}
	return null;

}).apply(ODPExtension);
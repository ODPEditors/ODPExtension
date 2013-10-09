(function() {

	this.addListener('userInterfaceLoad', function(aEnabled) {
		//from category menu
		//opens the "from" category menu on page rigth dblclick
		ODPExtension.getBrowserElement("content").addEventListener("dblclick", function(event) {
			if (event.button == 2) {
				ODPExtension.fromCategoryUpdateMenu(event, 'from-category')
			}
		}, false);
		var fromCategoryTimeout;
		//the set timeout is there to avoid multiples clicks
		ODPExtension.getBrowserElement("content").addEventListener("mouseup", function(event) {
			if (event.button == 0) {
				(function(event){
					clearTimeout(fromCategoryTimeout);
					fromCategoryTimeout = setTimeout(function() {
						ODPExtension.fromCategoryUpdateMenu(event, 'from-category');
					}, 200);
				})(event)
			} else if (event.button == 2 && ODPExtension.tagName(event.originalTarget) == 'select') {
				(function(event){
					setTimeout(function() {
						ODPExtension.fromCategoryUpdateMenu(event, 'from-category');
					}, 50);
				})(event)
			}
		}, false);
	});

	this.addListener('userInterfaceLoad', function(aEnabled) {
		//in multiple tab handler
		if (ODPExtension.getBrowserElement('multipletab-selection-menu')) {
			ODPExtension.getBrowserElement('multipletab-selection-menu').addEventListener("popupshowing", function(event) {
				if (event.originalTarget == event.currentTarget) {
					// this will update the label of the "from category" menu on context menu
					ODPExtension.fromCategoryUpdateMenu(event, 'tab-context-multiple-from-category');
				}
			}, false);
		}
		//in extension icon
		ODPExtension.getElement('extension-icon-context').addEventListener("popupshowing", function(event) {
			if (event.originalTarget == event.currentTarget) {
				// this will update the label of the "from category" menu on context menu
				ODPExtension.fromCategoryUpdateMenu(event, 'extension-icon-from-category');
			}
		}, false);
	});

	//in content area context menu
	this.addListener('contextMenuShowing', function(event) {
		// this will update the label of the "from category" menu on context menu
		ODPExtension.fromCategoryUpdateMenu(event, 'context-from-category');
		ODPExtension.getElement('from-category').hidePopup();
	});
	//in tabs
	this.addListener('tabContextMenuShowing', function(event) {
		// this will update the label of the "from category" menu on context menu
		ODPExtension.fromCategoryUpdateMenu(event, 'tab-context-from-category');
	});


	this.addListener('userInterfaceUpdate', function(aEnabled) {

		ODPExtension.getElement('context-from-category').setAttribute('hidden', !aEnabled);
		ODPExtension.getElement('context-from-categories').setAttribute('hidden', !aEnabled);
		ODPExtension.getElement('context-from-editor').setAttribute('hidden', !aEnabled);
		ODPExtension.getElement('context-from-editors').setAttribute('hidden', !aEnabled);

	});


	//this is to complex to follow
	//1 - check changes on the UI of the from category menu
	//		if there is a textbox should show copy, delete and paste if apropiated
	//		if there is some selection that we can encode or decode show the commands
	//		if a category is selected show the navigate item
	//2 - the category or categories values can come from:
	//	 	XUL:  menu, menuitem, toolbarbutton, tab context menu, multiples tabs selected with "multiple tab handler" extension
	//		HTML: selected text on page or input or framed doc, selected links on page, selected link on page, rigth clicked "SELECT" html tag, focused category
	//3 - this manage from where the from category menu is called and which category/categories are selected
	var fromCategoryUpdating = false;
	this.fromCategoryUpdateMenu = function(aEvent, fromWhere, cancelAutoPopup) {
		//when the autopopup is openede because of the right double click
		//we should prevent to the popup appears again if the new event is mouseup, because that mouse up is for hidding the popup, not for open again the popup
		if (this.fromCategoryLastEvent == 'dblclick' && aEvent.type == 'mouseup') {
			this.fromCategoryLastEvent = '';
			return;
		}
		if (
		(
		(
			this.fromCategoryCanceledAutoPopup && //if the element was showed with the rigth click event and the timeout to show the menu again is on
		(
			aEvent.type == 'mouseup' ||
			aEvent.type == 'dblclick')) ||
			fromCategoryUpdating //or this function is already running
		) &&
			aEvent.type != 'dblclick' //allow processing if doble rigth click
		) {
			//this.dump('fromCategoryMenu:UpdateCanceled');
			return;
		}
		//this.dump('fromCategoryUpdateMenu:aEvent.type:'+aEvent.type);

		var aDocTypeHTML = aEvent.originalTarget.ownerDocument instanceof HTMLDocument || aEvent.originalTarget.ownerDocument instanceof XMLDocument;
		var aDocTypeXUL = aEvent.originalTarget.ownerDocument instanceof XULDocument;

		//if XUL was clicked or if the click come with a modifier
		if (aDocTypeXUL && aEvent.type == 'mouseup' || (aEvent.type == 'mouseup' && (aEvent.ctrlKey || aEvent.shiftKey || aEvent.altKey)))
			return;

		//retreiving the data

		fromCategoryUpdating = true;
		this.fromCategoryLastEvent = aEvent.type;
		//categories
		this.fromCategorySelectedCategory = '';
		this.fromCategorySelectedCategories = [];
		//editors
		this.fromEditorSelectedEditors = [];
		this.fromEditorSelectedEditor = '';

		//ok let's check
		var autoPopup = false;

		//used vars
		var aTemp;

		//hack for pre tag support
		if (gContextMenu && gContextMenu.target && this.tagName(gContextMenu.target) == 'pre') {
			var selectedText = this.trim(this.stripTags(this.getSelectedTextHTML()));
		} else {
			var selectedText = this.trim(this.getSelectedText(false));
		}
		//more hack for pre tag
		/*
								in this portion of code we don't know if we are in a pre tag, because maybe the popup was fired by doble rigth click or the autopopup
								then
								if the selected text contains a <a tag, then is not a pre tag or our own at least.
							*/
		var selectedTextHTML = this.getSelectedTextHTML();
		if (selectedTextHTML.indexOf('<a') != -1 || selectedTextHTML.indexOf('<A') != -1)
			selectedTextHTML = selectedText;
		else
			selectedTextHTML = this.trim(this.htmlEntityDecode(this.stripTags(selectedTextHTML.replace(/<br>/gi, '\n').replace(/<\/br>/gi, '\n'))));

		//hack for multiple category selection on text area
		if (this.focusedElementIsTextbox() && selectedTextHTML == '')
			selectedTextHTML = selectedText;


		var selectedTextInsideInput = (this.getFocusedElementSelection() != '' ? true : false);
		var clipboard = (this.getClipboard() != '' ? true : false);

		//single categories

		//check if the selected text is a valid category
		//this.dump(selectedText);
		var aCategorySelectedText = this.categoryGetFromURL(selectedText, true);

		//check focused category
		var aCategoryFocused = this.categoryGetFocused();

		//check if the selected first links are valid categories
		var aCategoryLinks = '';
		var aTemp = this.getSelectedLinksURLs();
		for (var id in aTemp) {
			if ((aTemp[id] = this.categoryGetFromURL(aTemp[id])) != '') {
				aCategoryLinks = aTemp[id];
				break;
			}
		}
		//check if the selected link (not links) ( the rigth clicked link ) are a valid category
		var aCategoryLink = this.categoryGetFromURL(this.getSelectedLinkURL());

		//check rigth clicked category on some menu, menuitem or toolbarbutton
		if (document.popupNode) {
			if (document.popupNode.hasAttribute('category') && this.categoryGetFromURL(document.popupNode.getAttribute('category')) != '')
				var aCategoryPopup = this.categoryGetFromURL(document.popupNode.getAttribute('category'));
			else if (document.popupNode.hasAttribute('value') && this.categoryGetFromURL(document.popupNode.getAttribute('value')) != '')
				var aCategoryPopup = this.categoryGetFromURL(document.popupNode.getAttribute('value'));
			else
				var aCategoryPopup = '';
		} else
			var aCategoryPopup = '';

		//check a SELECT with a category value - firefox 3.6 will not show up the context menu, then my context menu will not be so disturbing!
		if (this.tagName(aEvent.originalTarget) == 'select' && aEvent.button == 2) {
			var aCategorySelectHTML = this.categoryGetFromURL(this.trim(aEvent.originalTarget.options[aEvent.originalTarget.selectedIndex].value));
			if (aCategorySelectHTML == '')
				var aCategorySelectHTML = this.categoryGetFromURL(this.trim(aEvent.originalTarget.options[aEvent.originalTarget.selectedIndex].innerHTML));
		} else
			var aCategorySelectHTML = '';

		//check tab context menu
		if (aDocTypeXUL)
			var aCategoryTabContextMenu = this.categoryGetFromURL(this.tabContextMenuLocation());
		else
			var aCategoryTabContextMenu = '';

		//this.dump(aCategoryTabContextMenu);

		//check link with category attribute
		//this.dump(fromWhere);

		if (fromWhere == 'context-from-category' && gContextMenu && gContextMenu.link && (gContextMenu.link.hasAttribute('category') || gContextMenu.link.hasAttribute('data-category') || gContextMenu.link.hasAttribute('data-odpextension-autopopup'))) {
			if (gContextMenu.link.hasAttribute('category'))
				var aLinkCategoryAttribute = this.categoryGetFromURL(gContextMenu.link.getAttribute('category'));
			else if (gContextMenu.link.hasAttribute('data-category'))
				var aLinkCategoryAttribute = this.categoryGetFromURL(gContextMenu.link.getAttribute('data-category'));
			else if (gContextMenu.link.hasAttribute('data-odpextension-autopopup')) {
				var aLinkCategoryAttribute = this.categoryGetFromURL(gContextMenu.link.href);
				autoPopup = true;
			}
		} else
			var aLinkCategoryAttribute = '';

		//multiple categories

		//check if the selected text is a valid category
		var aMCategorySelectedText = [];
		aTemp = selectedTextHTML.replace(/\*/g, '\n').replace(/\#/g, '\n').replace(/\"/g, '\n').replace(/\->/g, '\n').replace(/\</g, '\n').replace(/\)/g, '\n').replace(/\/\./g, '\n').split('\n');
		for (var id in aTemp) {
			if ((aTemp[id] = this.categoryGetFromURL(aTemp[id], true)) != '')
				aMCategorySelectedText[aMCategorySelectedText.length] = aTemp[id];
		}
		aMCategorySelectedText = this.arrayUnique(aMCategorySelectedText);

		//this.dump(aMCategorySelectedText);

		//check if the selected links are valid categories
		var aMCategoryLinks = [];
		aTemp = this.getSelectedLinksURLs();
		for (var id in aTemp) {
			if ((aTemp[id] = this.categoryGetFromURL(aTemp[id])) != '') {
				aMCategoryLinks[aMCategoryLinks.length] = aTemp[id]
			}
		}
		aMCategoryLinks = this.arrayUnique(aMCategoryLinks);

		//categories selected with multiple tab handler
		var aTabs = this.multipleTabHandlerSelectedTabs();
		var aMCategoriesMultipleTabHandler = [];
		for (var id in aTabs) {
			if ((aTemp = this.categoryGetFromDocument(this.documentGetFromTab(aTabs[id]))) != '') {
				aMCategoriesMultipleTabHandler[aMCategoriesMultipleTabHandler.length] = aTemp;
			} else if ((aTemp = this.categoryGetFromURL(this.tabGetLocation(aTabs[id]))) != '') {
				aMCategoriesMultipleTabHandler[aMCategoriesMultipleTabHandler.length] = aTemp;
			}
		}

		aMCategoriesMultipleTabHandler = this.arrayUnique(aMCategoriesMultipleTabHandler);

		if (fromWhere != 'from-category')
			var thePopupContainer = this.getElement(fromWhere).firstChild;
		else
			var thePopupContainer = this.getElement(fromWhere);

		//from editor


		var aEditor = '';

		aTemp = this.getSelectedLinksURLs();
		for (var id in aTemp) {
			if ((aEditor = this.editorGetFromURL(aTemp[id])) != '')
				this.fromEditorSelectedEditors[this.fromEditorSelectedEditors.length] = aEditor;
		}

		if (this.fromEditorSelectedEditors.length == 0 && this.documentGetFocused().body && this.documentGetFocused().body.innerHTML) {
			aTemp = this.categoryParserGetCategoryEditors(this.documentGetFocused().body.innerHTML);
			for (var id in aTemp) {
				this.fromEditorSelectedEditors[this.fromEditorSelectedEditors.length] = aTemp[id];
			}
		}

		if ((aEditor = this.editorGetFromURL(this.getSelectedLinkURL())) != '') {
			this.fromEditorSelectedEditor = aEditor;
		} else if ((aEditor = this.editorGetFromURL(this.focusedLocation())) != '') {
			this.fromEditorSelectedEditor = aEditor;
		} else if ((aEditor = this.editorGetFromURL(this.categoryGetFromURL(this.focusedLocation()))) != '') {
			this.fromEditorSelectedEditor = aEditor;
		}

		//from editor menu
		this.getElement('context-from-editor').setAttribute('hidden', true);
		this.getElement('context-from-editors').setAttribute('hidden', true);

		this.fromEditorSelectedEditors = this.arrayUnique(this.fromEditorSelectedEditors);

		if (this.preferenceGet('ui.context.menu.from.editors') && this.fromEditorSelectedEditors.length > 1) {
			this.getElement('context-from-editors').setAttribute('label', this.getElement('context-from-editors').getAttribute('original_label').replace('{EDITORS}', this.getURLForLabel(this.fromEditorSelectedEditors.join(','))));

			this.removeChilds(this.getElement('from-editors-tooltip-data'));
			for (var id in this.fromEditorSelectedEditors) {
				var label = this.create('label');
				label.setAttribute('value', this.fromEditorSelectedEditors[id]);
				this.getElement('from-editors-tooltip-data').appendChild(label);
			}
			this.getElement('context-from-editors').setAttribute('hidden', false);
		}

		if (this.preferenceGet('ui.context.menu.from.editor') && this.fromEditorSelectedEditor != '') {
			this.getElement('context-from-editor').setAttribute('label', this.getElement('context-from-editor').getAttribute('original_label').replace('{EDITOR}', this.fromEditorSelectedEditor));
			this.getElement('context-from-editor').setAttribute('tooltiptext', this.fromEditorSelectedEditor);
			this.getElement('context-from-editor').firstChild.setAttribute('tooltiptext', this.fromEditorSelectedEditor);
			this.getElement('context-from-editor').setAttribute('hidden', false);
		}

		//	this.dump(this.fromEditorSelectedEditor);
		//	this.dump(this.fromEditorSelectedEditors);

		//this.dump(thePopupContainer.tagName)

		//let's acomodate the UI
		if (
			aCategorySelectHTML != '' || //rigth clicked SELECT TAG
		(aCategoryPopup && aCategoryPopup != '') || //from a menuitem in the toolbar o category browser popup
		aEvent.currentTarget == this.getElement('extension-icon-context') //from extension icon context
		) {
			//hide elements no realtive to the HTML
			document.getAnonymousElementByAttribute(thePopupContainer, "anonid", "ODPExtension-from-category-paste").setAttribute('hidden', true);
			document.getAnonymousElementByAttribute(thePopupContainer, "anonid", "ODPExtension-from-category-cut").setAttribute('hidden', true);
			document.getAnonymousElementByAttribute(thePopupContainer, "anonid", "ODPExtension-from-category-delete").setAttribute('hidden', true);
			document.getAnonymousElementByAttribute(thePopupContainer, "anonid", "ODPExtension-from-category-copy-selection").setAttribute('hidden', true);
			//	document.getAnonymousElementByAttribute(thePopupContainer , "anonid", "ODPExtension-from-category-encode-decode").setAttribute('hidden', true);
			//	document.getAnonymousElementByAttribute(thePopupContainer , "anonid", "ODPExtension-from-category-encode-decode-separator").setAttribute('hidden', true);
		} else {
			//check for clipboard to show paste menuitem
			if (clipboard && this.focusedElementIsTextbox())
				document.getAnonymousElementByAttribute(thePopupContainer, "anonid", "ODPExtension-from-category-paste").setAttribute('hidden', false);
			else
				document.getAnonymousElementByAttribute(thePopupContainer, "anonid", "ODPExtension-from-category-paste").setAttribute('hidden', true);

			//check for selection to show cut and delete menuitem
			if (selectedTextInsideInput) {
				document.getAnonymousElementByAttribute(thePopupContainer, "anonid", "ODPExtension-from-category-cut").setAttribute('hidden', false);
				document.getAnonymousElementByAttribute(thePopupContainer, "anonid", "ODPExtension-from-category-delete").setAttribute('hidden', false);
			} else {
				document.getAnonymousElementByAttribute(thePopupContainer, "anonid", "ODPExtension-from-category-cut").setAttribute('hidden', true);
				document.getAnonymousElementByAttribute(thePopupContainer, "anonid", "ODPExtension-from-category-delete").setAttribute('hidden', true);
			}

			//if selection != '' show "copy selection"
			if (selectedText != '') {
				//	this.dump('selectedText:"'+selectedText+'"');
				document.getAnonymousElementByAttribute(thePopupContainer, "anonid", "ODPExtension-from-category-copy-selection").setAttribute('hidden', false);
				/*
								var hideEncodeDecodeSeparator = true;
								if(!selectedText.match(/^([a-z]|[0-9])+$/i))
								{
									document.getAnonymousElementByAttribute(thePopupContainer , "anonid", "ODPExtension-from-category-encode").setAttribute('hidden', false);
									hideEncodeDecodeSeparator = false;
								}
								else
									document.getAnonymousElementByAttribute(thePopupContainer , "anonid", "ODPExtension-from-category-encode").setAttribute('hidden', true);

								if(selectedText.indexOf('%') != -1)
								{
									document.getAnonymousElementByAttribute(thePopupContainer , "anonid", "ODPExtension-from-category-decode").setAttribute('hidden', false);
									hideEncodeDecodeSeparator = false;
								}
								else
									document.getAnonymousElementByAttribute(thePopupContainer , "anonid", "ODPExtension-from-category-decode").setAttribute('hidden', true);

								document.getAnonymousElementByAttribute(thePopupContainer , "anonid", "ODPExtension-from-category-encode-decode-separator").setAttribute('hidden', hideEncodeDecodeSeparator);*/
			} else {
				document.getAnonymousElementByAttribute(thePopupContainer, "anonid", "ODPExtension-from-category-copy-selection").setAttribute('hidden', true);
				//document.getAnonymousElementByAttribute(thePopupContainer , "anonid", "ODPExtension-from-category-encode").setAttribute('hidden', true);
				//document.getAnonymousElementByAttribute(thePopupContainer , "anonid", "ODPExtension-from-category-decode").setAttribute('hidden', true);
				//document.getAnonymousElementByAttribute(thePopupContainer , "anonid", "ODPExtension-from-category-encode-decode-separator").setAttribute('hidden', true);
			}
		}

		/*
							//single categories
							var aCategorySelectedText = this.categoryGetFromURL(selectedText);
							var aCategoryFocused = this.categoryGetFocused();
							var aCategoryLinks = [];
							var aCategoryLink
							var aCategoryPopup = this.categoryGetFromURL(document.popupNode.getAttribute('value'))
							var aCategorySelectHTML =  this.categoryGetFromURL(aEvent.originalTarget.options[aEvent.originalTarget.selectedIndex].value);
							//multiples categories
							var aMCategorySelectedText = [];
							var aMCategoryLinks = [];
							var aMCategoriesMultipleTabHandler = [];
						*/

		//let's show the menu if it is hidden and sets the value checking the exeptions

		//extension icon
		if (aEvent.currentTarget == this.getElement('extension-icon-context')) {
			//this.dump('icon:'+aEvent.type);
			this.fromCategoryClickType = 'single';
			//the "from category" in the extension icon helps to do a command in another category no matter if there is a category or editor selected
			this.fromCategorySelectedCategory = '';

			this.fromEditorSelectedEditor = '';
			this.fromEditorSelectedEditors = [];

			this.removeChilds(this.getElement('from-categories-tooltip-data'));
			var label = this.create('label');
			label.setAttribute('value', this.getString('from.category.will.ask.category'));
			this.getElement('from-categories-tooltip-data').appendChild(label);
		}
		//rigth double clik
		else if (aEvent.type == 'dblclick') {

			//this.dump('double click:'+aEvent.type);

			this.fromCategoryAutoPopupPreventAppearAgain = true;

			if (aDocTypeXUL) {
				if (aCategoryTabContextMenu != '') {
					this.fromCategorySelectedCategory = aCategoryTabContextMenu; //rigth clicked category in not focused tab
					this.fromCategoryClickType = 'single';
				} else {
					fromCategoryUpdating = false;
					return;
				}
			} else {
				if (aCategorySelectHTML != '') {
					this.fromCategorySelectedCategory = aCategorySelectHTML; //firefox is not showing the context menu when clicking a select, then give priority to this one
					this.fromCategoryClickType = 'single';
				} else if (aCategoryLink != '') {
					this.fromCategoryClickType = 'single';
					this.fromCategorySelectedCategory = aCategoryLink; //rigth clicked link
				} else if (aLinkCategoryAttribute != '') {
					this.fromCategoryClickType = 'single';
					this.fromCategorySelectedCategory = aLinkCategoryAttribute; //rigth clicked link
				} else if (aMCategorySelectedText.length > 1) {
					//this.dump('aMCategorySelectedText'+aMCategorySelectedText);
					this.fromCategoryClickType = 'multiple';
					this.fromCategorySelectedCategories = aMCategorySelectedText; //selected linked cateories
				} else if (aCategorySelectedText != '') {
					this.fromCategoryClickType = 'single';
					this.fromCategorySelectedCategory = aCategorySelectedText; //selected text
				} else if (aMCategoryLinks.length > 1) {
					this.fromCategoryClickType = 'multiple';
					this.fromCategorySelectedCategories = aMCategoryLinks; //selected links
				} else if (aCategoryLinks != '') {
					this.fromCategoryClickType = 'single';
					this.fromCategorySelectedCategory = aCategoryLinks; //first link in the selection
				} else if (aCategoryFocused != '') {
					this.fromCategoryClickType = 'single';
					this.fromCategorySelectedCategory = aCategoryFocused; //focused category
				} else {
					this.fromCategoryClickType = 'single';
					this.fromCategorySelectedCategory = '';
				}
			}

			if (this.fromCategoryClickType == 'single' && this.fromCategorySelectedCategory == '') {
				this.removeChilds(this.getElement('from-categories-tooltip-data'));
				var label = this.create('label');
				label.setAttribute('value', this.getString('from.category.will.ask.category'));
				this.getElement('from-categories-tooltip-data').appendChild(label);
			} else if (this.fromCategoryClickType == 'single') {
				this.removeChilds(this.getElement('from-categories-tooltip-data'));
				var label = this.create('label');
				label.setAttribute('value', this.categoryAbbreviate(this.fromCategorySelectedCategory));
				this.getElement('from-categories-tooltip-data').appendChild(label);
			} else {
				this.removeChilds(this.getElement('from-categories-tooltip-data'));
				for (var id in this.fromCategorySelectedCategories) {
					var label = this.create('label');
					label.setAttribute('value', this.categoryAbbreviate(this.fromCategorySelectedCategories[id]));
					this.getElement('from-categories-tooltip-data').appendChild(label);
				}
			}

			autoPopup = true;
		}
		//toolbarbutton
		else if (aCategoryPopup != '' && aEvent.type != 'mouseup' && aEvent.type != 'keypress' && aDocTypeXUL && fromWhere != 'context-from-category' && fromWhere != 'tab-context-from-category' && fromWhere != 'tab-context-multiple-from-category') {
			/* the toolbar buttons, category browser context menu */
			//this.dump('toolbar:'+aEvent.type);
			this.fromCategoryClickType = 'single';
			this.fromCategorySelectedCategory = aCategoryPopup;
			this.removeChilds(this.getElement('from-categories-tooltip-data'));
			var label = this.create('label');
			label.setAttribute('value', this.categoryAbbreviate(this.fromCategorySelectedCategory));
			this.getElement('from-categories-tooltip-data').appendChild(label);
			//	document.popupNode = null;
			var noNavigate = true;
		}
		//select html or rigth click on document
		else if (fromWhere == 'context-from-category' || this.tagName(aEvent.originalTarget) == 'select') {
			//this.dump('area:'+aEvent.type);

			//single link chceking
			if (aCategorySelectHTML != '') //firefox is not show the context menu when clicking a select, then give priority to this one
			{
				//this.dump('aCategorySelectHTML');
				this.fromCategoryClickType = 'single';
				this.fromCategorySelectedCategory = aCategorySelectHTML;
				//this.dump(this.fromCategorySelectedCategory);

				if (aEvent.button && aEvent.button == 2)
					autoPopup = true; //should autopopup, there is no context menu on selects

			} else if (aCategoryLink != '') {
				//this.dump('aCategoryLink');
				this.fromCategoryClickType = 'single';
				this.fromCategorySelectedCategory = aCategoryLink; //rigth clicked link
			} else if (aLinkCategoryAttribute != '') {
				//	this.dump('aLinkCategoryAttribute');
				this.fromCategoryClickType = 'single';
				this.fromCategorySelectedCategory = aLinkCategoryAttribute; //rigth clicked link
			} else if (aCategorySelectedText != '') {
				//	this.dump('aCategorySelectedText');
				this.fromCategoryClickType = 'single';
				this.fromCategorySelectedCategory = aCategorySelectedText; //selected text
			} else if (aCategoryLinks != '') {
				//this.dump('aCategoryLinks');
				this.fromCategoryClickType = 'single';
				this.fromCategorySelectedCategory = aCategoryLinks; //first link on the list
			} else if (aCategoryFocused != '') {
				//	this.dump('aCategoryFocused');
				this.fromCategoryClickType = 'single';
				this.fromCategorySelectedCategory = aCategoryFocused; //focused category
			} else {
				this.fromCategoryClickType = 'single';
				this.fromCategorySelectedCategory = '';
			}

			if (!this.preferenceGet('ui.context.menu.from.category') || this.fromCategorySelectedCategory == '')
				this.getElement('context-from-category').setAttribute('hidden', true);
			else {
				this.getElement('context-from-category').setAttribute('label', this.getElement('context-from-category').getAttribute('original_label').replace('{CATEGORY}', this.categoryTitleForLabel(this.categoryAbbreviate(this.fromCategorySelectedCategory))));
				this.getElement('context-from-category').setAttribute('tooltiptext', this.fromCategorySelectedCategory);
				this.getElement('context-from-category').firstChild.setAttribute('tooltiptext', this.fromCategorySelectedCategory);
				this.getElement('context-from-category').setAttribute('hidden', false);
			}

			//multiple link checking

			if (aMCategoryLinks.length > 1)
				this.fromCategorySelectedCategories = aMCategoryLinks; //selected linked cateories
			else if (aMCategorySelectedText.length > 1)
				this.fromCategorySelectedCategories = aMCategorySelectedText; //selected links as text

			if (!this.preferenceGet('ui.context.menu.from.categories') || this.fromCategorySelectedCategories.length == 0)
				this.getElement('context-from-categories').setAttribute('hidden', true);
			else {
				this.removeChilds(this.getElement('from-categories-tooltip-data'));
				for (var id in this.fromCategorySelectedCategories) {
					var label = this.create('label');
					label.setAttribute('value', this.categoryAbbreviate(this.fromCategorySelectedCategories[id]));
					this.getElement('from-categories-tooltip-data').appendChild(label);
				}
				this.getElement('context-from-categories').setAttribute('hidden', false);
			}
		}

		//tab context menu
		else if (fromWhere == 'tab-context-from-category') {

			this.fromCategoryClickType = 'single';

			if (aCategoryTabContextMenu != '')
				this.fromCategorySelectedCategory = aCategoryTabContextMenu;
			else
				this.fromCategorySelectedCategory = '';

			if (!this.preferenceGet('ui.context.menu.from.category.in.tab.context.menu') || this.fromCategorySelectedCategory == '')
				this.getElement('tab-context-from-category').setAttribute('hidden', true);
			else {
				this.getElement('tab-context-from-category').setAttribute('tooltiptext', this.fromCategorySelectedCategory);
				this.getElement('tab-context-from-category').firstChild.setAttribute('tooltiptext', this.fromCategorySelectedCategory);
				this.getElement('tab-context-from-category').setAttribute('label', this.getElement('tab-context-from-category').getAttribute('original_label').replace('{CATEGORY}', this.categoryTitleForLabel(this.categoryAbbreviate(this.fromCategorySelectedCategory))));
				this.getElement('tab-context-from-category').setAttribute('hidden', false);
			}
		}
		//multiple tab handler
		else if (fromWhere == 'tab-context-multiple-from-category') {
			//this.dump('MTH:'+aEvent.type);

			//this.dump(aMCategoriesMultipleTabHandler);
			if (this.preferenceGet('ui.context.menu.from.category.in.tab.context.menu') && aMCategoriesMultipleTabHandler.length > 0) {
				this.fromCategoryClickType = 'multiple';

				this.fromCategorySelectedCategories = aMCategoriesMultipleTabHandler;

				if (this.fromCategorySelectedCategories.length > 1) {
					this.getElement('tab-context-multiple-from-category').removeAttribute('tooltiptext');
					this.getElement('tab-context-multiple-from-category').firstChild.removeAttribute('tooltiptext');
					this.removeChilds(this.getElement('from-categories-tooltip-data'));
					for (var id in this.fromCategorySelectedCategories) {
						var label = this.create('label');
						label.setAttribute('value', this.categoryAbbreviate(this.fromCategorySelectedCategories[id]));
						this.getElement('from-categories-tooltip-data').appendChild(label);
					}
					this.getElement('tab-context-multiple-from-category').setAttribute('label', this.getElement('tab-context-multiple-from-category').getAttribute('original_label_multiple'));
				} else {
					this.getElement('tab-context-multiple-from-category').setAttribute('tooltiptext', this.fromCategorySelectedCategories[0]);
					this.getElement('tab-context-multiple-from-category').firstChild.setAttribute('tooltiptext', this.fromCategorySelectedCategories[0]);
					this.getElement('tab-context-multiple-from-category').setAttribute('label', this.getElement('tab-context-multiple-from-category').getAttribute('original_label_single').replace('{CATEGORY}', this.categoryTitleForLabel(this.categoryAbbreviate(this.fromCategorySelectedCategories[0]))));
				}

				this.getElement('tab-context-multiple-from-category').setAttribute('hidden', false);
			} else {
				this.getElement('tab-context-multiple-from-category').setAttribute('hidden', true);
			}
		}

		//text selection on document
		else if (aDocTypeHTML && (aEvent.type == 'mouseup' || aEvent.type == 'keypress')) {
			//this.dump('ITs from selection '+aEvent.type);

			this.fromCategoryAutoPopupPreventAppearAgain = true;

			//single link chceking
			if (aMCategorySelectedText.length > 1) {
				//	this.dump('aMCategorySelectedText'+aMCategorySelectedText);
				this.fromCategoryClickType = 'multiple';
				this.fromCategorySelectedCategories = aMCategorySelectedText; //selected linked cateories
			} else if (aCategorySelectedText != '') {
				//this.dump('aCategorySelectedText'+aCategorySelectedText);
				this.fromCategoryClickType = 'single';
				this.fromCategorySelectedCategory = aCategorySelectedText; //selected text
			} else if (aMCategoryLinks.length > 1) {
				//	this.dump('aMCategoryLinks'+aMCategoryLinks);
				this.fromCategoryClickType = 'multiple';
				this.fromCategorySelectedCategories = aMCategoryLinks;
			} else if (aCategoryLinks != '') {
				//this.dump('aCategoryLinks'+aCategoryLinks);
				this.fromCategoryClickType = 'single';
				this.fromCategorySelectedCategory = aCategoryLinks; //first link on the list
			} else if (aCategoryLink != '') {
				//this.dump('aCategoryLink'+aCategoryLink);
				this.fromCategoryClickType = 'single';
				this.fromCategorySelectedCategory = aCategoryLink;
			} else {
				//this.dump('nada');
				this.fromCategoryClickType = 'single';
				this.fromCategorySelectedCategory = '';
			}

			//bugfix: if there is some category selected in a input text and there is a click, and the click was not in the input text don't show the auto-menu
			if (this.fromCategorySelectedCategory != '' || this.fromCategorySelectedCategories.length > 0) {
				if (this.preferenceGet('ui.from.category.auto') && !cancelAutoPopup)
					autoPopup = true;
			}

			if (this.fromCategoryClickType == 'single') {
				this.removeChilds(this.getElement('from-categories-tooltip-data'));
				var label = this.create('label');
				label.setAttribute('value', this.categoryAbbreviate(this.fromCategorySelectedCategory));
				if (this.categoryIsRTL(this.fromCategorySelectedCategory))
					label.setAttribute('direction', 'rtl');
				this.getElement('from-categories-tooltip-data').appendChild(label);
			} else {
				this.removeChilds(this.getElement('from-categories-tooltip-data'));
				for (var id in this.fromCategorySelectedCategories) {
					var label = this.create('label');
					label.setAttribute('value', this.categoryAbbreviate(this.fromCategorySelectedCategories[id]));
					if (this.categoryIsRTL(this.fromCategorySelectedCategories[id]))
						label.setAttribute('direction', 'rtl');
					this.getElement('from-categories-tooltip-data').appendChild(label);
				}
			}
		}


		//reset the "category navigate"
		//adding navigate option only if is not from extension icon contextual menu and if there is no multiples categories

		if (!noNavigate && this.fromCategorySelectedCategory != '') {
			var navigate = document.getAnonymousElementByAttribute(thePopupContainer, 'anonid', 'ODPExtension-from-category-navigate');

			this.removeChilds(navigate);

			navigate.setAttribute('value', this.fromCategorySelectedCategory);
			navigate.setAttribute('label', navigate.getAttribute('original_label'));
			navigate.setAttribute('tooltiptext', this.fromCategorySelectedCategory);
			navigate.setAttribute('hidden', false);
			navigate.removeAttribute('done');

			document.getAnonymousElementByAttribute(thePopupContainer, 'anonid', 'ODPExtension-from-category-navigate-separator').setAttribute('hidden', false);


			//parents too, why not!
			var parents = document.getAnonymousElementByAttribute(thePopupContainer, 'anonid', 'ODPExtension-from-category-navigate-parents');
			var path = '';
			if (this.subStrCount(this.fromCategorySelectedCategory, '/') > 0) {

				this.removeChilds(parents);
				var aNodes = this.fromCategorySelectedCategory.split('/');

				var menupopup = this.create('menupopup')
				for (var id in aNodes) {
					if (id == aNodes.length - 1)
						break;
					path += aNodes[id] + '/';
					var add = this.create('menuitem');
					add.setAttribute('value', path.replace(/\/$/, ''));
					add.setAttribute('label', this.categoryAbbreviate(path).replace(/\/$/, ''));
					if (this.categoryIsRTL(path))
						add.setAttribute('direction', 'rtl');
					menupopup.appendChild(add);
				}
				parents.appendChild(menupopup);
				parents.setAttribute('hidden', false);
			} else {
				parents.setAttribute('hidden', true);
			}
		} else {
			document.getAnonymousElementByAttribute(thePopupContainer, 'anonid', 'ODPExtension-from-category-navigate').setAttribute('hidden', true);
			document.getAnonymousElementByAttribute(thePopupContainer, 'anonid', 'ODPExtension-from-category-navigate-parents').setAttribute('hidden', true);
			document.getAnonymousElementByAttribute(thePopupContainer, 'anonid', 'ODPExtension-from-category-navigate-separator').setAttribute('hidden', true);
		}


		if (autoPopup) {
			//this.stopEvent(aEvent);

			this.fromCategoryHideContextMenus();
			//add three pixels is for when the user clicked multiples time like triple click to select a line of text
			//maybe the user clciked more than 3 times and that will active the first action of the menu
			//this popup should be nice, not evil!
			if (this.contentAreaContextMenu().state != 'open' || aEvent.type == 'dblclick' || aEvent.detail == 3) {
				setTimeout(function() {
					ODPExtension.contentAreaContextMenu().hidePopup();
					ODPExtension.getElement('from-category').openPopupAtScreen(aEvent.screenX + 25, aEvent.screenY - 40, false);
				}, 0);

			}
			//when the popups open, listen key press so the popup is hidden
			window.addEventListener('keypress', ODPExtension.fromCategoryCloseMenu, false);

		}
		fromCategoryUpdating = false;
	}
	this.fromCategoryCloseMenu = function() {
		ODPExtension.getElement('from-category').hidePopup();
		window.removeEventListener('keypress', ODPExtension.fromCategoryCloseMenu, false);
	}
	return null;

}).apply(ODPExtension);
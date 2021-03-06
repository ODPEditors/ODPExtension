(function() {
	// close a tab and return true if the tab was closed. It will return false if the tab is protected by another extension
	this.tabClose = function(aTab) {
		if (!aTab.hasAttribute('isPermaTab') && !aTab.hasAttribute('protected')) {
			if(!gBrowser.removeTab)
				gBrowser.closeTab(aTab);
			else
				gBrowser.removeTab(aTab);
			return true;
		}
		return false;
	}
	//returns the tab context menu
	this.tabContextMenu = function() {
		if (document.getAnonymousElementByAttribute(this.getBrowserElement("content"), "anonid", "tabContextMenu"))
			return document.getAnonymousElementByAttribute(this.getBrowserElement("content"), "anonid", "tabContextMenu");
		else if (gBrowser.tabContainer && gBrowser.tabContainer.contextMenu)
			return gBrowser.tabContainer.contextMenu;
		else
			return this.getBrowserElement('tabContextMenu');
	}
	//returns the tab location of the tab that is in the context menu
	this.tabContextMenuLocation = function() {
		if (gBrowser.mContextTab)
			return this.tabGetLocation(gBrowser.mContextTab);
		else
			return '';
	}
	//returns the focused tab
	this.tabGetFocused = function() {
		return gBrowser.tabContainer.childNodes[gBrowser.tabContainer.selectedIndex];
	}
	//returns a tab from a document
	/*
		http://forums.mozillazine.org/viewtopic.php?p=3329527#p3329527
		document of page = event.originalTarget
		window of page = event.originalTarget.defaultView
		browser = gBrowser.getBrowserForDocument(event.originalTarget)
		tab = gBrowser.mTabs[gBrowser.getBrowserIndexForDocument(event.originalTarget)]
		panel = gBrowser.mTabs[gBrowser.getBrowserIndexForDocument(event.originalTarget)].linkedPanel
	*/
	this.tabGetFromDocument = function(aDoc) {
		return gBrowser.mTabs[gBrowser.getBrowserIndexForDocument(this.documentGetTop(aDoc))]
	}
	this.tabGetFromChromeDocument = function(aDoc) {
		return gBrowser.mTabs[gBrowser.getBrowserIndexForDocument(aDoc.top.document)]
	}
	//gets the current URI from aTab-REVIEW
	this.tabGetLocation = function(aTab) {
		if (aTab.hasAttribute('permaTabUrl'))
			return this.IDNDecodeURL(String(aTab.getAttribute('permaTabUrl')));
		else {
			var browser = this.browserGetFromTab(aTab)
			if (browser && browser.currentURI && browser.currentURI.spec)
				return this.IDNDecodeURL(String(browser.currentURI.spec));
			else
				return '';
		}
	}
	//returns true if a tab has frames
	this.tabHasFrames = function(aTab) {
		if (this.windowGetFromTab(aTab).frames.length > 0)
			return true;
		else
			return false;
	}

	//open a new tab with an URL that is already encoded example:http://www.dmoz.org/World/Espa%C3%B1ol/
	var tabOpenTimeout = false;
	var tabOpenTimeoutAllow = true;
	this.tabOpen = function(aURL, selected, aPostData, inNoTree) {

		var openInTree = false;
		if(!inNoTree) {
			if(tabOpenTimeoutAllow){
				tabOpenTimeoutAllow = false;
				openInTree = true
			}
			clearTimeout(tabOpenTimeout);
			tabOpenTimeout = setTimeout(function(){
				tabOpenTimeoutAllow = true;
				ODPExtension.treeStyleTabInTreeOpenStop();
			}, 350);
		}

		if(openInTree)
			this.treeStyleTabInTreeOpenStart();

		if(typeof(aURL) == 'object') {
			var aTab = []
			for(var id in aURL){
				aTab[aTab.length] = gBrowser.addTab(aURL[id], null, null, this.postData(aPostData));
			}
			if (!selected) {} else
				this.tabSelect(aTab[0]);
		} else {
			var aTab = gBrowser.addTab(aURL, null, null, this.postData(aPostData));
			if (!selected) {} else
				this.tabSelect(aTab);
		}


		return aTab;
	}
	//selects a tab
	this.tabSelect = this.tabFocus = function(aTab) {
		gBrowser.selectedTab = aTab;
	}

	var tabSaveData = true;
	var tabSaveDataTimeout = true;
	this.addListener('tabSelect', function(){
		tabSaveData = false;
		clearTimeout(tabSaveDataTimeout)
		tabSaveDataTimeout = setTimeout(function(){
			tabSaveData = true;
		}, 300);
	});
	this.addListener('tabClose', function(){
		tabSaveData = false;
		clearTimeout(tabSaveDataTimeout)
		tabSaveDataTimeout = setTimeout(function(){
			tabSaveData = true;
		}, 300);
	});
	this.tabSaveData = function(aName, aValue, aTab) {
		if(tabSaveData) {
			aName = aName.replace(/^ODPExtension-/, '')
			if(!aTab)
				aTab = this.tabGetFocused();
			if(!aTab.ODPExtensionData)
				aTab.ODPExtensionData = []
			aTab.ODPExtensionData[aName] = aValue
		}
	}

	this.tabGetData = function(aName, aTab) {
		aName = aName.replace(/^ODPExtension-/, '')
		if(!aTab)
			aTab = this.tabGetFocused();
		if(!aTab.ODPExtensionData)
			return null
		if(!!aTab.ODPExtensionData[aName])
			return aTab.ODPExtensionData[aName]
		else
			return null
	}


	return null;

}).apply(ODPExtension);
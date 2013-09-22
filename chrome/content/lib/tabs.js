(function() {
	// close a tab and return true if the tab was closed. It will return false if the tab is protected by another extension
	this.tabClose = function(aTab) {
		if (!aTab.hasAttribute('isPermaTab') && !aTab.hasAttribute('protected')) {
			try {
				gBrowser.closeTab(aTab);
			} catch (e) {
				gBrowser.removeTab(aTab);
			}
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
			return String(aTab.getAttribute('permaTabUrl'));
		else {
			if (this.browserGetFromTab(aTab) && this.browserGetFromTab(aTab).currentURI && this.browserGetFromTab(aTab).currentURI.spec)
				return String(this.browserGetFromTab(aTab).currentURI.spec);
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
	this.tabOpen = function(aURL, selected, aPostData) {
		this.treeStyleTabInTreeOpenStart();

		var aTab = gBrowser.addTab(aURL, null, null, this.postData(aPostData));
		if (!selected) {} else
			this.tabSelect(aTab);

		this.treeStyleTabInTreeOpenStop();
		return aTab;
	}
	//selects a tab
	this.tabSelect = function(aTab) {
		gBrowser.selectedTab = aTab;
	}

	return null;

}).apply(ODPExtension);
(function() {
	//closes a sidebar ( this function is to be called from a sidebar )
	this.sidebarClose = function(anID) {
		toggleSidebar(anID);
	}
	//flash the window in the taskbar
	this.windowGetAttention = function() {
		window.getAttention();
	}
	//returns the focused window
	this.windowGetFocused = function() {
		var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
			.getService(Components.interfaces.nsIWindowMediator);
		return wm.getMostRecentWindow('navigator:browser');
	}
	//returns the content window of a tab
	this.windowGetFromTab = function(aTab) {
		return this.browserGetFromTab(aTab).contentWindow;
	}
	//returns an array of navigator:browser
	this.windowsGet = function() {
		var windows = [];
		var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
			.getService(Components.interfaces.nsIWindowMediator);
		var enumerator = wm.getEnumerator('navigator:browser');
		while (enumerator.hasMoreElements()) {
			var win = enumerator.getNext();
			// win is [Object ChromeWindow] (just like window), do something with it
			windows[windows.length] = win;
		}
		return windows;
	}
	//returns an array with all the urls of all the windows including the tabs
	this.windowsGetURLs = function() {
		var windows = this.windowsGet();
		var urls = [];
		for (var id in windows) {
			var window = windows[id];
			for (var i = 0; i < window.gBrowser.tabContainer.childNodes.length; i++) {
				urls[urls.length] = this.string(window.gBrowser.getBrowserForTab(window.gBrowser.tabContainer.childNodes[i]).currentURI.spec);
			}
		}
		return urls;
	}

	return null;

}).apply(ODPExtension);
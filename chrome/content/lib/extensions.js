(function()
{
	//return true if the required version of gecko is present
	this.isGecko = function(aVersion)
	{
		var appInfo = Components.classes["@mozilla.org/xre/app-info;1"]
				.getService(Components.interfaces.nsIXULAppInfo);
		var versionChecker = Components.classes["@mozilla.org/xpcom/version-comparator;1"]
				.getService(Components.interfaces.nsIVersionComparator);
		return (versionChecker.compare(appInfo.platformVersion, aVersion) >= 0);
	}
	//returns true if multiple tab handler is installed
	this.isThereMultipleTabHandler = function()
	{
		if ('MultipleTabService' in window)
			return true;
		else
			return false;
	}
	//returns true if Split Browser s installed
	this.isThereSplitBrowser = function()
	{
		if ('SplitBrowser' in window)
			return true;
		else
			return false;
	}
	//returns true if tab kit is installed
	this.isThereTabKit = function()
	{
		if ('tabkit' in window)
			return true;
		else
			return false;
	}
	//returns true if tree style tab is installed
	this.isThereTreeStyleTab = function()
	{
		if ('TreeStyleTabService' in window)
			return true;
		else
			return false;
	}
	//returns true if vert tabbar is installed
	this.isThereVertTabbar = function()
	{
		if ('vertTabbar' in window)
			return true;
		else
			return false;
	}
	//returns an array with the tabs selected with multiple tab handler
	this.multipleTabHandlerSelectedTabs = function()
	{
		if(this.isThereMultipleTabHandler())
		{
			try{return MultipleTabService.getSelectedTabs();}catch(e){ return [];/* don't let any API break your code*/}
		}
		else
		{
			return [];
		}
	}
	//start to open tabs as childs of current tab
	this.treeStyleTabInTreeOpenStart = function()
	{
		if(this.isThereTreeStyleTab())// open tabs as children of the current tab
		{
			try{TreeStyleTabService.readyToOpenChildTab(gBrowser.selectedTab, true);}catch(e){}
		}
	}
	//stop to open tabs as childs of current tab
	this.treeStyleTabInTreeOpenStop = function()
	{
		if(this.isThereTreeStyleTab())
		{
			try{TreeStyleTabService.stopToOpenChildTab(gBrowser.selectedTab);}catch(e){}
		}
	}

	return null;

}).apply(ODPExtension);

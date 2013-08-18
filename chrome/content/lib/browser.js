(function()
{
	//returns the application name
	this.getApplicationName = function ()
	{
		var appInfo=Components.classes["@mozilla.org/xre/app-info;1"].
						getService(Components.interfaces.nsIXULAppInfo);
		return  appInfo.name
	}
	//returns true if the Application is SeaMonkey
	this.isSeaMonkey = function()
	{
		if(this.getApplicationName() == 'SeaMonkey')
			return true;
		else
			return false;
	}

	return null;

}).apply(ODPExtension);

/*
	gets the extension main object from places where maybe is not in the scope. Example inside a shared object from a window that was closed.
	tito (ed:development) <tito.bouzout@gmail.com>
*/

const nsITheExtension = Components.interfaces.nsITheExtension;
const nsISupports = Components.interfaces.nsISupports;
const nsIObserver = Components.interfaces.nsIObserver;

const CLASS_ID = Components.ID("{97176570-9c94-1337-981c-0800200c9a66}");
const CLASS_NAME = "Gets the extension main object from places where maybe is not in the scope. Example inside a shared object from a window that was closed.";
const CONTRACT_ID = "@particle.universe.odp.tito/TheExtension;3";

function TheExtension() {
	this.wrappedJSObject = this;
}
TheExtension.prototype = {
	classID: CLASS_ID,
	classDescription: CLASS_NAME,
	contractID: CONTRACT_ID,
	observe: function(aSubject, aTopic, aData) {},
	//returns the main extension object
	code: function(anExt) {
		//try to use the most recent window
		var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
			.getService(Components.interfaces.nsIWindowMediator);
		var win = wm.getMostRecentWindow('navigator:browser');

		//waiting for the extension to load
		if (win && ('' + anExt + '' in win)) {
			return win[anExt];
		}
	},
	//returns the win
	win: function() {
		//try to use the most recent window
		var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
			.getService(Components.interfaces.nsIWindowMediator);
		var win = wm.getMostRecentWindow('navigator:browser');

		return win;
	},
	QueryInterface: function(aIID) {
		if (!aIID.equals(nsITheExtension) && !aIID.equals(nsISupports) && !aIID.equals(nsIObserver))
			throw Components.results.NS_ERROR_NO_INTERFACE;
		return this;
	}

};

/***********************************************************
class factory

This object is a member of the global-scope Components.classes.
It is keyed off of the contract ID. Eg:

myTheExtension = Components.classes["@dietrich.ganx4.com/TheExtension;2"].
                          createInstance(Components.interfaces.nsITheExtension);

***********************************************************/
var TheExtensionFactory = {
	createInstance: function(aOuter, aIID) {
		if (aOuter != null)
			throw Components.results.NS_ERROR_NO_AGGREGATION;
		return (new TheExtension()).QueryInterface(aIID);
	}
};

/***********************************************************
module definition (xpcom registration)
***********************************************************/
var TheExtensionModule = {
	registerSelf: function(aCompMgr, aFileSpec, aLocation, aType) {
		aCompMgr = aCompMgr.
		QueryInterface(Components.interfaces.nsIComponentRegistrar);
		aCompMgr.registerFactoryLocation(CLASS_ID, CLASS_NAME,
			CONTRACT_ID, aFileSpec, aLocation, aType);
	},

	unregisterSelf: function(aCompMgr, aLocation, aType) {
		aCompMgr = aCompMgr.
		QueryInterface(Components.interfaces.nsIComponentRegistrar);
		aCompMgr.unregisterFactoryLocation(CLASS_ID, aLocation);
	},

	getClassObject: function(aCompMgr, aCID, aIID) {
		if (!aIID.equals(Components.interfaces.nsIFactory))
			throw Components.results.NS_ERROR_NOT_IMPLEMENTED;

		if (aCID.equals(CLASS_ID))
			return TheExtensionFactory;

		throw Components.results.NS_ERROR_NO_INTERFACE;
	},

	canUnload: function(aCompMgr) {
		return true;
	}
};

/***********************************************************
module initialization

When the application registers the component, this function
is called.
***********************************************************/
//http://forums.mozillazine.org/viewtopic.php?f=19&t=1957409
try {
	Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
} catch (e) {}

/**
 * XPCOMUtils.generateNSGetFactory was introduced in Mozilla 2 (Firefox 4).
 * XPCOMUtils.generateNSGetModule is for Mozilla 1.9.1 (Firefox 3.5).
 */

if ("undefined" == typeof XPCOMUtils) // Firefox <= 2.0
{
	function NSGetModule(aComMgr, aFileSpec) {
		return TheExtension;
	}
} else if (XPCOMUtils.generateNSGetFactory)
	var NSGetFactory = XPCOMUtils.generateNSGetFactory([TheExtension]);
else
	var NSGetModule = XPCOMUtils.generateNSGetModule([TheExtension]);
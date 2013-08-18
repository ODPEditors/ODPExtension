/* 
	SHARES OBJECTS BETWEEN WINDOWS OF THE SAME BROWSER INSTANCE FOR N ADD-ONS 
	tito (ed:development) <extensiondevelopment@gmail.com>
*/

const nsISharedObject = Components.interfaces.nsISharedObject;
const nsISupports = Components.interfaces.nsISupports;
const nsIObserver = Components.interfaces.nsIObserver;

const CLASS_ID = Components.ID("{a1805800-9c94-11df-981c-0800200c9a66}");
const CLASS_NAME = "Shares objects of N add-ons between windows of the same browser instance";
const CONTRACT_ID = "@particle.universe.tito/SharedObject;3";

function SharedObject(){this.wrappedJSObject = this;}

SharedObject.prototype = 
{
	classID : CLASS_ID,
	classDescription : CLASS_NAME,
	contractID : CONTRACT_ID,
	observe: function(aSubject, aTopic, aData)
	{
	},
	//our array that will store the shared variables
	s : [],
	//appends a var to the array 's' (store)
	sharedObjectSet: function(aName,aValue)
	{
		this.s[aName] = aValue;
	},
	//gets a var from the array 's' (store)
	sharedObjectGet: function(aName)
	{
		return this.s[aName];
	},
	//sets to null the array in the position aName
	sharedObjectDestroy: function(aName)
	{
		/* 
			CAUTION THIS WILL DESTROY THE OBJECT INSIDE THE XPCOM COMPONENT 
			BUT THE REFERENCE (if any) ON YOUR EXTENSION WILL REMAIN INTACT
		*/
		this.s[aName] = null;
		delete(this.s[aName]);
	},
	//returns true if the object aName exists in 's' (store)
	sharedObjectExists: function(aName)
	{
		if(!this.s[aName])
			return false;
		else
			return true;
	},
   QueryInterface: function(aIID)
  {
    if (
		!aIID.equals(nsISharedObject)
		&& !aIID.equals(nsISupports)
		&& !aIID.equals(nsIObserver)
		)
      throw Components.results.NS_ERROR_NO_INTERFACE;
    return this;
  }
};

/***********************************************************
class factory

This object is a member of the global-scope Components.classes.
It is keyed off of the contract ID. Eg:

mySharedObject = Components.classes["@dietrich.ganx4.com/SharedObject;2"].
                          createInstance(Components.interfaces.nsISharedObject);

***********************************************************/
var SharedObjectFactory = {
  createInstance: function (aOuter, aIID)
  {
    if (aOuter != null)
      throw Components.results.NS_ERROR_NO_AGGREGATION;
    return (new SharedObject()).QueryInterface(aIID);
  }
};

/***********************************************************
module definition (xpcom registration)
***********************************************************/
var SharedObjectModule = {
  registerSelf: function(aCompMgr, aFileSpec, aLocation, aType)
  {
    aCompMgr = aCompMgr.
        QueryInterface(Components.interfaces.nsIComponentRegistrar);
    aCompMgr.registerFactoryLocation(CLASS_ID, CLASS_NAME, 
        CONTRACT_ID, aFileSpec, aLocation, aType);
  },

  unregisterSelf: function(aCompMgr, aLocation, aType)
  {
    aCompMgr = aCompMgr.
        QueryInterface(Components.interfaces.nsIComponentRegistrar);
    aCompMgr.unregisterFactoryLocation(CLASS_ID, aLocation);        
  },
  
  getClassObject: function(aCompMgr, aCID, aIID)
  {
    if (!aIID.equals(Components.interfaces.nsIFactory))
      throw Components.results.NS_ERROR_NOT_IMPLEMENTED;

    if (aCID.equals(CLASS_ID))
      return SharedObjectFactory;

    throw Components.results.NS_ERROR_NO_INTERFACE;
  },

  canUnload: function(aCompMgr) { return true; }
};

/***********************************************************
module initialization

When the application registers the component, this function
is called.
***********************************************************/
//http://forums.mozillazine.org/viewtopic.php?f=19&t=1957409
try
{
  Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
}
catch(e) { }

/**
* XPCOMUtils.generateNSGetFactory was introduced in Mozilla 2 (Firefox 4).
* XPCOMUtils.generateNSGetModule is for Mozilla 1.9.1 (Firefox 3.5).
*/

if ("undefined" == typeof XPCOMUtils) // Firefox <= 2.0
{
  function NSGetModule(aComMgr, aFileSpec)
  {
    return SharedObject;
  }
}
else if (XPCOMUtils.generateNSGetFactory)
  var NSGetFactory = XPCOMUtils.generateNSGetFactory([SharedObject]);
else
  var NSGetModule = XPCOMUtils.generateNSGetModule([SharedObject]);
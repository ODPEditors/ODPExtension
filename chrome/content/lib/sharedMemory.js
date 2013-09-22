(function() {
	//returns true if a shared object created by a XPCOM exists (shared by all the windows of the same browser instance (profile))
	this.sharedObjectExists = function(objectName) {
		var sharedObjectComponent = Components.classes['@particle.universe.tito/SharedObject;3']
			.getService().wrappedJSObject;

		return sharedObjectComponent.sharedObjectExists('ODPExtension.' + objectName);
	}
	//returns a shared object stored in a XPCOM (shared by all the windows of the same browser instance (profile))
	/*
		NOTE TO SELF:
			Problematic reference:
				var ODPExtension = {} //some extension var. solved with the "theExtension;2" component

				this.complexSharedVar = function()
				{
					var aConnection = 'complexVar.connection';

					if(this.sharedObjectExists(aConnection))
					{
						return this.sharedObjectGet(aConnection);
					}
					else
					{
						var object = {};
							object.propertyOne = [];
							object.methodOne = function(anID) { };
							object.reset = function(anID) { };
							object.stop = function(anID)
							{
PROBLEMATIC----------->>>>>>>>> ODPExtension.dump(anID+' takes '+diff+' ms');
							}
					}
				}

PROBLEM			when the window that holds "ODPExtension" is closed the complexVar still exists for other windows in a shared enviroment, but ODPExtension no exists anymore.
	*/
	this.sharedObjectGet = function(objectName, aDefault) {
		var sharedObjectComponent = Components.classes['@particle.universe.tito/SharedObject;3']
			.getService().wrappedJSObject;
		if (this.sharedObjectExists(objectName)) {
			//this.dump('sharedObjectGet:The shared var "'+objectName+'" is a property of the XPCOM');
		} else {
			//this.dump('sharedObjectGet:The shared var "'+objectName+'" is NOT a property of the XPCOM');
			if (!aDefault && aDefault !== 0) {
				//this.dump('sharedObjectGet:The shared var "'+objectName+'" doenst have a default value');
				aDefault = {};
			} else {
				//this.dump('sharedObjectGet:The shared var "'+objectName+'" has a default value');
			}

			//this.dump('sharedObjectGet:The shared var "'+objectName+'" was stored as a property of the XPCOM');
			sharedObjectComponent.sharedObjectSet('ODPExtension.' + objectName, aDefault);
		}
		//this.dump('sharedObjectGet:The property "'+objectName+'" was retrieved from the XPCOM');
		return sharedObjectComponent.sharedObjectGet('ODPExtension.' + objectName);
	}

	return null;

}).apply(ODPExtension);
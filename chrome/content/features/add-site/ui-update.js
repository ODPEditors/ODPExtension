(function()
{

	this.addListener('userInterfaceUpdate', function(aEnabled){ ODPExtension.addSiteOnUserInterfaceUpdate(aEnabled); });

	this.addSiteOnUserInterfaceUpdate = function(aEnabled){
			this.getElement('toolbarbutton-add-to-open-directory').setAttribute('hidden', !aEnabled);
	}

	return null;

}).apply(ODPExtension);

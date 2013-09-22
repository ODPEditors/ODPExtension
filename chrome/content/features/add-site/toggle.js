(function()
{
	this.addListener('toolbarsToggle', function(aClosed){ ODPExtension.addSiteOnToolbarsToggle(aClosed); });

	this.addSiteOnToolbarsToggle = function(aClosed){
		if(aClosed) {
			if(this.getElement('toolbarbutton-add-to-open-directory'))
				this.toolbarOpenRemember(this.getElement('toolbarbutton-add-to-open-directory'));
		} else {
			if(this.getElement('toolbarbutton-add-to-open-directory'))
				this.toolbarCloseRemember(this.getElement('toolbarbutton-add-to-open-directory'));
		}
	}
	return null;

}).apply(ODPExtension);

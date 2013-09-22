(function() {

	//update the position of the icon

	this.extensionIconUpdatePosition = function() {
		this.getBrowserElement('urlbar-icons').appendChild(this.getElement('extension-icon'));
	}

	return null;

}).apply(ODPExtension);
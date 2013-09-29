(function() {

	this.addListener('userInterfaceLoad', function(aEnabled) {
		ODPExtension.tabContextMenu().appendChild(ODPExtension.getElement('tab-context-from-category'));
	});
	return null;

}).apply(ODPExtension);
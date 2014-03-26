(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	var links = [];

	this.addListener('userInterfaceUpdate', function(aEnable) {
		ODPExtension.getElement('open-links-new-tab').setAttribute('hidden', !aEnable);
	});

	this.addListener('contextMenuShowing', function(event) {
		links = ODPExtension.getSelectedLinksURLs();
		ODPExtension.getElement('open-links-new-tab').setAttribute('hidden', links.length < 2);
		ODPExtension.getElement('copy-links-urls').setAttribute('hidden', links.length < 2);
	});

	this.openSelectedLinks = function(aEvent) {
		for(var id in links){
			this.openURL(links[id], true);
		}
	}
	this.copySelectedLinks = function(aEvent) {
		this.copyToClipboard(links.join('\n'));
	}
	return null;

}).apply(ODPExtension);
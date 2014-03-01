(function() {

	this.categoryBrowserOpen = function() {
		this.getElement('category-browser').openPopup();
		document.getAnonymousElementByAttribute(this.getElement('category-browser'), 'anonid', 'ODPExtension-category-browser-textbox-data-xbl').focus();
	}
	return null;

}).apply(ODPExtension);
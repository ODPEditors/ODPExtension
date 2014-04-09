(function() {

	var debugingThisFile = true;

	var anElement

	this.addListener('contextMenuShowing', function(event) {
		anElement = ODPExtension.getFocusedEditableElement(ODPExtension.documentGetFocused())
	});

	this.pasteCategory = function(aEvent) {
		this.stopEvent(aEvent);

		anElement = ODPExtension.getFocusedEditableElement(ODPExtension.documentGetFocused())

		this.fromCategoryAction = 'pasteCategoryPaste'

		this.fromCategoryHideContextMenus();
		this.categoryBrowserOpen();
	}
	this.pasteCategoryPaste = function(aCategory){

		if(!anElement(aCategory[0]))
			this.copyToClipboard(aCategory[0])

	}
	return null;

}).apply(ODPExtension);
(function() {

	var debugingThisFile = true;

	var anElement

	this.addListener('contextMenuShowing', function(event) {
		anElement = ODPExtension.getFocusedElement(ODPExtension.documentGetFocused())
	});

	this.pasteCategory = function(aEvent) {
		this.stopEvent(aEvent);

		anElement = ODPExtension.getFocusedElement(ODPExtension.documentGetFocused())

		this.fromCategoryAction = 'pasteCategoryPaste'

		this.fromCategoryHideContextMenus();
		this.categoryBrowserOpen();
	}
	this.pasteCategoryPaste = function(aCategory){

		if(!!anElement) {
			if(anElement.contentEditable)
				anElement.innerHTML = aCategory
			else
				anElement.value = aCategory
		} else {
			this.copyToClipboard(aCategory)
		}
	}
	return null;

}).apply(ODPExtension);
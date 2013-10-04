(function() {

	//makes any menupopup navegable, no need to call this on any childs of this menupopup
	//super-cali-fragilistico-espi-alidoso!!!
	this.categoryBrowserNavigateMakeMenuPopupNavegable = function(aMenupopup) {
		//category browser attributes
		aMenupopup.setAttribute('ignorekeys', true);
		aMenupopup.setAttribute('class', 'ODPExtension-category-filter ODPExtension-crop'); //by setting this a textbox filter will appear on the menu - which is XBL
		aMenupopup.setAttribute('onmouseover', 'ODPExtension.categoryBrowserNavigate(event);');
		aMenupopup.setAttribute('onmouseout', 'ODPExtension.categoryBrowserNavigate(event);');
		//aMenupopup.setAttribute('onclick', 'ODPExtension.stopEvent(event);ODPExtension.categoryBrowserClick(event)');/*dont use oncommand it will the menus no clickeables*/
		aMenupopup.setAttribute('onmouseup', 'ODPExtension.stopEvent(event);ODPExtension.categoryBrowserClick(event)'); /*dont use oncommand it will the menus no clickeables*/
		aMenupopup.setAttribute('ondblclick', 'ODPExtension.stopEvent(event);');
		aMenupopup.setAttribute('context', 'ODPExtension-from-category');
	}


	return null;

}).apply(ODPExtension);
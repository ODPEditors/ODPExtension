(function() {


	this.categoryFilterFocusTextbox = function(aMenupopup, aEvent){
		setTimeout(function(){
			if(aEvent.currentTarget == aEvent.originalTarget)
				document.getAnonymousElementByAttribute(aMenupopup, "anonid", "ODPExtension-category-filter-textbox-xbl").focus();
		}, 300);

	}
	return null;

}).apply(ODPExtension);
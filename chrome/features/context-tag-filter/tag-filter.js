(function() {

	var lastTagName = 'li';
	var lastSearch = '';

	this.tagFilter = function(aEvent) {
		this.stopEvent(aEvent);

		var tagName = this.prompt('Name of the Tag to filter:', lastTagName)
		if(!tagName)
			return
		lastTagName = tagName

		var search = this.prompt('Search for..', lastSearch)
		lastSearch = search

		this.foreachFrame(this.windowGetFromTab(this.tabGetFocused()), function(aDoc) {
			var tags = aDoc.getElementsByTagName(tagName)
			for(var i=0;i<tags.length;i++){
				var tag = tags[i]
				if(search == '' || ODPExtension.searchEngineSearch(search, tag.innerHTML)){
					if(tag.hasAttribute('oldDisplay')){
						tag.style.setProperty('display', tag.getAttribute('oldDisplay'));
					}
				} else {
					tag.setAttribute('oldDisplay', String(tag.style.display))
					tag.style.setProperty('display', 'none');

				}
			}
		})
	}
	return null;

}).apply(ODPExtension);
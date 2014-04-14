(function() {

	this.addListener('DOMContentLoadedNoFrames', function(aDoc) {
		ODPExtension.pageTitles(aDoc);
	});

	this.clipboardOpenURLs = function() {

		var urls = this.arrayUnique((this.getClipboard()+'\n').split('\n'));
		for(var id in urls){
			var item = urls[id].trim();
			if(item != '' && item.indexOf('http') === 0)
				this.tabOpen(item);
		}

	}
	return null;

}).apply(ODPExtension);
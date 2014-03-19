(function() {

	this.rdfTemplatedSite = function(site) {
		var added = ''
		if(site.category && this.categoryIsRTL(site.category))
			added = ' class="rtl"';
		return '<li'+added+'>[<a href="http://www.dmoz.org/editors/editurl/edit?url='+this.encodeUTF8(site.uri)+'&cat='+this.encodeUTF8(site.category)+'">edit</a>] - <a href="'+this.h(site.uri)+'">'+this.h(site.title)+'</a> - '+this.h(site.description)+'<br><small class="green">'+this.h(site.uri)+'</small><br><small>'+this.h(site.category)+'</small></li>'
	}

	return null;

}).apply(ODPExtension);
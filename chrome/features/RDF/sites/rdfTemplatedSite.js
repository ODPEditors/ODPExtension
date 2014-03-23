(function() {

	this.rdfTemplatedSite = function(site) {
		var className = '', added = []
		if(site.category && this.categoryIsRTL(site.category))
			className = ' class="rtl"';
		if(site.cool)
			added[added.length] = 'cool'
		if(site.pdf)
			added[added.length] = 'pdf'
		if(site.atom)
			added[added.length] = 'atom'
		if(site.rss)
			added[added.length] = 'rss'
		if(site.mediadate != '')
			added[added.length] = ' ('+site.mediadate+')'

		if(added.length)
			added = '['+added.join(',')+']'
		else
			added = '';
		return '<li'+className+'>[<a href="http://www.dmoz.org/editors/editurl/edit?url='+this.encodeUTF8(site.uri)+'&cat='+this.encodeUTF8(site.category)+'">edit</a>] - '+added+'<a href="'+this.h(site.uri)+'">'+this.h(site.title)+'</a> - '+this.h(site.description)+'<br><small class="green">'+this.h(site.uri)+'</small><br><small>'+this.h(site.category)+'</small></li>'
	}

	return null;

}).apply(ODPExtension);
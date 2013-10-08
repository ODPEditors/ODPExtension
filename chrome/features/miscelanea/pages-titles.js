(function() {

	this.addListener('DOMContentLoadedNoFrames', function(aDoc) {
		ODPExtension.pageTitles(aDoc);
	});

	this.pageTitles = function(aDoc) {

		var aCategory = this.categoryGetFromDocument(aDoc);
		var aLocation = this.documentGetLocation(aDoc);
		if (aCategory != '' && ( aLocation.indexOf('www.dmoz.org/editors/') != -1 || aDoc.title.indexOf('Open Directory - ') === 0) ) {

			var title = '';
			if (
				aLocation.indexOf('editcat/index') != -1)
				title = 'EDIT';
			else if (
				aLocation.indexOf('editurl/edit') != -1 ||
				aLocation.indexOf('editurl/add') != -1)
				title = 'URL';
			else if (
				aLocation.indexOf('editfaq.cgi') != -1)
				title = 'FAQ';
			else if (
				aLocation.indexOf('editcat/desc') != -1)
				title = 'DESC';
			else if (
				aLocation.indexOf('log/search') != -1)
				title = 'LOG';
			else if (
				aLocation.indexOf('editunrev/listurl') != -1)
				title = 'UNREV';
			else if (
				aLocation.indexOf('editcat/new') != -1)
				title = 'NEWCAT';
			else if (
				aLocation.indexOf('editcat/delete') != -1)
				title = 'DELCAT';
			else if (
				aLocation.indexOf('alphabar.cgi') != -1)
				title = 'ALPHABAR';
			else if (
				aLocation.indexOf('editcat/priority') != -1)
				title = 'SORT';
			else if (
				aLocation.indexOf('editcat/addrelation') != -1 && aLocation.indexOf('type=symbolic') != -1)
				title = '@LINK';
			else if (
				aLocation.indexOf('editcat/editrelation') != -1 && aLocation.indexOf('type=related') != -1)
				title = 'REL';
			else if (
				aLocation.indexOf('editcat/editrelation') != -1 && aLocation.indexOf('type=altlang') != -1)
				title = 'ALT';
			else if (
				aLocation.indexOf('editcat/editlink') != -1)
				title = 'USENET';
			else if (
				aLocation.indexOf('editcat/mv') != -1)
				title = 'MV';
			else if (
				aLocation.indexOf('editcat/terms') != -1)
				title = 'KEYS';
			else if (
				aLocation.indexOf('editcat/searchstring') != -1)
				title = 'EXO';
			else if (
				aLocation.indexOf('editcat/features') != -1)
				title = 'FEAT';
			else if (
				aLocation.indexOf('editcat/editImage') != -1)
				title = 'MOZ';

			if(title != '')
				title += ':';
			aDoc.title = title + this.categoryAbbreviate(aCategory);
		}

	}
	return null;

}).apply(ODPExtension);
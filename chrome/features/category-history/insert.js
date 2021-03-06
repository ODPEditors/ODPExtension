(function() {
	var debugingThisFile = false; //sets debuging on/off for this JavaScript file

	this.addListener('focusedCategoryChange', function(aCategory) {
		//saving the category to the table of categories history
		ODPExtension.categoryHistoryInsert(aCategory, ODPExtension.focusedURL, ODPExtension.date());
	});

	//inserts categories in the category history database, also asigns radiation(points) in an attemp to add some type of nice sorting
	//here I'm just playing
	this.categoryHistoryInsert = function(aCategory, aURL, aDate, noAsync) {
		if (this.categoryIsBadEncoded(aCategory) || aCategory == '')
			return;

		aCategory = aCategory.replace(/\/?\*$/, '')

		//this.dump('categoryHistoryInsert', debugingThisFile);
		//this must be improved .. also modified when the new beta dmoz go live

		//based on location we set radiation(points) to make the category appear higher on the category browser
		// ..........

		var radiation = 1;
		if (aURL.indexOf('editors.dmoz.org') != -1 || aURL.indexOf('www.dmoz.org') != -1) {
			if (aURL.indexOf('editurl/add?url=') != -1)
				radiation = 50;
			else if (aURL.indexOf('editurl/edit?urlId=') != -1)
				radiation = 5;
			else if (
				aURL.indexOf('editfaq.cgi') != -1 ||
				aURL.indexOf('editcat/desc?cat=') != -1)
				radiation = 45;
			else if (aURL.indexOf('editcat/new?cat=') != -1)
				radiation = 120;
			else if (aURL.indexOf('editunrev/listurl?cat=') != -1)
				radiation = 15;
			else if (aURL.indexOf('editunrev/') != -1)
				radiation = 30;
			else if (
				aURL.indexOf('editcat/addrelation?cat=') != -1 ||
				aURL.indexOf('editcat/editrelation?cat=') != -1 ||
				aURL.indexOf('editcat/editrelation?cat=') != -1 ||
				aURL.indexOf('editcat/editlink?cat=') != -1 ||
				aURL.indexOf('manage/makealphabar?cat=') != -1 ||
				aURL.indexOf('editcat/delete?cat=') != -1)
				radiation = 2;
			else if (aURL.indexOf('editcat/editImage?cat=') != -1)
				radiation = 60;
			else if (aURL.indexOf('log/search?') != -1)
				radiation = 8;
			else
				radiation = 4;
		} else if (aURL.indexOf('categoryBrowserClick') !== -1)
			radiation = 250;
		//I'm really evil
		else if (aURL.indexOf('directory.google.com') != -1 || aURL.indexOf('google.com/Top') != -1)
			radiation = 0;

		var db = this.categoriesHistoryDatabaseOpen();
		//insert async of unique categories
		this.insertCategoryHistory.params('categories_history_category', aCategory);
		if(!noAsync)
			db.insertAsync(this.insertCategoryHistory, true);
		else
			db.insert(this.insertCategoryHistory, true);

		//update async of counts points and date
		this.updateCategoryHistory.params('categories_history_category', aCategory);
		this.updateCategoryHistory.params('categories_history_date', aDate);
		this.updateCategoryHistory.params('categories_history_radiation', radiation);
		if(!noAsync)
			db.updateAsync(this.updateCategoryHistory);
		else
			db.update(this.updateCategoryHistory);

	}
	return null;

}).apply(ODPExtension);
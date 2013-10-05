(function() {
	var debugingThisFile = false; //sets debuging on/off for this JavaScript file

	//imports to the category browser history, all the categories that you have in your browser history
	this.categoryHistoryImportCategoriesHistory = function() {

		var historyService = Components.classes["@mozilla.org/browser/nav-history-service;1"]
			.getService(Components.interfaces.nsINavHistoryService);

		// queries parameters (e.g. domain name matching, text terms matching, time range...)
		// see : https://developer.mozilla.org/en/nsINavHistoryQuery
		var query = historyService.getNewQuery();

		// options parameters (e.g. ordering mode and sorting mode...)
		// see : https://developer.mozilla.org/en/nsINavHistoryQueryOptions
		var options = historyService.getNewQueryOptions();

		// execute the query
		// see : https://developer.mozilla.org/en/nsINavHistoryService#executeQuery()
		var result = historyService.executeQuery(query, options);

		// Using the results by traversing a container
		// see : https://developer.mozilla.org/en/nsINavHistoryContainerResultNode
		var cont = result.root;
		cont.containerOpen = true;

		//this.dump(cont.childCount);

		var category = '';
		var toImport = [];
		var sitesCount = cont.childCount;
		for (var i = 0; i < cont.childCount; i++) {
			var node = cont.getChild(i);

			// "node" attributes contains the information (e.g. URI, title, time, icon...)
			// see : https://developer.mozilla.org/en/nsINavHistoryResultNode

			category = this.categoryGetFromURL(node.uri);
			if (category != '') {
				toImport[toImport.length] = {
					cat: category,
					uri: node.uri,
					date: this.date(node.time / 1000)
				};
			}
		}

		// Close container when done
		// see : https://developer.mozilla.org/en/nsINavHistoryContainerResultNode
		cont.containerOpen = false;

		if (toImport.length < 1) {} else {
			var db = this.categoriesHistoryDatabaseOpen();
			db.begin();

			this.categoryHistoryStatements();
			for (var id in toImport) {
				this.categoryHistoryInsert(toImport[id].cat, toImport[id].uri, toImport[id].date, true);
			}
			db.commit();
			db.vacuum();

			ODPExtension.gc();
		}
	}
	return null;

}).apply(ODPExtension);
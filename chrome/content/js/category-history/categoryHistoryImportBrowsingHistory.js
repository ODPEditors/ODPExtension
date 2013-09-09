(function()
{
		var debugingThisFile = false;//sets debuging on/off for this JavaScript file

		//imports to the category browser history, all the categories that you have in your browser history
		this.categoryHistoryImportBrowsingHistory = function()
		{
			this.alert('Please wait a minute!');

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
			for (var i = 0; i < cont.childCount; i ++)
			{
				var node = cont.getChild(i);

				// "node" attributes contains the information (e.g. URI, title, time, icon...)
				// see : https://developer.mozilla.org/en/nsINavHistoryResultNode

				category = this.categoryGetFromURL(node.uri);
				if(category != '')
				{
					toImport[toImport.length] = {cat: category, uri:node.uri, date: this.date(node.time/1000)};
					//this.categoryHistoryInsert(category, node.uri);
				}
			}

			// Close container when done
			// see : https://developer.mozilla.org/en/nsINavHistoryContainerResultNode
			cont.containerOpen = false;

			if(toImport.length < 1)
			{
				this.alert('You don\'t have any site from the Open Directory Project in the browsing history!');
			}
			else
			{
				if(this.confirm(toImport.length+' sites from your history looks like valid categories. These will be inserted in your "Category History" database, only the category names and time of visit will be inserted, to give relevance. Do you want to import these? It is recommended because puts your frequently used category on top of the menu.'))
				{
					for(var id in toImport) {
						this.categoryHistoryInsert(toImport[id].cat, toImport[id].uri, toImport[id].date);
					}
					this.alert('Done. Give some minutes to the browser to insert these.');
				}
			}
		}
	return null;

}).apply(ODPExtension);

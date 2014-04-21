(function () {

	this.panelFastAddOpenTabsWithLinkedPanel = function (aURLs, aItems, selected) {

		this.treeStyleTabInTreeOpenStart();

			var aTabs = []
			aURLs.forEach(function(n, id) {

				var url = aURLs[id]
				var item = aItems[id]

				var aTab = gBrowser.addTab(url, null, null, ODPExtension.postData(null));
					ODPExtension.tabSaveData('panel-fast-add-url', item.url(), aTab)
					ODPExtension.tabSaveData('panel-fast-add-title', item.title(), aTab)
					ODPExtension.tabSaveData('panel-fast-add-description', item.description(), aTab)
					ODPExtension.tabSaveData('panel-fast-add-category', item.category(), aTab)
					ODPExtension.tabSaveData('panel-fast-add-note', item.note(), aTab)
					ODPExtension.tabSaveData('panel-fast-add-linked-function', function(url, title, description, category, note, action){
						item.url(url),
						item.title(title),
						item.description(description),
						item.category(category),
						item.note(note);
						if(action)
							item[action](note);
					}, aTab)

					aTabs[aTabs.length] = aTab
			})

			if (!!selected)
				ODPExtension.tabSelect(aTabs[0]);

		this.treeStyleTabInTreeOpenStop();
	}

	return null;

}).apply(ODPExtension);
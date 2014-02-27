function sync() {

	var items = listGetVisible();
	var changed = []

	items.each(function(d) {
		for (var id in columns) {
			var name = columns[id]
			var nameChanged = 'new' + ODP.ucFirst(columns[id])
			if (d[nameChanged] && d[nameChanged] != d[name]) {
				changed.push(d)
				break;
			}
		}
	});

	for (var id in changed) {
		var site = changed[id]
		if (site.area == 'unrev')
			edit(site, 'http://www.dmoz.org/editors/editunrev/editurl?urlsubId=' + site.site_id + '&cat=' + ODP.encodeUTF8(site.category) + '&offset=5000')
		else if (site.area == 'rev')
			edit(site, 'http://www.dmoz.org/editors/editurl/edit?urlId=' + site.site_id + '&cat=' + ODP.encodeUTF8(site.category) + '&offset=5000')
		else if (site.area == 'new')
			edit(site, 'http://www.dmoz.org/editors/editurl/add?url=' + site.newUrl + '&cat=' + ODP.encodeUTF8(site.newCategory))
	}

}

function edit(site, url) {

	var aTab = ODP.tabOpen(url);

	//aTab.setAttribute('hidden', true);

	var newTabBrowser = ODP.browserGetFromTab(aTab);
		newTabBrowser.webNavigation.allowAuth = false;
		newTabBrowser.webNavigation.allowImages = false;
		try {
			newTabBrowser.webNavigation.allowMedia = false; //does not work
		} catch (e) {}
		newTabBrowser.webNavigation.allowJavascript = true;
		newTabBrowser.webNavigation.allowMetaRedirects = true;
		newTabBrowser.webNavigation.allowPlugins = false;
		newTabBrowser.webNavigation.allowWindowControl = false;
		newTabBrowser.webNavigation.allowSubframes = false;

		newTabBrowser.addEventListener("DOMContentLoaded", function(aEvent) {

			var aDoc = aEvent.originalTarget;
			var content = ODP.documentGetFromTab(aTab).body.innerHTML;

			if (content.indexOf('history.back') != -1 || content.indexOf('There was a problem with your form:')) {
				aTab.setAttribute('hidden', false);
			}
			else {
				if (aTab.hasAttribute('edited', true))
					ODP.tabClose(aTab)
				else {

						//clean error
						if (site.type == 'error' && aDoc.getElementById('resolve') != null && (!site.newUrl || site.newUrl == site.url ) && (site.newAction || site.action) != 'D'){

							aDoc.getElementById('resolve').click()

						} else {

							if (site.newUrl && site.newUrl != site.url){
								(ODP.getElementNamed('newurl', aDoc) || ODP.getElementNamed('url', aDoc)).value = site.newUrl;
								site.url = site.newUrl
							}
							if (site.newTitle && site.newTitle != site.title){
								(ODP.getElementNamed('newtitle', aDoc) || ODP.getElementNamed('title', aDoc)).value = site.newTitle;
								site.title = site.newTitle
							}
							if (site.newDescription && site.newDescription != site.description){
								(ODP.getElementNamed('newdesc', aDoc) || ODP.getElementNamed('desc', aDoc)).value = site.newDescription;
								site.description = site.newDescription
							}
							if (site.newCategory && site.newCategory != site.category){
								(ODP.getElementNamed('typecat', aDoc) || ODP.getElementNamed('cat', aDoc)).value = site.newCategory;
								site.category = site.newCategory
							}
							if (site.newNote && site.newNote != ''){
								(ODP.getElementNamed('newnote', aDoc) || ODP.getElementNamed('note', aDoc)).value = site.newNote;
								site.note = site.newNote
							}

							//click operation
							var action = site.newAction || site.action
							if(action == 'U')
								ODP.getElementNamedWithValue('operation', 'unrev', aDoc).click()
							else if (action == 'P')
								(ODP.getElementNamedWithValue('operation', 'update', aDoc) || ODP.getElementNamedWithValue('operation', 'grant', aDoc)).click()
							else if (action == 'D')
								(ODP.getElementNamedWithValue('operation', 'delete', aDoc) || ODP.getElementNamedWithValue('operation', 'deny', aDoc)).click()
							site.action = action

							//sent
							var inputs = aDoc.getElementsByTagName('input');
							var sent = false

							for (var a = 0; a < inputs.length; a++) {
								if (inputs[a].hasAttribute('accesskey') && inputs[a].getAttribute('accesskey') == 'n') {
									inputs[a].click();
									sent = true
									break;
								}
							}
							if (!sent) {
								for (var a = 0; a < inputs.length; a++) {
									if (inputs[a].hasAttribute('accesskey') && inputs[a].getAttribute('accesskey') == 'b') {
										inputs[a].click();
										break;
									}
								}
							}

							aTab.setAttribute('edited', true);

						}
				}
			}

	}, false);
}
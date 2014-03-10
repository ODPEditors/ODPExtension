function sync() {

	var items = listGetVisible();
	var changed = []

	items.each(function(d) {
		for (var id in columns_changes) {
			var name = columns_changes[id]
			var nameChanged = 'new_' + columns_changes[id]
			if (d[nameChanged] && d[nameChanged] != d[name]) {
				changed.push(d)
				break;
			}
		}
	});

	var timer = 0;
	for (var id in changed) {
		var site = changed[id];
		(function(site) {
			setTimeout(function() {
				if (site.area == 'unreviewed')
					edit(site, 'http://www.dmoz.org/editors/editunrev/editurl?urlsubId=' + site.site_id + '&cat=' + ODP.encodeUTF8(site.category) + '&offset=5000')
				else if (site.area == 'reviewed')
					edit(site, 'http://www.dmoz.org/editors/editurl/edit?urlId=' + site.site_id + '&cat=' + ODP.encodeUTF8(site.category) + '&offset=5000')
				else if (site.area == 'new')
					edit(site, 'http://www.dmoz.org/editors/editurl/add?url=' + site.new_url + '&cat=' + ODP.encodeUTF8(site.new_category))
			}, timer += 1200);
		})(site);
	}

}

function edit(site, url) {

	var aTab = ODP.tabOpen(url, false, false, true)

	aTab.setAttribute('hidden', true);

	var newTabBrowser = ODP.browserGetFromTab(aTab);
	newTabBrowser.webNavigation.allowAuth = false;
	newTabBrowser.webNavigation.allowImages = false;
	try {
		newTabBrowser.webNavigation.allowMedia = false; //does not work
	}
	catch (e) {}
	newTabBrowser.webNavigation.allowJavascript = true;
	newTabBrowser.webNavigation.allowMetaRedirects = true;
	newTabBrowser.webNavigation.allowPlugins = false;
	newTabBrowser.webNavigation.allowWindowControl = false;
	newTabBrowser.webNavigation.allowSubframes = false;

	newTabBrowser.addEventListener("DOMContentLoaded", function(aEvent) {

		var aDoc = aEvent.originalTarget;
		var html = ODP.documentGetFromTab(aTab).body.innerHTML;

		if (
			html.indexOf('history.back') != -1 || html.indexOf('There was a problem with your form:') != -1 || html.indexOf('connection reset') != -1) {
			aTab.setAttribute('hidden', false);
		}
		else {

			if (aTab.hasAttribute('edited', true) && html.indexOf('<center>Update complete</center>') != -1) {
				ODP.tabClose(aTab)
				$('.item.pending').each(function(){
					$(this).removeClass('pending');
					entryUpdatePendingCounter();
					return false;
				});

			}
			else if (aTab.hasAttribute('edited', true)) {
				aTab.setAttribute('hidden', false);
			}
			else {

				//clean error
				if (site.type == 'error' && aDoc.getElementById('resolve') != null && (!site.new_url || site.new_url == site.url) && (site.new_action || site.action) != 'deleted') {

					aDoc.getElementById('resolve').click()

				}
				else {

					if (ODP.editingFormURLExists(aDoc)) {

						if (site.new_url && site.new_url != site.url) {
							(ODP.getElementNamed('newurl', aDoc) || ODP.getElementNamed('url', aDoc)).value = site.new_url;
							site.url = site.new_url
						}
						if (site.new_title && site.new_title != site.title) {
							(ODP.getElementNamed('newtitle', aDoc) || ODP.getElementNamed('title', aDoc)).value = site.new_title;
							site.title = site.new_title
						}
						if (site.new_description && site.new_description != site.description) {
							(ODP.getElementNamed('newdesc', aDoc) || ODP.getElementNamed('desc', aDoc)).value = site.new_description;
							site.description = site.new_description
						}
						if (site.new_category && site.new_category != site.category) {
							(ODP.getElementNamed('typecat', aDoc) || ODP.getElementNamed('cat', aDoc)).value = site.new_category;
							site.category = site.new_category
						}
						if (site.new_note && site.new_note != '') {
							(ODP.getElementNamed('newnote', aDoc) || ODP.getElementNamed('note', aDoc)).value = site.new_note;
							site.note = site.new_note
						}

						//click operation
						var action = site.new_action || site.action
						if (action == 'unreviewed'){
							ODP.getElementNamedWithValue('operation', 'unrev', aDoc).click()
							site.area = 'unreviewed'
						}
						else if (action == 'reviewed') {
							(ODP.getElementNamedWithValue('operation', 'update', aDoc) || ODP.getElementNamedWithValue('operation', 'grant', aDoc)).click()
							site.area = 'reviewed'
						}
						else if (action == 'deleted'){
							(ODP.getElementNamedWithValue('operation', 'delete', aDoc) || ODP.getElementNamedWithValue('operation', 'deny', aDoc)).click()
							site.area = 'deleted'
						}
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
		}

	}, false);
}
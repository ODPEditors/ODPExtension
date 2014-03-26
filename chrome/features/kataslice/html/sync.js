function sync() {

	var items = listGetVisible();
	var changed = []
	var columns_changes = ['title', 'description', 'category', 'type', 'action', 'url', 'note']

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
		var d = changed[id];
		(function(d) {
			setTimeout(function() {
				if (d.area == 'unreviewed'){
					if(d.site_id && d.site_id != '')
						edit(d, 'http://www.dmoz.org/editors/editunrev/editurl?urlsubId=' + d.site_id + '&cat=' + ODP.encodeUTF8(d.category) + '&offset=5000')
					else
						edit(d, 'http://www.godzuki.com.uy/mimizu/service/edit-url-unreview.php?url='+ODP.encodeUTF8(d.url)+'&cat=' + ODP.encodeUTF8(d.category))
				} else if (d.area == 'reviewed'){
					if(d.site_id && d.site_id != '')
						edit(d, 'http://www.dmoz.org/editors/editurl/edit?urlId=' + d.site_id + '&cat=' + ODP.encodeUTF8(d.category) + '&offset=5000')
					else
						edit(d, 'http://www.godzuki.com.uy/mimizu/service/edit-url.php?url='+ODP.encodeUTF8(d.url)+'&cat=' + ODP.encodeUTF8(d.category))
				} else if (d.area == 'new')
					edit(d, 'http://www.dmoz.org/editors/editurl/add?url=' + ODP.encodeUTF8(d.new_url) + '&cat=' + ODP.encodeUTF8(d.new_category))
			}, timer += 1200);
		})(d);
	}

}

function edit(d, url) {

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
			html.indexOf('history.back') != -1 ||
			html.indexOf('There was a problem with your form:') != -1 ||
			html.indexOf('connection reset') != -1) {
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
				if (d.type == 'error' && aDoc.getElementById('resolve') != null && (!d.new_url || d.new_url == d.url) && (d.new_action || d.action) != 'deleted') {

					aDoc.getElementById('resolve').click()

				}
				else {

					if (ODP.editingFormURLExists(aDoc)) {

						if (d.new_url && d.new_url != d.url) {
							(ODP.getElementNamed('newurl', aDoc) || ODP.getElementNamed('url', aDoc)).value = d.new_url;
							d.url = d.new_url
						}
						if (d.new_title && d.new_title != d.title) {
							(ODP.getElementNamed('newtitle', aDoc) || ODP.getElementNamed('title', aDoc)).value = d.new_title;
							d.title = d.new_title
						}
						if (d.new_description && d.new_description != d.description) {
							(ODP.getElementNamed('newdesc', aDoc) || ODP.getElementNamed('desc', aDoc)).value = d.new_description;
							d.description = d.new_description
						}
						if (d.new_category && d.new_category != d.category) {
							(ODP.getElementNamed('typecat', aDoc) || ODP.getElementNamed('cat', aDoc)).value = d.new_category;
							d.category = d.new_category
						}
						if (d.new_note && d.new_note != '') {
							(ODP.getElementNamed('newnote', aDoc) || ODP.getElementNamed('note', aDoc)).value = d.new_note;
							d.note = d.new_note
						}

						//click operation
						var action = d.new_action || d.action
						if (action == 'unreviewed'){
							ODP.getElementNamedWithValue('operation', 'unrev', aDoc).click()
							d.area = 'unreviewed'
						}
						else if (action == 'reviewed') {
							(ODP.getElementNamedWithValue('operation', 'update', aDoc) || ODP.getElementNamedWithValue('operation', 'grant', aDoc)).click()
							d.area = 'reviewed'
						}
						else if (action == 'deleted'){
							(ODP.getElementNamedWithValue('operation', 'delete', aDoc) || ODP.getElementNamedWithValue('operation', 'deny', aDoc)).click()
							d.area = 'deleted'
						}
						d.action = action

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


var seFreeTextTimeout = false;
function toolSearchEngine(item, event) {
	clearTimeout(seFreeTextTimeout);
	seFreeTextTimeout = setTimeout(function() {
		_toolSearchEngine(item, event);
	}, 1200);
}

function _toolSearchEngine(item, event) {
	var text = $(item).val();
	item = entryGetItem(item);
	var d = entryGetData(item);

	var template = _.template($(".tpl-list-item-tool-se").html());
	var container = $(item.find('.tools').find('.search-engine'))

	if (text == '')
		text = d.title
	text = text.trim()

	if(container.attr('text') != text){
		container.attr('text', text)
		ODP.searchEngine().search(text, ODP.getLanguageFromCategory(d.category).code, false, function(aData) {
			container.empty();
			for (var id in aData) {
				container.append(template(aData[id]));
			}
		});
	}
}



function entryNotes(item, event) {
	item = $(item);
	var template = _.template($(".list-item-template-tool-notes").html());

	var entry = item.parents('.list-entry')
	var tools = entry.find('.tools')

	var container = tools.find('.notes');
	if (container.length < 1) {
		tools.append('<div class="notes tool"></div>')
		var container = tools.find('.notes');

		if (entry.find('.url').text()) {
			ODP.odpNotes(entry.find('.url').text(), function(aData) {
				container = tools.find('.notes');
				container.empty()
				if (aData.length) {
					for (var id in aData) {
						container.append(template(aData[id]));
					}
				} else {
					container.append('No notes..')
				}
			});
		}
	} else {
		container.remove();
	}
}
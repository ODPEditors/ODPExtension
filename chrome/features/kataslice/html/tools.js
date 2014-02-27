

//getLanguageFromCategory
function entrySE(item, event, text, fromAKeypress) {

	item = entryGetItem(item);
	var d = entryGetData(item);
	var template = _.template($(".tpl-list-item-tool-se").html());

	if (!text)
		text = d.title
	var tools = item.find('.tools')

	var container = tools.find('.se');
	if (container.length < 1 || fromAKeypress) {
		container.remove();

		tools.append('<div class="se tool"></div>')
		var container = tools.find('.se');
		if (text) {
			ODP.searchEngine().search(text, 'en', false, function(aData) {
				container = tools.find('.se');
				container.empty()
				container.append('<input onkeyup="entrySEFreeText(this, event)" value="' + ODP.h(text) + '" size="49" style="margin:10px;float:right;"><div class="clear"></div>');
				for (var id in aData) {
					container.append(template(aData[id]));
				}
			});
		}
	} else {
		container.slideUp();
	}
}
var seFreeTextTimeout = false;
function entrySEFreeText(item, event) {
	clearTimeout(seFreeTextTimeout);
	seFreeTextTimeout = setTimeout(function() {
		entrySE(item, event, item.value, true);
	}, 1200);
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
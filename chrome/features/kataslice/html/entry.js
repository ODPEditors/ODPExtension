
function entryMouseOver(item, event) {
	item = $(item);
	item.find('[contenteditable]').each(function() {
		$(this).attr('contenteditable', false);
		$(this).attr('spellcheck', true);
		$(this).attr('contenteditable', true);
	});
}

function entryMouseOut(item, event) {
	item = $(item);
	item.find('[contenteditable]').each(function() {
		$(this).attr('contenteditable', false);
		$(this).attr('spellcheck', false);
		$(this).attr('contenteditable', true);
	});
}

function entryKeyPress(item, event) {
	if (event.keyCode == event.DOM_VK_RETURN) {
		event.stopPropagation();
		event.preventDefault();
		ODP.tabOpen($(item).parents('.list-entry').find('.url').text(), true)
		return false;
	} else {
		return true;
	}
}

function entrySelect(item, event) {
	item = $(item);
	if (!event.ctrlKey)
		$('.list-entry.selected').each(function() {
			$(this).removeClass('selected');
		});
	if (item.hasClass('selected'))
		item.removeClass('selected')
	else
		item.addClass('selected');

	$('.totals .selected').text($('.list-entry.selected').length);
}

var seFreeTextTimeout = false;
function entrySEFreeText(item, event) {
	clearTimeout(seFreeTextTimeout);
	seFreeTextTimeout = setTimeout(function() {
		entrySE(item, event, item.value, true);
	}, 1200);
}

//getLanguageFromCategory
function entrySE(item, event, text, fromAKeypress) {

	item = $(item);
	var template = _.template($(".list-item-template-tool-se").html());

	var entry = item.parents('.list-entry')
	if (!text)
		text = entry.find('.title').text()
	var tools = entry.find('.tools')

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
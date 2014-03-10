function entryGetItem(item, event) {
	item = $(item)
	if (item.hasClass('item'))
		return item;
	else
		return item.parents('.item');
}

function entryGetData(item, event) {
	return listRows[0][entryGetItem(item).attr('index')].__data__;
}

function entryUpdatePendingCounter() {
	$('.totals .pending').text($('.item.pending').length);
}
var lastSelectedEntry = false;
var lastSelectedData = [];

function entrySync(item) {
	item = $(item);
	var k = item.attr('class');
	var v = item.text().trim();

	if (lastSelectedData[k] != v || (lastSelectedData['new_' + k] && lastSelectedData['new_' + k] != v)) {
		ODP.dump('------------------------');
		ODP.dump(lastSelectedData)
		ODP.dump(v)
		lastSelectedData['new_' + k] = v;
		lastSelectedEntry.addClass('pending');
		entryUpdatePendingCounter();
	}
}

function entryClick(item, event) {
	item = $(item);
	var entry = entryGetItem(item)
	if (entry.hasClass('selected') && $(event.originalTarget).parents('.tools').length)
		return

	lastSelectedData = entryGetData(item);
	var lastSelectedIsSsame = false
	var targetIsContentEditable = $(event.originalTarget).attr('contenteditable') || $(event.originalTarget).prop("tagName") == 'INPUT';

	//remove spellcheck from lastSelectedEntry item
	if (lastSelectedEntry && lastSelectedEntry.attr('id') != entry.attr('id')) {
		lastSelectedEntry.find('[contenteditable]').each(function () {
			var input = $(this)
			input.attr('contenteditable', false);
			input.attr('spellcheck', false);
			input.attr('contenteditable', true);
		});
	} else if (lastSelectedEntry) {
		lastSelectedIsSsame = true;
	}
	//enable spellcheck in this clicked entry
	entry.find('[contenteditable]').each(function () {
		var input = $(this)
		input.attr('contenteditable', false);
		if (!input.attr('spellcheckdisabled') || input.attr('spellcheckdisabled') != 'true') {
			input.attr('spellcheck', true);
		}
		input.attr('contenteditable', true);
		if (!targetIsContentEditable && !lastSelectedIsSsame) {
			targetIsContentEditable = true;
			input.focus();
		}
	});
	lastSelectedEntry = entry;

	//select item
	if (!event.ctrlKey) {
		$('.item.selected').each(function () {
			$(this).removeClass('selected');
		});
	}
	if (entry.hasClass('selected'))
		entry.removeClass('selected')
	else
		entry.addClass('selected');

	$('.totals .selected').text($('.item.selected').length);
}

function entryOnBlurOnInput(item, event) {
	entrySync(item);
}

//navigating with TABs changes current focus
function entryOnFocus(item, event) {
	item = $(item);
	var entry = entryGetItem(item)
	if (!entry.hasClass('selected')) {
		lastSelectedData = entryGetData(item);
		lastSelectedEntry = entry
	}
}

function entryKeyPressBody(item, event) {
	if (event.keyCode == event.DOM_VK_RETURN) {
		var items = listGetSelected()
			items.each(function(d) {
				ODP.tabOpen(d.new_url || d.url, true)
			});
	}
}

function entryKeyPress(item, event) {
	if (event.keyCode == event.DOM_VK_RETURN) {
		entrySync(item);
		event.stopPropagation();
		event.preventDefault();
		var d = entryGetData(item)
		ODP.tabOpen(d.new_url || d.url, true)
		return false;
	} else {
		return true;
	}
}

function entryPaste(item, event) {
	ODP.copyToClipboard(ODP.getClipboard().replace(/\s+/g, ' ').trim());
}

function entryMouseOver(item, event) {}
function entryMouseOut(item, event) {}
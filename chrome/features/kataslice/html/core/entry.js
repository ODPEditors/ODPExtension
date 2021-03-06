/*
	Resolve the "entry"(complete HTML node that holds our "item"), by calling "itemGetEntry" with any node as arguement.
	Resolve the "data" of that "entry" by calling "entryGetData" with an "entry" as argument.
*/

//core

function itemGetEntry(item, event) {
	item = $(item)
	if (item.hasClass('item'))
		return item;
	else
		return item.parents('.item');
}

function entryGetData(item, event) {
	return d3.select(item)[0][0][0].__data__;
}

function entryBlurOrInput(item, event) {
	//l('entryBlurOrInput')
	entrySync(item);
}
function entrySync(item) {
	item = $(item);
	var entry = lastPreviousSelectedEntry = itemGetEntry(item)
	var d = entryGetData(entry)
	var k = item.attr('class');
	var v = item.text().trim();

	if (d[k] != v || (d['new_' + k] && d['new_' + k] != v)) {
		d['new_' + k] = v;
		entry.addClass('modified');
		updateTotalsModified();
	}
}

//handy

var lastSelectedEntry = false;
var lastPreviousSelectedEntry = false;

//events

function entryClickAction(item, event) {
	entryClick(item, event)
	if (event.ctrlKey && !ODP.confirm('Action will be applied to all selected items. Are you sure?'))
		return
	action(item)
}

function entryClick(item, event) {

	//safe until proven guilty
	var _return = true;

	item = $(item);
	var target = $(event.originalTarget)
	var entry = itemGetEntry(item)
	var toFocus;

	if (entry.hasClass('selected') && total_selected === 1 && (target.parents('.tools').length || target.parents('.toolbar').length))
		return

	if(event.shiftKey && !entry.hasClass('selected')) {
		_return = false;
		ODP.stopEvent(event);
	}

	var lastSelectedIsSsame = false
	var targetIsContentEditable = target.attr('contenteditable') || $(event.target).prop("tagName") == 'INPUT';

	if (lastSelectedEntry && lastSelectedEntry[0] && entry[0] && lastSelectedEntry[0].__data__.id != entry[0].__data__.id) {
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
			toFocus = entry.find('.description');
		}
	});

	//select item(s)
	if (event.shiftKey) {
		var items = listGetVisible();
		var itemCurrent = entryGetData(entry)
		if (entryGetData(lastSelectedEntry).id != itemCurrent.id)
			var itemPrevious = entryGetData(lastSelectedEntry)
		else
			var itemPrevious = entryGetData(lastPreviousSelectedEntry)

		if (itemPrevious.id != itemCurrent.id) {

			window.getSelection().removeAllRanges()
			var found = 0
			items.each(function (d) {
				if (found == 0 && (d.id == itemCurrent.id || d.id == itemPrevious.id)) {
					d3.select(this).classed('selected', true);
					found = 1
				} else if (found == 1) {
					if (d.id == itemCurrent.id || d.id == itemPrevious.id)
						found = 2
					d3.select(this).classed('selected', true);
				}
			});
			window.getSelection().removeAllRanges()

		} else {

		}
	} else {
		if (!event.ctrlKey)
			listGetSelected().classed('selected', false);

		if (entry.hasClass('selected'))
			entry.removeClass('selected')
		else
			entry.addClass('selected');
	}
	if (toFocus)
		toFocus.focus()

	lastPreviousSelectedEntry = lastSelectedEntry = entry;
	updateTotalsSelected();
	return _return;
}



function entryFocus(item, event) {

	var entry = itemGetEntry(item)

	//remove spellcheck from lastSelectedEntry item
	if (lastSelectedEntry && lastSelectedEntry[0].__data__.id != entry[0].__data__.id) {
		lastSelectedEntry.find('[contenteditable]').each(function () {
			var input = $(this)
			input.attr('contenteditable', false);
			input.attr('spellcheck', false);
			input.attr('contenteditable', true);
		});
	}

	//enable spellcheck in this entry
	entry.find('[contenteditable]').each(function () {
		var input = $(this)
		input.attr('contenteditable', false);
		if (!input.attr('spellcheckdisabled') || input.attr('spellcheckdisabled') != 'true') {
			input.attr('spellcheck', true);
		}
		input.attr('contenteditable', true);
	});
	setTimeout(function(){
		lastSelectedEntry = entry;
	}, 20);
}

function entryKeyPressBody(item, event) {
	if (event.keyCode == event.DOM_VK_RETURN) {
		api.tabOpenEditable(api.sitesGetSelected());
	}
}

function entryKeyPress(item, event) {
	if (event.keyCode == event.DOM_VK_RETURN) {
		var entry = itemGetEntry(item)
		entrySync(item);
		event.stopPropagation();
		event.preventDefault();
		api.tabOpenEditable(api.sitesGetSelected());
		return false;
	} else {
		return true;
	}
}


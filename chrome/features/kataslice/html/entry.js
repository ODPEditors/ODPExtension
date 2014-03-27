
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
	function entrySync(item) {
		item = $(item);
		var entry = itemGetEntry(item)
		var d = entryGetData(entry)
		var k = item.attr('class');
		var v = item.text().trim();

		if (d[k] != v || (d['new_' + k] && d['new_' + k] != v)) {
			d['new_' + k] = v;
			entry.addClass('pending');
			entryUpdatePendingCounter();
		}
	}

//handy

	function entryUpdatePendingCounter() {
		$('.header-totals .pending').text($('.item.pending').length);
	}
	var lastSelectedEntry = false;

//events

	function entryClickAction(item, event){
		entryClick(item, event)
		if(event.ctrlKey && !ODP.confirm('Action will be applied to all selected items. Are you sure?'))
			return
		action(item)
	}
	function entryClick(item, event) {
		item = $(item);
		var target = $(event.originalTarget)
		var entry = itemGetEntry(item)

		if (entry.hasClass('selected') && $('.item.selected').length === 1 && (target.parents('.tools').length || target.parents('.toolbar').length ))
			return

		var lastSelectedIsSsame = false
		var targetIsContentEditable = target.attr('contenteditable') || $(event.target).prop("tagName") == 'INPUT';

		if (lastSelectedEntry && lastSelectedEntry[0].__data__.id != entry[0].__data__.id) {
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

		$('.header-totals .selected').text($('.item.selected').length);
	}

	function entryBlurOrInput(item, event) {
		entrySync(item);
	}
	function entryFocus(item, event){
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

		//enable spellcheck in this clicked entry
		entry.find('[contenteditable]').each(function () {
			var input = $(this)
			input.attr('contenteditable', false);
			if (!input.attr('spellcheckdisabled') || input.attr('spellcheckdisabled') != 'true') {
				input.attr('spellcheck', true);
			}
			input.attr('contenteditable', true);
		});
		lastSelectedEntry = entry;
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
			var entry = itemGetEntry(item)
			entrySync(item);
			event.stopPropagation();
			event.preventDefault();
			var items = listGetSelected()
			items.each(function(d) {
				ODP.tabOpen(d.new_url || d.url, true)
			});
			return false;
		} else {
			return true;
		}
	}

	//when pasting, get the clipboard as pure text
	function entryPaste(item, event) {
		ODP.copyToClipboard(ODP.getClipboard().replace(/\s+/g, ' ').trim());
	}

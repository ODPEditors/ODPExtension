
function entryGetItem(item, event){
	item = $(item)
	if(item.hasClass('item'))
		return item;
	else
		return item.parents('.item');
}
function entryGetData(item, event){
	return listRows[0][entryGetItem(item).attr('index')].__data__;
}
function entrySync(item){
	item = $(item);
	var k = item.attr('class');
	var v = item.text();
	lastSelectedData[k] = v;
}

var lastSelectedEntry = false;
function entryMouseOver(item, event) {}

function entryMouseOut(item, event) {}

function entryClick(item, event){

	item = $(item);
	entry = entryGetItem(item)
	lastSelectedData = entryGetData(item);
	var lastSelectedIsSsame = false
	var targetIsContentEditable = $(event.originalTarget).attr('contenteditable');

	//remove spellcheck from lastSelectedEntry item
	if(lastSelectedEntry && lastSelectedEntry.attr('id') != entry.attr('id')){
		lastSelectedEntry.find('[contenteditable]').each(function() {
			$(this).attr('contenteditable', false);
			$(this).attr('spellcheck', false);
			$(this).attr('contenteditable', true);
		});
	} else if(lastSelectedEntry) {
		lastSelectedIsSsame = true;
	}
	//enable spellcheck in this clicked entry
	entry.find('[contenteditable]').each(function() {
		$(this).attr('contenteditable', false);
		$(this).attr('spellcheck', true);
		$(this).attr('contenteditable', true);
		if(!targetIsContentEditable && !lastSelectedIsSsame){
			targetIsContentEditable = true;
			$(this).focus();
		}
	});
	lastSelectedEntry = entry;

	//select item
	if (!event.ctrlKey)
		$('.item.selected').each(function() {
			$(this).removeClass('selected');
		});
	if (entry.hasClass('selected'))
		entry.removeClass('selected')
	else
		entry.addClass('selected');

	$('.totals .selected').text($('.item.selected').length);
}

function entryKeyPress(item, event) {
	entrySync(item);

	if (event.keyCode == event.DOM_VK_RETURN) {
		event.stopPropagation();
		event.preventDefault();
		ODP.tabOpen(entryGetData(item).url, true)
		return false;
	} else {
		return true;
	}
}
function entryPaste(item, event) {
	ODP.copyToClipboard(ODP.getClipboard().replace(/\s+/g, ' '));
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
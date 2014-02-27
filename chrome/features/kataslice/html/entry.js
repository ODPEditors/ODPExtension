
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
	var v = item.text().trim();
	if(lastSelectedData[k] != v){
		lastSelectedData['new'+ODP.ucFirst(k)] = v;
		lastSelectedEntry.addClass('pending');
		$('.totals .pending').text($('.item.pending').length);
	}
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
		if(!!$(this).attr('spellcheckdisabled')){
			$(this).attr('spellcheck', true);
		}
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

function entryOnBlur(item, event){
	entrySync(item)
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
	ODP.copyToClipboard(ODP.getClipboard().replace(/\s+/g, ' ').trim());
}



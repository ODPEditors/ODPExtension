var timer, ODP, addons = [],
	addon = [],
	l = console.log

	/* LOAD/UNLOAD */

var aSites = [],
	aCategory;

addEventListener('load', load, false);

function load() {
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
		.getService(Components.interfaces.nsIWindowMediator);
	var win = wm.getMostRecentWindow('navigator:browser');
	ODP = win.ODPExtension;

	//on browser restart, sometimes the extension ins't loaded.
	if (!ODP) {
		setTimeout(function () {
			load();
		}, 500);
	} else {
		timer = ODP.timer();
		timer.start('onLoad');

		aCategory = ODP.categoryGetFromURL(document.location.hash)

		var reviewed = ODP.getHashParamFromURL(document.location, 'reviewed')
		var recursive = ODP.getHashParamFromURL(document.location, 'recursive') == '1'
		var json = ODP.getHashParamFromURL(document.location, 'json') == '1'

		if (json) {
			ODP.katasliceJSON(function (aData) {
				aSites = aData
				dispatch('onLoad');
				timer.stop('onLoad');
			});
		} else {
			ODP.kataslice(aCategory, reviewed, recursive, function (aData) {
				aSites = aData
				dispatch('onLoad');
				timer.stop('onLoad');
			});
		}
	}
}

function onUnload() {
	l('onUnload')
	dispatch('onUnload');
	if (listGetModified().size() > 0)
		return 'Are you sure?';
}

function onDataLoad() {
	l('onDataLoad')

	//set category
	document.title = 'S:' + ODP.categoryTitleForLabel(ODP.categoryGetFromURL(aCategory));
	$('.header-categories').text(ODP.categoryGetFromURL(aCategory))
	$('.header-categories').attr('category', aCategory)

	//totals
	total_count = aSites.length
	$('.total-total').text(total_count)

	//sort sites by date
	timer.start('sortSitesByDate');
	aSites = _.sortBy(aSites, 'date').reverse();
	timer.stop('sortSitesByDate');

	//load addons
	timer.start('addons');
	dimensions = []

	addons.forEach(function (addon) {
		if (addon.enabled) {
			if (addon.source.dimensions)
				addon.source.dimensions.forEach(function (dimension, i) {
					dimension.id = 'a-d-' + addon.id + '-' + i
					dimensions[dimensions.length] = dimension
				});
			if (addon.source.toolbarbuttons)
				addon.source.toolbarbuttons.forEach(function (toolbarbutton, i) {
					toolbarbutton.id = 'a-tb-' + addon.id + '-' + i
					toolbarbutton.name = (toolbarbutton.name || toolbarbutton.id).toLowerCase().replace(/\./g, '-').replace(/\s/g, '-').trim()
					toolbarbutton.title = ODP.ucFirst((toolbarbutton.title || '').trim())
					toolbarbutton.label = ODP.ucFirst((toolbarbutton.label || '').trim())
					toolbarbuttonCreate(toolbarbutton, addon);
				});
		}
	});
	addons.forEach(function (addon) {
		if (addon.enabled) {
			if (addon.source.toolbarbuttons){
				addon.source.toolbarbuttons.reverse()
				addon.source.toolbarbuttons.forEach(function (toolbarbutton, i) {
					toolbarbuttonMove(toolbarbutton, addon);
				});
			}
		}
	});
	for(var a=0;a<100;a++){

		timer.start('toolbar reposition');
		addons.forEach(function (addon) {
			if (addon.enabled) {
				if (addon.source.toolbarbuttons)
					addon.source.toolbarbuttons.forEach(function (toolbarbutton, i) {
						toolbarbuttonReposition(toolbarbutton, addon);
					});
			}
		});
		timer.stop('toolbar reposition');

	}
	addons.forEach(function (addon) {
		if (addon.enabled) {
			if (addon.source.toolbarbuttons)
				addon.source.toolbarbuttons.forEach(function (toolbarbutton, i) {
					toolbarbuttonSet(toolbarbutton, addon);
				});
		}
	});

	timer.stop('addons');

	//set the site text for search filtering
	timer.start('setSitesText');
	aSites.forEach(function (d) {
		d.text = d.user + ' ' + d.ip + ' ' + d.title + ' ' + d.description + ' ' + d.category + ' ' + d.url;
		d.title = ODP.htmlEntityDecode(d.title).replace(/\\/g, '').replace(/\s+/g, ' ').replace(/^(\*|\.|-)/, '').replace(/(\*|\.|-)$/, '').trim()
		d.description = ODP.htmlEntityDecode(d.description).replace(/\\/g, '').replace(/\s+/g, ' ').replace(/^(\*|\.|-)/, '').replace(/(\*|-)$/, '').replace(/\s+\.$/, '.').trim()
		if (d.title == '')
			d.title = '(no title)'
		if (d.description == '')
			d.description = '(no description)'
	});
	timer.stop('setSitesText');

	//render HTML
	listRender();
	updateTotals();
	chartsPie()
	chartsBars();
	timer.display();
	timer.resetAll();

	//remove loading
	$('body').attr('loading', 'false');
}

function update() {
	l('update')

	filterList();
	filterTextbox();

	updateTotals();
	updateTotalsModified();
	updateTotalsSelected();

	chartsPie()
	chartsBars();

	timer.display();
}

/* update totals */

	var updateTotalsTimeout = false;
	var updateTotalsFunction = function () {
		_updateTotals();
	};
	function updateTotals() {
		clearTimeout(updateTotalsTimeout);
		updateTotalsTimeout = setTimeout(updateTotalsFunction, 80);
	}
	function _updateTotals() {
		timer.start('updateTotals');

		var size = total_visible = listGetVisible().size()
		ui_total_visible.text(size)
		ui_content.attr('size_visible', size);

		timer.stop('updateTotals');
	}

/* update totals modified */

	var updateTotalsModifiedTimeout = false;
	var updateTotalsModifiedFunction = function () {
		_updateTotalsModified();
	};

	function updateTotalsModified() {
		clearTimeout(updateTotalsModifiedTimeout);
		updateTotalsModifiedTimeout = setTimeout(updateTotalsModifiedFunction, 80);
	}
	function _updateTotalsModified() {
		var size = total_modified = listGetModified().size();
		var size_total = total_modified_total = listGetModifiedTotal().size();
		ui_total_modified.text(size);

		if(size != size_total && size_total != '0'){
			ui_total_modified_total.show();
			ui_total_modified_total.text(size_total)
		} else {
			ui_total_modified_total.hide();
			ui_total_modified_total.text('')
		}

		if (size > 0)
			ui_pending_actions.addClass('click')
		else
			ui_pending_actions.removeClass('click')
	}

/* update totals selected */

	var updateTotalsSelectedTimeout = false;
	var updateTotalsSelectedFunction = function () {
		_updateTotalsSelected();
	};

	function updateTotalsSelected() {
		clearTimeout(updateTotalsSelectedTimeout);
		updateTotalsSelectedTimeout = setTimeout(updateTotalsSelectedFunction, 80);
	}

	function _updateTotalsSelected() {
		var size = total_selected = listGetSelected().size()
		ui_total_selected.text(size);
		ui_content.attr('size_selected', size);
	}

var ui_total_visible;
var ui_total_modified;
var ui_total_selected;
var ui_pending_actions;

var ui_content;

var total_count
var total_visible;
var total_modified;
var total_modified_total;
var total_selected;

add('onLoad', function () {
	ui_total_visible = $('.total-visible')
	ui_total_modified = $('.total-modified')//the total of visible modified
	ui_total_modified_total = $('.total-modified-total')//the total of all modification(including invisible)
	ui_total_selected = $('.total-selected')

	ui_content = $('.content')
	ui_pending_actions = $('.pending-actions')
});

add('onLoad', onDataLoad);

//when pasting, get the clipboard as pure text
function onPaste() {
	ODP.copyToClipboard(ODP.getClipboard().replace(/\s+/g, ' ').replace(/^\s+/, ''));
}
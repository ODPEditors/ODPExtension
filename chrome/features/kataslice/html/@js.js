var ODP, aCategory, aSites;
var timer

addEventListener('load', function() {
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
		.getService(Components.interfaces.nsIWindowMediator);
	var win = wm.getMostRecentWindow('navigator:browser');
	ODP = win.ODPExtension;
	timer = ODP.timer();
	timer.start('onCategoryChange');

	onCategoryChange();
	addEventListener("hashchange", onCategoryChange, false);
}, false);

function onCategoryChange() {
	aCategory = ODP.categoryGetFromURL(document.location.hash)

	var reviewed = ODP.getHashParamFromURL(document.location, 'reviewed')
	var recursive = ODP.getHashParamFromURL(document.location, 'recursive') == '1'
	var json = ODP.getHashParamFromURL(document.location, 'json') == '1'

	if(json) {
		ODP.katasliceJSON(function(aData) {
			aSites = aData
			timer.stop('onCategoryChange');
			timer.display();
			onCategoryLoad();
		});
	} else {
		ODP.kataslice(aCategory, reviewed, recursive, function(aData) {
			aSites = aData
			timer.stop('onCategoryChange');
			timer.display();
			onCategoryLoad();
		});
	}
}

var groups = ['domain', 'subdomain', 'user', 'ip', 'type', 'category', 'type_colour', 'action'],
	columns = ['subdomain', 'title', 'description', 'category', 'user', 'date', 'ip', 'type', 'colour', 'action'],
	by = [],
	byCount = []

//create page

function onCategoryLoad() {

	timer.resetAll()

	document.title = 'KS: ' + ODP.categoryTitleForLabel(ODP.categoryGetFromURL(aCategory));

	//set category
	$('.header-categories').text(ODP.categoryAbbreviate(ODP.categoryGetFromURL(aCategory)))
	$('.header-categories').attr('category', aCategory)

	//sort sites by date
	timer.start('sortSitesByDate');
	aSites = _.sortBy(aSites, 'date').reverse();
	timer.stop('sortSitesByDate');

	//set the site text for filtering
	timer.start('setSitesText');
	aSites.forEach(function(d) {
		d.text = d.subdomain + ' ' + d.user + ' ' + d.ip + ' ' + d.title + ' ' + d.description + ' ' + d.category + ' ' + d.url;
	});
	timer.stop('setSitesText');

	//render HTML
	listRender();
	update();
	chartsRenderBar();
	chartsRenderPie();

	timer.display()

	//remove loading
	$('.loading').fadeOut();
	$('body').attr('loading', false);
}

var ListBody, listRows, listRowsVisible;

function listRender() {

	timer.start('listRender');

	var item = _.template($(".tpl-list-item").html());

	$('.list').empty();

	ListBody = d3.select(".list")
		.attr('sort-by', 'date')
		.attr('sort-order', 'desc');

	listRows = ListBody.selectAll("div").data(aSites).enter().append('div')
	listRows
		.attr('class', 'item')
		.attr('action', function(d) {
			return d.action;
		})
		.on('click', function(d) {
			entryClick(this, d3.event);
		})
		.html(function(d, i) {
			return item(d);
		})

	timer.stop('listRender');
}

function update() {
	listFilter();
	filterFreeText();
	updateTotals();
	chartsRenderPie()
	timer.display();
}

function updateTotals() {
	timer.start('updateTotals');
	listRowsVisible = ListBody.selectAll('.item:not(.filtered):not(.filter-textboxed)')
	$('.header-totals .filtered').text(listRowsVisible.size())

	if (listRowsVisible.size() < 1)
		$('.list-no-results').attr('results', false);
	else
		$('.list-no-results').attr('results', true);
	timer.stop('updateTotals');
}

var filters = {};

function listFilter() {

	timer.start('listFilter')

	var filter = _.values(filters)
	var size = 0
	for (var id in filter)
		size += _.size(filter[id])

	if (size > 0) {
		//hide all rows
		listRows.each(function(d) {
			d3.select(this).classed('filtered', true);
		});

		//apply filters
		listRows.each(function(d) {
			//AND
			var show = true;
			for (var i in filter) {
				//OR
				var orFilter = filter[i]
				//l(orFilter)
				for (var id in orFilter) {

					var test = d[orFilter[id].key] == orFilter[id].value;
					show = test && !orFilter[id].negation || !test && orFilter[id].negation;
					if (show)
						break;
				}
				if (!show)
					break;
			}
			if (show)
				d3.select(this).classed('filtered', false)
		});

	} else {
		listRows.each(function(d) {
			d3.select(this).classed('filtered', false);
		});
	}
	timer.stop('listFilter')
}

function filterAdd(key, value, event) {
	var k = key + '-' + value;
	if (!filters[key])
		filters[key] = {}
	filters[key][k] = {
		'key': key,
		'value': value,
		negation: event && event.ctrlKey
	}

	var superClass = '.filters .current .and[key="' + ODP.h(key) + '"]';
	if (key == 'category')
		var anchor = ODP.categoryTitleLastChild(value);
	else
		var anchor = value;
	if (!$(superClass).length)
		$('.filters .current').append('<span class="and" key="' + ODP.h(key) + '"></span>');

	if (!$(superClass + ' .filter[k="' + ODP.h(k) + '"]').length)
		$(superClass).append('<span class="filter or" k="' + ODP.h(k) + '" key="' + ODP.h(key) + '"></span>');

	var item = $(superClass + ' .filter[k="' + ODP.h(k) + '"]');
	item.attr('title', 'Click to remove filter');
	item.attr('onclick', 'filterRemove(this)');
	item.html((filters[key][k].negation ? '<b><i class="negation">!</i></b> ' : '') + ODP.h(anchor))

	update();
	chartsRenderBar();
}

function filterRemove(item) {
	delete filters[item.getAttribute('key')][item.getAttribute('k')];
	ODP.removeElement(item);

	update();
	chartsRenderBar();
}

var filterFreeTextTimeout = false;
function filterFreeText(timedout) {
	clearTimeout(filterFreeTextTimeout);
	if ( !! timedout)
		filterFreeTextTimeout = setTimeout(function() {
			filterFreeTextFilter();
			update()
		}, 720);
	else
		filterFreeTextFilter();
}

function filterFreeTextFilter() {
	var item = $('.filter-textbox');
	var filterFreeTextLastText = item.val().trim();
	ListBody.selectAll('.item:not(.filtered)').each(function(d) {
		if (filterFreeTextLastText == '' || ODP.searchEngineSearch(filterFreeTextLastText, d.text))
			d3.select(this).classed('filter-textboxed', false)
		else
			d3.select(this).classed('filter-textboxed', true)
	});
}

function chartsRenderBar() {
	timer.start('chartsRenderBar')

	var data = []
	listRowsVisible.each(function(d) {
		data[data.length] = d;
	});
	//crossfilter
	timer.start('groups')
	var xdata = crossfilter(data);

	//total
	$('.header-totals .total').text(xdata.size())
	$('.group-by-totals .none').text('(' + xdata.size() + ')')

	//grouping by all
	by['all'] = xdata.dimension(function(d) {
		return d;
	});
	byCount['all'] = by['all'].group(function(d) {
		return d;
	});

	//grouping by group
	for (var id in groups) {
		var item = groups[id];
		by[item] = xdata.dimension(function(d) {
			return d[item];
		});
		byCount[item] = by[item].group(function(value) {
			return value;
		});
	}

	//sidebar count group by
	for (var id in groups) {
		$('.group-by-totals .' + groups[id] ).text('(' + byCount[groups[id]].size() + ')')
	}
	timer.stop('groups')

	//bars group
	timer.start('bar');
	var bar, bars = ['domain', 'user', 'ip', 'category', 'action'];
	var group, colours
	for (var i in bars) {

		$('.bars .bar-' + bars[i]).remove();
		$('.bars').append('<div class="bar-' + bars[i]+'"></div>');

		group = byCount[bars[i]].top(50)
		colours = ODP.generateColours(group.length)

		var t = 0
		group.forEach(function(item) {
			t += item.value
		})
		bar = d3.select('.bars .bar-' + bars[i]).attr('key', bars[i])
		bar.selectAll('div').data(group).enter()
			.append("div")
			.attr('style', function(d, i) {
			return 'width:' + (d.value / (t / 100)) + '%;background-color:' + colours[i] + ''
		})
		.attr('class', 'bar')
		.attr("title", function(d, i) {
			return  d.key + ' (' + d.value + ')\n\nCLICK: show only items that match this value.\nCTRL+CLICK: remove from the list items that match this value.';
		})
		.on('click', function(d, i) {
			filterAdd(this.parentNode.getAttribute('key'), d.key, d3.event)
		})
		bar.append('div').attr('class', 'bars-legend ignore').text(bars[i])
	}
	timer.stop('bar');
	timer.stop('chartsRenderBar');
}

function chartsRenderPie() {

	var data = []
	listRowsVisible.each(function(d) {
		data[data.length] = d;
	});

	var groups = _.groupBy(data, 'type_colour')

	//pie types
	timer.start('pie');
	var c = [],
		values = [],
		names = [],
		functions = [],
		tooltip = [];
	for (var id in groups) {
		names[names.length] = id.split('-')[0]
		values[values.length] = groups[id].length
		c[c.length] = id.split('-')[1]
		tooltip[tooltip.length] = names[names.length - 1] + ' (' + values[values.length - 1] + ')';
		functions[functions.length] = function(d) {
			filterAdd('type', d, d3.event);
		}
	}
	pie(['.pie-type', 140], names, values, c, tooltip, functions);
	timer.stop('pie');
}

function listSortBy(item, by, order) {

	if ( !! item) {
		by = item.innerHTML
		item = $(item);
		order = item.attr('order')
		if (order == 'asc')
			item.attr('order', 'desc');
		else
			item.attr('order', 'asc');
		order = item.attr('order');
	} else {
		by = $('.list').attr('sort-by')
		order = $('.list').attr('sort-order')
	}

	if (order == 'desc')
		listRows.sort(function(a, b) {
			return d3.descending(a[by], b[by]);
		});
	else
		listRows.sort(function(a, b) {
			return d3.ascending(a[by], b[by]);
		});
}
function listGetVisible() {
	return ListBody.selectAll('.item:not(.filtered):not(.filter-textboxed)');
}
function listGetSelected() {
	return ListBody.selectAll('.item.selected:not(.filtered):not(.filter-textboxed)');
}
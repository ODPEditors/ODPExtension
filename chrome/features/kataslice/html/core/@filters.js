var filters = {};

function filterList() {
	l('filterList')

	timer.start('filterList')

	var andFilters = _.values(filters)
	var size = 0
	for (var id in andFilters)
		size += _.size(andFilters[id])

	if (size > 0) {

		//hide all rows
		timer.start('filterListHideAll')
		listRowsAll.classed('filtered', true);
		timer.stop('filterListHideAll')

		//apply filters
		timer.start('filterListApplyFilter')
		listRowsAll.each(function (d) {
			//AND
			var show = true;
			for (var i in andFilters) {
				//OR
				var orFilters = andFilters[i]
				for (var id in orFilters) {
					var test = orFilters[id].aFunction(d, d3.select(this)) == orFilters[id].v;
					show = test && !orFilters[id].negation || !test && orFilters[id].negation;
					if (show)
						break;
				}
				if (!show)
					break;
			}
			if (show)
				d3.select(this).classed('filtered', false)
		});
		timer.stop('filterListApplyFilter')

	} else {
		timer.start('filterListShowAll')
		listRowsAll.classed('filtered', false);
		timer.stop('filterListShowAll')
	}

	timer.stop('filterList')
}

function filterAdd(k, aFunction, v, event, name, label) {
	l('filterAdd')

	if (!filters[k])
		filters[k] = {}
	filters[k][v] = {
		'k': k,
		'v': v,
		'negation': event && event.ctrlKey,
		'aFunction': aFunction
	}
	var filter = filters[k][v]

	var classSuper = '.filters .filters-current .filter-and[k="' + ODP.h(k) + '"]';
	var classItem = classSuper + ' .filter[v="' + ODP.h(v) + '"]';
	if (!$(classSuper).length)
		$('.filters .filters-current').append('<span class="filter-and" k="' + ODP.h(k) + '"></span>');

	if (!$(classItem).length)
		$(classSuper).append('<span class="filter filter-or" v="' + ODP.h(v) + '"></span>');

	var item = $(classItem);
	item.attr('title', ODP.ucFirst(name) + ' : ' + (filter.negation ? 'NOT : ' : '') + ' ' + v);
	item.attr('onclick', 'filterRemove(this)');

	item.html((filter.negation ? '<i class="filter-negation">!</i>' : '') + ODP.h(ODP.shortText((label || v), 25, true)))

	update();
}

function filterRemove(item) {
	l('filterRemove')

	var parent = item.parentNode
	delete filters[parent.getAttribute('k')][item.getAttribute('v')];
	ODP.removeElement(item);
	if (parent.innerHTML == '')
		ODP.removeElement(parent);

	update();
}

function filterModified(event) {
	if (listGetModified().size()) {
		filterAdd('pending actions', function (d, e) {
			return e.classed('modified')
		}, true, event, 'Items that have been modified and will be synced', 'Sites Modified')
	}
}
/* textbox filter (search) */

var filterTextboxTimeout = false;
var filterTextboxLastValue = '';

function filterTextbox(timedout) {
	l('filterTextbox')

	clearTimeout(filterTextboxTimeout);
	if (timedout)
		filterTextboxTimeout = setTimeout(function () {
			_filterTextbox();
			update()
		}, 320);
	else
		_filterTextbox();
}

function _filterTextbox() {
	l('_filterTextbox')

	var text = $('.filter-textbox').val().trim()

	if (filterTextboxLastValue != text) {
		filterTextboxLastValue = text
		if (text == '') {
			listRowsAll.classed('filter-textboxed', false)
		} else {
			listRowsAll.each(function (d) {
				if (ODP.searchEngineSearch(text, d.text))
					d3.select(this).classed('filter-textboxed', false)
				else
					d3.select(this).classed('filter-textboxed', true)
			});
		}
	}
}
//in F5 the textbox may get a "saved state"
add('onLoad', function () {
	$('.filter-textbox').val('')
});
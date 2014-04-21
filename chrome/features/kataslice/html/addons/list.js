function sitesGetSelected() {
	return _getItems(listGetSelected())
}

function sitesGetVisible() {
	return _getItems(listGetVisible())
}

function sitesGetAll() {
	return _getItems(listRowsAll)
}

function sitesGetModified() {
	return _getItems(listGetModified())
}

function sitesSelectAll() {
	listGetVisible().classed('selected', true);
	updateTotalsSelected();
}

function sitesSelectNone() {
	listGetVisible().classed('selected', false);
	updateTotalsSelected();
}

function sitesSelectInvert() {
	listGetVisible().each(function (d) {
		var item = d3.select(this)
			item.classed('selected', !item.classed('selected'))
	});
	updateTotalsSelected();
}

function _getItems(which) {
	var items = []
	which.each(function (d) {
		items[items.length] = _getItem(d, d3.select(this))
	});
	return items;
}
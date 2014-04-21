var ListBody, listRowsAll

	function listRender() {
		l('listRender')

		timer.start('listRender');

		var item = _.template($(".tpl-list-item").html());

		$('.list').empty();

		ListBody = d3.select(".list")
			.attr('sort-by', 'date')
			.attr('sort-order', 'desc');

		listRowsAll = ListBody.selectAll("div").data(aSites).enter().append('div')
		listRowsAll
			.attr('class', 'item no-selection')
			.attr('action', function (d) {
				return d.action;
			})
			.attr('dir', function (d) {
				return ODP.categoryIsRTL(d.category) ? 'rtl' : 'ltr'
			})
			.on('click', function (d) {
				entryClick(this, d3.event);
			})
			.html(function (d, i) {
				return item(d);
			})

		timer.stop('listRender');
	}

	function listGetVisible() {
		l('listGetVisible')

		timer.start('listGetVisible');
		var list = ListBody.selectAll('.item:not(.filtered):not(.filter-textboxed)');
		timer.stop('listGetVisible:' + list.size());
		return list
	}

	function listGetSelected() {
		l('listGetSelected')

		timer.start('listGetSelected');
		var list = ListBody.selectAll('.item.selected:not(.filtered):not(.filter-textboxed)');
		timer.stop('listGetSelected');
		return list
	}

	function listGetModified() {
		l('listGetModified')

		timer.start('listGetModified');
		var list = ListBody.selectAll('.item.modified:not(.filtered):not(.filter-textboxed)');
		timer.stop('listGetModified');
		return list
	}

	function listSortBy(item, by, order) {
		l('listSortBy')
		timer.start('listSortBy');

		if ( !! item) {
			item = $(item);
			by = item.text()
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
			var aFunction = function (a, b) {
				return d3.descending(a[by], b[by]);
			};
		else
			var aFunction = function (a, b) {
				return d3.ascending(a[by], b[by]);
			};
		listGetVisible().sort(aFunction)

		timer.stop('listSortBy');
	}
var by = [],
	byCount = [],
	colours = []

	function chartsBars() {
		l('chartsBars')

		timer.start('chartsBars')

		//crossfilter
		timer.start('groups')
		var xdata = crossfilter(listGetVisible().data());
		var count = function (d) {
			return d;
		}
		by['all'] = xdata.dimension(count);
		byCount['all'] = by['all'].group(count)
		timer.stop('groups')

		//grouping by group
		for (var id in dimensions) {
			var dimension = dimensions[id]

			timer.start('chartsBar: ' + dimension.title)

			by[dimension.id] = xdata.dimension(dimension.scope);
			byCount[dimension.id] = by[dimension.id].group(count);
			if (!colours[dimension.id])
				colours[dimension.id] = ODP.generateColours(aSites.length)

			chartsBar(dimension)

			timer.stop('chartsBar: ' + dimension.title);
		}

		timer.stop('chartsBars');
	}

	function chartsBar(dimension) {
		$('.bar-' + dimension.id).remove();

		if ( !! dimension.barChart) {

			$('.bars').append('<div class="bar bar-' + dimension.id + '"></div>');

			var group = byCount[dimension.id].top(50)
			var colour = colours[dimension.id]

			var total = 0;
			group.forEach(function (d) {
				total += d.value;
			});

			var bar = d3.select('.bar-' + dimension.id)
				.attr('label', dimension.title.replace(/_|-/g, ' '))
				.selectAll('div').data(group)
				.enter()
				.append("div")
				.attr('class', 'bar-column')
				.attr('style', function (d, i) {
					return 'width:' + (d.value / (total / 100)) + '%;background-color:' + colour[i];
				})
				.attr("title", function (d, i) {
					return d.key + ' (' + d.value + ')';
				})
				.on('click', function (d, i) {
					filterAdd(dimension.id, dimension.scope, d.key, d3.event, dimension.title.replace(/_|-/g, ' '))
				})
		}
	}
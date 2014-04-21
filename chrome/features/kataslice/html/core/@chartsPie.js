function chartsPie() {
	l('chartsPie')

	timer.start('pie');

	var groups = _.groupBy(listGetVisible().data(), 'type_colour')

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
		functions[functions.length] = function (d) {
			filterAdd('type', d, d3.event);
		}
	}
	pie(['.pie-type', 140], names, values, c, tooltip, functions);
	timer.stop('pie');
}
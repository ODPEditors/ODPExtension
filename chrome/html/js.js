
function pie(item, names, values, colours, tooltip, functions) {

	$(item[0]).empty();

	var width = item[1],
		height = item[1],
		radius = Math.min(width, height) / 2;

	var color = d3.scale.ordinal()
		.domain(names)
		.range(colours);

	var arc = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(radius - width/3);

	var pie = d3.layout.pie()
		.sort(null);

	var svg = d3.select(item[0]).append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	var path = svg.selectAll("path")
		.data(names)
		.enter().append("path")
		.style("fill", color)
		.style("stroke", "rgba(180,180,180, .4)")
		.style("stroke-width", "5")
		.text(function(g){ return values[names.indexOf(g)];})
		.on('click', function(d){ functions[names.indexOf(d.data)](d.data); })
		.attr('class', 'click not-ignore')
		.attr('title', function(g){ return tooltip[names.indexOf(g)]; })
		.each(function() {
			this._current = {
				startAngle: 0,
				endAngle: 0
			};
		})

	path.data(pie.value(function(g) {
		return values[names.indexOf(g)];
	})(names)).transition()
		.attrTween("d", function(d) {
		var interpolate = d3.interpolate(this._current, d);
		this._current = interpolate(0);
		return function(t) {
			return arc(interpolate(t));
		};
	});

}
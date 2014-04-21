EXPORTED_SYMBOLS = ['toolbarbuttons', 'dimensions', 'listeners', 'api'], api = {}

var dimensions = []

dimensions[dimensions.length] = {
	title: 'domain',
	barChart: true,
	scope: function (site) {
		return site['domain']
	}
}
dimensions[dimensions.length] = {
	title: 'subdomain',
	barChart: true,
	scope: function (site) {
		return site['subdomain']
	}
}
dimensions[dimensions.length] = {
	title: 'category',
	barChart: true,
	scope: function (site) {
		return site['category']
	}
}
dimensions[dimensions.length] = {
	title: 'user',
	barChart: true,
	scope: function (site) {
		return site['user']
	}
}
dimensions[dimensions.length] = {
	title: 'ip',
	barChart: true,
	scope: function (site) {
		return site['ip']
	}
}

dimensions[dimensions.length] = {
	title: 'type',
	barChart: true,
	scope: function (site) {
		return site['type']
	}
}
dimensions[dimensions.length] = {
	title: 'type_colour',
	barChart: false,
	scope: function (site) {
		return site['type_colour']
	}
}
dimensions[dimensions.length] = {
	title: 'placement',
	barChart: true,
	scope: function (site) {
		return site['action']
	}
}
dimensions[dimensions.length] = {
	title: 'title starts with lower case?',
	barChart: true,
	scope: function (site) {
		return (site['title'] && site['title'][0].toLowerCase() == site['title'][0]) ? 'Yes' : 'No';
	}
}
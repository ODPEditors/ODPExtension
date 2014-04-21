EXPORTED_SYMBOLS = ['toolbarbuttons', 'dimensions', 'listeners', 'api'], api = {}

var toolbarbuttons = []

toolbarbuttons[toolbarbuttons.length] = {
	title: 'listings',
	label: '', //optional
	name: 'listings',

	icon: '\uf127', //copy and paste one from here: http://fortawesome.github.io/Font-Awesome/cheatsheet/
	icon_color: '',

	toolbar: 'main', //'main' or 'header' toolbar
	position: 'right', //to the 'left' or to the 'right' of the toolbar
	insert_after: 'tito@toolbarbuttons-select-all',
	include_separator: false,

	onclick: function (event) {

		var items = api.sitesGetSelected();

		items.forEach(function (item) {

			api.ODP.subdomainGetListings(item.url(), function (aData) {
				var txt = ''
				for (var id in aData) {
					txt += '<hr>'
					txt += api.h(aData[id].category) + '<br>'
					txt += api.h(aData[id].uri) + '<br>'
				}
				item.appendHTML(txt);
			})
		});

	},
	onmouseover: function (event) {},
	onmouseout: function (event) {},
	onopen: function () {},
	onclose: function () {}
}
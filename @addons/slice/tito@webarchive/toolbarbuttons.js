EXPORTED_SYMBOLS = ['toolbarbuttons', 'dimensions', 'listeners', 'api'], api = {}

var toolbarbuttons = []

toolbarbuttons[toolbarbuttons.length] = {
	title: 'webarchive',
	label: '', //optional
	name: 'webarchive',

	icon: '\uf02d', //copy and paste one from here: http://fortawesome.github.io/Font-Awesome/cheatsheet/
	icon_color: '',

	toolbar: 'main', //'main' or 'header' toolbar
	position: 'right', //to the 'left' or to the 'right' of the toolbar
	insert_after: 'tito@toolbarbuttons-link-check',
	include_separator: true,

	onclick: function (event) {

		var uris = []
		var items = api.sitesGetSelected();
		items.forEach(function (item) {
			uris[uris.length] = 'http://web.archive.org/' + item.url()
		});
		api.tabOpen(api.arrayUnique(uris), true);
	},
	onmouseover: function (event) {},
	onmouseout: function (event) {},
	onopen: function () {},
	onclose: function () {}
}
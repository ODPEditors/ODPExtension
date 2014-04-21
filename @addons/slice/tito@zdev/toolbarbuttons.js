EXPORTED_SYMBOLS = ['toolbarbuttons', 'dimensions', 'listeners', 'api'], api = {}

var toolbarbuttons = []

toolbarbuttons[toolbarbuttons.length] = {
	title: 'site data dump',
	label: 'DS', //optional
	name: 'data-dump',

	icon: '', //copy and paste one from here: http://fortawesome.github.io/Font-Awesome/cheatsheet/
	icon_color: '',

	toolbar: 'main', //'main' or 'header' toolbar
	position: 'right', //to the 'left' or to the 'right' of the toolbar
	insert_before: 'tito@toolbarbuttons-delete',
	include_separator: false,

	onclick: function (event) {
		var items = api.sitesGetSelected();
		items.forEach(function (item) {
			api.dump(item)
		});
	},
	onmouseover: function (event) {},
	onmouseout: function (event) {},
	onopen: function () {},
	onclose: function () {}
}

toolbarbuttons[toolbarbuttons.length] = {
	title: 'link checker dump',
	label: 'DL', //optional
	name: 'link-checker-dump',

	icon: '', //copy and paste one from here: http://fortawesome.github.io/Font-Awesome/cheatsheet/
	icon_color: '',

	toolbar: 'main', //'main' or 'header' toolbar
	position: 'right', //to the 'left' or to the 'right' of the toolbar
	insert_before: 'tito@toolbarbuttons-delete',
	include_separator: false,

	onclick: function (event) {
		var items = api.sitesGetSelected();
		var linkChecker = api.linkChecker();
		items.forEach(function (item) {
			linkChecker.check(item.url(), function (aData, aURL) {
				api.dump(aData);
			});
		});
	},
	onmouseover: function (event) {},
	onmouseout: function (event) {},
	onopen: function () {},
	onclose: function () {}
}

toolbarbuttons[toolbarbuttons.length] = {
	title: 'false positive',
	label: 'LCFP', //optional
	name: 'link-checker-false-positive',

	icon: '', //copy and paste one from here: http://fortawesome.github.io/Font-Awesome/cheatsheet/
	icon_color: '',

	toolbar: 'main', //'main' or 'header' toolbar
	position: 'right', //to the 'left' or to the 'right' of the toolbar
	insert_before: 'tito@toolbarbuttons-delete',
	include_separator: false,

	onclick: function (event) {
		var urls = []
		var items = api.sitesGetSelected();
		items.forEach(function (item) {
			urls[urls.length] = item.url();
		});
		api.ODP.fileWriteAsync('link-checker-false-positives.txt', api.ODP.fileRead('link-checker-false-positives.txt') + '\n' + (urls.join('\n')))
	},
	onmouseover: function (event) {},
	onmouseout: function (event) {},
	onopen: function () {},
	onclose: function () {}
}
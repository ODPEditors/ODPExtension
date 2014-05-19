EXPORTED_SYMBOLS = ['toolbarbuttons', 'dimensions', 'listeners', 'api'], api = {}

var toolbarbuttons = []

toolbarbuttons[toolbarbuttons.length] = {
	title: 'Add ODP Editor Note to selected sites',
	label: 'Note', //optional
	name: 'note',

	icon: '\uf040', //copy and paste one from here: http://fortawesome.github.io/Font-Awesome/cheatsheet/
	icon_color: '',

	toolbar: 'main', //'main' or 'header' toolbar
	position: 'left', //to the 'left' or to the 'right' of the toolbar
	insert_after: 'tito@toolbarbuttons-status-unreview',
	include_separator: false,

	onclick: function (event) {
		var sites = api.sitesGetSelected();
		if (sites.length) {
			var note = api.prompt('ODP Note');
			sites.forEach(function (site) {
				site.unreviewed(note)
			});
		}
	},
	onmouseover: function (event) {},
	onmouseout: function (event) {},
	onopen: function () {},
	onclose: function () {}
}

toolbarbuttons[toolbarbuttons.length] = {
	title: 'Move selected sites to another category',
	label: 'Move', //optional
	name: 'move',

	icon: '\uf124', //copy and paste one from here: http://fortawesome.github.io/Font-Awesome/cheatsheet/
	icon_color: '',

	toolbar: 'main', //'main' or 'header' toolbar
	position: 'left', //to the 'left' or to the 'right' of the toolbar
	insert_after: 'tito@toolbarbuttons-note',
	include_separator: false,

	onclick: function (event) {
		var note, sites = api.sitesGetSelected();
		if (sites.length && (!event.ctrlKey || (note = api.prompt('ODP Note')))) {
			api.promptForCategory(function (aCategory) {
				sites.forEach(function (site) {
					site.category(aCategory, note)
				});
			});
		}
	},
	onmouseover: function (event) {},
	onmouseout: function (event) {},
	onopen: function () {},
	onclose: function () {}
}

toolbarbuttons[toolbarbuttons.length] = {
	title: 'open selected sites in tabs for editing',
	label: 'editable', //optional
	name: 'open-urls',

	icon: '\uf18e', //copy and paste one from here: http://fortawesome.github.io/Font-Awesome/cheatsheet/
	icon_color: '',

	toolbar: 'main', //'main' or 'header' toolbar
	position: 'left', //to the 'left' or to the 'right' of the toolbar
	insert_after: 'tito@toolbarbuttons-move',
	include_separator: true,

	onclick: function (event) {
		api.tabOpenEditable(api.sitesGetSelected())
	},
	onmouseover: function (event) {},
	onmouseout: function (event) {},
	onopen: function () {},
	onclose: function () {}
}
toolbarbuttons[toolbarbuttons.length] = {
	title: 'undo last action',
	label: 'undo', //optional
	name: 'undo',

	icon: '\uf112', //copy and paste one from here: http://fortawesome.github.io/Font-Awesome/cheatsheet/
	icon_color: '',

	toolbar: 'main', //'main' or 'header' toolbar
	position: 'left', //to the 'left' or to the 'right' of the toolbar
	insert_after: 'tito@toolbarbuttons-open-urls',
	include_separator: false,

	onclick: function (event) {
		api.alert('Not yet... but soon.. soon when?');
	},
	onmouseover: function (event) {},
	onmouseout: function (event) {},
	onopen: function () {},
	onclose: function () {}
}

toolbarbuttons[toolbarbuttons.length] = {
	title: 'select all sites',
	label: '', //optional
	name: 'select-all',

	icon: '\uf046', //copy and paste one from here: http://fortawesome.github.io/Font-Awesome/cheatsheet/
	icon_color: '',

	toolbar: 'main', //'main' or 'header' toolbar
	position: 'right', //to the 'left' or to the 'right' of the toolbar
	//insert_before: 'tito@toolbarbuttons-undo',
	include_separator: true,

	onclick: function (event) {
		if(api.sitesCountSelected() == api.sitesCountVisible())
			api.sitesSelectInvert()
		else
			api.sitesSelectAll()

	},
	onmouseover: function (event) {},
	onmouseout: function (event) {},
	onopen: function () {},
	onclose: function () {}
}

toolbarbuttons[toolbarbuttons.length] = {
	title: 'edit selected',
	label: '', //optional
	name: 'edit',

	icon: '\uf044', //copy and paste one from here: http://fortawesome.github.io/Font-Awesome/cheatsheet/
	icon_color: '',

	toolbar: 'main', //'main' or 'header' toolbar
	position: 'right', //to the 'left' or to the 'right' of the toolbar
	//insert_before: 'tito@toolbarbuttons-undo',
	include_separator: false,

	onclick: function (event) {
		var items = api.sitesGetSelected();
		items.forEach(function (item) {
			item.edit();
		});
	},
	onmouseover: function (event) {},
	onmouseout: function (event) {},
	onopen: function () {},
	onclose: function () {}
}
toolbarbuttons[toolbarbuttons.length] = {
	title: 'open categories',
	label: '', //optional
	name: 'open-categories',

	icon: '\uf044', //copy and paste one from here: http://fortawesome.github.io/Font-Awesome/cheatsheet/
	icon_color: '',

	toolbar: 'main', //'main' or 'header' toolbar
	position: 'right', //to the 'left' or to the 'right' of the toolbar
	//insert_before: 'tito@toolbarbuttons-undo',
	include_separator: false,

	onclick: function (event) {
		var urls = []
		var items = api.sitesGetSelected();
		items.forEach(function (item) {
			urls[urls.length] = api.categoryGetURLEdit(item.category());
		});
		urls = api.arrayUnique(urls);
		api.tabOpen(urls, true)
	},
	onmouseover: function (event) {},
	onmouseout: function (event) {},
	onopen: function () {},
	onclose: function () {}
}
toolbarbuttons[toolbarbuttons.length] = {
	title: 'add dot to description',
	label: '', //optional
	name: '',

	icon: 'd', //copy and paste one from here: http://fortawesome.github.io/Font-Awesome/cheatsheet/
	icon_color: '',

	toolbar: 'main', //'main' or 'header' toolbar
	position: 'right', //to the 'left' or to the 'right' of the toolbar
	//insert_before: 'tito@toolbarbuttons-undo',
	include_separator: false,

	onclick: function (event) {
		var items = api.sitesGetSelected();
		items.forEach(function (item) {
			var description = item.description().trim();
			if(!/(\]|\)|\!|\?|\.|\'|\")$/.test(description))
				item.description(description+'.')
		});
	},
	onmouseover: function (event) {},
	onmouseout: function (event) {},
	onopen: function () {},
	onclose: function () {}
}

/*
	<!--span class="toolbarbutton" title="Duplicate"><i></i></span>
	<span class="toolbarbutton separator">|</span-->
	<span class="toolbarbutton" title="Import Feeds"><i></i></span>
	<span class="toolbarbutton separator">|</span>
	<span class="toolbarbutton" title="Fixer"><i></i></span>
	<span class="toolbarbutton separator">|</span>
	<span class="toolbarbutton" title="Edit selected"><i></i></span>
	<span class="toolbarbutton separator">|</span>
	<span class="toolbarbutton" title="Sort"><i></i></span>
	<span class="toolbarbutton separator">|</span>
	<span class="toolbarbutton" title="Save and Exit"><i></i></span>
*/
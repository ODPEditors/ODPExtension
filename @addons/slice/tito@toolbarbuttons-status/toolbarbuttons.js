EXPORTED_SYMBOLS = ['toolbarbuttons', 'dimensions', 'listeners', 'api'], api = {}

var toolbarbuttons = []

toolbarbuttons[toolbarbuttons.length] = {
	title: 'publish selected sites',
	label: 'publish', //optional
	name: 'publish',

	icon: '\uf058', //copy and paste one from here: http://fortawesome.github.io/Font-Awesome/cheatsheet/
	icon_color: 'rgb(102, 153, 51)',

	toolbar: 'main', //'main' or 'header' toolbar
	position: 'left', //to the 'left' or to the 'right' of the toolbar
	include_separator: false,

	onclick: function (event) {
		var note, sites = api.sitesGetSelected();
		if (sites.length && (!event.ctrlKey || (note = api.prompt('ODP Note')))) {
			sites.forEach(function (site) {
				site.published(note)
			});
		}
	},
	onmouseover: function (event) {},
	onmouseout: function (event) {},
	onopen: function () {},
	onclose: function () {}
}

	toolbarbuttons[toolbarbuttons.length] = {
		label: 'Works',
		parent: 'tito@toolbarbuttons-status-publish',
		name: 'publish-works',

		onclick: function (event) {
			var note = 'Works', sites = api.sitesGetSelected();
			if (sites.length) {
				sites.forEach(function (site) {
					site.published(note)
				});
			}
		}
	}

toolbarbuttons[toolbarbuttons.length] = {
	title: 'delete selected sites',
	label: 'delete', //optional
	name: 'delete',

	icon: '\uf056', //copy and paste one from here: http://fortawesome.github.io/Font-Awesome/cheatsheet/
	icon_color: 'rgba(255, 0, 0, 0.70)',

	toolbar: 'main', //'main' or 'header' toolbar
	position: 'left', //to the 'left' or to the 'right' of the toolbar
	insert_after: 'tito@toolbarbuttons-status-publish',
	include_separator: false,

	onclick: function (event) {
		var note, sites = api.sitesGetSelected();
		if (sites.length && (note = api.prompt('ODP Note'))) {
			sites.forEach(function (site) {
				site.deleted(note)
			});
		}
	},
	onmouseover: function (event) {},
	onmouseout: function (event) {},
	onopen: function () {},
	onclose: function () {}
}

var deletion_notes = [
						'Duplicated',
						'Outdated',
						'Hijacked',
						'Gone',
						'Poor',
						'MFA',
						'Irrelevant',
						'spam'
					]

	deletion_notes.forEach(function(value){
		toolbarbuttons[toolbarbuttons.length] = {
			label: value,
			parent: 'tito@toolbarbuttons-status-delete',
			name: 'delete-'+value,

			onclick: function (event) {
				var note = value, sites = api.sitesGetSelected();
				if (sites.length) {
					sites.forEach(function (site) {
						site.deleted(note)
					});
				}
			}
		}
	});


toolbarbuttons[toolbarbuttons.length] = {
	title: 'unreview selected sites',
	label: 'unreview', //optional
	name: 'unreview',

	icon: '\uf06a', //copy and paste one from here: http://fortawesome.github.io/Font-Awesome/cheatsheet/
	icon_color: 'rgb(161, 161, 161)',

	toolbar: 'main', //'main' or 'header' toolbar
	position: 'left', //to the 'left' or to the 'right' of the toolbar
	insert_after: 'tito@toolbarbuttons-status-delete',
	include_separator: true,

	onclick: function (event) {
		var note, sites = api.sitesGetSelected();
		if (sites.length && (!event.ctrlKey || (note = api.prompt('ODP Note')))) {
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
		label: 'Does not work',
		parent: 'tito@toolbarbuttons-status-unreview',
		name: 'unreview-does-not-work',

		onclick: function (event) {
			var note = 'Does not work', sites = api.sitesGetSelected();
			if (sites.length) {
				sites.forEach(function (site) {
					site.unreviewed(note)
				});
			}
		}
	}

	toolbarbuttons[toolbarbuttons.length] = {
		label: 'Has errors',
		parent: 'tito@toolbarbuttons-status-unreview',
		name: 'unreview-has-errors',

		onclick: function (event) {
			var note = 'Has errors', sites = api.sitesGetSelected();
			if (sites.length) {
				sites.forEach(function (site) {
					site.unreviewed(note)
				});
			}
		}
	}
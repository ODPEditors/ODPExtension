EXPORTED_SYMBOLS = ['toolbarbuttons', 'dimensions', 'listeners', 'api', 'search'], api = {}

var panel;

var toolbarbuttons = []

toolbarbuttons[toolbarbuttons.length] = {
	icon: '\uf002', //copy and paste one from here: http://fortawesome.github.io/Font-Awesome/cheatsheet/
	name: 'google-search',
	title: 'Google Search',
	label: '', //optional

	toolbar: 'main', //'main' or 'header' toolbar
	position: 'left', //to the 'left' or to the 'right' of the toolbar
	insert_after: 'tito@toolbarbuttons-undo',
	include_separator: false,

	onclick: function (event) {
		api.l('toolbarbuttons.onclick')
		//fetch our template
		var content = api.html(api.templates.find('.addon-google-tpl-search').html())
		//write the value of title to the template
		content = content(({
			title: ''
		}))

		//write the content to the output panel and get the panel
		panel = this.writeToPanel(content)

		//get the first selected site
		var sites = api.sitesGetSelected();
		var site = sites[0];

		this.open();

		if (site) {
			//get the site data
			var searchTerm = site.title()
			var category = site.category()

			//search and open the panel
			search(searchTerm)
			panel.find('.addon-google-search-input').val(searchTerm);

		} else {

			panel.find('.addon-google-search-results').fadeOut();
		}

		panel.find('.addon-google-search-input').focus();
		panel.find('.addon-google-search-input').select();
	},

	onmouseover: function (event) {
		api.l('toolbarbuttons.onmouseover')
	},
	onmouseout: function (event) {
		api.l('toolbarbuttons.onmouseout')
	},
	onopen: function () {
		api.l('toolbarbuttons.onopen')
		searchTermLastValue = ''
	},
	onclose: function () {
		api.l('toolbarbuttons.onclose')
		searchTermLastValue = ''
	}
}

var searchTimeout = false;

function search(searchTerm, timedout) {
	api.clearTimeout(searchTimeout);
	if (timedout)
		searchTimeout = api.setTimeout(function () {
			_search(searchTerm);
		}, 720);
	else
		_search(searchTerm);
}

var searchTermLastValue = '';

function _search(searchTerm) {

	if (searchTerm != '' && searchTerm != searchTermLastValue) {

		searchTermLastValue = searchTerm

		//get the site data
		var sites = api.sitesGetSelected();
		var site = sites[0];
		if (site) {
			var category = site.category()
			var lang = api.ODP.getLanguageFromCategory(category).code
		}

		//get the panel of the results
		var resultsContainer = panel.find('.addon-google-search-results')

		//template of a google item
		var item = api.html(api.templates.find('.addon-google-tpl-item').html())

		api.ODP.searchEngine().search(searchTerm, lang, false, function (aData) {

			var results = ''
			for (var id in aData) {
				results += item({
					title: aData[id].title,
					url: aData[id].url,
					urldecoded: api.ODP.decodeUTF8Recursive(aData[id].url),
					description: aData[id].description
				})
			}
			if (aData.length) {
				//write the results to the panel
				resultsContainer.html(results)
			} else {
				resultsContainer.html('No results for "' + api.h(searchTerm) + '"')
			}
		});
	}
}
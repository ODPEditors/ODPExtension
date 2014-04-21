EXPORTED_SYMBOLS = ['toolbarbuttons', 'dimensions', 'listeners', 'api'], api = {}

var toolbarbuttons = []

toolbarbuttons[toolbarbuttons.length] = {
	title: 'link check',
	label: '', //optional
	name: 'link-check',

	icon: '\uf127', //copy and paste one from here: http://fortawesome.github.io/Font-Awesome/cheatsheet/
	icon_color: '',

	toolbar: 'main', //'main' or 'header' toolbar
	position: 'right', //to the 'left' or to the 'right' of the toolbar
	insert_after: 'tito@toolbarbuttons-select-all',
	include_separator: false,

	onclick: function (event) {

		var items = api.sitesGetSelected();

		var linkChecker = api.linkChecker();

		items.forEach(function (item) {
			linkChecker.check(item.url(), function (aData, aURL) {

				if (aData.status.error && aData.status.canDelete)
					item.item.attr('status', 'red')
				else if (aData.status.error && aData.status.canUnreview)
					item.item.attr('status', 'purple')
				else if (aData.status.suspicious.length)
					item.item.attr('status', 'orange')
				else if (aData.statuses[aData.statuses.length - 1] == '200' && aData.status.error === false)
					item.item.attr('status', 'green')
				else
					item.item.attr('status', 'yellow')

					var text =
						'[' +
						api.h(aData.statuses.join(', ') + ' | ' + aData.status.code + ' | ' + aData.status.errorString + ' | ' + aData.ip + ' | ' + aData.language + ' | ' + aData.checkType + ' | ' + aData.title + '  ') + (aData.urlLast != aData.urlOriginal ? '<br>' + api.h(aData.urlOriginal) + '<br>' + api.h(aData.urlLast) + '<br>' : '') + ' ] <span type="selection"><span class="click" onclick="action(this)" action="false-positive">false positive</span>'

				//d.text += text

				if (aData.status.code == -1340)
					item.url(aData.urlLast)
				item.appendHTML(text);
			});

		});

	},
	onmouseover: function (event) {},
	onmouseout: function (event) {},
	onopen: function () {},
	onclose: function () {}
}
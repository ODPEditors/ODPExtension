EXPORTED_SYMBOLS = ['toolbarbuttons', 'dimensions', 'listeners', 'api'], api = {}

var toolbarbuttons = []

	toolbarbuttons[toolbarbuttons.length] = {
		title: 'Translate',
		label: '', //optional
		name: 'Translate',

		icon: '\uf0ac', //copy and paste one from here: http://fortawesome.github.io/Font-Awesome/cheatsheet/
		icon_color: '',

		toolbar: 'main', //'main' or 'header' toolbar
		position: 'right', //to the 'left' or to the 'right' of the toolbar
		insert_after: 'tito@toolbarbuttons-link-check',
		include_separator:false,

		onclick:function(event) {
		var items = api.sitesGetSelected();
		items.forEach(function (item) {
			api.ODP.stringTranslate(item.title() + ' - ' + item.description(), function (aData) {
				item.appendText(aData);
			})
		});
		},
		onmouseover:function(event){
		},
		onmouseout:function(event){
		},
		onopen:function(){
		},
		onclose:function(){
		}
	}
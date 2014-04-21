EXPORTED_SYMBOLS = ['toolbarbuttons', 'dimensions', 'listeners', 'api'], api = {}

var listeners = []

listeners.toolbaronmouseover = function (aToolbar) {
	var list = this.list;
	if (!list.hasClass('addon-toolbar-darkify-selected-on-over')) {
		list.addClass('addon-toolbar-darkify-selected-on-over')
	}
}

listeners.toolbaronmouseout = function (aToolbar) {
	var list = this.list;
	if (!list.hasClass('addon-toolbar-darkify-selected-on-over')) {
		list.removeClass('addon-toolbar-darkify-selected-on-over')
	}
}
(function() {
	//hides or shows all the toolbars and toolbars buttons
	this.toolbarsToggle = function() {

		this.dispatchGlobalEvent('toolbarsToggle', this.preferenceGet('toolbars.toggle'));

		this.preferenceSet('toolbars.toggle', !this.preferenceGet('toolbars.toggle'));
	}
	return null;

}).apply(ODPExtension);
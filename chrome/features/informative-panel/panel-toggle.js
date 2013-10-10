(function() {

	//toggle the visibility of the panel

	var panel, panel_move;
	this.addListener('userInterfaceLoad', function() {
		panel = ODPExtension.getElement('panel');
		panel_move = ODPExtension.getElement('panel-move');
	});

	this.panelInformationToggle = function(closed, saveStatus) {
		if (closed) {
			panel.setAttribute('hidden', false);
			panel_move.setAttribute('status', 'opened');
			if (saveStatus)
				this.preferenceSet('ui.informative.panel.closed', false);
		} else {
			panel.setAttribute('hidden', true);
			panel_move.setAttribute('status', 'closed');
			if (saveStatus)
				this.preferenceSet('ui.informative.panel.closed', true);
		}
	}

	this.panelShow = function(aHide) {
		panel.setAttribute('hidden', !aHide);
		panel_move.setAttribute('hidden', !aHide);
		if (panel_move.hidden) {} else {
			panel.style.setProperty("right", this.preferenceGet('ui.informative.panel.r') + 'px', "important");
			panel.style.setProperty("bottom", this.preferenceGet('ui.informative.panel.b') + 'px', "important");

			panel_move.style.setProperty("right", (this.preferenceGet('ui.informative.panel.r')) + 'px', "important");
			panel_move.style.setProperty("bottom", (this.preferenceGet('ui.informative.panel.b') - 24) + 'px', "important");
		}
	}
	return null;

}).apply(ODPExtension);
(function () {

	var panel
	this.addListener('userInterfaceLoad', function () {
		panel = ODPExtension.getElement('panel-fast-add');
	});

	this.panelFastAddToggleViaKey = function () {
		if (panel.hidden == false) {
			this.getElement('panel-fast-add-description').focus()
		} else {
			this.panelFastAddToggle();
		}
	}

	this.panelFastAddToggle = function () {
		var closed = this.preferenceGet('ui.fast.add.panel.closed')
		if (closed) {
			panel.setAttribute('hidden', false);
			this.preferenceSet('ui.fast.add.panel.closed', false);
			this.panelFastAddGetInformation();
			this.getElement('panel-fast-add-description').focus()
		} else {
			panel.setAttribute('hidden', true);
			this.preferenceSet('ui.fast.add.panel.closed', true);
		}
	}

	this.panelFastAddShow = function (aHide) {
		panel.setAttribute('hidden', !aHide);
		panel.style.setProperty("top", '200px', "important");
		panel.style.setProperty("left", '50px', "important");
	}

	this.panelFastAddVisibilityHide = function () {
		panel.setAttribute('focused', false)
	}
	this.panelFastAddVisibilityShow = function (focus) {
		panel.setAttribute('focused', true)
		if(focus)
			this.getElement('panel-fast-add-description').focus()
	}

	return null;

}).apply(ODPExtension);
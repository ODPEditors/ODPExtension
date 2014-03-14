(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	var header, title, description, uri;
	this.addListener('userInterfaceLoad', function() {
		header = ODPExtension.getElement('panel-header');
		title = ODPExtension.getElement('panel-header-title');
		description = ODPExtension.getElement('panel-header-description');
		uri = ODPExtension.getElement('panel-header-uri');
	});
	this.panelInformationBuildHeader = function(aSelected) {
		var aSite = this.listingInformationData[aSelected];

		var urlPretty = this.decodeUTF8Recursive(this.IDNDecodeURL(aSite.uri));

		 if (this.categoryIsRTL(aSite.category)) {
			title.setAttribute('direction', 'rtl');
			description.setAttribute('direction', 'rtl');
		} else {
			title.removeAttribute('direction');
			description.removeAttribute('direction');
		}
		//panel
		header.setAttribute('category', aSite.category);
		header.setAttribute('url', aSite.uri);
		header.setAttribute("tooltiptext", 'EDIT:' + urlPretty);
		header.setAttribute("panel-header-selected", aSelected);

		//title
		if (this.preferenceGet('ui.informative.panel.title')) {
			title.replaceChild(document.createTextNode((aSite.mediadate != '' ? '(' + aSite.mediadate + ') ' : '') + aSite.title), title.firstChild);
			title.setAttribute('type', aSite.type + '-' + aSite.cool);
			title.setAttribute('hidden', false);
		} else {
			title.setAttribute('hidden', true);
		}

		//description
		if (this.preferenceGet('ui.informative.panel.description')) {
			description.replaceChild(document.createTextNode(aSite.description), description.firstChild);
			description.setAttribute('hidden', false);
		} else {
			description.setAttribute('hidden', true);
		}

		//uri
		if (this.preferenceGet('ui.informative.panel.url')) {
			uri.setAttribute("value", urlPretty);
			uri.setAttribute("tooltiptext", this.removeSchema(urlPretty));
			uri.setAttribute('hidden', false);
		} else {
			uri.setAttribute('hidden', true);
		}

		if (!this.preferenceGet('ui.informative.panel.url') && !this.preferenceGet('ui.informative.panel.description') && !this.preferenceGet('ui.informative.panel.title'))
			this.getElement('panel-header').setAttribute('hidden', true);
		else
			this.getElement('panel-header').setAttribute('hidden', false);
	}

	return null;

}).apply(ODPExtension);
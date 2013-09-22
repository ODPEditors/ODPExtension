(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.panelInformationBuildHeader = function(aSelected) {
		var site = this.listingInformationData[aSelected];

		var urlPretty = this.decodeUTF8Recursive(site.url);

		var panelSite = this.getElement('panel-header');
		panelSite.setAttribute('category', site.category);
		panelSite.setAttribute('url', site.url);
		panelSite.setAttribute("tooltiptext", 'EDIT:' + this.removeSchema(urlPretty));
		panelSite.setAttribute("panel-header-selected", aSelected);

		//titulo
		var title = this.getElement('panel-header-title');
		if (this.preferenceGet('ui.informative.panel.title')) {
			title.setAttribute('hidden', false);
			title.replaceChild(document.createTextNode((site.mediadate != '' ? '(' + site.mediadate + ') ' : '') + site.title), title.firstChild);
			title.setAttribute('type', site.type + '-' + site.cool);
		} else {
			title.setAttribute('hidden', true);
		}

		//description
		var description = this.getElement('panel-header-description');
		if (this.preferenceGet('ui.informative.panel.description')) {
			description.setAttribute('hidden', false);
			description.replaceChild(document.createTextNode(site.description), description.firstChild);
		} else {
			description.setAttribute('hidden', true);
		}

		//uri
		var uri = this.getElement('panel-header-uri');
		if (this.preferenceGet('ui.informative.panel.url')) {
			uri.setAttribute('hidden', false);
			uri.setAttribute("value", urlPretty);
			uri.setAttribute("tooltiptext", this.removeSchema(urlPretty));
			uri.setAttribute("crop", 'end');
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
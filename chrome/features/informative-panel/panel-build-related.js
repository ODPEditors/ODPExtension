(function() {


	this.addListener('userInterfaceUpdate', function() {
		if (ODPExtension.preferenceGet('ui.informative.panel.categories.align.left')) {
			ODPExtension.getElement('panel-related-categories').setAttribute('data-align', 'left');
			var categoryCrop = 'end';
		} else {
			ODPExtension.getElement('panel-related-categories').setAttribute('data-align', 'right');
			var categoryCrop = 'start';
		}
		for (var i = 0; i < ODPExtension.getElement('panel-related-categories').childNodes.length; i++) {
			ODPExtension.getElement('panel-related-categories').childNodes[i].setAttribute('crop', categoryCrop);
		}
	});
	//builds the related content of the informative panel ( other listed uris with information about categories and titles )
	this.panelInformationBuildRelated = function(aSelected) {
		if (!this.preferenceGet('ui.informative.panel.categories.titles.urls')) {
			//so, do you wanted to completely hide the informative panel
			if (!this.preferenceGet('ui.informative.panel.url') && !this.preferenceGet('ui.informative.panel.description') && !this.preferenceGet('ui.informative.panel.title')) {
				this.preferenceSet('ui.informative.panel', false);
				this.getElement('panel').setAttribute('hidden', true);
			}
			this.getElement('panel-related').setAttribute('hidden', true);
		} else {
			this.getElement('panel-related').setAttribute('hidden', false);

			var aSite, title, uri, category, urlPretty, tooltiptext;

			for (var i = 0; i < this.listingInformationData.length; i++) {
				aSite = this.listingInformationData[i];

				urlPretty = this.decodeUTF8Recursive(aSite.uri);
				tooltiptext = aSite.title + '\n' + urlPretty + '\n' + this.categoryAbbreviate(aSite.category) + '\n' + aSite.description;

				title = this.getElement('panel-related-titles-' + i);
				uri = this.getElement('panel-related-uris-' + i);
				category = this.getElement('panel-related-categories-' + i);

				title.setAttribute('value', (aSite.mediadate != '' ? '(' + aSite.mediadate + ') ' : '') + aSite.title);
				title.setAttribute('url', aSite.uri);
				title.setAttribute('type', aSite.type + '-' + aSite.cool);
				title.setAttribute('tooltiptext', tooltiptext);

				uri.setAttribute('value', this.removeSchema(urlPretty));
				uri.setAttribute('url', aSite.uri);
				uri.setAttribute('type', aSite.type + '-' + aSite.cool);
				uri.setAttribute('tooltiptext', tooltiptext);

				category.setAttribute('value', this.categoryAbbreviate(aSite.category));
				category.setAttribute('category', aSite.category);
				category.setAttribute('type', aSite.type + '-' + aSite.cool);
				category.setAttribute('tooltiptext', tooltiptext);

				title.removeAttribute('hidden');
				uri.removeAttribute('hidden');
				category.removeAttribute('hidden');

				if (i == aSelected)
					this.panelInformativeRelatedWriteSelectedSite(aSelected);
			}
			//hidding all empty or old data
			for (; i < 32; i++) {
				this.getElement('panel-related-titles-' + i).setAttribute('hidden', true);
				this.getElement('panel-related-uris-' + i).setAttribute('hidden', true);
				this.getElement('panel-related-categories-' + i).setAttribute('hidden', true);
			}
		}
	}

	return null;

}).apply(ODPExtension);
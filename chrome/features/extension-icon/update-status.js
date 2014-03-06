(function () {

	//updates the icon of the extension
	this.addListener('onLocationChangeNotDocumentLoad', function (aLocation) {
		ODPExtension.extensionIconUpdateStatus();
	});

	var tooltip, extensionIcon, urlbar
		this.addListener('userInterfaceLoad', function () {
			tooltip = ODPExtension.getElement('extension-icon-tooltip-data');
			extensionIcon = ODPExtension.getElement('extension-icon');
			urlbar = ODPExtension.getBrowserElement('urlbar');
		});

	//update the status of the icon

	this.extensionIconUpdateStatus = function () {
		this.removeChilds(tooltip);
		var label = this.create('label');

		if (this.preferenceGet('ui.informative.panel.urlbar') && urlbar)
			urlbar.setAttribute('odp', this.listingInformation);
		else
			urlbar.removeAttribute('odp');


		if (!this.preferenceGet('enabled')) {
			extensionIcon.setAttribute('status', 'disabled');
			label.setAttribute('value', this.getString('disabled'));
		} else {
			var status = 'nada';

			if (this.cantLeakURL(this.focusedURL)) {

				status = 'private';
				label.setAttribute('value', this.getString('private.url'));

			} else if (this.listingInformation != '') {
				status = this.listingInformation;
				if (status == 'error')
					label.setAttribute('value', this.getString('bad.response.from.data.server'));
				else {
					if (this.focusedCategory != '')
						label.setAttribute('value', this.categoryAbbreviate(this.focusedCategory));
					else
						label.setAttribute('value', this.listingInformationURL);
				}

			} else {

				if (this.focusedCategory != '')
					label.setAttribute('value', this.categoryAbbreviate(this.focusedCategory));
				else
					label.setAttribute('value', this.decodeUTF8Recursive(this.focusedURL));
			}

			if (this.documentHasFrameSet()) {
				status = status + '-frameset';
				var labelFrameSet = this.create('label');
				labelFrameSet.setAttribute('value', this.getString('document.under.frameset'));
				tooltip.appendChild(labelFrameSet);
			}

			extensionIcon.setAttribute('status', status);
		}
		tooltip.appendChild(label);
	}
	return null;

}).apply(ODPExtension);
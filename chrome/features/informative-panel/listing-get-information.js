(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//informative popup
	//updates the content when switching tabs
	this.addListener('onLocationChange', function() {
		ODPExtension.listingGetInformation(ODPExtension.focusedURL);
	});

	this.listingGetInformation = function(aLocation, aClick) {
		if (this.preferenceGet('privacy.listing.method.none') || !this.preferenceGet('enabled')) //listing check disabled
		{
			this.listingInformation = '';
			this.getElement('panel').hidePopup();
			this.extensionIconUpdateStatus();
			return;
		} else if (
			this.preferenceGet('advanced.urls.rdf') == '' ||
			this.preferenceGet('advanced.urls.rdf').indexOf('http') == -1 ||
			this.preferenceGet('advanced.urls.rdf').indexOf('{URL}') == -1) //there is a valiod RDF url?
		{
			this.listingInformation = 'error';
			this.getElement('panel').hidePopup();
			this.extensionIconUpdateStatus();
			return;
		} else if (this.cantLeakURL(aLocation)) //private URI
		{
			this.listingInformation = '';
			this.getElement('panel').hidePopup();
			this.extensionIconUpdateStatus();
			return;
		} else if (this.preferenceGet('privacy.listing.when.click') && !aClick) //waiting for a click to load
		{
			this.listingInformation = '';
			this.getElement('panel').hidePopup();
			this.extensionIconUpdateStatus();
			return
		} else if (this.preferenceGet('privacy.listing.method.domain'))
			aLocation = this.anonymize(this.getSubdomainFromURL(aLocation)); //only subdomain
		else
			aLocation = this.anonymize(aLocation); //every url


		//update the icon status
		this.listingInformationURL = this.decodeUTF8Recursive(aLocation);
		this.listingInformation = 'loading';
		this.extensionIconUpdateStatus();

		//check if this domain has little listing, if yes the results are cached by domain then don't do the request and show the cached data.
		var hash = this.sha256(this.getDomainFromURL(aLocation));
		var cachedFile = 'cached.request/listings.information/domain.few.listings/' + hash[0] + '/' + hash[1] + '/' + hash + '.txt';
		if (this.fileExists(cachedFile)) {
			this.listingGetInformationLoaded(this.fileRead(cachedFile), aLocation);
		} else {
			//get the information
			this.readURL(
				this.preferenceGet('advanced.urls.rdf').replace('{URL}', this.encodeUTF8(this.removeSchema(aLocation))),
				'listings.information/responses/',
				null,
				null, function() {
				ODPExtension.listingGetInformationLoaded(arguments[0], arguments[1]);
			},
				aLocation); //variable num of arguments
		}
	}

	this.listingGetInformationLoaded = function(aData, aLocation) {
		//check if the retreived data is for this focused tab
		var shouldLoad = false;
		if (this.preferenceGet('privacy.listing.method.domain') && aLocation == this.anonymize(this.getSubdomainFromURL(this.focusedURL)))
			shouldLoad = true;
		else if (aLocation == this.anonymize(this.focusedURL))
			shouldLoad = true;

		//if the request come from the focused location, rebuild the popup
		if (shouldLoad) {
			//if there is a need to remove the www
			var focusedLocationWWW = this.decodeUTF8Recursive(this.removeSchema(this.shortURL(this.focusedURL).replace(/\/+$/, ''))).toLowerCase();
			var focusedLocationNoWWW = this.removeWWW(this.focusedURL);
			var focusedLocationDomain = this.focusedDomain;
			var focusedLocationSubdomain = this.focusedSubdomain;

			//validate the response of the data server
			aData = this.trim(aData);
			if (aData == '') //if data is zero fail silenty
			{
				this.listingInformation = 'nada';
				this.extensionIconUpdateStatus();
				this.getElement('panel').hidePopup();
				return;
			} else if (aData.split('\n')[1].indexOf('NO listings') === 0) {
				this.listingInformation = 'nada';
				this.extensionIconUpdateStatus();
				this.getElement('panel').hidePopup();
				return;
			} else if (aData.indexOf('<!-- Generated at') === 0) {
				this.listingInformation = 'loading';
				this.extensionIconUpdateStatus();
			} else {
				this.listingInformation = 'error';
				this.extensionIconUpdateStatus();
				this.getElement('panel').hidePopup();
				return;
				//invalid response from data server
			}

			//check if we need to cache this data
			if (this.subStrCount(aData, '\n') < 30) {
				var hash = this.sha256(this.getDomainFromURL(aLocation));
				var cachedFile = 'cached.request/listings.information/domain.few.listings/' + hash[0] + '/' + hash[1] + '/' + hash + '.txt';
				if (!this.fileExists(cachedFile))
					this.fileWrite(cachedFile, aData);
			}

			//parsing the site data
			var siteData = this.trim(aData).split('\n');

			/*cache validation*/

			//check if the cached should be cleaned, when the godzuki data is updated
			var generatedAt = siteData[0].replace(/.*([0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]).*/, "$1");

			//if there "generated at" change then there is a new data, clean the cached data
			if (this.preferenceGet('last.rdf.update') != generatedAt) {
				this.fileRemove('cached.request/');
				this.preferenceSet('last.rdf.update', generatedAt);
			}

			/* resutls comparation to see if the URI is listed*/
			var listed_same_uri = -1;
			var listed_domain_uri = -1;
			var listed_other_uri = -1;
			var aSelected = -1;
			//this.dump(siteData);

			//normalizing
			var aData = [],
				site;
			//the first line is the meta data <!-- generated at -->
			for (var i = 1, counter = 0; i < siteData.length; i++, counter++) {
				site = siteData[i].split('\t');
				aData[counter] = {}
				aData[counter].url = site[1];
				aData[counter].title = site[2];
				aData[counter].description = site[3];
				aData[counter].category = site[0];
				aData[counter].type = (site[5] || '');
				aData[counter].cool = (site[4] || '');
				aData[counter].mediadate = (site[6] || '');
			}
			this.listingInformationData = aData;
			//	this.dump(aData);
			//looking for the most close url (wichi is already served by godzuki)
			for (var i = 0; i < aData.length; i++) {
				var siteURLWWW = this.decodeUTF8Recursive(this.removeSchema(this.shortURL(aData[i].url).replace(/\/+$/, ''))).toLowerCase();
				var siteURLNoWWW = this.removeWWW(siteURLWWW);

				/*SITE INFO*/

				if (
					siteURLWWW == focusedLocationWWW ||
					siteURLNoWWW == focusedLocationNoWWW ||
					siteURLWWW == focusedLocationNoWWW ||
					siteURLNoWWW == focusedLocationWWW) {
					listed_same_uri = i;
					break;
				} else if (
					siteURLWWW == focusedLocationDomain ||
					siteURLNoWWW == focusedLocationDomain ||
					siteURLWWW == focusedLocationDomain ||
					siteURLNoWWW == focusedLocationSubdomain) {
					listed_domain_uri = i;
				} else {
					listed_other_uri = i;
				}
			}

			if (listed_same_uri > -1) {
				this.listingInformation = 'listed';
				aSelected = listed_same_uri;
			} else if (listed_domain_uri > -1) {
				this.listingInformation = 'listed-domain-uri';
				aSelected = listed_domain_uri;
			} else if (listed_other_uri > -1) {
				this.listingInformation = 'listed-other-uri';
				aSelected = listed_other_uri;
			}

			this.extensionIconUpdateStatus();

			this.getElement('panel-subcontainer').setAttribute('listed', this.listingInformation); //the border of the panel
			this.getElement('panel-header-title').setAttribute('listed', this.listingInformation); //the color of the header
			this.getElement('panel-move').setAttribute('listed', this.listingInformation); //the color of the move button
			this.getElement('panel-header-title').setAttribute('type', aData[aSelected].type + '-' + aData[aSelected].cool);

			this.panelInformationToggle(!this.preferenceGet('ui.informative.panel.closed'), false);

			if (this.preferenceGet('ui.informative.panel')) {
				this.panelInformationBuildHeader(aSelected);
				this.panelInformationBuildRelated(aSelected);

				if (this.preferenceGet('ui.informative.panel')) //the user maybe unchecked all the visual options
				{
					if (this.getElement('panel').state != 'open')
						this.getElement('panel').openPopup(this.getBrowserElement('main-window'), 'end_after', this.preferenceGet('ui.informative.panel.x'), this.preferenceGet('ui.informative.panel.y'), false);
				} else {
					this.getElement('panel').hidePopup();
				}
			} else {
				this.getElement('panel').hidePopup();
			}
		}
	}
	return null;

}).apply(ODPExtension);
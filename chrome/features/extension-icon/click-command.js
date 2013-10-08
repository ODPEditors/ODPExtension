(function() {

	//handle the posibles commands on the extension icon clicks

	this.extensionIconClickCommand = function(aCommand) {
		if (!this.preferenceGet('enabled') &&
			aCommand != 'extensionToggle' &&
			aCommand != 'openDContextMenu' &&
			aCommand != 'openPreferences')
			return;

		if (aCommand != 'openDContextMenu')
			this.getElement('extension-icon-context').hidePopup();

		switch (aCommand) {
			case 'copyLocation':
				{
					var aCategory = this.categoryGetFocused();
					var aLocation = this.focusedURL;

					if (aCategory != '')
						this.copyToClipboard(aCategory + '/');
					else if (aLocation != '')
						this.copyToClipboard(aLocation);

					break;
				}
			case 'copyLocationPHPBB':
				{
					var aCategory = this.categoryGetFocused();
					var aLocation = this.focusedURL;

					if (aCategory != '')
						this.copyToClipboard('[url=' + this.categoryGetURL(aCategory) + ']' + aCategory + '/[/url]');
					else if (aLocation != '')
						this.copyToClipboard('[url=' + aLocation + ']' + this.decodeUTF8Recursive(aLocation) + '[/url]');

					break;
				}
			case 'copyLocationHTML':
				{
					var aCategory = this.categoryGetFocused();
					var aLocation = this.focusedURL;

					if (aCategory != '')
						this.copyToClipboard('<a href="' + this.categoryGetURL(aCategory) + '">' + aCategory + '/</a>');
					else if (aLocation != '')
						this.copyToClipboard('<a href="' + aLocation + '">' + this.decodeUTF8Recursive(aLocation) + '</a>');

					break;
				}
			case 'domainSiteODP':
				{
					var aSubdomain = this.getSubdomainFromURL(this.focusedURL);

					if (aSubdomain != '')
						aSubdomain = this.removeWWW(aSubdomain);
					else
						aSubdomain = this.getSelectedTextOrPrompt(true, 'example.net');

					if (aSubdomain != '')
						this.tabOpenCheckForBehavior(this.odpSearchGetURL(aSubdomain), null, 'odp.search');

					break;
				}
			case 'domainSiteSE':
				{
					var aLocation = this.focusedURL;
					var urls = [
						'https://www.google.com/search?safe=off&q=site%3A{WWW_DOMAIN}'
						,'http://www.ewhois.com/{DOMAIN}/'
						,'http://www.bing.com/search?q=site%3A{WWW_DOMAIN}'
						//,'https://ahrefs.com/site-explorer/overview/subdomains/{WWW_DOMAIN}'
						,'http://www.opensiteexplorer.org/links.html?site={WWW_DOMAIN}'
					];

					var aEvent = {};
					aEvent.button = false;

					//fix for when there is many urls to open but the user has not checked open in new tab
					//if is no chekd the user will open all the urls in the same tab causing only the last one to be displayed
					if (urls.length > 1)
						aEvent.button = 1;
					for (var id in urls)
						this.tabOpenCheckForBehavior(this.URLToolsApply(urls[id], aLocation), aEvent, 'domain.site');

					break;
				}
			case 'highlightListings':
				{
					this.listingsHighlight();

					break;
				}
			case 'checkHTTPStatus':
				{
					this.linkChecker();
					break;
				}
			case 'openPreferences':
				{
					this.preferencesOpen();

					break;
				}
			case 'openDContextMenu':
				{
					this.getElement('extension-icon-context').openPopup(this.getElement('extension-icon'), 'after_end');
					break;
				}
			case 'extensionToggle':
				{
					this.extensionToggle();

					break;
				}
			default:
				{
					this.error('Extension Icon command not found : ' + aCommand);

					break;
				}
		}
	}

	return null;

}).apply(ODPExtension);
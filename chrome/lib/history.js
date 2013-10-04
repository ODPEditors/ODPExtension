(function() {
	this.faviconGetFromURL = function(aURL) {
		var faviconURI;

		try {
			faviconURI = this.service('fs').getFaviconForPage(this.newURI(aURL));
		} catch (e) {
			faviconURI = false;
		}

		if (faviconURI) {} else {
			try {
				faviconURI = this.service('fs').getFaviconForPage(this.getSchema(aURL) + '://' + this.getSubdomainFromURL(aURL) + '/');
			} catch (e) {
				faviconURI = false;
			}
		}
		if (faviconURI) {} else {
			try {
				var dataURL = this.service('fs').getFaviconDataAsDataURL(faviconURI);
				if (dataURL) {
					if (dataURL == '')
						return this._faviconGetFromURL(aURL);
					else
						return dataURL;
				}
			} catch (e) {
				return this._faviconGetFromURL(aURL);
			}
		}
		return faviconURI;
	}
	this._faviconGetFromURL = function(aURL) {
		aURL = this.anonymize(aURL);
		if (this.cantLeakURL(aURL))
			return 'chrome://ODPExtension/content/lib/history/faviconGetFromURL/icon.png';
		else
			return 'https://plus.google.com/_/favicon?domain=' + this.encodeUTF8(aURL);
	}
	this.isVisitedURL = function(aURL) {
		try {
			return this.service('hsgh2').isVisited(this.newURI(aURL));
		} catch (e) {
			return false;
		}
	}

	this.removeURLFromBrowserHistory = function(aURL) {
		this.service('bh').removePages([this.newURI(aURL)], 1, false);
	}

	return null;

}).apply(ODPExtension);
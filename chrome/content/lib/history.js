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
		if (faviconURI) {
			try {
				var dataURL = this.service('fs').getFaviconDataAsDataURL(faviconURI);
				if (dataURL) {
					if (dataURL == '')
						return 'chrome://ODPExtension/content/lib/history/faviconGetFromURL/icon.png';
					else
						return dataURL;
				}
			} catch (e) {
				return 'chrome://ODPExtension/content/lib/history/faviconGetFromURL/icon.png';
			}
		}
		return 'chrome://ODPExtension/content/lib/history/faviconGetFromURL/icon.png';
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
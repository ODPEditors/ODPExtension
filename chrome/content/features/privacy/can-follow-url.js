(function() {

	//returns true if the URL is followable (ie: can be read by a link cheker)
	this.canFollowURL = function(aURL, focusedURL) {
		if (!this.isPublicURL(aURL)) {
			//this.dump('Is not public', true);
			return false;
		}

		var aSubdomain = this.getSubdomainFromURL(aURL);

		//excluded.domains
		for (var id in this.shared.privacy.excluded.domains) {
			if (this.match(aSubdomain, '^' + this.shared.privacy.excluded.domains[id] + '$')) {
				//this.dump('user domain found:'+this.shared.privacy.excluded.domains[id]+' in '+aSubdomain, true);
				return false;
			}
		}

		//excluded.odp.subdomains
		for (var id in this.shared.privacy.odp.subdomains) {
			if (aSubdomain == this.shared.privacy.odp.subdomains[id]) {
				//this.dump('excluded.odp.subdomains found:'+this.shared.privacy.excluded.domains[id]+' in '+aDomain, true);
				return false;
			}
		}

		var aDomain = this.getDomainFromURL(aURL);
		//excluded.odp.domains
		for (var id in this.shared.privacy.odp.domains) {
			if (aDomain == this.shared.privacy.odp.domains[id]) {
				//this.dump('excluded.odp.domains found:'+this.shared.privacy.excluded.domains[id]+' in '+aDomain, true);
				return false;
			}
		}

		//just in case
		//urls with the string log something
		if (
			aURL.indexOf('logout') != -1 ||
			aURL.indexOf('logoff') != -1)
			return false;

		//in link non-sense
		if (!focusedURL) {} else {
			if (false || focusedURL.indexOf('.domaintools.com') != -1 && aURL.indexOf('.domaintools.com') != -1 || focusedURL.indexOf('.google.') != -1 && (aURL.indexOf('.google.') != -1 || aURL.indexOf('cache:') != -1 || aURL.indexOf('related:') != -1 || aURL.indexOf('site:') != -1) || focusedURL.indexOf('.yahoo.') != -1 && aURL.indexOf('.yahoo.') != -1 || focusedURL.indexOf('.bing.') != -1 && aURL.indexOf('.bing.') != -1)
				return false;
		}

		//we are safe!
		return true;
	}
	return null;

}).apply(ODPExtension);
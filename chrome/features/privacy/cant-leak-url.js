(function() {

	//returns true if the URL is private based on user configuration
	this.cantLeakURL = function(aURL) {
		if (!this.isPublicURL(aURL)) {
			//this.dump('Is not public', true);
			return true;
		}

		//https check
		if (this.preferenceGet('privacy.queries.exclude.https') && this.getSchema(aURL) == 'https://') {
			//this.dump('NO https!!', true);
			return true;
		}

		var aSubdomain = this.getSubdomainFromURL(aURL);

		//ip adress check
		if (this.preferenceGet('privacy.queries.exclude.ips') && this.isIPAddress(aSubdomain)) {
			//this.dump('NO ips!', true);
			return true;
		}

		//excluded.domains
		for (var id in this.shared.privacy.excluded.domains) {
			if (this.match(aSubdomain, '^' + this.shared.privacy.excluded.domains[id] + '$')) {
				//this.dump('user domain found:'+this.shared.privacy.excluded.domains[id]+' in '+aSubdomain, true);
				return true;
			}
		}

		//excluded.odp.subdomains
		for (var id in this.shared.privacy.odp.subdomains) {
			if (aSubdomain == this.shared.privacy.odp.subdomains[id]) {
				//this.dump('excluded.odp.subdomains found:'+this.shared.privacy.excluded.domains[id]+' in '+aDomain, true);
				return true;
			}
		}

		var aDomain = this.getDomainFromURL(aURL);
		//excluded.odp.domains
		for (var id in this.shared.privacy.odp.domains) {
			if (aDomain == this.shared.privacy.odp.domains[id]) {
				//this.dump('excluded.odp.domains found:'+this.shared.privacy.excluded.domains[id]+' in '+aDomain, true);
				return true;
			}
		}

		//excluded.strings
		aURL = this.decodeUTF8Recursive(aURL.toLowerCase());

		for (var id in this.shared.privacy.excluded.strings) {
			if (this.shared.privacy.excluded.strings[id] != '' && aURL.indexOf(this.shared.privacy.excluded.strings[id]) != -1) {
				//this.dump('user string found:'+this.shared.privacy.excluded.strings[id], true);
				return true;
			}
		}

		//just in case
		//urls with the string log something and pass for passwords are considerated private
		if (
			aURL.indexOf('logout') != -1 ||
			aURL.indexOf('logoff') != -1)
			return true;

		//we are safe!
		return false;
	}
	return null;

}).apply(ODPExtension);
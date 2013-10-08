(function() {

	this.addListener('preferencesLoadGlobal', function() {

		ODPExtension.shared.privacy.odp.noReferrer = [
				'dmoz.org/editors/', 'forums.dmoz.org/', 'research.dmoz.org/', 'passport.dmoz.org/', 'odp.danielmclean.id.au/', 'odp.dlugan.com/', 'odp.jtlabs.net/', 'odp.tubert.org/', 'pmoz.info/', 'robert.mathmos.net/odp/', 'rpfuller.com/', 'rpfuller.org/', 'godzuki.com.uy/mimizu/'
		];
		//privacy
		ODPExtension.shared.privacy.noReferrer = ODPExtension.trim(ODPExtension.preferenceGet('advanced.urls.odp.private.no.referrer').replace(/,/g, '\n')).split('\n');
		for (var id in ODPExtension.shared.privacy.odp.noReferrer)
			ODPExtension.shared.privacy.noReferrer.push('^[a-z]+\\:/+([^/]+)?\\.?' + (ODPExtension.shared.privacy.odp.noReferrer[id].replace(/\./g, '\\.')))
		ODPExtension.shared.privacy.noReferrer = ODPExtension.arrayUnique(ODPExtension.shared.privacy.noReferrer);

	});

	this.addListener('userInterfaceUpdate', function() {
		//no referrer
		if (ODPExtension.preferenceGet('privacy.no.referrer'))
			ODPExtension.startComplexListener('onModifyRequest');
		else
			ODPExtension.stopComplexListener('onModifyRequest');
	});

	//referrer modification
	this.addListener('onModifyRequest', function(aSubject) {
		ODPExtension.privacyRemoveReferrer(aSubject)
	});

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//removes the referrer from private ODP domains

	this.privacyRemoveReferrer = function(aSubject) {
		//this.dump('privacyRemoveReferrer', debugingThisFile);
		if (aSubject.referrer) {
			//the referrer
			var aReferrerURI = this.decodeUTF8Recursive(this.string(aSubject.referrer.spec));

			//for each private ODP domain

			for (var id in this.shared.privacy.noReferrer) {
				//if from this url we can't send any reffer
				if (this.match(aReferrerURI, this.shared.privacy.noReferrer[id])) {
					//not like the others this sets as refferer the URL that we will open
					//this.dump('privacyRemoveReferrer:this.privacyRemoveReferrerURLs[id]'+this.shared.privacy.noReferrer[id], debugingThisFile);

					//if is a redirection send as reffer the redirection
					if (aSubject.URI && aSubject.URI.asciiSpec && aSubject.URI.asciiSpec != aSubject.originalURI.asciiSpec)
						aSubject.setRequestHeader('Referer', aSubject.URI.asciiSpec, false);
					else
						aSubject.setRequestHeader('Referer', aSubject.originalURI.asciiSpec, false);
					break;
				}
			}
		}
	};

	return null;

}).apply(ODPExtension);
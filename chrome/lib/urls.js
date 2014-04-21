(function () {
	//gets the current focused location by looking at the location of the document
	this.focusedLocation = function () {
		var aLocation = this.documentFocusedGetLocation();

		if (aLocation != '')
			return aLocation;
		else
			return '';
	}
	//gets the current focused location by looking at the value of the URLBar, if is not valid will look into the location of the document
	this.focusedLocationBarURL = function () {
		var aLocation = '';

		//if the URLBar is there...
		if (this.getBrowserElement('urlbar')) {
			aLocation = this.string(this.getBrowserElement('urlbar').value);

			//the urlbar can contain any typed data, try to see if this is an url
			if (aLocation.indexOf('.') != -1) {
				//sometimes the autocomplete feature miss the protocol
				if (/^[a-z]+\:\/+/i.test(aLocation)) {} else
					aLocation = 'http://' + aLocation;

				//if the url don't have a slash after the domain name then do not use it
				if (/^[a-z]+\:\/+[^\/]+$/i.test(aLocation))
					aLocation = '';

				//the url bar contains the data in a "pretty" not usable format
				//aLocation = this.encodeURI(aLocation);
			} else {
				aLocation = '';
			}
		}

		if (aLocation != '')
			return this.IDNDecodeURL(aLocation);
		else
			aLocation = this.documentFocusedGetLocation();

		if (aLocation != '')
			return aLocation;
		else
			return '';
	}
	//gets the domain from an URL
	var getDomainFromURLRegExp = /(aero|arpa|asia|biz|cat|co|com|coop|edu|gb|gob|gouv|gov|gub|gv|info|int|jobs|mil|mobi|museum|name|ne|net|org|post|pro|tel|travel)\.(ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bl|bm|bn|bo|bq|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cw|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mf|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|cat|yu|za|zm|zw|мон|рф|срб|укр|қаз|الاردن|الجزائر|السعودية|المغرب|امارات|ایران|بھارت|تونس|سودان|سورية|عمان|فلسطين|قطر|مصر|مليسيا|پاکستان|भारत|বাংলা|ভারত|ਭਾਰਤ|ભારત|இந்தியா|இலங்கை|சிங்கப்பூர்|భారత్|ලංකා|ไทย|გე|中国|中國|台湾|台灣|新加坡|香港|한국)$/i;
	var getDomainFromURLRegExp1 = /.*\.([^\.]+\.[^\.]+\.[^\.]+)$/;
	var getDomainFromURLRegExp2 = /.*\.([^\.]+\.[^\.]+)$/;

	this.getDomainFromURL = function (aURL) {
		if (!aURL)
			return '';
		//http://www.iana.org/domains/root/db/ - iana root zone database
		var aSubdomainOrDomainOrIP = this.removeWWW(this.getSubdomainFromURL(aURL));
		if (this.isIPAddress(aSubdomainOrDomainOrIP))
			return aSubdomainOrDomainOrIP;
		var nodes = this.subStrCount(aSubdomainOrDomainOrIP, '.');
		if (nodes == 1)
			return aSubdomainOrDomainOrIP;
		else if (nodes == 2 && getDomainFromURLRegExp.test(aSubdomainOrDomainOrIP))
			return aSubdomainOrDomainOrIP;
		else if (nodes >= 3 && getDomainFromURLRegExp.test(aSubdomainOrDomainOrIP))
			return aSubdomainOrDomainOrIP.replace(getDomainFromURLRegExp1, "$1");
		else
			return aSubdomainOrDomainOrIP.replace(getDomainFromURLRegExp2, "$1");
	}
	//returns the IP of a host name
	this.getIPFromDomain = function (aDomain, noCache) {
		var IP = '';
		try {
			var DNS = this.service('dns');
			if (!noCache)
				var nsRecord = DNS.resolve(aDomain, false);
			else
				var nsRecord = DNS.resolve(aDomain, Components.interfaces.nsIDNSService.RESOLVE_BYPASS_CACHE);

			while (nsRecord.hasMore()) {
				IP = nsRecord.getNextAddrAsString();
				this.dispatchEvent('IPResolved', aDomain, IP)
				return IP;
			}
		} catch (e) {}

		return IP;
	}

	this.getIPFromDomainAsync = function (aDomain, aFunction) {
		try {
			var DNS = this.service('dns');
			var thread;
			if (Components.classes['@mozilla.org/event-queue-service;1']) {
				const EQS = Components.classes['@mozilla.org/event-queue-service;1'].getService(Components.interfaces.nsIEventQueueService);
				thread = EQS.getSpecialEventQueue(EQS.CURRENT_THREAD_EVENT_QUEUE);
			} else {
				thread = Components.classes['@mozilla.org/thread-manager;1'].getService().mainThread;
			}
			DNS.asyncResolve(aDomain, null, {
				onLookupComplete: function (aRequest, aRecord, aStatus) {
					while (aRecord && aRecord.hasMore()) {
						var ip = aRecord.getNextAddrAsString()
						ODPExtension.dispatchEvent('IPResolved', aDomain, ip)
						aFunction(ip)
						return null
					}
					aFunction('')
				}
			}, thread);

		} catch (e) {
			aFunction('')
		}
	}

	this.getDNSFromURL = function (aURL) {
		var aDomain = this.getDomainFromURL(aURL)
		var aData = {
			ips: [],
			hosts: []
		};
		try {
			var nsRecord = this.service('dns').resolve(aDomain, Components.interfaces.nsIDNSService.RESOLVE_CANONICAL_NAME);
			while (nsRecord.hasMore()) {
				aData.ips.push(nsRecord.getNextAddrAsString());
				aData.hosts.push(nsRecord.canonicalName);
			}
		} catch (e) {}

		return aData;
	}

	//gets the schema of a URL
	var getSchemaRegExp = /^([^\:]+):.*$/;
	this.getSchema = function (aURL) {
		if (!aURL)
			return '';
		return aURL.replace(getSchemaRegExp, "$1").toLowerCase() + '://';
	}
	//gets the subdomain from an URL
	var getSubdomainFromURLRegExp = /^[^\:]+\:\/+([^(\/|\?)]+)[\/|\?]?.*$/;
	this.getSubdomainFromURL = function (aURL) {
		if (!aURL)
			return '';
		//checks if contains the final /, if not it is added
		/*		if (aURL.indexOf('://') != -1 && this.subStrCount(aURL, '/') == 2)
			aURL = aURL + '/';*/
		return this.removePort(aURL.replace(getSubdomainFromURLRegExp, "$1")).toLowerCase();
	}
	//shots a url for showing in a label
	this.getURLForLabel = function (aURL) {
		aURL = this.removeWWW(this.removeSchema(aURL));
		if (aURL.length > 22)
			return aURL.substr(0, 22) + '…';
		else
			return aURL;
	}
	//returns true if the aURLorDomain is garbage
	this.isGarbage = function (aURLorDomain) {
		if (aURLorDomain.indexOf(':') != -1 || aURLorDomain.indexOf('/') != -1)
			return this.isGarbageURL(aURLorDomain);
		else if (this.isGarbageSubdomain(aURLorDomain) || this.isGarbageDomain(aURLorDomain))
			return true;
		else
			return false;
	}
	//returns true if the aDomain is garbage
	this.isGarbageDomain = function (aDomain) {
		switch (aDomain) {
			case 'googlesyndication.com':
			//case 'google-analytics.com':
			case 'doubleclick.net':
			case 'gstatic.com':
			case 'fbcdn.net':
			case 'googleadservices.com':
			case 'sharethis.com':
			case 'scorecardresearch.com':
			case 'adnxs.com':
				return true;
			default:
				return false;
		}
	}
	//returns true if the aSubdomain is garbage
	this.isGarbageSubdomain = function (aSubdomain) {
		switch (aSubdomain) {
			case 'googleads.g.doubleclick.net':
			case 'pagead2.googlesyndication.com':

			case 'plus.google.com':
			case 'apis.google.com':
			case 'adwords.google.com':
			case 'services.google.com':
			//case 'accounts.google.com':
			case 'fonts.googleapis.com':
			case 'maps.google.com':
			case 'maps.googleapis.com':
			case 'partner.googleadservices.com':

			case 'connect.facebook.com':
			case 'connect.facebook.net':
			case 'api.facebook.com':
			case 'static.ak.facebook.com':
			case 's-static.ak.facebook.com':

			case 'advertising.microsoft.com':
			case 'api.tweetmeme.com':
			case 'a.disquscdn.com':
			case 'mediacdn.disqus.com':
			case 'assets.tumblr.com':
				return true;
			default:
				return false;
		}
	}
	//returns true if the URL is garbage
	this.isGarbageURL = function (aURL) {
		if (
			this.isGarbageSubdomain(this.getSubdomainFromURL(aURL)) ||
			this.isGarbageDomain(this.getDomainFromURL(aURL)) ||
			aURL.indexOf('http://www.google.com/url?') === 0 ||
			aURL.indexOf('https://www.google.com/url?') === 0 ||
			aURL.indexOf('https://maps.google.') === 0 ||
			aURL.indexOf('http://maps.google.') === 0 ||
			aURL.indexOf('https://www.google.com/ads') === 0 ||
			aURL.indexOf('http://www.google.com/ads') === 0 ||
			aURL.indexOf('https://www.facebook.com/connect') === 0 ||
			aURL.indexOf('http://analytics.') === 0 ||
			aURL.indexOf('http://ad.') === 0 ||
			aURL.indexOf('http://ads.') === 0 ||
			aURL.indexOf('https://analytics.') === 0 ||
			aURL.indexOf('https://ad.') === 0 ||
			aURL.indexOf('https://ads.') === 0 ||
			aURL.indexOf('tweetmeme.com/button') != -1 ||
			aURL.indexOf('youtube.com/embed') != -1 ||
			aURL.indexOf('facebook.com/plugins') != -1 ||
			aURL.indexOf('facebook.com/widgets') != -1 ||
			aURL.indexOf('ads.') != -1 ||
			aURL.indexOf('.ads') != -1 ||
			aURL.indexOf('.adver') != -1 ||
			aURL.indexOf('facebook.com/xd_') != -1 ||
			aURL.indexOf('addthis.com/static') != -1 ||
			aURL.indexOf('.twitter.com/widgets') != -1 ||
			aURL.indexOf('.amazon.com/widgets') != -1 ||
			aURL.indexOf('gmodules.com/gadgets') != -1

		)
			return true;
		else
			return false;
	}
	// when searching for site replacements, many wikipedia, facebook and other results may popup in search results.
	//this list just remove noise.
	var noise = [''
		,'adobe.com'
		,'addthis.com'
		,'aol.com'
		,'archive.is'
		,'ask.com'
		,'bing.com'
		,'blogger.com'
		,'creativecommons.org'
		,'espanoworld.com'
		,'facebook.com'
		,'feedburner.com'
		,'flickr.com'
		,'gigablast.com'
		,'google.com'
		,'google.es'
		,'google.de'
		,'infoguia.net'
		,'linkedin.com'
		,'melodysoft.com'
		,'pinterest.com'
		,'slideshare.net'
		,'tripadvisor.es'
		,'twitter.com'
		,'univision.com'
		,'w3.org'
		,'w3schools.com'
		,'wikipedia.org'
		,'yahoo.com'
		,'yippy.com'
		,'youtube.com'
		,'zopim.com'
		,'vimeo.com'
		,'foursquare.com'
		,'instagram.com'
		,'myspace.com',
		,'tripadvisor.com'
	]
	this.isNoiseURL = function (aURL) {
		return noise.indexOf(this.getDomainFromURL(aURL)) != -1
	}
	this.isNoiseDomain = function (aDomain) {
		return noise.indexOf(aDomain) != -1
	}
	//return true if the domain name is a ip address
	var isIPAddressRegExp = /^([0-9]|\.)+$/;
	this.isIPAddress = function (aDomain) {
		if (isIPAddressRegExp.test(aDomain))
			return true;
		else
			return false;
	}
	//return true if the ip address is private
	this.isIPAddressPrivate = function (aIP) {
		/*
			checking private ranges - thanks to callimachus
			The private IP blocks as documented in RFC 1918 and RFC 3330:
				1 - 10.0.0.0 - 10.255.255.255
				2 - 127.0.0.0 - 127.255.255.255
				3 - 172.16.0.0 - 172.31.255.255
				4 - 169.254.0.0 - 169.254.255.255
				5 - 192.168.0.0 - 192.168.255.255
		*/
		var nodos = aIP.split('.');
		if (nodos.length == 4) {
			/* checking ranges 1,2,5,4' */
			if (nodos[0] == '10' || nodos[0] == '127' || nodos[0] + '.' + nodos[1] == '192.168' || nodos[0] + '.' + nodos[1] == '169.254')
				return true;
			/* checking ranges 3 */
			if ((nodos[0] == '172') && (nodos[1] >= 16 && nodos[1] <= 31))
				return true;
		}
		return false;
	}
	//returns true if the URL is public accesible (maybe)
	var isPublicURLRegExp = /^([a-z]|[0-9]|@|\:)+$/i;
	this.isPublicURL = function (aURL) {
		var schema = this.getSchema(aURL);
		if (schema != 'http://' && schema != 'https://' && schema != 'ftp://' && schema != 'gopher://')
			return false;

		var aDomain = this.getSubdomainFromURL(aURL);

		if (this.isIPAddress(aDomain) && this.isIPAddressPrivate(aDomain))
			return false

		if (isPublicURLRegExp.test(aDomain))
			return false;

		return true;
	}
	//returns true if the URI is safe to use
	this.isSecureURI = function (aURI) {
		aURI = this.string(aURI).toLowerCase();

		if (
			aURI.indexOf('http://') === 0 ||
			aURI.indexOf('https://') === 0 ||
			aURI.indexOf('ftp://') === 0 ||
			aURI.indexOf('feed:') === 0 ||
			aURI.indexOf('gopher:') === 0) {
			return true;
		} else {
			this.error(' The URI "' + aURI + '" can\'t be opened, looks like a non secure URI for use within this extension');
			return false;
		}
	}
	//returns a URI from an URL
	this.newURI = function (aURL) {
		return this.service('ios').newURI(aURL, null, null);
	}
	//open an external URI - mailto: for example
	this.openURI = function (aURL, isSecure) {
		//security
		if ((aURL.toLowerCase()).indexOf('chrome:') === 0 && !isSecure) {
			this.error(' chrome:// URLs can\'t be opened with openURI ');
			return;
		} else if ((aURL.toLowerCase()).indexOf('javascript:') === 0 && !isSecure) {
			this.error(' javascript:// URLs can\'t be opened with openURI ');
			return;
		}
		(function (aURL) {
			var ios = Components.classes["@mozilla.org/network/io-service;1"]
				.getService(Components.interfaces.nsIIOService);
			var uri = ios.newURI(aURL, null, null);

			var protocolSvc = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"]
				.getService(Components.interfaces.nsIExternalProtocolService);

			if (!protocolSvc.isExposedProtocol(uri.scheme)) {
				// If we're not a browser, use the external protocol service to load the URI.
				protocolSvc.loadUrl(uri);
			} else {
				var loadgroup = Components.classes["@mozilla.org/network/load-group;1"]
					.createInstance(Components.interfaces.nsILoadGroup);
				var appstartup = Components.classes["@mozilla.org/toolkit/app-startup;1"]
					.getService(Components.interfaces.nsIAppStartup);

				var loadListener = {
					onStartRequest: function ll_start(aRequest, aContext) {
						appstartup.enterLastWindowClosingSurvivalArea();
					},
					onStopRequest: function ll_stop(aRequest, aContext, aStatusCode) {
						appstartup.exitLastWindowClosingSurvivalArea();
					},
					QueryInterface: function ll_QI(iid) {
						if (iid.equals(Components.interfaces.nsISupports) ||
							iid.equals(Components.interfaces.nsIRequestObserver) ||
							iid.equals(Components.interfaces.nsISupportsWeakReference))
							return this;
						throw Components.results.NS_ERROR_NO_INTERFACE;
					}
				}
				loadgroup.groupObserver = loadListener;

				var uriListener = {
					onStartURIOpen: function (uri) {
						return false;
					},
					doContent: function (ctype, preferred, request, handler) {
						return false;
					},
					isPreferred: function (ctype, desired) {
						return false;
					},
					canHandleContent: function (ctype, preferred, desired) {
						return false;
					},
					loadCookie: null,
					parentContentListener: null,
					getInterface: function (iid) {
						if (iid.equals(Components.interfaces.nsIURIContentListener))
							return this;
						if (iid.equals(Components.interfaces.nsILoadGroup))
							return loadgroup;
						throw Components.results.NS_ERROR_NO_INTERFACE;
					}
				}

				var channel = ios.newChannelFromURI(uri);
				var uriLoader = Components.classes["@mozilla.org/uriloader;1"]
					.getService(Components.interfaces.nsIURILoader);
				uriLoader.openURI(channel, true, uriListener);
			}
		})(aURL);
	}
	//opens a an URL that is already encoded example:http://www.dmoz.org/World/Espa%C3%B1ol/
	//if allowed and selected: in a sub browser of split browser extension, at the desired position
	//else in a normal tab, selected or not
	this.openURL = function (aURL, inNewTab, inNewWindow, giveFocus, aPostData, byPassSecure) {
		//security
		if (this.isSecureURI(aURL) || byPassSecure) {
			if (inNewWindow && !inNewTab) //err! this is not fun!
			{
				if (!aPostData)
					window.open(aURL);
				else {
					if (this.isSeaMonkey())
						window.openDialog('chrome://navigator/content', '_blank', 'all,dialog=no', aURL, null, null, this.postData(aPostData));
					else
						window.openDialog('chrome://browser/content', '_blank', 'all,dialog=no', aURL, null, null, this.postData(aPostData));
				}
			} else {
				// open a normal tab
				if (inNewTab && this.documentFocusedGetLocation().indexOf('about:') !== 0)
					this.tabOpen(aURL, giveFocus, aPostData);
				else
					gBrowser.loadURIWithFlags(aURL, null, null, null, this.postData(aPostData))
			}
		}
	}
	//returns .. post data in a what???
	this.postData = function (dataString) {
		if (!dataString)
			return null;
		// POST method requests must wrap the encoded text in a MIME
		// stream
		var stringStream = Components.classes["@mozilla.org/io/string-input-stream;1"].
		createInstance(Components.interfaces.nsIStringInputStream);
		if ("data" in stringStream) // Gecko 1.9 or newer
			stringStream.data = dataString;
		else // 1.8 or older
			stringStream.setData(dataString, dataString.length);

		var postData = Components.classes["@mozilla.org/network/mime-input-stream;1"].
		createInstance(Components.interfaces.nsIMIMEInputStream);
		postData.addHeader("Content-Type", "application/x-www-form-urlencoded");
		postData.addContentLength = true;
		postData.setData(stringStream);

		// postData is ready to be used as aPostData argument
		return postData;
	}
	this.readURLAsync = function (aURL) {
		var Requester = new XMLHttpRequest();
		Requester.overrideMimeType('text/plain');
		Requester.open("GET", aURL, false);
		Requester.send(null);
		return Requester.responseText;
	}
	this.readURLDeleteCache = function (aURL, aCacheID) {
		//builds the cache ID
		var hash = this.sha256(aURL);
		var cachedFile = 'cached.request/' + aCacheID + '/' + hash[0] + '/' + hash[1] + '/' + hash + '.txt';
		this.fileRemove(cachedFile)
	}
	//reads cacheID and calls aFunction with the data or read the data from online resource,
	//cache the data and calls aFunction
	this.readURL = function (aURL, aCacheID, aPostData, anArrayHeaders, aFunction, textPlain, useCookies) {
		var aCallbackArgs = [];
		aCallbackArgs[0] = arguments[5];
		aCallbackArgs[1] = arguments[6];
		aCallbackArgs[2] = arguments[7];
		aCallbackArgs[3] = arguments[8];
		aCallbackArgs[4] = arguments[9];
		aCallbackArgs[5] = arguments[10];
		aCallbackArgs[6] = arguments[11];
		aCallbackArgs[7] = arguments[12];
		aCallbackArgs[8] = arguments[13];
		aCallbackArgs[9] = arguments[14];
		aCallbackArgs[10] = arguments[15];

		//builds the cache ID
		var hash = this.sha256(aURL);

		var cachedFile = 'cached.request/' + aCacheID + '/' + hash[0] + '/' + hash[1] + '/' + hash + '.txt';

		//check if the cached file exists
		if (aCacheID !== null && aCacheID !== false && this.fileExists(cachedFile)) {
			aURL = this.pathSanitize(this.extensionDirectory().path + '/' + cachedFile);
			var ios = Components.classes["@mozilla.org/network/io-service;1"].
			getService(Components.interfaces.nsIIOService);
			aURL = ios.newURI('file://' + aURL, null, null).spec;
		}

		var Requester = new XMLHttpRequest();
		Requester.onload = function () {
			if (Requester.responseText == -1 || Requester.responseText == null || Requester.responseText == '') {} else {
				if (aCacheID !== null && aCacheID !== false)
					ODPExtension.fileWriteAsync(cachedFile, Requester.responseText);
				if (aFunction) {
					(function () {
						aFunction(Requester.responseText,
							aCallbackArgs[0], aCallbackArgs[1], aCallbackArgs[2], aCallbackArgs[3],
							aCallbackArgs[4], aCallbackArgs[5], aCallbackArgs[6], aCallbackArgs[7])
					}());
				}
			}
		};
		if ( !! textPlain)
			Requester.overrideMimeType('text/plain');
		if (!aPostData)
			Requester.open("GET", aURL, true);
		else {
			Requester.open("POST", aURL, true);
			Requester.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
		}
		if (useCookies) {
			this.XMLHttpRequestFix(Requester, aURL);
		}

		if (aURL.indexOf('http') === 0) {
			Requester.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;
			if (anArrayHeaders) {
				for (var id in anArrayHeaders) {
					Requester.setRequestHeader(id, anArrayHeaders[id]);
				}
			}
		}

		Requester.send(aPostData);
	}
	this.XMLHttpRequestFix = function (aRequester, aURL) {
		var cookie, cookies = [],
			cookieManager = Components.classes["@mozilla.org/cookiemanager;1"].getService(Components.interfaces.nsICookieManager2);
		for (var e = cookieManager.getCookiesFromHost(this.newURI(aURL).host); e.hasMoreElements();) {
			cookie = e.getNext().QueryInterface(Components.interfaces.nsICookie2);
			//why on earth I need to do this?? I mean.. this way
			//ODPExtension.dump(cookie);
			cookies[cookies.length] = (cookie.name) + "=" + (cookie.value)
		}
		cookies.reverse();
		aRequester.setRequestHeader('Cookie', cookies.join('; '));
		cookie = cookies = e = cookieManager = null
	}

	this.removeFileName = function (aURL) {
		var url2 = this.removeVariables(aURL).replace(/\/+$/, '').replace(/\/[^\/]+$/, '/');
		if (/\:\/+$/.test(url2))
			return aURL;
		else
			return url2;
	}
	this.removeFileName2 = function (aURL) {
		return this.removeVariables(aURL).replace(/\/+$/, '').replace(/\/[^\/]+$/, '/');
	}
	this.removeFromTheFirstFolder = function (aURL) {
		aURL = this.removeVariables(aURL);

		if (this.subStrCount(aURL, '/') >= 2)
			return aURL.replace(/^([a-z]+\:\/+[^\/]+\/[^\/]+\/).*$/, "$1");
		else
			return aURL;
	}
	this.removeFromTheFirstFolder2 = function (aURL) {
		return aURL.replace(/^([^\/]+)\/?.*$/, "$1");
	}
	//remove the port number from a domain name
	var removePortRegExp = /\:[0-9]*$/;
	this.removePort = function (aDomain) {
		if (!aDomain)
			return '';
		return aDomain.replace(removePortRegExp, ''); //the * is for "local" domains like file:////c:/
	}
	//removes the schema of an URL
	var removeSchemaRegExp = /^[^\:]+\:\/+/i;
	this.removeSchema = function (aURL) {
		if (!aURL)
			return '';
		return aURL.replace(removeSchemaRegExp, '');
	}

	this.removeSensitiveDataFromURL = function (aURL) {
		var aDomain = this.getDomainFromURL(aURL);
		var aSubdomain = this.removeWWW(this.getSubdomainFromURL(aURL));

		/*mutimedia files*/
		/*images*/
		aURL = aURL.replace(/\/[^\/]*\.jpg$/i, '/').replace(/\/[^\/]*\.jpeg$/i, '/');
		aURL = aURL.replace(/\/[^\/]*\.gif$/i, '/').replace(/\/[^\/]*\.png$/i, '/');
		/*videos*/
		aURL = aURL.replace(/\/[^\/]*\.mpg$/i, '/').replace(/\/[^\/]*\.mpeg$/i, '/');
		aURL = aURL.replace(/\/[^\/]*\.mov$/i, '/').replace(/\/[^\/]*\.wmv$/i, '/');
		aURL = aURL.replace(/\/[^\/]*\.ogg$/i, '/').replace(/\/[^\/]*\.ogg$/i, '/');
		/*flash*/
		aURL = aURL.replace(/\/[^\/]*\.flv$/i, '/').replace(/\/[^\/]*\.swf$/i, '/');
		/*music*/
		aURL = aURL.replace(/\/[^\/]*\.mp3$/i, '/').replace(/\/[^\/]*\.wav$/i, '/');
		aURL = aURL.replace(/\/+$/, '/');

		if (aURL.indexOf('?') != -1) {
			/*q= privacy*/
			aURL = aURL.replace(/q\=[^\&]*\&/gi, '').replace(/q\=[^\&]*$/i, '');
			aURL = aURL.replace(/search\=[^\&]*\&/gi, '').replace(/search\=[^\&]*$/i, '');
			/*session privacy*/
			aURL = aURL.replace(/cfid\=[^\&]*\&/gi, '').replace(/cfid\=[^\&]*$/i, '');
			aURL = aURL.replace(/cftoken\=[^\&]*\&/gi, '').replace(/cftoken\=[^\&]*$/i, '');
			aURL = aURL.replace(/phpsessid\=[^\&]*\&/gi, '').replace(/phpsessid\=[^\&]*$/i, '');
			aURL = aURL.replace(/session\=[^\&]*\&/gi, '').replace(/session\=[^\&]*$/i, '');
			aURL = aURL.replace(/sessid\=[^\&]*\&/gi, '').replace(/sessid\=[^\&]*$/i, '');
			aURL = aURL.replace(/sess\=[^\&]*\&/gi, '').replace(/sess\=[^\&]*$/i, '');
			aURL = aURL.replace(/sid\=[^\&]*\&/gi, '').replace(/sid\=[^\&]*$/i, '');

			/*email privacy*/
			aURL = aURL.replace(/email\=[^\&]*\&/gi, '').replace(/email\=[^\&]*$/i, '');
			aURL = aURL.replace(/mail\=[^\&]*\&/gi, '').replace(/mail\=[^\&]*$/i, '');

			/*forums privacy*/
			/*hilos y post*/
			aURL = aURL.replace(/showthread\.php.*$/i, "showthread.php");
			aURL = aURL.replace(/forumdisplay\.php.*$/i, "forumdisplay.php");
			aURL = aURL.replace(/viewforum\.php.*$/i, "viewforum.php");
			aURL = aURL.replace(/viewtopic\.php.*$/i, "viewtopic.php");
			/*members*/
			aURL = aURL.replace(/member\.php.*$/i, "member.php");
			aURL = aURL.replace(/profile\.php.*$/i, "profile.php");
			/*replys*/
			aURL = aURL.replace(/newreply\.php.*$/i, '');
			aURL = aURL.replace(/posting\.php.*$/i, '');
			aURL = aURL.replace(/privmsg\.php.*$/i, '');
			aURL = aURL.replace(/newthread\.php.*$/i, '');
			aURL = aURL.replace(/sendmessage\.php.*$/i, '');
			aURL = aURL.replace(/private\.php.*$/i, '');

			/*pages-counts*/
			aURL = aURL.replace(/page\=[0-9]+/gi, '');
			aURL = aURL.replace(/start\=[0-9]+/gi, '');

			if (aDomain.indexOf('yahoo.') != -1 || aDomain.indexOf('google.') != -1) {
				aURL = aURL.replace(/\/accounts\?.*$/i, "/accounts");
				aURL = aURL.replace(/\/search\?.*$/i, "/search");
				aURL = aURL.replace(/\/results\?.*$/i, "/results");
				aURL = aURL.replace(/\/imghp\?.*$/i, "/imghp");
				aURL = aURL.replace(/\/grphp\?.*$/i, "/grphp");
				aURL = aURL.replace(/\/nwshp\?.*$/i, "/nwshp");
				aURL = aURL.replace(/\/dirhp\?.*$/i, "/dirhp");
				aURL = aURL.replace(/\/webhp\?.*$/i, "/webhp");
				aURL = aURL.replace(/\/news\?.*$/i, "/news");
				aURL = aURL.replace(/\/blogsearch\?.*$/i, "/blogsearch");
				aURL = aURL.replace(/\/preferences\?.*$/i, "/preferences");
				aURL = aURL.replace(/\/language\?.*$/i, "/language");
				aURL = aURL.replace(/\/advanced\?.*$/i, "/advanced");
				aURL = aURL.replace(/\/advsearch\?.*$/i, "/advsearch");
				aURL = aURL.replace(/\/alerts\?.*$/i, "/alerts");
				aURL = aURL.replace(/\/books\?.*$/i, "/books");
				aURL = aURL.replace(/\/scholar\?.*$/i, "/scholar");
				aURL = aURL.replace(/\/images\?.*$/i, "/images");
				aURL = aURL.replace(/\/groups\?.*$/i, "/groups");
				aURL = aURL.replace(/\/imgres\?.*$/i, "/imgres");
				aURL = aURL.replace(/\/maps\?.*$/i, "/maps");
				aURL = aURL.replace(/\/maphp\?.*$/i, "/maphp");
				aURL = aURL.replace(/\/videosearch\?.*$/i, "/videosearch");
				aURL = aURL.replace(/\/ig\?.*$/i, "/ig");
				aURL = aURL.replace(/\/\?ncl.*$/i, "/?ncl");
				aURL = aURL.replace(/\/videoplay\?.*$/i, "/videoplay");

				aURL = aURL.replace(/\/mail\/.*$/i, "/mail");
				aURL = aURL.replace(/\/group\/.*$/i, "/group");
				aURL = aURL.replace(/\/adsense\/.*$/i, "/adsense");

				//stupid redirects
				aURL = aURL.replace(/\/url\?.*$/i, "/url");
			}

			if (aSubdomain.indexOf('search.msn') != -1 || aSubdomain.indexOf('search.blogger') != -1) {
				aURL = aURL.replace(/\?.*$/, '');
			}

			if (aDomain.indexOf('hotmail.') != -1 || aSubdomain.indexOf('.live.com') != -1) {
				aURL = aURL.replace(/\/cgi-bin\/.*$/i, '/');
				aURL = aURL.replace(/\?.*$/, '');
			}

			if (aSubdomain.indexOf('apps.facebook.') != -1) {
				aURL = aURL.replace(/\?.*$/, '');
			}

			if (aDomain.indexOf('youtube.') != -1) {
				aURL = aURL.replace(/\/results\?.*$/i, "/results");
			}

			if (aSubdomain.indexOf('.bing') != -1) {
				aURL = aURL.replace(/\?.*$/i, "");
			}

			if (aSubdomain == 'search.dmoz.org') {
				aURL = aURL.replace(/\/cgi-bin\/search.*$/i, '/cgi-bin/search');
			}

			/*duplicate simbols*/
			aURL = aURL.replace(/\&+/g, "&").replace(/\&$/, '').replace(/\?$/, '');
		}

		//the "face"
		if (aDomain.indexOf('facebook.') != -1) {
			aURL = aURL.replace(/\#.*$/, '');
		}
		//wordpress
		if (aURL.indexOf('/wp-admin/') != -1) {
			aURL = aURL.replace(/\/wp-admin\/.*$/, '');
		}

		aURL = aURL.replace(/\/+$/, '/');

		return aURL;
	}
	this.removeSession = function (aURL) {
		aURL = aURL.replace(/cfid\=[^\&]*\&/gi, '').replace(/cfid\=[^\&]*$/i, '');
		aURL = aURL.replace(/cftoken\=[^\&]*\&/gi, '').replace(/cftoken\=[^\&]*$/i, '');
		aURL = aURL.replace(/phpsessid\=[^\&]*\&/gi, '').replace(/phpsessid\=[^\&]*$/i, '');
		aURL = aURL.replace(/session\=[^\&]*\&/gi, '').replace(/session\=[^\&]*$/i, '');
		aURL = aURL.replace(/sessid\=[^\&]*\&/gi, '').replace(/sessid\=[^\&]*$/i, '');
		aURL = aURL.replace(/sess\=[^\&]*\&/gi, '').replace(/sess\=[^\&]*$/i, '');
		aURL = aURL.replace(/sid\=[^\&]*\&/gi, '').replace(/sid\=[^\&]*$/i, '');
		aURL = aURL.replace(/\&+/g, "&").replace(/\&$/, '').replace(/\?$/, '');
		return aURL;
	}
	//removes the http://www.domain/ from an url
	var removeSubdomainRegExp = /^[^\:]+\:\/+[^(\/|\?|\#)]+\/?(\??.*)$/;
	this.removeSubdomain = function (aURI) {
		if (!aURI)
			return '';
		return aURI.replace(removeSubdomainRegExp, "$1");
	}
	this.removeVariables = function (aURL) {
		return aURL.replace(/^([^\?]+).*$/, '$1');
	}
	//remove the ww. ww09. www09. ww-09. www-09. www. www09. es-en.www. es.www09. (and probably others) from a domain name
	/*
		http://www-142.ibm.com/software/products/uy/es/category/SWF00
		http://es-es.www.mozilla.org/
	*/
	var removeWWWRegExp1 = /^([a-z]|[0-9]|-)+\.www?-?[0-9]*\./i;
	var removeWWWRegExp2 = /^www?[a-z]?-?[0-9]*\./i;

	this.removeWWW = function (aDomain) {
		if (!aDomain)
			return '';
		var temp = aDomain.replace(removeWWWRegExp1, '');
		if (aDomain != temp)
			return temp;
		else
			return aDomain.replace(removeWWWRegExp2, '');
	}
	var getWWWRegExp1 = /^(([a-z]|[0-9]|-)+\.www?-?[0-9]*\.).*/i;
	var getWWWRegExp2 = /^(www?[a-z]?-?[0-9]*\.).*/i;
	this.getWWW = function (aDomain) {
		if (!aDomain)
			return '';
		var temp = aDomain.replace(removeWWWRegExp1, '');
		if (aDomain != temp) {
			return aDomain.replace(getWWWRegExp1, '$1');
		} else {
			temp = aDomain.replace(getWWWRegExp2, '$1');
			if (aDomain != temp)
				return temp;
			else
				return '';
		}
	}
	var decodeUTF8RecursiveRegExp = /% +/g;
	var idn = this.service('idn')
	var IDNDecode = idn.convertACEtoUTF8
	var IDNEncode = idn.convertUTF8toACE
	var IDNIsAce = idn.isACE
	this.IDNDecodeURL = function(aURL){
		try{
			aURL = aURL.split('/')
			if(!IDNIsAce(aURL[2]))
				return aURL.join('/')
			aURL[2] = IDNDecode(aURL[2], {})
			aURL = aURL.join('/')
		} catch(e){
		}
		return aURL
	}
	this.IDNEncodeURL = function(aURL){
		try{
			aURL = aURL.split('/')
			aURL[2] = IDNEncode(aURL[2], {})
			aURL = aURL.join('/')
		} catch(e){
		}
		return aURL
	}
	this.IDNDecodeDomain = function(aDomain){
		try{
			if(IDNIsAce(aDomain))
				return IDNDecode(aDomain, {})
		} catch(e){
		}
		return aDomain
	}
	var IDNDecodeDomain = this.IDNDecodeDomain
	this.getURLID = function (aURL) {

		var id = {}
		id.uri = aURL;
		id.subdomain = IDNDecodeDomain(aURL.replace(getSubdomainFromURLRegExp, "$1").replace(removePortRegExp, '').toLowerCase());
		id.schemaWWW = '';

		var temp;
		var aSubdomainOrDomainOrIP = id.subdomain;
		if (isIPAddressRegExp.test(aSubdomainOrDomainOrIP)) {
			id.domain = aSubdomainOrDomainOrIP;
		} else {
			temp = aSubdomainOrDomainOrIP.replace(removeWWWRegExp1, '');
			if (aSubdomainOrDomainOrIP != temp)
				aSubdomainOrDomainOrIP = temp;
			else
				aSubdomainOrDomainOrIP = aSubdomainOrDomainOrIP.replace(removeWWWRegExp2, '');

			temp = 0;
			var pos = aSubdomainOrDomainOrIP.indexOf('.');
			while (pos != -1) {
				temp++;
				pos = aSubdomainOrDomainOrIP.indexOf('.', pos + 1);
			}

			if (temp == 1)
				id.domain = aSubdomainOrDomainOrIP;
			else if (temp == 2 && getDomainFromURLRegExp.test(aSubdomainOrDomainOrIP))
				id.domain = aSubdomainOrDomainOrIP;
			else if (temp >= 3 && getDomainFromURLRegExp.test(aSubdomainOrDomainOrIP))
				id.domain = aSubdomainOrDomainOrIP.replace(getDomainFromURLRegExp1, "$1");
			else
				id.domain = aSubdomainOrDomainOrIP.replace(getDomainFromURLRegExp2, "$1");

			if (id.subdomain != id.domain) {
				temp = id.subdomain.replace(removeWWWRegExp1, '');
				if (id.subdomain != temp) {
					id.schemaWWW = id.subdomain.replace(getWWWRegExp1, '$1');
				} else {
					temp = id.subdomain.replace(getWWWRegExp2, '$1');
					if (id.subdomain != temp)
						id.schemaWWW = temp;
					else
						id.schemaWWW = '';
				}
				id.subdomain = aSubdomainOrDomainOrIP;
			}
		}

		id.schemaWWW = aURL.replace(getSchemaRegExp, "$1").toLowerCase() + '://' + id.schemaWWW;

		aURL = aURL.replace(removeSubdomainRegExp, "$1").toLowerCase();

		while (aURL.indexOf('%') != -1) {
			aURL = aURL.replace(decodeUTF8RecursiveRegExp, '%');
			temp = aURL;
			try {
				aURL = decodeURIComponent(aURL);
			} catch (e) {
				try {
					aURL = decodeURI(aURL);
				} catch (e) {
					break;
				}
			}
			if (aURL == temp)
				break;
		}
		id.path = aURL;

		return id;
	}

	//returns aURL in short mode, example http://domain.org/index.html will throw http://domain.org/
	var shortURLRegExp = /\/(index|default|home|main|)(\.[a-z]{2,4})\/?$/i;
	this.shortURL = function (aURL) {
		return aURL.replace(shortURLRegExp, '/');
	}
	// |
	// http://domain.tld/#!cms/index3.php4/?
	var shortURLOneRegExp = /\/(\#|\#\!)?[0-9]{0,2}(info|www|flash|swf|wp|wordpress|willkommen|velkommen|wikistart|welkom|welcome|website|weblog|webhome|web|vb|top|startseite|startpage|start|splash|site|sitio|public_html|public|principal|presentation|presentacion|portal|portail|portada|pages|page|phpbb[0-9]?|php|oldindex|old|newindex|new|mainpage|mainframe|mainmenu|main_page|main|landingpage|landing|joomla|introduction|introductie|intro_old|intro_new|intro|inicio|inici|index|indice|httpdocs|html|htm|homesite|hpm_homepage|front_content|homepage|home_page|home|guest|frontpage|front|frameset|frames|frame|foros|forums|forum|font_content|enter|default|content|cms|bin|cgi-bin|cgi|blog|bienvenue|bienvenido|bbs|accueil|about|asp|pdf)((_|-)?[0-9]{0,2}\.[a-z]{2,5}[0-9]{0,1})?\/?\??$/i;
	this.shortURLOne = function (aURL) {
		return aURL.replace(shortURLOneRegExp, '/');
	}
	var shortURLTwoRegExp = /\/(\#|\#\!)?[0-9]{0,2}(info|www|flash|swf|wp|wordpress|willkommen|velkommen|wikistart|welkom|welcome|website|weblog|webhome|web|vb|top|startseite|startpage|start|splash|site|sitio|public_html|public|principal|presentation|presentacion|portal|portail|portada|pages|page|phpbb[0-9]?|php|oldindex|old|newindex|new|mainpage|mainframe|mainmenu|main_page|main|landingpage|landing|joomla|introduction|introductie|intro_old|intro_new|intro|inicio|inici|index|indice|httpdocs|html|htm|homesite|hpm_homepage|front_content|homepage|home_page|home|guest|frontpage|front|frameset|frames|frame|foros|forums|forum|font_content|enter|default|content|cms|bin|cgi-bin|cgi|blog|bienvenue|bienvenido|bbs|accueil|about|asp|pdf)?\/?(info|www|flash|swf|wp|wordpress|willkommen|velkommen|wikistart|welkom|welcome|website|weblog|webhome|web|vb|top|startseite|startpage|start|splash|site|sitio|public_html|public|principal|presentation|presentacion|portal|portail|portada|pages|page|phpbb[0-9]?|php|oldindex|old|newindex|new|mainpage|mainframe|mainmenu|main_page|main|landingpage|landing|joomla|introduction|introductie|intro_old|intro_new|intro|inicio|inici|index|indice|httpdocs|html|htm|homesite|hpm_homepage|front_content|homepage|home_page|home|guest|frontpage|front|frameset|frames|frame|foros|forums|forum|font_content|enter|default|content|cms|bin|cgi-bin|cgi|blog|bienvenue|bienvenido|bbs|accueil|about|asp|pdf)?((_|-)?[0-9]{0,2}\.[a-z]{2,5}[0-9]{0,1})?\/?\??$/i;
	this.shortURLTwo = function (aURL) {
		return aURL.replace(shortURLTwoRegExp, '/');
	}
	var removeHashRegExp = /#.*$/
	this.removeHash = function (aURL) {
		return aURL.replace(removeHashRegExp, '');
	}
	this.getHashParamFromURL = function(aURL, aName){
	  var searchString = String(aURL).replace(/^[^#]+#/, ''),
	      i, val, params = searchString.split("&");
	     // console.log(searchString);

	  for (i=0;i<params.length;i++) {
	    val = params[i].split("=");
	    if (val[0] == aName) {
	      return this.decodeUTF8(val[1].replace(/\+/g, ' '));
	    }
	  }
	  return null;
	}
	return null;

}).apply(ODPExtension);
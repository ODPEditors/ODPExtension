(function()
{
	//gets the current focused location by looking at the location of the document
	this.focusedLocation = function()
	{
		var aLocation = this.documentFocusedGetLocation();

		if(aLocation != '' && this.isPublicURL(aLocation))
			return aLocation;
		else
			return '';
	}
	//gets the current focused location by looking at the value of the URLBar, if is not valid will look into the location of the document
	this.focusedLocationBar = function()
	{
		var aLocation = '';

		//if the URLBar is there...
		if(this.getBrowserElement('urlbar'))
		{
			aLocation = this.string(this.getBrowserElement('urlbar').value);

			//the urlbar can contain any typed data, try to see if this is an url
			if(aLocation.indexOf('.') != -1)
			{
				//sometimes the autocomplete feature miss the protocol
				if(/^[a-z]+\:\/+/i.test(aLocation)){}
				else
					aLocation = 'http://'+aLocation;

				//if the url don't have a slash after the domain name then do not use it
				if(/^[a-z]+\:\/+[^\/]+$/i.test(aLocation))
					aLocation = '';

				//the url bar contains the data in a "pretty" not usable format
				//aLocation = this.encodeURI(aLocation);
			}
			else
			{
				aLocation = '';
			}
		}

		if(aLocation != '' && this.isPublicURL(aLocation))
			return aLocation;
		else
			aLocation = this.documentFocusedGetLocation();

		if(aLocation != '' && this.isPublicURL(aLocation))
			return aLocation;
		else
			return '';
	}
	//gets the domain from an URL
	this.getDomainFromURL = function(aURL)
	{
		if(!aURL)
			return '';
		//http://www.iana.org/domains/root/db/ - iana root zone database
		var aSubdomainOrDomainOrIP = this.removeWWW(this.getSubdomainFromURL(aURL));
		if(this.isIPAddress(aSubdomainOrDomainOrIP))
			return aSubdomainOrDomainOrIP;
		var puntos = this.subStrCount(aSubdomainOrDomainOrIP, '.');
		if(puntos == 1)
			return aSubdomainOrDomainOrIP;
		else if(puntos == 2 &&
				/(com|net|org|edu|gov|gub|mil|int|arpa|aero|biz|coop|info|museum|name|co|ac|ne|asia|jobs|mobi|pro|tel|travel)\.(ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bl|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cat|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mf|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)$/i.test(aSubdomainOrDomainOrIP)
				)
			return aSubdomainOrDomainOrIP;
		else if(puntos >= 3 &&
				/(com|net|org|edu|gov|gub|mil|int|arpa|aero|biz|coop|info|museum|name|co|ac|ne|asia|jobs|mobi|pro|tel|travel)\.(ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bl|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cat|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mf|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)$/i.test(aSubdomainOrDomainOrIP)
				)
			return aSubdomainOrDomainOrIP.replace(/.*\.([^\.]+\.[^\.]+\.[^\.]+)$/, "$1");
		else
			return aSubdomainOrDomainOrIP.replace(/.*\.([^\.]+\.[^\.]+)$/, "$1");
	}
	//returns the IP of a host name

	this.getIPFromDomain = function(aDomain)
	{
		var IP = '';
		try
		{
			var DNS = Components.classes['@mozilla.org/network/dns-service;1'].getService(Components.interfaces.nsIDNSService);

			var nsRecord = DNS.resolve(aDomain, false);
			while (nsRecord.hasMore())
			{
				IP = nsRecord.getNextAddrAsString();
				return IP;
			}
		}catch(e){}

		return IP;
	}
	//gets the schema of a URL
	this.getSchema = function(aURL)
	{
		if(!aURL)
			return '';
		return aURL.replace(/^([^\:]+):.*$/, "$1").toLowerCase();
	}
	//gets the subdomain from an URL
	this.getSubdomainFromURL = function(aURL)
	{
		if(!aURL)
			return '';
		//checks if contains the final /, if not it is added
		if(aURL.indexOf('://') != -1 && this.subStrCount(aURL, '/') == 2)
			aURL = aURL+'/';
		return this.removePort(aURL.replace(/^(.+?):\/+(.+?)\/.*$/, "$2")).toLowerCase();
	}
	//shots a url for showing in a label
	this.getURLForLabel = function(aURL)
	{
		aURL = this.removeWWW(this.removeSchema(aURL));
		if(aURL.length > 22)
			return aURL.substr(0,22)+'…';
		else
			return aURL;
	}
	//returns true if the aURLorDomain is garbage
	this.isGarbage = function(aURLorDomain)
	{
		if(aURLorDomain.indexOf(':') != -1 || aURLorDomain.indexOf('/') != -1)
			return this.isGarbageURL(aURLorDomain);
		else if(this.isGarbageSubdomain(aURLorDomain) || this.isGarbageDomain(aURLorDomain))
			return true;
		else
			return false;
	}
	//returns true if the aDomain is garbage
	this.isGarbageDomain = function(aDomain)
	{
		switch(aDomain)
		{
			case 'googlesyndication.com':
			case 'doubleclick.net':
			case 'fbcdn.net':
			case 'sharethis.com':

				return true;
			default:
				return false;
		}
	}
	//returns true if the aSubdomain is garbage
	this.isGarbageSubdomain = function(aSubdomain)
	{
		switch(aSubdomain)
		{
			case 'googleads.g.doubleclick.net':
			case 'pagead2.googlesyndication.com':
			case 'adwords.google.com':
			case 'services.google.com':
			case 'advertising.microsoft.com':
			case 'api.tweetmeme.com':
			case 'api.facebook.com':
			case 'mediacdn.disqus.com':
				return true;
			default:
				return false;
		}
	}
	//returns true if the URL is garbage
	this.isGarbageURL = function(aURL)
	{
		if(
		   this.isGarbageSubdomain(this.getSubdomainFromURL(aURL)) ||
		   this.isGarbageDomain(this.getDomainFromURL(aURL)) ||
		   aURL.indexOf('http://www.google.com/url?') === 0 ||
		   aURL.indexOf('tweetmeme.com/button') != -1 ||
		   aURL.indexOf('facebook.com/plugins') != -1 ||
		   aURL.indexOf('facebook.com/widgets') != -1 ||
		   aURL.indexOf('facebook.com/xd_') != -1 ||
		   aURL.indexOf('addthis.com/static') != -1  ||
		   aURL.indexOf('.twitter.com/widgets') != -1  ||
		   aURL.indexOf('gmodules.com/gadgets') != -1

		 )
			return true;
		else
			return false;
	}
	//return true if the domain name is a ip address
	this.isIPAddress = function(aDomain)
	{
		if(/^([0-9]|\.)+$/.test(aDomain))
			return true;
		else
			return false;
	}
	//return true if the ip address is private
	this.isIPAddressPrivate = function(aIP)
	{
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
		if(nodos.length==4)
		{
			/* checking ranges 1,2,5,4' */
			if(nodos[0] == '10' || nodos[0] == '127' || nodos[0]+'.'+nodos[1] == '192.168' || nodos[0]+'.'+nodos[1] == '169.254')
				return true;
			/* checking ranges 3 */
			if((nodos[0] == '172') && (nodos[1] >= 16 && nodos[1] <= 31))
				return true;
		}
		return false;
	}
	//returns true if the URL is public accesible (maybe)
	this.isPublicURL = function(aURL)
	{
		var schema = this.getSchema(aURL);
		if(schema != 'http' && schema != 'https' && schema != 'ftp' && schema != 'feed' && schema != 'gopher')
			return false;

		var aDomain = this.getSubdomainFromURL(aURL);

		if(aDomain.indexOf('.') == -1)
			return false;

		if(this.isIPAddress(aDomain) && this.isIPAddressPrivate(aDomain))
			return false

		if(aDomain.indexOf('@') != -1 && aDomain.indexOf(':') != -1)
			return false;

		return true;
	}
	//returns true if the URI is safe to use
	this.isSecureURI = function(aURI)
	{
		var aURI = this.string(aURI).toLowerCase();

		if(
			   aURI.indexOf('http://') === 0 ||
			   aURI.indexOf('https://') === 0 ||
			   aURI.indexOf('ftp://') === 0 ||
			   aURI.indexOf('feed:') === 0 ||
			   aURI.indexOf('gopher:') === 0
		   )
		{
			return true;
		}
		else
		{
			this.error(' The URI "'+aURI+'" can\'t be opened, looks like a non secure URI for use within this extension');
			return false;
		}
	}
	//returns a URI from an URL
	this.newURI = function(aURL)
	{
		return this.service('ios').newURI(aURL, null, null);
	}
	//open an external URI - mailto: for example
	this.openURI = function(aURL, isSecure)
	{
		//security
		if((aURL.toLowerCase()).indexOf('chrome:') === 0 && !isSecure)
		{
			this.error(' chrome:// URLs can\'t be opened with openURI ');
			return;
		}
		else if((aURL.toLowerCase()).indexOf('javascript:') === 0 && !isSecure)
		{
			this.error(' javascript:// URLs can\'t be opened with openURI ');
			return;
		}
		(function (aURL)
		{
		  var ios = Components.classes["@mozilla.org/network/io-service;1"]
							  .getService(Components.interfaces.nsIIOService);
		  var uri = ios.newURI(aURL, null, null);

		  var protocolSvc = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"]
									  .getService(Components.interfaces.nsIExternalProtocolService);

		  if (!protocolSvc.isExposedProtocol(uri.scheme)) {
			// If we're not a browser, use the external protocol service to load the URI.
			protocolSvc.loadUrl(uri);
		  }
		  else {
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
			  onStartURIOpen: function(uri) { return false; },
			  doContent: function(ctype, preferred, request, handler) { return false; },
			  isPreferred: function(ctype, desired) { return false; },
			  canHandleContent: function(ctype, preferred, desired) { return false; },
			  loadCookie: null,
			  parentContentListener: null,
			  getInterface: function(iid) {
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
	this.openURL = function(aURL, inNewTab, inNewWindow, giveFocus, onSubBrowser, subBrowserPosition, aPostData, byPassSecure)
	{
		//security
		if(this.isSecureURI(aURL) || byPassSecure)
		{
			if(inNewWindow && !inNewTab)//err! this is not fun!
			{
				if(!aPostData)
					window.open(aURL);
				else
				{
					if(this.isSeaMonkey())
						window.openDialog('chrome://navigator/content', '_blank', 'all,dialog=no', aURL, null, null, this.postData(aPostData));
					else
						window.openDialog('chrome://browser/content', '_blank', 'all,dialog=no', aURL, null, null, this.postData(aPostData));
				}
			}
			else
			{
				//if the user allowed the usage of other add-ons and if is there
				if(onSubBrowser && this.isThereSplitBrowser() && this.usePowerExtensionsWhenAvailable)
				{
						try{
							//find the position of the split browser
								var aPosition;
								if(subBrowserPosition == 'L')
									aPosition = SplitBrowser.POSITION_LEFT
								else if(subBrowserPosition == 'R')
									aPosition = SplitBrowser.POSITION_RIGHT
								else if(subBrowserPosition == 'T')
									aPosition = SplitBrowser.POSITION_TOP
								else if(subBrowserPosition == 'B')
									aPosition = SplitBrowser.POSITION_BOTTOM

							//check if there subbrowser is already opened
							if(!this.aSubBrowser || !this.aSubBrowser[subBrowserPosition] || !this.aSubBrowser[subBrowserPosition].browser)
							{
								if(!this.aSubBrowser)
									this.aSubBrowser = [];

								this.aSubBrowser[subBrowserPosition] = SplitBrowser.addSubBrowser('', SplitBrowser.activeBrowser, aPosition);
								this.aSubBrowser[subBrowserPosition].browser.loadURIWithFlags(aURL, null, null, null, this.postData(aPostData) )
							}
							else
							{
								if(inNewTab)
								{
									var aTab = this.aSubBrowser[subBrowserPosition].browser.addTab(aURL, null, null, this.postData(aPostData));

									if(giveFocus)
									{
										this.aSubBrowser[subBrowserPosition].browser.focus();
										this.aSubBrowser[subBrowserPosition].browser.selectedTab = aTab;
									}
								}
								else
								{
									this.aSubBrowser[subBrowserPosition].browser.loadURIWithFlags(aURL, null, null, null, this.postData(aPostData) )
								}
							}
							return;

						}catch(e){}
				}
				//if split browser is not there, or if is usage of the power extensions is disabled ,or if fails
				// open a normal tab
				if(inNewTab && this.documentFocusedGetLocation() != 'about:blank')
					this.tabOpen(aURL, giveFocus, aPostData);
				else
					gBrowser.loadURIWithFlags(aURL, null, null, null, this.postData(aPostData))
			}
		}
	}
	//returns .. post data in a what???
	this.postData = function(dataString)
	{
		if(!dataString)
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
	//reads cacheID and calls aFunction with the data or read the data from online resource,
	//cache the data and calls aFunction
	this.readURL = function(aURL, aCacheID, aPostData, anArrayHeaders, aFunction)
	{
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

		var cachedFile = 'cached.request/'+aCacheID+'/'+hash[0]+'/'+hash[1]+'/'+hash+'.txt';

		//check if the cached file exists
		if(aCacheID !== null && aCacheID !== false && this.fileExists(cachedFile))
		{
			aURL = this.pathSanitize(this.extensionDirectory().path+'/'+cachedFile);
			var ios = Components.classes["@mozilla.org/network/io-service;1"].
							getService(Components.interfaces.nsIIOService);
			aURL = ios.newURI('file://'+aURL, null, null).spec;
		}

		var Requester = new XMLHttpRequest();
			//Requester.overrideMimeType('text/plain');
			if(aPostData === null)
			  Requester.open("GET", aURL, true);
			else
			{
			  Requester.open("POST", aURL, true);
			  Requester.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
			}

			if(aURL.indexOf('http') === 0)
			{
				Requester.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;
				if(anArrayHeaders)
				{
				  for(var id in anArrayHeaders)
				  {
					Requester.setRequestHeader(id, anArrayHeaders[id]);
				  }
				}
			}
			Requester.onload = function ()
			{
				if(Requester.responseText == -1 || Requester.responseText == null || Requester.responseText == ''){}
				else
				{
				  if(aCacheID !== null && aCacheID !== false )
					ODPExtension.fileWrite(cachedFile, Requester.responseText);

				  (function()
				  {
						  aFunction(Requester.responseText,
							  aCallbackArgs[0],aCallbackArgs[1],aCallbackArgs[2],aCallbackArgs[3],
							  aCallbackArgs[4],aCallbackArgs[5],aCallbackArgs[6],aCallbackArgs[7]
						  )
				  }());
				}
			};
			Requester.send(aPostData);
	}
	this.removeFileName = function (aURL)
	{
		var url2 = this.removeVariables(aURL).replace(/\/+$/, '').replace(/\/[^\/]+$/, '/');
		if(/\:\/+$/.test(url2))
			return aURL;
		else
			return url2;
	}
	this.removeFromTheFirstFolder = function (aURL)
	{
		aURL = this.removeVariables(aURL);

		if(this.subStrCount(aURL, '/') >= 2)
			return aURL.replace(/^([a-z]+\:\/+[^\/]+\/[^\/]+\/).*$/, "$1");
		else
			return aURL;
	}
	//remove the port number from a domain name
	this.removePort = function(aDomain)
	{
		if(!aDomain)
			return '';
		return aDomain.replace(/\:[0-9]*$/, '');//the * is for "local" domains like file:////c:/
	}
	//removes the schema of an URL
	this.removeSchema = function(aURL)
	{
		if(!aURL)
			return '';
		var schema =  aURL.replace(/^([^\:]*):.*$/, "$1");
		var rX= new RegExp('^'+schema+'\:\/+','i');
		return aURL.replace(rX, '');
	}
	this.removeSensitiveDataFromURL = function (aURL)
			{
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

				if(aURL.indexOf('?') != -1)
				{
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

						if(aDomain.indexOf('yahoo.') != -1 || aDomain.indexOf('google.') != -1)
						{
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

						if(aSubdomain.indexOf('search.msn') != -1 || aSubdomain.indexOf('search.blogger') != -1)
						{
							aURL =  aURL.replace(/\?.*$/, '');
						}

						if(aDomain.indexOf('hotmail.') != -1 || aSubdomain.indexOf('.live.com') != -1)
						{
							aURL = aURL.replace(/\/cgi-bin\/.*$/i, '/');
							aURL = aURL.replace(/\?.*$/, '');
						}

						if(aSubdomain.indexOf('apps.facebook.') != -1)
						{
							aURL = aURL.replace(/\?.*$/, '');
						}

						if(aDomain.indexOf('youtube.') != -1)
						{
							aURL = aURL.replace(/\/results\?.*$/i, "/results");
						}

						if(aSubdomain.indexOf('.bing') != -1)
						{
							aURL = aURL.replace(/\?.*$/i, "");
						}

						if(aSubdomain == 'search.dmoz.org')
						{
							aURL = aURL.replace(/\/cgi-bin\/search.*$/i, '/cgi-bin/search');
						}

					/*duplicate simbols*/
						aURL = aURL.replace(/\&+/g, "&").replace(/\&$/, '').replace(/\?$/, '');
				}

				//the "face"
				if(aDomain.indexOf('facebook.') != -1)
				{
					aURL = aURL.replace(/\#.*$/, '');
				}
				//wordpress
				if(aURL.indexOf('/wp-admin/') != -1)
				{
					aURL = aURL.replace(/\/wp-admin\/.*$/, '');
				}

				aURL = aURL.replace(/\/+$/, '/');

				return aURL;
			}
	this.removeSession = function (aURL)
	{
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
	this.removeSubdomain = function(aURI)
	{
		if(!aURI)
			return '';

		return aURI.replace(/^(.+?):\/+(.+?)\/(.*)$/, "$3");
	}
	this.removeVariables = function (aURL)
	{
		return aURL.replace(/^([^\?]+).*$/, '$1');
	}
	//remove the ww. ww09. www09. ww-09. www-09. www. www09. es-en.www. es.www09. (and probably others) from a domain name
	/*
		http://www-142.ibm.com/software/products/uy/es/category/SWF00
		http://es-es.www.mozilla.org/
	*/
	this.removeWWW = function(aDomain)
	{
		if(!aDomain)
			return '';
		var withoutAZ09WWW = aDomain.replace(/^([a-z]|[0-9]|-)+\.www?-?([0-9]+)?\./i, '');
		if(aDomain != withoutAZ09WWW)
			return withoutAZ09WWW;
		else
			return aDomain.replace(/^www?-?([0-9]+)?\./i, '');
	}
	//returns aURL in short mode, example http://domain.org/index.html will throw http://domain.org

	this.shortURL = function(aURL)
	{
		aURL = aURL.replace(/\/index\.[a-z]{2,4}$/i, '/');
		aURL = aURL.replace(/\/default\.[a-z]{2,4}$/i, '/');
		aURL = aURL.replace(/\/index$/i, '/');
		aURL = aURL.replace(/\/default$/i, '/');

		return aURL;
	}

	return null;

}).apply(ODPExtension);

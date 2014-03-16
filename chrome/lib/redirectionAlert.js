(function() {

	var redirectionAlertID = 0;

	//broadcast we are running
	this.addListener('preferencesLoadGlobal', function () {

		if(!ODPExtension.shared.linkCheckerRunningInstances)
			ODPExtension.shared.linkCheckerRunningInstances = 0
	});

	//when the link checker crashes, it does not close previous tabs
	this.addListener('userInterfaceLoad', function () {

		var tabs = gBrowser.mTabContainer.childNodes;

		var close = []
		for(var a=0;a<tabs.length;a++){
			if(tabs[a].hasAttribute('ODPLinkChecker') || ODPExtension.browserGetFromTab(tabs[a]).hasAttribute('ODPLinkChecker'))
				close[close.length] = tabs[a]
		}
		for(var id in close){
			ODPExtension.tabClose(close[id]);
		}
	});

	var timeoutAfter = 80 * 1000; //seconds for the website to load
	var gracePeriod = 6000; //seconds for the website to load
	var watchingPeriod = 18000; //seconds to allow the website redirect
	var tagsMedia = ['object', 'media', 'video', 'audio', 'embed'];
	var tagsNoContent = ['noscript', 'noframes', 'style', 'script', 'frameset'];

	var contentTypesTxt = ['application/atom+xml', 'application/atom', 'application/javascript', 'application/json', 'application/rdf+xml', 'application/rdf', 'application/rss+xml', 'application/rss', 'application/xhtml', 'application/xhtml+xml', 'application/xml', 'application/xml-dtd', 'application/html', 'text/css', 'text/csv', 'text/html', 'text/xhtml', 'text/javascript', 'text/plain', 'text/xml', 'text/json', 'text', 'txt', 'html', 'xml', 'application/x-unknown-content-type', ''];
	var contentTypesKnown = [
	'application/atom+xml', 'application/atom', 'application/javascript', 'application/json', 'application/rdf+xml', 'application/rdf', 'application/rss+xml', 'application/rss', 'application/xhtml', 'application/xhtml+xml', 'application/xml', 'application/xml-dtd', 'application/html', 'text/css', 'text/csv', 'text/html', 'text/xhtml', 'text/javascript', 'text/plain', 'text/xml', 'text/json', 'text', 'html', 'xml', '', //txt
	'application/x-bzip', 'application/x-bzip-compressed-tar', 'application/x-gzip', 'application/x-tar', 'application/x-tgz', 'application/zip', //compressed
	'application/pdf', 'application/msword', //documents
	'application/x-shockwave-flash', 'application/ogg', //multimedia
	'audio/mpeg', 'audio/x-mpegurl', 'audio/x-ms-wax', 'audio/x-ms-wma', 'audio/x-wav', //audio
	'image/gif', 'image/jpeg', 'image/png', 'image/x-xbitmap', 'image/x-xpixmap', 'image/x-xwindowdump', //image
	'video/mpeg', 'video/quicktime', 'video/x-ms-asf', 'video/x-ms-wmv', 'video/x-msvideo', //video
	'application/x-unknown-content-type', '']

	var debug = false;

	this.redirectionAlert = function() {
		function RedirectionAlert() {
			return this;
		}

		RedirectionAlert.prototype = {

			init: function() {
				this.id = String(redirectionAlertID++);
				this.cache = [];
				this.cacheRedirects = [];
				this.itemsWorking = 0;
				this.itemsDone = 0;
				ODPExtension.shared.linkCheckerRunningInstances++
				this.itemsNetworking = 0;
				this.queue = []

				var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
					//after server talks back
					observerService.addObserver(this, "http-on-examine-response", false);
					observerService.addObserver(this, "http-on-examine-merged-response", false);
					observerService.addObserver(this, "http-on-examine-cached-response", false);
					//DOMContent going to be parsed/rendered by the browser
					observerService.addObserver(this, 'content-document-global-created', false);
					//before talking to server
					observerService.addObserver(this, 'http-on-modify-request', false);
					//ignore
					//observerService.addObserver(this, 'http-on-opening-request', false);
			},
			unLoad: function() {
				var self = this;
				setTimeout(function() {
					self._unLoad();
				}, 20000);
			},
			_unLoad: function() {
				if (this.itemsWorking != this.itemsDone)
					return;

				var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
					//after server talks back
					observerService.removeObserver(this, "http-on-examine-response", false);
					observerService.removeObserver(this, "http-on-examine-merged-response", false);
					observerService.removeObserver(this, "http-on-examine-cached-response", false);
					//DOMContent going to be parsed/rendered by the browser
					observerService.removeObserver(this, 'content-document-global-created', false);
					//before talking to server
					observerService.removeObserver(this, 'http-on-modify-request', false);
					//ignore
					//observerService.removeObserver(this, 'http-on-opening-request', false);

				this.cache = null;
				this.cacheRedirects = null;
				this.itemsWorking = null;
				this.itemsDone = null;
				this.queue = null;
				ODPExtension.shared.linkCheckerRunningInstances--
			},
			observe: function(aSubject, aTopic, aData) {
				switch (aTopic) {
					//server talking back to us
					case 'http-on-examine-response':
					case 'http-on-examine-merged-response':
					case 'http-on-examine-cached-response':

						aSubject.QueryInterface(Components.interfaces.nsIHttpChannel);
						// LISTEN for Tabs
						// this piece allows to get the HTTP code of urls that redirects via metarefresh or JS
						// also, allows to holds the urls of external content associated to a tab. !
						var aTab = false
						try {
							var notificationCallbacks = aSubject.notificationCallbacks ? aSubject.notificationCallbacks : aSubject.loadGroup.notificationCallbacks;
							if (!notificationCallbacks) {} else {
								var domWin = notificationCallbacks.getInterface(Components.interfaces.nsIDOMWindow);
								aTab = ODPExtension.tabGetFromChromeDocument(domWin);
								if (aTab && !! aTab.ODPExtensionExternalContent) {
									var decoded = ODPExtension.IDNDecodeURL(aSubject.URI.spec)
									aTab.ODPExtensionExternalContent[aTab.ODPExtensionExternalContent.length] = {
										url: decoded,
										status: aSubject.responseStatus
									};
									aTab.ODPExtensionURIsStatus[decoded] = aSubject.responseStatus;
								}
							}
						} catch (e) {}

						// LISTEN for XMLHttpRequest
						this.onExamineResponse(aSubject, aTab);
						break;
					//document going to be parsed/rendered by the browser
					case 'content-document-global-created':
						if (aSubject instanceof Components.interfaces.nsIDOMWindow) {
							var aTab = ODPExtension.tabGetFromChromeDocument(aSubject);
							if (aTab && !! aTab.ODPExtensionLinkChecker) {
								ODPExtension.disableTabFeatures(aSubject, aTab, this.cache[aTab.ODPExtensionOriginalURI]);
							}
						}
						break;
					//before talking to server
					//case 'http-on-opening-request':
					case 'http-on-modify-request':
						aSubject.QueryInterface(Components.interfaces.nsIHttpChannel);

						try {
							var notificationCallbacks = aSubject.notificationCallbacks ? aSubject.notificationCallbacks : aSubject.loadGroup.notificationCallbacks;
							if (!notificationCallbacks) {} else {
								var domWin = notificationCallbacks.getInterface(Components.interfaces.nsIDOMWindow);
								var aTab = ODPExtension.tabGetFromChromeDocument(domWin);
								if (aTab && !! aTab.ODPExtensionExternalContent) {
									var decoded = ODPExtension.IDNDecodeURL(aSubject.URI.spec)
									if(/\.css(\?.*)?$/.test(decoded) || ODPExtension.isGarbage(decoded)){
										aTab.ODPExtensionExternalContent[aTab.ODPExtensionExternalContent.length] = {
											url: decoded,
											status: 200
										};
										aSubject.cancel(Components.results.NS_BINDING_ABORTED);
									}
								}
							}
						} catch (e) {}
						break;
				}
			},
			//try hard to cancel a download when linkchecking
			cancelDownload:function(oHttp){
				//cancel downloads
				var isDownload = false

				if(!isDownload){
					try {
						var contentDisposition = oHttp.contentDisposition;
						contentDisposition = String(contentDisposition).trim();
						isDownload = true;
						oHttp.cancel(Components.results.NS_BINDING_ABORTED);
					} catch (e) {}
				}

				if(!isDownload){
					try {
						var contentDispositionFilename = oHttp.contentDispositionFilename;
						contentDispositionFilename = String(contentDispositionFilename).trim();
						isDownload = true;
						oHttp.cancel(Components.results.NS_BINDING_ABORTED);
					} catch (e) {}
				}

				if(!isDownload){
					try {
						var contentDispositionHeader = oHttp.contentDispositionHeader;
						contentDispositionHeader = String(contentDispositionHeader).trim();
						isDownload = true;
						oHttp.cancel(Components.results.NS_BINDING_ABORTED);
					} catch (e) {}
				}

				if(!isDownload && oHttp.channelIsForDownload){
					isDownload = true
					oHttp.cancel(Components.results.NS_BINDING_ABORTED);
				}

				if(!isDownload){
					var disp = "", regexp = /^\s*attachment/i;
					try {
						disp = oHttp.getResponseHeader("Content-Disposition");
					} catch (e) { }

					if (regexp.test(disp)){
						try{
							oHttp.setResponseHeader("Content-Disposition", disp.replace(regexp, "inline"), false);
							oHttp.cancel(Components.results.NS_BINDING_ABORTED);
							isDownload = true;
						}catch(e) { }
					}
				}

				return isDownload
			},
			//after the server talks back
			onExamineResponse: function(oHttp, aTab) {

				var isDownload = false
				var decodedOriginalURI = ODPExtension.IDNDecodeURL(oHttp.originalURI.spec)
				var decodedURI = ODPExtension.IDNDecodeURL(oHttp.URI.spec)
				//skiping the examinations of requests NOT related to our redirection alert
				if (!this.cache[decodedOriginalURI]) {
					if (!this.cacheRedirects[decodedOriginalURI]) {
						if(aTab)
							isDownload = this.cancelDownload(oHttp);

						//this examination comes from a request (browser, extension, document) not related to the current process: checking the status of the this document/selected links
						return;
					} else {
						//resolving: from where this redirection come from - this resolve when a redirect redirect again to another place
						var originalURI = this.cacheRedirects[decodedOriginalURI];
					}
				} else {

					var originalURI = decodedOriginalURI;
				}

				if (this.cache[originalURI].stop == true) {
					isDownload = this.cancelDownload(oHttp);

					//resolving: this item was already checked to the end but all the request are still on examination
					//so: if you open a new tab with this item.url, that information willl be appended as a redirection (this return avoids this)
					return;
				}

				//normalize responseStatus
				var responseStatus = oHttp.responseStatus;
				if (responseStatus === 0)
					responseStatus = -1;

				//DO NOT EDIT:
				this.cache[originalURI].statuses.push(responseStatus);
				this.cache[originalURI].urlRedirections.push(decodedURI);
				if (originalURI != decodedURI) {
					this.cacheRedirects[decodedURI] = originalURI;
					this.cache[originalURI].urlLast = decodedURI;
				} else {
					var lastURL = '';
					try {
						lastURL = ODPExtension.IDNDecodeURL(oHttp.URI.resolve(oHttp.getResponseHeader('Location')))
					} catch (e) {}
					if (lastURL != '' && lastURL != decodedURI) {
						this.cacheRedirects[lastURL] = originalURI;
						this.cache[originalURI].urlLast = lastURL;
					}
				}
				this.cache[originalURI].requestMethod = oHttp.requestMethod || 'GET';

				isDownload = this.cancelDownload(oHttp);

				//detect downloads
				//this.cache[originalURI].isDownload = isDownload;

				if (oHttp.contentType.trim() != '' && contentTypesTxt.indexOf(oHttp.contentType) === -1) {
					this.cache[originalURI].contentType = oHttp.contentType;
					isDownload = true
					if(!isDownload)//already canceled
						oHttp.cancel(Components.results.NS_BINDING_ABORTED);
				} else if(isDownload){
					this.cache[originalURI].contentType = oHttp.contentType;
				}

				this.cache[originalURI].isDownload = isDownload;

				//if the request is from XMLHttpRequester, the "Location:" header, maybe is not reflected in the redirections,
				//then we need to get if from the responseHeaders.
				//aData[URL] is equal to the original URI. But then,
				//Since the redirectionn is not exposed, if we change the current Location to
				//this.cache[originalURI].lastURL = oHttp.getResponseHeader('Location')
				//we will inherit all the properties of the previous URL, such contenttype, etc.
				//So, dont use this:
				//this.cache[originalURI].remoteAddress = oHttp.remoteAddress || 0;
				//this.cache[originalURI].remotePort = oHttp.remotePort || 0;
				//this.cache[originalURI].contentLength = oHttp.contentLength || 0;
				//this.cache[originalURI].contentType = oHttp.contentType || '';
				//this.cache[originalURI].contentCharset = oHttp.contentCharset || '';

			},
			check: function(aURL, aFunction) {
				this.queue[this.queue.length] = [ODPExtension.IDNDecodeURL(aURL), aFunction, aURL];
				this.next();
			},
			done: function(aFunction, aData, aURL, aOriginalURL) {
				ODPExtension.getIPFromDomainAsync(aData.subdomain, function(aIP){
					aData.ip = aIP
					ODPExtension.detectLanguage(aData.txt.slice(0, 4096), function(aLanguage){
						aData.language = aLanguage;

						if (ODPExtension.preferenceGet('link.checker.cache.result')){
							var cacheID = ODPExtension.sha256(aURL)
							ODPExtension.compress(JSON.stringify(aData), function(aCompressedData){
								ODPExtension.fileWriteAsync('/LinkChecker/'+cacheID[0]+'/'+cacheID[1]+'/'+cacheID, aCompressedData);
							});
						}
						oRedirectionAlert.cache[aURL] = null;
						if(debug)
							ODPExtension.dump(aData)
						aFunction(aData, aOriginalURL);
						aData = null
					});
				});
			},
			next: function() {
				if (this.itemsNetworking < ODPExtension.preferenceGet('link.checker.threads')) {
					var next = this.queue.shift();
					if ( !! next) {
						this._check(next[0], next[1], next[2]);
						this.next();
					}
				}
			},

			_check: function(aURL, aFunction, aOriginalURL, letsTryAgainIfFail) {
				this.itemsWorking++;
				this.itemsNetworking++;

				if (typeof(letsTryAgainIfFail) == 'undefined')
					letsTryAgainIfFail = 1;

				if (!this.cache[aURL]) {
					this.cache[aURL] = {};
					var aData = this.cache[aURL];
					aData.stop = false;

					aData.isDownload = false;

					aData.statuses = [];
					aData.headers = '';
					aData.contentType = '';
					aData.requestMethod = 'GET';

					aData.urlRedirections = [];
					aData.urlOriginal = aURL;
					aData.urlLast = aURL;
					aData.domain = '';
					aData.subdomain = '';
					aData.ip = '';
					aData.ns = '';

					aData.checkType = '';
					aData.siteType = 'html'; //html, rss, atom, pdf, media, flash

					aData.html = '';
					aData.htmlRequester = '';
					aData.htmlTab = '';
					aData.domTree = '';
					aData.txt = '';
					aData.language = '';

					aData.hash = '';
					aData.hashOriginal = ''
					aData.hashKnown = false;
					aData.match = '';
					aData.ids = [];

					aData.title = '';

					aData.externalContent = [];
					aData.linksInternal = []
					aData.linksExternal = []

					aData.metaRSS = []
					aData.metaAtom = []
					aData.metaOpenSearch = []

					aData.metaAuthor = ''
					aData.metaCopyright = ''
					aData.metaRobots = ''
					aData.metaGenerator = ''
					aData.metaDescription = '';
					aData.metaKeywords = '';

					aData.mediaCount = 0;
					aData.imageCount = 0;
					aData.scriptCount = 0;
					aData.wordCount = 0;
					aData.strLength = 0;
					aData.hasFrameset = 0;
					aData.frames = 0;
					aData.dateStart = ODPExtension.now();
					aData.dateEnd = aData.dateStart;
					aData.intrusivePopups = 0;
					aData.loadingSuccess = false;
					aData.note = [];
					//aData.removeFromBrowserHistory = !ODPExtension.isVisitedURL(aURL);

				} else {
					var aData = this.cache[aURL];
				}
				var oRedirectionAlert = this;
				var Requester = new XMLHttpRequest();
				try {
					Requester.mozAnon = true;
				} catch (e) {} //If true, the request will be sent without cookie and authentication headers.
				try {
					Requester.mozBackgroundRequest = true;
				} catch (e) {} //Indicates whether or not the object represents a background service request. If true, no load group is associated with the request, and security dialogs are prevented from being shown to the user. Requires elevated privileges to access.

				var loaded = false;
				var timer;
				Requester.timeout = timeoutAfter;
				Requester.onload = function() {
					if (loaded)
						return null;

					aData.checkType = 'XMLHttpRequestSuccess'
					loaded = true;
					aData.stop = true;
					aData.headers = Requester.getAllResponseHeaders();
					aData.htmlRequester = Requester.responseText;
					aData.html = Requester.responseText;
					aData.ids = ODPExtension.normalizeIDs(aData.ids, aData.html.match(/(pub|ua)-[^"'&\s]+/gmi) || [])
					aData.contentType = Requester.getResponseHeader('Content-Type');
					//now get the response as UTF-8

					var aTab = ODPExtension.tabOpen('about:blank', false, false, true);
					aTab.setAttribute('hidden', ODPExtension.preferenceGet('link.checker.hidden.tabs'));
					aTab.setAttribute('ODPLinkChecker', true);
					aTab.ODPExtensionLinkChecker = true;
					aTab.ODPExtensionOriginalURI = aURL;
					aTab.ODPExtensionExternalContent = [];
					aTab.ODPExtensionURIsStatus = [];

					var aTabBrowser = ODPExtension.browserGetFromTab(aTab);
						aTabBrowser.setAttribute('ODPLinkChecker', true);

					var timedout = {}
						timedout.status = -1;
						timedout.timer = false;
					//timedout = -1 | tab did not timedout
					//timedout = 1 | tab timedout (did not fired DOM CONTENT LOAD)
					//timedout = 2 | tab did load (did fired DOM CONTENT LOAD)

					function onTabLoad() {
						timedout.status = 3;
						aTabBrowser.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);

						oRedirectionAlert.next();

						aData.checkType = 'aTab'
						aData.externalContent = aTab.ODPExtensionExternalContent;

						var aDoc = ODPExtension.documentGetFromTab(aTab);

						aData.urlLast = ODPExtension.tabGetLocation(aTab);

						if (aDoc.documentURI.indexOf('about:') === 0 || aDoc.documentURI.indexOf('chrome:') === 0) {
							aDoc = ODPExtension.toDOM(aData.htmlRequester, aData.urlLast);
						}

						aData.contentType = aDoc.contentType;
						//a tab may redirect to binary content
						if (aData.contentType != '' && contentTypesTxt.indexOf(aData.contentType) === -1) {
							aData.isDownload = true;
						}

						aData.title = ODPExtension.documentGetTitle(aDoc);
						aData.metaDescription = ODPExtension.documentGetMetaDescription(aDoc);

						//detect meta/js redirect
						if (aData.urlRedirections[aData.urlRedirections.length - 1] != aData.urlLast) {
							aData.statuses.push('meta/js');
							//save the redirection
							aData.urlRedirections.push(aData.urlLast);
							//get the last status, if was meta/js redirect
							if (!aTab.ODPExtensionURIsStatus[aData.urlLast]) {} else {
								aData.statuses.push(aTab.ODPExtensionURIsStatus[aData.urlLast]);
							}
						}

						aData.subdomain = ODPExtension.getSubdomainFromURL(aData.urlLast);
						aData.domain = ODPExtension.getDomainFromURL(aData.urlLast);

						//links
						aData.linksInternal = []
						aData.linksExternal = []

						var links = ODPExtension.getAllLinksItems(aDoc);
						for (var i = 0, length = links.length; i < length; i++) {
							var link = links[i];
							var href = ODPExtension.IDNDecodeURL(ODPExtension.string(link.href))
							if (href && href != '' && href.indexOf('http') === 0) {
								var aDomain = ODPExtension.getDomainFromURL(href)
								if (aDomain != aData.domain)
									aData.linksExternal[aData.linksExternal.length] = {
										url: href,
										anchor: link.innerHTML,
										domain: aDomain
									};
								else
									aData.linksInternal[aData.linksInternal.length] = {
										url: href,
										anchor: link.innerHTML,
										domain: aDomain
									};
							}
						}
						link = links = href = length = null

						if (!aDoc.mediaCounted || !aData.loadingSuccess) {
							aData.htmlTab = new XMLSerializer().serializeToString(aDoc);
							aData.html = aData.htmlTab;
							aData.ids = ODPExtension.normalizeIDs(aData.ids, aData.html.match(/(pub|ua)-[^"'&\s]+/gmi) || [])
							aData.domTree = ODPExtension.domTree(aDoc);
							aData.hash = ODPExtension.md5(JSON.stringify(aData.domTree));
							if(aData.hashOriginal == '')
								aData.hashOriginal = aData.hash;

							aData.mediaCount = 0;
							for (var id in tagsMedia)
								aData.mediaCount += aDoc.getElementsByTagName(tagsMedia[id]).length;
						}

						ODPExtension.dispatchEvent('DOMContentLinkChecked', aDoc, aData.ids);

						//count
						aData.imageCount = aDoc.getElementsByTagName('img').length;
						aData.scriptCount = aDoc.getElementsByTagName('script').length;

						//frames
						aData.hasFrameset = aDoc.getElementsByTagName('frameset').length;
						aData.frames = aDoc.getElementsByTagName('iframe').length + aDoc.getElementsByTagName('frame').length;

						aData.framesURLs = [];
						var frames = aDoc.getElementsByTagName('iframe')
						for (var i = 0; i < frames.length; i++) {
							aData.framesURLs[aData.framesURLs.length] = ODPExtension.IDNDecodeURL(ODPExtension.string(frames[i].src));
						}
						var frames = aDoc.getElementsByTagName('frame')
						for (var i = 0; i < frames.length; i++) {
							aData.framesURLs[aData.framesURLs.length] = ODPExtension.IDNDecodeURL(ODPExtension.string(frames[i].src));
						}
						frames = null

						//site "type"
						if(ODPExtension.urlFlagsHashFlash.indexOf(aData.hash) !== -1){
							aData.siteType = 'flash';
							aData.hashKnown = true;
						} else if(aData.hash == 'fc0ca0e30d7f2673fa08c0482ed3f152') {
							aData.siteType = 'pdf';
							aData.hashKnown = true;
						} else if(aData.hash == '869a4716516c5ef5f369913fa60d71b8') {
							aData.siteType = 'txt';
							aData.contentType = 'text/plain';
							aData.hashKnown = true;
						} else if(aData.hash == '4829ce6bb0951e966681fe2011b87ace'){//browser viewer
							if(aData.htmlRequester.indexOf('xmlns=\'http://www.w3.org/2005/Atom\'') !== -1 || aData.htmlRequester.indexOf('type="application/atom+xml"') !== -1)
								aData.siteType = 'atom';
							else if(aData.htmlRequester.indexOf('<rss') !== -1)
								aData.siteType = 'rss';
							else if(aData.htmlRequester.indexOf('xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns') !== -1)
								aData.siteType = 'rdf';
							aData.hashKnown = true;
						}

						var meta = aDoc.getElementsByTagName('link')
						for (var i = 0; i < meta.length; i++) {
							if(meta[i].hasAttribute('type')){
								var type = meta[i].getAttribute('type').toLowerCase().trim()
								var href = ODPExtension.IDNDecodeURL(ODPExtension.string(meta[i].href))
								switch(type){
									case 'application/rss+xml':{
										aData.metaRSS[aData.metaRSS.length] = {
												url:href,
												title:meta[i].getAttribute('title')
										}
										break;
									}
									case 'application/atom+xml':{
										aData.metaAtom[aData.metaAtom.length] =  {
												url:href,
												title:meta[i].getAttribute('title')
										}
										break;
									}
									case 'application/opensearchdescription+xml':{
										aData.metaOpenSearch[aData.metaOpenSearch.length] =  {
												url:href,
												title:meta[i].getAttribute('title')
										}
										break;
									}
								}
							}
						}
						var meta = aDoc.getElementsByTagName('meta')
						for (var i = 0; i < meta.length; i++) {
							if(meta[i].hasAttribute('name')){
								var name = meta[i].getAttribute('name').toLowerCase().trim()
								switch(name){
									case 'author':{
										aData.metaAuthor = meta[i].getAttribute('content')
										break;
									}
									case 'copyright':{
										aData.metaCopyright = meta[i].getAttribute('content')
										break;
									}
									case 'robots':{
										aData.metaRobots = meta[i].getAttribute('content')
										break;
									}
									case 'generator':{
										aData.metaGenerator = meta[i].getAttribute('content')
										break;
									}
									case 'keywords':{
										aData.metaKeywords = meta[i].getAttribute('content')
										break;
									}
								}
							}
						}
						meta = type = href = name = null

						//CLONE DOC, DO NOT TOUCH THE DOC IN THE TAB
						aDoc = aDoc.cloneNode(true);
						for (var id in tagsMedia) {
							var tags = aDoc.getElementsByTagName(tagsMedia[id]);
							var i = tags.length;
							while (i--) {
								tags[i] && tags[i].parentNode && tags[i].parentNode.removeChild(tags[i]);
							}
						}
						for (var id in tagsNoContent) {
							var tags = aDoc.getElementsByTagName(tagsNoContent[id]);
							var i = tags.length;
							while (i--)
								tags[i] && tags[i].parentNode && tags[i].parentNode.removeChild(tags[i]);
						}
						ODPExtension.removeComments(aDoc);
						tags = i = id = null

						try {
							aDoc = new XMLSerializer().serializeToString(aDoc.body);
						} catch (e) {
							aDoc = new XMLSerializer().serializeToString(aDoc);
						}
						aData.txt = ODPExtension.htmlSpecialCharsDecode(ODPExtension.stripTags(aDoc, ' ').replace(/\r\n/g, '\n').replace(/[\t| ]+/g, ' ').replace(/\n\s+/g, '\n').replace(/\s+\n/g, '\n').trim());
						aData.wordCount = aData.txt.split(' ').length
						aData.strLength = aData.txt.length

						ODPExtension.disableTabFeatures(ODPExtension.windowGetFromTab(aTab), aTab, aData)
						ODPExtension.urlFlag(aData);

						//because the linkcheck runs in a tab, it add stuff to the browser history that shouldn't be added
						//http://forums.mozillazine.org/viewtopic.php?p=9070125#p9070125
						//if (aData.removeFromBrowserHistory)
						//	ODPExtension.removeURLFromBrowserHistory(aURL);

						ODPExtension.tabClose(aTab);

						oRedirectionAlert.cache[aURL] = aTab = aDoc = aTabBrowser = null;

						aData.dateEnd = ODPExtension.now();
						aData.loadTime = ((ODPExtension.sqlDate(aData.dateEnd) - ODPExtension.sqlDate(aData.dateStart))/1000) || 0

						oRedirectionAlert.done(aFunction, aData, aURL, aOriginalURL)

						oRedirectionAlert.next();

						oRedirectionAlert.itemsDone++;
						if (oRedirectionAlert.itemsDone == oRedirectionAlert.itemsWorking)
							oRedirectionAlert.unLoad();
					}

					function DOMContentLoaded(aEvent) {

						ODPExtension.disableTabFeatures(ODPExtension.windowGetFromTab(aTab), aTab, aData)
						ODPExtension.disableMedia(aEvent.originalTarget)

						oRedirectionAlert.next();

						if (timedout.status === -1) {
							var aDoc = aEvent.originalTarget;
							if (!aDoc.defaultView)
								var topDoc = aDoc;
							else
								var topDoc = aDoc.defaultView.top.document;

							//its a frame
							if (aDoc != topDoc) {

							//not a frame
							} else {

								if(ODPExtension.redirectionAlertWatchDoc(aDoc, aTabBrowser, aData, timedout, oRedirectionAlert)){

									oRedirectionAlert.next();

									setTimeout(function() {
										var currentDoc = ODPExtension.documentGetFromTab(aTab)
										if(aDoc != currentDoc){

											oRedirectionAlert.itemsNetworking++;

											//ODPExtension.dump('the document is different')
											aData.statuses.push('meta/js');
											timedout.status = -1

											clearTimeout(timedout.timer)
											timedout.timer = setTimeout(function() {
												if (timedout.status === -1) {
													ODPExtension.dump('timeoud1')
													timedout.status = 1;
													oRedirectionAlert.itemsNetworking--;
													onTabLoad();
												}
											}, timeoutAfter + gracePeriod); //give time to load, else, just forget it.

											DOMContentLoaded({originalTarget:currentDoc})
										} else {
											aData.loadingSuccess = true;
											onTabLoad()
										}
									}, watchingPeriod);
								}

							}
						}
					}
					aTabBrowser.addEventListener("DOMContentLoaded", DOMContentLoaded, false);

					aTabBrowser.webNavigation.allowAuth = false;
					aTabBrowser.webNavigation.allowImages = false;
					try {
						aTabBrowser.webNavigation.allowMedia = false; //does not work
					} catch (e) {}
					aTabBrowser.webNavigation.allowJavascript = true;
					aTabBrowser.webNavigation.allowMetaRedirects = true;
					aTabBrowser.webNavigation.allowPlugins = false;
					aTabBrowser.webNavigation.allowWindowControl = false;
					aTabBrowser.webNavigation.allowSubframes = true;

					if (!ODPExtension.preferenceGet('link.checker.use.cache'))
						aTabBrowser.loadURIWithFlags(aURL, aTabBrowser.webNavigation.LOAD_FLAGS_BYPASS_PROXY | aTabBrowser.webNavigation.LOAD_FLAGS_BYPASS_CACHE | aTabBrowser.webNavigation.LOAD_ANONYMOUS | aTabBrowser.webNavigation.LOAD_FLAGS_BYPASS_HISTORY, null, null);
					else
						aTabBrowser.loadURI(aURL);

					timedout.timer = setTimeout(function() {
						if (timedout.status === -1) {
							ODPExtension.dump('timeoud2')
							timedout.status = 1;
							oRedirectionAlert.itemsNetworking--;
							onTabLoad();
						}
					}, timeoutAfter + gracePeriod); //give time to load, else, just forget it.
					return null;
				};
				Requester.onerror = Requester.onabort = function(TIMEDOUT) {
					oRedirectionAlert.itemsNetworking--;
					oRedirectionAlert.next();

					aData.checkType = 'XMLHttpRequestError'
					//ODPExtension.dump('Requester.onerror');
					//ODPExtension.dump(TIMEDOUT);
					if (letsTryAgainIfFail == 1 && !aData.isDownload) {
						//ODPExtension.dump('sending again..'+aURL);
						oRedirectionAlert.itemsDone++;
						clearTimeout(timer);

						aData.statuses = [];
						aData.urlRedirections = [];

						oRedirectionAlert._check(aURL, aFunction, aOriginalURL, 0);
					} else {
						if (loaded)
							return null;
						loaded = true;

						if (aData.isDownload) {
							aData.checkType = 'Attachment'
							if (aData.contentType == '') //the raw contentType sometimes has the "charset" and other stuff, only get it if is not already set.
								aData.contentType = Requester.getResponseHeader('Content-Type');
							aData.headers = Requester.getAllResponseHeaders();

						} else if (typeof(TIMEDOUT) != 'undefined' && TIMEDOUT === 'TIMEDOUT') {
							aData.statuses.push(-5)
							aData.checkType = 'XMLHttpRequestTimeout'
						} else if (typeof(TIMEDOUT) != 'undefined' && TIMEDOUT === 'ABORTED') {
							//oHttp.responseStatus = -5
							aData.stop = true;
							aData.checkType = 'XMLHttpRequestAbortMedia'
						} else {
							if (
								Components
								.classes["@mozilla.org/network/io-service;1"]
								.getService(Components.interfaces.nsIIOService)
								.offline ||
								false //ODPExtension.getIPFromDomain('www.google.com', true) === '' // this blocks the browser because is sync
							) {
								aData.statuses.push(-1337)
							} else {
								try {
									aData.statuses.push(ODPExtension.createTCPErrorFromFailedXHR(Requester, aData));
								} catch (e) {
									try {
										aData.statuses.push(Requester.status);
									} catch (e) {
										aData.statuses.push(-1);
									}
								}
								if (aData.statuses[aData.statuses.length - 1] === 0)
									aData.statuses[aData.statuses.length - 1] = -1;
							}
						}

						aData.stop = true;

						aData.subdomain = ODPExtension.getSubdomainFromURL(aData.urlLast);
						aData.domain = ODPExtension.getDomainFromURL(aData.urlLast);

						ODPExtension.urlFlag(aData);
						oRedirectionAlert.cache[aURL] = null;

						aData.dateEnd = ODPExtension.now();
						aData.loadTime = ((ODPExtension.sqlDate(aData.dateEnd) - ODPExtension.sqlDate(aData.dateStart))/1000) || 0

						oRedirectionAlert.done(aFunction, aData, aURL, aOriginalURL)

						oRedirectionAlert.next();
						oRedirectionAlert.itemsDone++;
						if (oRedirectionAlert.itemsDone == oRedirectionAlert.itemsWorking)
							oRedirectionAlert.unLoad();
					}
					oRedirectionAlert.next();
					return null;
				};
				Requester.open("GET", aURL, true);
				if (!ODPExtension.preferenceGet('link.checker.use.cache'))
					Requester.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_FLAGS_BYPASS_PROXY | Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE | Components.interfaces.nsIRequest.LOAD_ANONYMOUS | Components.interfaces.nsIRequest.LOAD_FLAGS_BYPASS_HISTORY;
				else
					Requester.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_ANONYMOUS | Components.interfaces.nsIRequest.LOAD_FLAGS_BYPASS_HISTORY

				if (letsTryAgainIfFail === 0) {
					try{
						Requester.setRequestHeader('Referer', aURL);
					}catch(e){
						Requester.setRequestHeader('Referer', ODPExtension.IDNEncodeURL(aURL));
					}
				} else {
					Requester.setRequestHeader('Referer', 'https://www.google.com/');
				}
				//Just dont try and catch this.. try{
				Requester.send(null);
				//}catch(e){}
				//in some situations, timeout is maybe ignored, but neither onload, onerror nor onabort are called
				timer = setTimeout(function() {
					if (!loaded) {
						//ODPExtension.dump('aborted'+aURL);
						Requester.onerror('TIMEDOUT');
					}
				}, timeoutAfter + gracePeriod);
				//ODPExtension.dump('check');
			}
		};

		var oRedirectionAlert = new RedirectionAlert();
		oRedirectionAlert.init();

		return oRedirectionAlert;
	}
	//https://developer.mozilla.org/en-US/docs/How_to_check_the_security_state_of_an_XMLHTTPRequest_over_SSL
	this.createTCPErrorFromFailedXHR = function(xhr, aData) {
		var status = xhr.channel.QueryInterface(Components.interfaces.nsIRequest).status;

		var errType;
		var errName = -1;
		if ((status & 0xff0000) === 0x5a0000) { // Security module
			const nsINSSErrorsService = Components.interfaces.nsINSSErrorsService;
			var nssErrorsService = Components.classes['@mozilla.org/nss_errors_service;1'].getService(nsINSSErrorsService);
			var errorClass;
			// getErrorClass will throw a generic NS_ERROR_FAILURE if the error code is
			// somehow not in the set of covered errors.
			try {
				errorClass = nssErrorsService.getErrorClass(status);
			} catch (ex) {
				errorClass = 'SecurityProtocol';
			}
			if (errorClass == nsINSSErrorsService.ERROR_CLASS_BAD_CERT) {
				errType = 'SecurityCertificate';
			} else {
				errType = 'SecurityProtocol';
			}

			// NSS_SEC errors (happen below the base value because of negative vals)
			if ((status & 0xffff) < Math.abs(nsINSSErrorsService.NSS_SEC_ERROR_BASE)) {
				// The bases are actually negative, so in our positive numeric space, we
				// need to subtract the base off our value.
				var nssErr = Math.abs(nsINSSErrorsService.NSS_SEC_ERROR_BASE) - (status & 0xffff);
				switch (nssErr) {
					case 11: // SEC_ERROR_EXPIRED_CERTIFICATE, sec(11)
						errName = 'SecurityExpiredCertificateError';
						break;
					case 12: // SEC_ERROR_REVOKED_CERTIFICATE, sec(12)
						errName = 'SecurityRevokedCertificateError';
						break;

						// per bsmith, we will be unable to tell these errors apart very soon,
						// so it makes sense to just folder them all together already.
					case 13: // SEC_ERROR_UNKNOWN_ISSUER, sec(13)
					case 20: // SEC_ERROR_UNTRUSTED_ISSUER, sec(20)
					case 21: // SEC_ERROR_UNTRUSTED_CERT, sec(21)
					case 36: // SEC_ERROR_CA_CERT_INVALID, sec(36)
						errName = 'SecurityUntrustedCertificateIssuerError';
						break;
					case 90: // SEC_ERROR_INADEQUATE_KEY_USAGE, sec(90)
						errName = 'SecurityInadequateKeyUsageError';
						break;
					case 176: // SEC_ERROR_CERT_SIGNATURE_ALGORITHM_DISABLED, sec(176)
						errName = 'SecurityCertificateSignatureAlgorithmDisabledError';
						break;
					default:
						errName = 'SecurityError';
						break;
				}
			} else {
				var sslErr = Math.abs(nsINSSErrorsService.NSS_SSL_ERROR_BASE) - (status & 0xffff);
				switch (sslErr) {
					case 3: // SSL_ERROR_NO_CERTIFICATE, ssl(3)
						errName = 'SecurityNoCertificateError';
						break;
					case 4: // SSL_ERROR_BAD_CERTIFICATE, ssl(4)
						errName = 'SecurityBadCertificateError';
						break;
					case 8: // SSL_ERROR_UNSUPPORTED_CERTIFICATE_TYPE, ssl(8)
						errName = 'SecurityUnsupportedCertificateTypeError';
						break;
					case 9: // SSL_ERROR_UNSUPPORTED_VERSION, ssl(9)
						errName = 'SecurityUnsupportedTLSVersionError';
						break;
					case 12: // SSL_ERROR_BAD_CERT_DOMAIN, ssl(12)
						errName = 'SecurityCertificateDomainMismatchError';
						break;
					default:
						errName = 'SecurityError';
						break;
				}
			}
		} else {
			errType = 'Network';
			switch (status) {
				// connect to host:port failed
				case 0x804B000C: // NS_ERROR_CONNECTION_REFUSED, network(13)
					errName = -4; //ConnectionRefused
					break;
					// network timeout error
				case 0x804B000E: // NS_ERROR_NET_TIMEOUT, network(14)
					errName = -5; //NetworkTimeout
					break;
					// hostname lookup failed
				case 0x804B001E: // NS_ERROR_UNKNOWN_HOST, network(30)
					errName = -1; //DomainNotFound
					break;
				case 0x804B0047: // NS_ERROR_NET_INTERRUPT, network(71)
					errName = -1337; //NetworkInterrupt
					break;
				default:
					errName = -4; //NetworkError
					break;
			}
		}
		return errName;
	}

	this.disableTabFeatures = function(aWindow, aTab, aData) {

		var events = ['beforeunload', 'unbeforeunload']
		var noop = function(){}
		var yesop = function(){ return true; }
		var notempty = function(){ return 'something'; }

		this.disableTabFeaturesCounter(aWindow.onbeforeunload, aData);
		this.disableTabFeaturesCounter(aWindow.beforeunload, aData);
		this.disableTabFeaturesCounter(aWindow.wrappedJSObject.onbeforeunload, aData);
		this.disableTabFeaturesCounter(aWindow.wrappedJSObject.beforeunload, aData);

		var v = aWindow.wrappedJSObject;
		for (var id in events) {
			if (v._eventTypes && v._eventTypes[events[id]]) {
				var r = v._eventTypes[events[id]];
				for (var s = 0; s < r.length; s++) {
					this.disableTabFeaturesCounter(r[events[id]], aData);
					v.removeEventListener(events[id], r[events[id]], false);
					v.removeEventListener(events[id], r[events[id]], true);
				}
				v._eventTypes[events[id]] = [];
			}
		}

		aWindow.wrappedJSObject.alert = aWindow.wrappedJSObject.focus = aWindow.alert = aWindow.wrappedJSObject.onbeforeunload = aWindow.wrappedJSObject.beforeunload = aWindow.onbeforeunload = aWindow.beforeunload = aWindow.focus = noop
		aWindow.wrappedJSObject.prompt = aWindow.prompt = notempty
		aWindow.wrappedJSObject.confirm =  aWindow.confirm = yesop
		aWindow.console.log = aWindow.console.debug = aWindow.console.error = aWindow.console.dir = aWindow.console.exception = aWindow.console.info = aWindow.console.warn = aWindow.console.trace = noop
		aWindow.wrappedJSObject.console.log = aWindow.wrappedJSObject.console.debug = aWindow.wrappedJSObject.console.error = aWindow.wrappedJSObject.console.dir = aWindow.wrappedJSObject.console.exception = aWindow.wrappedJSObject.console.info = aWindow.wrappedJSObject.console.warn = aWindow.wrappedJSObject.console.trace = noop

		this.foreachFrame(aWindow.wrappedJSObject, function(aDoc) {
			var aWin = aDoc.defaultView;

			var v = aWin;
			for (var id in events) {
				if (v && v._eventTypes && v._eventTypes[events[id]]) {
					var r = v._eventTypes[events[id]];
					for (var s = 0; s < r.length; s++) {
						ODPExtension.disableTabFeaturesCounter(r[events[id]], aData);
						v.removeEventListener(events[id], r[events[id]], false);
						v.removeEventListener(events[id], r[events[id]], true);
					}
					v._eventTypes[events[id]] = [];
				}
			}
			ODPExtension.disableTabFeaturesCounter(aWin.onbeforeunload, aData);
			ODPExtension.disableTabFeaturesCounter(aWin.beforeunload, aData);

			aWin.alert = aWin.onbeforeunload = aWin.beforeunload = aWin.focus = noop;
			aWin.prompt = notempty
			aWin.confirm = yesop
			aWin.console.log = aWin.console.debug = aWin.console.error = aWin.console.dir = aWin.console.exception = aWin.console.info = aWin.console.warn = aWin.console.trace = noop
		});
	}
	this.disableTabFeaturesCounter = function(aFunction, aData) {
		if ( !! aFunction && !! aFunction.toSource) {
			var src = aFunction.toSource();
			if (src.indexOf('return') != -1 || src.indexOf('alert') != -1 || src.indexOf('confirm') != -1)
				aData.intrusivePopups++;
		}
	}
	this.disableMedia = function(aDoc){
		for (var id in tagsMedia) {
			var tags = aDoc.getElementsByTagName(tagsMedia[id]);
			var i = tags.length;
			while (i--) {
				try {
					tags[i].pause();
					try {
						tags[i].stop();
					} catch (e) {
						try {
							tags[i].stop();
						} catch (e) {}
					}
				} catch (e) {
					try {
						tags[i].stop();
					} catch (e) {}
				}
			}
		}
	}
	this.redirectionAlertWatchDoc = function(aDoc, aTabBrowser, aData, timedout, oRedirectionAlert){

		aData.htmlTab = new XMLSerializer().serializeToString(aDoc);
		aData.html = aData.htmlTab;
		aData.ids = ODPExtension.normalizeIDs(aData.ids, aData.html.match(/(pub|ua)-[^"'&\s]+/gmi) || [])
		aData.domTree = ODPExtension.domTree(aDoc);
		aData.hash = ODPExtension.md5(JSON.stringify(aData.domTree));
		if(aData.hashOriginal == '')
			aData.hashOriginal = aData.hash;

		//Check for framed redirects
		var aURI = '';

		if(ODPExtension.urlFlagsHashFramesetRedirect.indexOf(aData.hash) !== -1 && aDoc.getElementsByTagName('frame')[0] && aDoc.getElementsByTagName('frame')[0].src)
			aURI = aDoc.getElementsByTagName('frame')[0].src;
		else if(ODPExtension.urlFlagsHashFramesetRedirect.indexOf(aData.hash) !== -1 && aDoc.getElementsByTagName('iframe')[0] && aDoc.getElementsByTagName('iframe')[0].src)
			aURI = aDoc.getElementsByTagName('iframe')[0].src;

		if(aURI != '') {

			timedout.status = -1

			aData.statuses.push('framed');
			if (!ODPExtension.preferenceGet('link.checker.use.cache'))
				aTabBrowser.loadURIWithFlags(aURI, aTabBrowser.webNavigation.LOAD_FLAGS_BYPASS_PROXY | aTabBrowser.webNavigation.LOAD_FLAGS_BYPASS_CACHE | aTabBrowser.webNavigation.LOAD_ANONYMOUS | aTabBrowser.webNavigation.LOAD_FLAGS_BYPASS_HISTORY, null, null);
			else
				aTabBrowser.loadURI(aURI);

			return false

		} else {

			timedout.status = 2;
			oRedirectionAlert.itemsNetworking--;

			aDoc.mediaCounted = true;
			aData.mediaCount = 0
			for (var id in tagsMedia)
				aData.mediaCount += aDoc.getElementsByTagName(tagsMedia[id]).length;

			return true
		}
	}
	// comments of the error codes based or taken from http://www.dmoz.org/docs/en/errorcodes.html
	this.urlFlag = function(aData) {

		aData.status = {};
		aData.status.error = true;
		aData.status.code = false;
		aData.status.canDelete = false;
		aData.status.canUnreview = false;
		aData.status.suspicious = [];

		aData.status.errorString = '';
		aData.status.errorStringUserFriendly = '';

		aData.status.match = '';
		aData.status.matchHash = false;

		aData.urlLast = aData.urlLast.replace(/\/+$/, '/');

		//HTTP redirections to HTTPS are not perceived as a redirection, log it
		if (aData.urlRedirections.length === 1 && aData.urlOriginal != aData.urlLast)
			aData.urlRedirections.push(aData.urlLast)

		var lastStatus = aData.statuses[aData.statuses.length - 1];

		//-6 BAd URL
		if (false ||
		    	aData.urlLast.indexOf('http') !== 0 ||
		    	aData.urlLast.indexOf('https:///') === 0 ||
		    	aData.urlLast.indexOf('http:///') === 0 ||
		    	aData.subdomain.indexOf(',') !== -1 ||
		    	aData.subdomain.indexOf('%') !== -1 ||
		    	!this.isPublicURL(aData.urlLast)
		 || lastStatus == 414 // Request-URI Too Large - The URL (usually created by a GET form request) is too large for the server to handle. Check to see that a lot of garbage didn't somehow get pasted in after the URL.
		|| lastStatus == 413 // Request Entity Too Large - The server is refusing to process a request because the request entity is larger than the server is willing or able to process. Should never occur for Robozilla.
		//|| lastStatus == 400 // Bad Request	Usually occurs due to a space in the URL or other malformed URL syntax. Try converting spaces to %20 and see if that fixes the error.
		) {
			aData.status.code = -6;
			aData.status.errorString = 'Bad URL';
			aData.status.errorStringUserFriendly = 'Bad URL';
			aData.status.canUnreview = true;

			//-1 	Unable to Resolve Host 	They didn't pay their bill for their Domain name.
		} else if (false || aData.statuses.indexOf(-1) != -1 || aData.statuses.indexOf('DomainNotFound') != -1) {
			aData.status.code = -1;
			aData.status.errorString = 'Domain Not Found';
			aData.status.errorStringUserFriendly = 'Does Not Work';
			aData.status.canDelete = true;

			//-401  SSL Error
		} else if (false || aData.statuses.indexOf('SecurityProtocol') != -1 || aData.statuses.indexOf('SecurityCertificate') != -1 || aData.statuses.indexOf('SecurityExpiredCertificateError') != -1 || aData.statuses.indexOf('SecurityRevokedCertificateError') != -1 || aData.statuses.indexOf('SecurityUntrustedCertificateIssuerError') != -1 || aData.statuses.indexOf('SecurityInadequateKeyUsageError') != -1 || aData.statuses.indexOf('SecurityCertificateSignatureAlgorithmDisabledError') != -1 || aData.statuses.indexOf('SecurityError') != -1 || aData.statuses.indexOf('SecurityNoCertificateError') != -1 || aData.statuses.indexOf('SecurityBadCertificateError') != -1 || aData.statuses.indexOf('SecurityUnsupportedCertificateTypeError') != -1 || aData.statuses.indexOf('SecurityUnsupportedTLSVersionError') != -1 || aData.statuses.indexOf('SecurityCertificateDomainMismatchError') != -1 || aData.statuses.indexOf('SecurityCertificateDomainMismatchError') != -1) {
			aData.status.code = -401;
			aData.status.errorString = 'SSL Error: ' + lastStatus;
			aData.status.errorStringUserFriendly = 'SSL Error: ' + lastStatus;
			aData.status.canUnreview = true;

			//-4 	Can't connect 	We can't connect to the HTTP server. The server is there but it didn't want to talk to Robozilla on the specified port.
		} else if (false || aData.statuses.indexOf(-4) != -1 || aData.statuses.indexOf('ConnectionRefused') != -1 || aData.statuses.indexOf('NetworkError') != -1) {
			aData.status.code = -4;
			aData.status.errorString = 'Can\'t Connect';
			aData.status.errorStringUserFriendly = 'Can\'t Connect';
			aData.status.canUnreview = true;

			//-5 	Timeout Robozilla connected OK, and sent the request but Robozilla timed out waiting to fetch the page. This happens sometimes on really busy servers.
		} else if (false || aData.statuses.indexOf(-5) != -1 || aData.statuses.indexOf('NetworkTimeout') != -1 || lastStatus == 408 // Request Time-Out	- The server took longer than expected to return a page, and timed out. Similar to -5, but generated by the server, rather than Robozilla.
		|| lastStatus == 504 // Gateway Timeout - A server being used by this server has not responded in time.
		) {
			aData.status.code = -5;
			aData.status.errorString = 'Network Timeout';
			aData.status.errorStringUserFriendly = 'Network Timeout';
			aData.status.canUnreview = true;

			//-1337 	Local Network error - probably the internet is gone
		} else if (false || aData.statuses.indexOf(-1337) != -1 || aData.statuses.indexOf('NetworkInterrupt') != -1) {
			aData.status.code = -1337;
			aData.status.errorString = 'Internet Gone!?';
			aData.status.errorStringUserFriendly = 'Internet Gone!?';

			//404 	Not Found
		} else if (false || lastStatus == 404 // Not Found
		|| lastStatus == 410 // Gone
		) {
			aData.status.code = lastStatus;
			aData.status.errorString = 'Not Found';
			aData.status.errorStringUserFriendly = 'Not Found';
			aData.status.canUnreview = true;

			//Server Error	The server returned an error code that looks like permanent.
		} else if (false || lastStatus == 505 // HTTP Version Not Supported

		|| lastStatus == 503 // Server Overload
		|| lastStatus == 502 // Bad Gateway
		|| lastStatus == 501 // Not Implemented
		|| lastStatus == 500 // Server error

		|| lastStatus == 417 // Expectation Failed
		|| lastStatus == 416 // Requested Range Not Satisfiable
		|| lastStatus == 415 // Unsupported Media Type


		|| lastStatus == 412 // Precondition Failed
		|| lastStatus == 411 // Length Required

		|| lastStatus == 409 // Conflict

		|| lastStatus == 407 // Proxy Authentication Required
		|| lastStatus == 406 // Not Acceptable
		|| lastStatus == 405 // Method Not Allowed

		|| lastStatus == 403 // Forbidden

		|| lastStatus == 402 // Payment Required.
		|| lastStatus == 401 // Unauthorised
		) {
			aData.status.code = lastStatus;
			aData.status.errorString = 'Server Error';
			aData.status.errorStringUserFriendly = 'Server Error';
			aData.status.canUnreview = true;

			//-8 	Empty Page
		} else if (false  //nothing
		  || (
		      (aData.hash == '869a4716516c5ef5f369913fa60d71b8')  && aData.wordCount < 20 && aData.strLength < 150)
		) {
			aData.status.code = -8;
			aData.statuses.push(aData.status.code);
			aData.status.errorString = 'Empty Page';
			aData.status.errorStringUserFriendly = 'Empty Page';
			aData.status.canUnreview = true;
			aData.status.match = aData.txt;

			//-8 	Tiny Page
		} else if (false  //nothing
		  || (
		      	aData.checkType != 'Attachment'
		      	&& aData.wordCount < 20
		      	&& aData.strLength < 150
		      	&&  !aData.hasFrameset
				&&  aData.mediaCount < 1
				&&  (aData.linksExternal.length + aData.linksInternal.length ) < 1
 		      ) // few words, no media content
		) {
			aData.status.code = -8;
			aData.statuses.push(aData.status.code);
			aData.status.errorString = 'Tiny Page';
			aData.status.errorStringUserFriendly = 'Tiny Page';
			aData.status.canUnreview = true;
			aData.status.match = aData.txt;

			//-1340 	Redirect OK	The server redirects to another page but it's OK and  probably very likelly can be autofixed
		} else if (
		(
			aData.statuses.indexOf(300) !== -1 // Moved
		|| aData.statuses.indexOf(301) !== -1 // Redirect Permanently
		|| aData.statuses.indexOf(302) !== -1 // Redirect Temporarily
		//|| aData.statuses.indexOf(303) !== -1 // See Other
		|| aData.statuses.indexOf('meta/js') !== -1 // meta/js redirect
		|| aData.urlOriginal != aData.urlLast) && this.redirectionOKAutoFix(aData.urlOriginal, aData.urlLast)) {
			aData.status.code = -1340;
			aData.status.errorString = 'Redirect OK Candidate 4 Autofix';
			aData.status.errorStringUserFriendly = 'OK';
			aData.status.error = false;

			//-1338 	Redirect OK	The server redirects to another page but it's OK
		} else if (
		(
			aData.statuses.indexOf(300) !== -1 // Moved
		|| aData.statuses.indexOf(301) !== -1 // Redirect Permanently
		|| aData.statuses.indexOf(302) !== -1 // Redirect Temporarily
		//|| aData.statuses.indexOf(303) !== -1 // See Other
		|| aData.statuses.indexOf('meta/js') !== -1 // meta/js redirect
		|| aData.urlOriginal != aData.urlLast) && this.redirectionOK(aData.urlOriginal, aData.urlLast)) {
			aData.status.code = -1338;
			aData.status.errorString = 'Redirect OK';
			aData.status.errorStringUserFriendly = 'OK';
			aData.status.error = false;

			//-1339 	Redirect Must be corrected The server redirects to another page and must be corrected
		} else if (false || aData.statuses.indexOf(300) !== -1 // Moved
		|| aData.statuses.indexOf(301) !== -1 // Redirect Permanently
		|| aData.statuses.indexOf(302) !== -1 // Redirect Temporarily
		|| aData.statuses.indexOf(303) !== -1 // See Other
		|| aData.statuses.indexOf('meta/js') !== -1 // meta/js redirect
		|| aData.urlOriginal != aData.urlLast) {
			aData.status.code = -1339;
			aData.status.errorString = 'Redirect';
			aData.status.errorStringUserFriendly = 'Redirect';

			//200 OK
		} else if (false || lastStatus == 200  //|| lastStatus == 304 // OK / Not modified
		) {
			aData.status.code = 200;
			aData.status.errorString = 'OK';
			aData.status.errorStringUserFriendly = 'OK';

			aData.status.error = false;

			//-7 	Server Error	The server returned an unknown error code, and is probably mis-configured. The page may still show up okay, but it's a good idea to check it just in case.
		} else {
			aData.status.code = lastStatus;
			aData.status.errorString = 'Unknown Error';
			aData.status.errorStringUserFriendly = 'Unknown Error';
		}

		//most important should go first (example, makes no sense to check for errors in a page that is just parked)
		var array = [''
				, 'pendingRenew'

				, 'forSale'
				, 'parked'

				, 'hacked'
				, 'hijacked'

				, 'gonePermanent'
				, 'notFound'
				, 'serverPage'

				, 'requiresLogin'
				//, 'messageFromOwner'
				, 'noContent'

				, 'pageErrors'
				, 'serverErrors'

				, 'underConstruction'

				, 'comingSoon'
				, 'suspended'

				//, 'dirty'
		]

		var externalContent = ''
		for (var id in aData.externalContent)
			externalContent += aData.externalContent[id].url+' ';
		aData.ids = this.normalizeIDs(aData.ids, (externalContent).match(/(pub|ua)-[^"'&\s]+/gmi) || [])
		var data = (aData.urlRedirections.join('\n') + '\n' + externalContent + '\n' + aData.headers + '\n' + aData.html).toLowerCase().replace(/\s+/g, ' ');
		var breaky = false;
		for (var name in array) {
			if (array[name] != '') {

				//bodyMatch
				var flag = this['urlFlags'][array[name]]

				if (aData.hash != '' && flag['hash'].indexOf(aData.hash) != -1) {
					aData.status.error = true;

					if(! flag['errorCodeApplyOnOKOnly'] || ( flag['errorCodeApplyOnOKOnly'] && aData.status.code == 200)) {
						aData.status.code = flag['errorCode'];
						aData.statuses.push(aData.status.code);
					}

					if (flag['canDelete'])
						aData.status.canDelete = true;
					if (flag['canUnreview'])
						aData.status.canUnreview = true;

					aData.status.errorString = flag['errorString'];
					aData.status.errorStringUserFriendly = flag['errorStringUserFriendly'];
					//aData.status.match = string;
					aData.status.matchHash = true;
					aData.hashKnown = true;
					breaky = true;
					break;
				}

				for (var id in flag['body']) {
					var string = flag['body'][id].replace(/\s+/g, ' ').toLowerCase().trim();
					if (string != '' && data.indexOf(string) != -1  ) {
						aData.status.error = true;

						if(! flag['errorCodeApplyOnOKOnly'] || ( flag['errorCodeApplyOnOKOnly'] && aData.status.code == 200)) {
							aData.status.code = flag['errorCode'];
							aData.statuses.push(aData.status.code);
						}

						if (flag['canDelete'])
							aData.status.canDelete = true;
						if (flag['canUnreview'])
							aData.status.canUnreview = true;

						aData.status.errorString = flag['errorString'];
						aData.status.errorStringUserFriendly = flag['errorStringUserFriendly'];
						aData.status.match = string;
						breaky = true;
						break;
					}
				}
				if (breaky)
					break;
			}
		}

		//Unknown content type
		if (contentTypesKnown.indexOf(aData.contentType) == -1)
			aData.status.suspicious.push('Unknown content type: ' + aData.contentType);
		//just flag
		if (aData.hash != '' && this.urlFlagsHash.indexOf(aData.hash) != -1){
			aData.status.suspicious.push('Document may has problems');
			aData.hashKnown = true;
		}
		//framset
		if (aData.hash != '' && this.urlFlagsHashFrameset.indexOf(aData.hash) != -1 ){
			aData.hashKnown = true;
		}
		//Known
		if (aData.hash != '' && this.urlFlagsHashKnown.indexOf(aData.hash) != -1 ){
			aData.hashKnown = true;
		}

		if (aData.intrusivePopups > 1)
			aData.status.suspicious.push('Window may has problems');
	}
	//free.fr blogspot.tld wordpress.com
	var removeTLD = /(\.(website|web|jimdo|pagespersoorange|e\.telefonica|free|blogspot|wordpress))?(\.(aero|arpa|asia|biz|cat|co|com|coop|edu|gb|gob|gouv|gov|gub|gv|info|int|jobs|mil|mobi|museum|name|ne|net|org|post|pro|tel|travel))?(\.(ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bl|bm|bn|bo|bq|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cw|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mf|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|cat|yu|za|zm|zw|мон|рф|срб|укр|қаз|الاردن|الجزائر|السعودية|المغرب|امارات|ایران|بھارت|تونس|سودان|سورية|عمان|فلسطين|قطر|مصر|مليسيا|پاکستان|भारत|বাংলা|ভারত|ਭਾਰਤ|ભારત|இந்தியா|இலங்கை|சிங்கப்பூர்|భారత్|ලංකා|ไทย|გე|中国|中國|台湾|台灣|新加坡|香港|한국))?$/i;

	var removeFreeHost = /^(sites\.google\.com\/site\/|sites\.google\.com\/a\/|users.skynet.be\/)/i;

	var IDNDiacriticDigraphsFind = [
		//digraphs
		/ß/gi,
		/æ/gi,
		/ĳ/gi,
		/œ/gi,
		/ǆ/gi,
		/ǉ/gi,
		/ǌ/gi,
		/ǣ/gi,
		/ǳ/gi,
		/ǽ/gi,
		/ȸ/gi,
		/ȹ/gi,
		/ɶ/gi,
		/ʣ/gi,
		/ʤ/gi,
		/ʥ/gi,
		/ʦ/gi,
		/ʧ/gi,
		/ʨ/gi,
		/ʩ/gi,
		/ʪ/gi,
		/ʫ/gi,
		/ᴁ/gi,
		/ᴂ/gi,
		/ᴔ/gi,
		/ᵺ/gi,
		/ﬁ/gi,
		/ﬂ/gi,

		//Diacritic
		/à|á|â|ã|ä|å|ā|ă|ą|ǎ|ǟ|ǡ|ǻ|ȁ|ȃ|ȧ|ɐ|ɑ|ᶏ|ḁ|ạ|ả|ấ|ầ|ẩ|ẫ|ậ|ắ|ằ|ẳ|ẵ|ặ|ⱥ/gi,
		/ƀ|ƃ|ɓ|ᵬ|ᶀ|ḃ|ḅ|ḇ/gi,
		/ç|ć|ĉ|ċ|č|ƈ|ȼ|ɕ|ḉ/gi,
		/ď|đ|ƌ|ȡ|ɖ|ɗ|ᵭ|ᶁ|ᶑ|ḋ|ḍ|ḏ|ḑ|ḓ|∂/gi,
		/è|é|é|é|ê|ë|ē|ĕ|ė|ę|ě|ȅ|ȇ|ȩ|ɇ|е|ё|ᶒ|ḕ|ḗ|ḙ|ḛ|ḝ|ẹ|ẻ|ẽ|ế|ề|ể|ễ|ệ/gi,
		/ƒ|ᵮ|ᶂ|ḟ/gi,
		/ĝ|ğ|ġ|ģ|ǥ|ǧ|ǵ|ɠ|ᶃ|ḡ/gi,
		/h|ĥ|ħ|ȟ|̱ẖ|ḣ|ḥ|ḧ|ḩ|ḫ|ⱨ/gi,
		/i|ì|í|î|ï|ĩ|ī|ĭ|į|ı|ǐ|ȉ|ȋ|ɨ|̇|ї|ᵻ|ᶖ|ḭ|ḯ|ỉ|ị/gi,
		/j|ĵ|ȷ|ɉ|ɟ|ʄ|ʝ|̌ǰ/gi,
		/k|ķ|ƙ|ǩ|̂k̂|ќ|ᶄ|ḱ|ḳ|ḵ|ⱪ/gi,
		/ĺ|ļ|ľ|ŀ|ł|ƚ|ȴ|ɫ|ɬ|ɭ|ᶅ|ḷ|ḹ|ḻ|ḽ|ⱡ/gi,
		/ɱ|ᵯ|ᶆ|ḿ|ṁ|ṃ/gi,
		/n|ñ|ń|ņ|ň|ŋ|ƞ|ǹ|ȵ|ɲ|ɳ|̈n̈|й|ᵰ|ᶇ|ṅ|ṇ|ṉ|ṋ/gi,
		/o|ò|ó|ô|õ|ö|ø|ō|ŏ|ő|ơ|ǒ|ǫ|ǭ|ǿ|ȍ|ȏ|ȫ|ȭ|ȯ|ȱ|ɔ|ɵ|͘o͘|ṍ|ṏ|ṑ|ṓ|ọ|ỏ|ố|ồ|ổ|ỗ|ộ|ớ|ờ|ở|ỡ|ợ/gi,
		/p|ƥ|̃p̃|ᵱ|ᵽ|ᶈ|ṕ|ṗ/gi,
		/ƣ|ɋ|ʠ/gi,
		/ŕ|ŗ|ř|ȑ|ȓ|ɍ|ɼ|ɽ|ɾ|ѓ|ᵲ|ᵳ|ᶉ|ṙ|ṛ|ṝ|ṟ/gi,
		/s|s̩|ś|ŝ|ş|š|ș|ȿ|ʂ|̩|ᵴ|ᶊ|ṡ|ṣ|ṥ|ṧ|ṩ/gi,
		/t|ţ|ť|ŧ|ƫ|ƭ|ț|ȶ|ʈ|̈ẗ|ᵵ|ṫ|ṭ|ṯ|ṱ|ⱦ/gi,
		/ù|ú|û|ü|ũ|ū|ŭ|ů|ű|ų|ư|ǔ|ǖ|ǘ|ǚ|ǜ|ȕ|ȗ|ʉ|ᵾ|ᶙ|ṳ|ṵ|ṷ|ṹ|ṻ|ụ|ủ|ứ|ừ|ử|ữ|ự/gi,
		/ʋ|ᶌ|ṽ|ṿ|ⱱ|ⱴ/gi,
		/w|ŵ|̊ẘ|ẁ|ẃ|ẅ|ẇ|ẉ|ⱳ/gi,
		/ᶍ|ẋ|ẍ/gi,
		/y|ý|ÿ|ŷ|ƴ|ȳ|ɏ|ʏ|̊ẙ|ў|ẏ|ỳ|ỵ|ỷ|ỹ/gi,
		/ź|ż|ž|ƶ|ȥ|ɀ|ʐ|ʑ|ᵶ|ᶎ|ẑ|ẓ|ẕ|ⱬ/gi
	]
	var IDNDiacriticDigraphsReplace = [
		's',
		'ae',
		'ij',
		'oe',
		'dz',
		'lj',
		'nj',
		'ae',
		'dz',
		'ae',
		'db',
		'qp',
		'oe',
		'dz',
		'dezh',
		'dz',
		'ts',
		'tesh',
		'tc',
		'feng',
		'ls',
		'lz',
		'ae',
		'ae',
		'oe',
		'th',
		'fi',
		'fl',

		'a',
		'b',
		'c',
		'd',
		'e',
		'f',
		'g',
		'h',
		'i',
		'j',
		'k',
		'l',
		'm',
		'n',
		'o',
		'p',
		'q',
		'r',
		's',
		't',
		'u',
		'v',
		'w',
		'x',
		'y',
		'z'
	]
	this.redirectionOKAutoFix = function(oldURL, newURL) {
		if (oldURL == newURL)
			return false;

		oldURL = this.removeWWW(this.removeSchema(this.shortURLAggresive(oldURL))).replace(/\/+$/, '').toLowerCase().replace(/-|_/g, '').trim();
		newURL = this.removeSchema(newURL)
								.replace(/\/+$/, '')
								.replace(/^www\./, '') // if http://www.tld/ redirects to http://www9.tld/ shouldn't be corrected [we only remove the www]
								.toLowerCase().replace(/-|_/g, '')
								.trim();

		if (oldURL == newURL)
			return true;

		if(newURL.indexOf('/') != -1)//only for files and folder, not TLDs
			newURL = newURL.replace(/\.[a-z]{3,4}$/,'') // example when http://tld/folder/ redirects to http://tld/folder.htm

		if (oldURL == newURL)
			return true;

		oldURL = oldURL.replace(removeFreeHost, '')
		newURL = newURL.replace(removeFreeHost, '')

		if (oldURL == newURL)
			return true;

		//remove tld, http://www.well.tld1/ redirects to http://www.well.tld2/ must be corrected, or http://myusername.freehost.tld1/ to http://myusername.tld1/
		oldURL = oldURL.split('/')
		oldURL[0] = oldURL[0].replace(removeTLD, '')
		oldURL = oldURL.join('/')

		newURL = newURL.split('/')
		newURL[0] = newURL[0].replace(removeTLD, '')
		newURL = newURL.join('/')

		if (oldURL == newURL)
			return true;

		oldURL = oldURL.replace(/\./g, '').replace(/\,/g, '')
		newURL = newURL.replace(/\./g, '').replace(/\,/g, '')

		if (oldURL == newURL)
			return true;

		//decode
		oldURL = this.decodeUTF8Recursive(oldURL)
		newURL = this.decodeUTF8Recursive(newURL)

		if (oldURL == newURL)
			return true;

		//IDN decode
		for(var id in IDNDiacriticDigraphsFind){
			oldURL = oldURL.replace(IDNDiacriticDigraphsFind[id], IDNDiacriticDigraphsReplace[id])
			newURL = newURL.replace(IDNDiacriticDigraphsFind[id], IDNDiacriticDigraphsReplace[id])
		}

		if (oldURL == newURL)
			return true;
		else
			return false;
	}

	this.redirectionOK = function(oldURL, newURL) {

		if (this.getSchema(oldURL) != this.getSchema(newURL))
			return false;
		oldURL = this.removeWWW(this.removeSchema(oldURL)).replace(/\/+$/, '').toLowerCase().trim();
		newURL = this.removeWWW(this.removeSchema(newURL)).replace(/\/+$/, '').toLowerCase().trim();

		if (oldURL == newURL) {
			return true;
		} else if (newURL.indexOf(oldURL) === 0) {
			return true;
		} else {
			return false;
		}
	}

	return null;

}).apply(ODPExtension);
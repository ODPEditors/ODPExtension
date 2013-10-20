(function() {
	/*
			This file comes from an idea from here http://forums.dmoz.org/forum/viewtopic.php?t=920940&start=0#1716101
			The link checker was introduced here http://forums.dmoz.org/forum/viewtopic.php?t=920940&start=50#1758894
		*/
	/*
		tabsListener = {
			QueryInterface: function(aIID) {
				if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
					aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
					aIID.equals(Components.interfaces.nsISupports))
					return this;
				throw Components.results.NS_NOINTERFACE;
			},
			onLocationChange: function(aBrowser, aWebProgress, aRequest, aLocation) {
				//ODPExtension.dump('onLocationChange:onLocationChange', true);
				ODPExtension.dispatchOnLocationChange(false);
			},
			onStateChange: function(aBrowser, aWebProgress, aRequest, aFlag, aStatus) {
				if (aFlag & STATE_STOP) {
					ODPExtension.dispatchDOMContentLoaded({originalTarget:aWebProgress.DOMWindow.document});
				}
			},
			onProgressChange: function(aBrowser, aWebProgress, aRequest, curSelf, maxSelf, curTot, maxTot) {},
			onStatusChange: function(aBrowser, aWebProgress, aRequest, aStatus, aMessage) {},
			onSecurityChange: function(aBrowser, aWebProgress, aRequest, aState) {},
			onRefreshAttempted: function(aBrowser, aWebProgress, aRefreshURI, aMillis, aSameURI) {},
			onLinkIconAvailable: function(aBrowser) {}
		};
		gBrowser.addTabsProgressListener(tabsListener);
*/

	var debugingThisFile = true;

	var redirectionAlertID = 0;

	this.redirectionAlert = function() {
		function RedirectionAlert() {
			return this;
		}

		RedirectionAlert.prototype = {
			init: function() {
				this.id = String(redirectionAlertID++);
				this.timeout = 60 * 1000; //60 seconds for the website to load
				this.cache = [];
				this.cacheRedirects = [];
				this.cacheTabs = [];
				this.itemsWorking = 0;
				this.itemsDone = 0;
				var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
				observerService.addObserver(this, "http-on-examine-response", false);
				observerService.addObserver(this, "http-on-examine-merged-response", false);
				observerService.addObserver(this, "http-on-examine-cached-response", false);
				observerService.addObserver(this, 'content-document-global-created', false);
			},
			unLoad: function() {
				var self = this;
				setTimeout(function() {
					self._unLoad();
				}, 10000);
			},
			_unLoad: function() {
				if (this.itemsWorking != this.itemsDone)
					return;

				var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
				observerService.removeObserver(this, "http-on-examine-response", false);
				observerService.removeObserver(this, "http-on-examine-merged-response", false);
				observerService.removeObserver(this, "http-on-examine-cached-response", false);
				observerService.removeObserver(this, 'content-document-global-created', false);

				delete(this.cache);
				delete(this.cacheRedirects);
				delete(this.cacheTabs);
				delete(this.itemsWorking);
				delete(this.itemsDone);
			},
			observe: function(aSubject, aTopic, aData) {
				if (aTopic == 'http-on-examine-response' || aTopic == 'http-on-examine-merged-response' || aTopic == 'http-on-examine-cached-response') {
					aSubject.QueryInterface(Components.interfaces.nsIHttpChannel);

					// LISTEN for Tabs
					// this piece allows to get the HTTP code of urls that redirects via metarefresh or JS
					// allow to holds the urls of external content associated to a tab. !
					try {

						var notificationCallbacks = aSubject.notificationCallbacks ? aSubject.notificationCallbacks : aSubject.loadGroup.notificationCallbacks;
						if (!notificationCallbacks) {} else {
							this.cacheTabs[aSubject.URI.spec] = aSubject.responseStatus;

							var domWin = notificationCallbacks.getInterface(Components.interfaces.nsIDOMWindow);
							var aTab = ODPExtension.tabGetFromChromeDocument(domWin);
							if (aTab && aTab.hasAttribute('ODPExtension-originalURI')) {
								var URI = aTab.getAttribute('ODPExtension-originalURI');
								this.cache[URI].externalContent.push(aSubject.URI.spec);
							}
						}
					} catch (e) {}

					// LISTEN for XMLHttpRequest
					this.onExamineResponse(aSubject);

				} else if (aTopic == 'content-document-global-created') {
					if (aSubject instanceof Components.interfaces.nsIDOMWindow) {
						var aTab = ODPExtension.tabGetFromChromeDocument(aSubject);
						if (aTab && aTab.hasAttribute('ODPExtension-linkChecker')) {
							ODPExtension.disableTabFeatures(aSubject);
						}
					}
				}
			},
			onExamineResponse: function(oHttp) {
				//skiping the examinations of requests NOT related to our redirection alert
				if (!this.cache[oHttp.originalURI.spec]) {
					if (!this.cacheRedirects[oHttp.originalURI.spec]) {
						//this examination comes from a request (browser, extension, document) not related to the current process: checking the status of the this document/selected links
						return;
					} else {
						//resolving: from where this redirection come from - this resolve when a redirect redirect again to another place
						var originalURI = this.cacheRedirects[oHttp.originalURI.spec];
					}
				} else {
					var originalURI = oHttp.originalURI.spec;
				}
				if (this.cache[originalURI].stop == true) {
					//resolving: this item was already checked to the end but all the request are still on examination
					//so: if you open a new tab with this item.url, that information willl be appended as a redirection (this return avoids this)
					return;
				}

				//normalize responseStatus
				var responseStatus = oHttp.responseStatus;
				if (responseStatus === 0)
					responseStatus = -1;

				this.cache[originalURI].statuses.push(responseStatus);
				this.cache[originalURI].urlRedirections.push(oHttp.URI.spec);

				if (originalURI != oHttp.URI.spec) {
					this.cacheRedirects[oHttp.URI.spec] = originalURI;
					this.cache[originalURI].urlLast = oHttp.URI.spec;
				}
			},
			check: function(aURL, aFunction, tryAgain) {
				this.itemsWorking++;
				//ODPExtension.dump('check:function:'+aURL);
				if (typeof(tryAgain) == 'undefined')
					tryAgain = 1;

				if (!this.cache[aURL]) {
					this.cache[aURL] = {};
					var aData = this.cache[aURL];
					aData.stop = false;

					aData.statuses = [];
					aData.headers = '';
					aData.contentType = 'text/plain';

					aData.urlRedirections = [];
					aData.urlOriginal = aURL;
					aData.urlLast = aURL;

					aData.html = '';
					aData.txt = '';
					aData.language = '';
					aData.checkType = '';

					aData.htmlRequester = '';
					aData.htmlTab = '';

					aData.hash = '';
					aData.ids = [];

					aData.ip = '';

					aData.title = '';
					aData.metaDescription = '';

					aData.externalContent = [];
					aData.linksInternal = []
					aData.linksExternal = []
					aData.mediaCount = 0;

					aData.removeFromBrowserHistory = !ODPExtension.isVisitedURL(aURL);

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
				Requester.timeout = oRedirectionAlert.timeout;
				Requester.onreadystatechange = function() {
					if (Requester.readyState == 2) { //headers received
						var contentType = Requester.getResponseHeader('Content-Type');
						if (contentType && contentType.indexOf('audio/mpeg') != -1) {
							aData.checkType = 'XMLHttpRequestAbortMedia'
							aData.contentType = contentType;
							aData.headers = Requester.getAllResponseHeaders();
							tryAgain = 0;
							aData.mediaCount = 1;
							Requester.onerror('ABORTED');
							Requester.abort();
						}
					}
				}
				Requester.onload = function() {
					if (loaded)
						return null;
					aData.checkType = 'XMLHttpRequestSuccess'
					loaded = true;
					aData.stop = true;
					aData.headers = Requester.getAllResponseHeaders();
					aData.htmlRequester = Requester.responseText;
					aData.html = Requester.responseText;
					aData.ids = ODPExtension.arrayMix(aData.ids, aData.html.match(/(pub|ua)-[^"'&\s]+/gmi) || [])
					aData.contentType = Requester.getResponseHeader('Content-Type');
					//now get the response as UTF-8
					ODPExtension.runThreaded('link.checker.utf8.html.content.' + oRedirectionAlert.id, ODPExtension.preferenceGet('link.checker.threads'), function(onThreadDone) {

						var aTab = ODPExtension.tabOpen('about:blank', false, false, true);
						aTab.setAttribute('hidden', true);
						aTab.setAttribute('ODPExtension-linkChecker', true);
						aTab.setAttribute('ODPExtension-originalURI', aURL);
						var newTabBrowser = ODPExtension.browserGetFromTab(aTab);

						var timedout = -1;
						//timedout = -1 | tab did not timedout
						//timedout = 1 | tab timedout (did not fired DOM CONTENT LOAD)
						//timedout = 2 | tab did load (did fired DOM CONTENT LOAD)

						function onTabLoad() {

							newTabBrowser.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);

							timedout = 3;
							aData.checkType = 'aTab'
							var aDoc = ODPExtension.documentGetFromTab(aTab);
							aData.urlLast = ODPExtension.tabGetLocation(aTab);

							if (aDoc.documentURI.indexOf('about:') === 0 || aDoc.documentURI.indexOf('chrome:') === 0) {
								aDoc = ODPExtension.toDOM(aData.htmlRequester, aData.urlLast);
							}

							aData.contentType = aDoc.contentType;
							aData.title = ODPExtension.documentGetTitle(aDoc);
							aData.metaDescription = ODPExtension.documentGetMetaDescription(aDoc);

							//detect meta/js redirect
							if (aData.urlRedirections[aData.urlRedirections.length - 1] != aData.urlLast) {
								aData.statuses.push('meta/js');
								//save the redirection
								aData.urlRedirections.push(aData.urlLast);
								//get the last status, if was meta/js redirect
								if (!oRedirectionAlert.cacheTabs[aData.urlLast]) {} else {
									aData.statuses.push(oRedirectionAlert.cacheTabs[aData.urlLast]);
								}
							}

							aData.subdomain = ODPExtension.getSubdomainFromURL(aData.urlLast);
							aData.domain = ODPExtension.getDomainFromURL(aData.urlLast);
							aData.ip = ODPExtension.getIPFromDomain(aData.subdomain);

							//links
							aData.linksInternal = []
							aData.linksExternal = []

							var links = ODPExtension.getAllLinksHrefs(aDoc);
							for (var i = 0, length = links.length; i < length; i++) {
								var link = links[i];
								if (link.href && link.href != '' && link.href.indexOf('http') === 0) {
									var aDomain = ODPExtension.getDomainFromURL(link.href)
									if (aDomain != aData.domain)
										aData.linksExternal.push({
											url: link.href,
											anchor: link.innerHTML,
											domain: aDomain
										});
									else
										aData.linksInternal.push({
											url: link.href,
											anchor: link.innerHTML,
											domain: aDomain
										});
								}
							}

							var mediaTags = ['object', 'media', 'video', 'audio', 'embed'];
							if (!aDoc.mediaCounted) {
								aData.htmlTab = new XMLSerializer().serializeToString(aDoc);
								aData.html = aData.htmlTab;
								aData.ids = ODPExtension.arrayMix(aData.ids, aData.html.match(/(pub|ua)-[^"'&\s]+/gmi) || [])

								aData.domTree = ODPExtension.domTree(aDoc);
								aData.hash = ODPExtension.md5(JSON.stringify(aData.domTree));

								aData.mediaCount = 0;
								for (var id in mediaTags)
									aData.mediaCount += aDoc.getElementsByTagName(mediaTags[id]).length;
							}

							//clone doc, do not touch the doc in the tab
							aDoc = aDoc.cloneNode(true);
							for (var id in mediaTags) {
								var tags = aDoc.getElementsByTagName(mediaTags[id]);
								var i = tags.length;
								while (i--) {
									tags[i].parentNode && tags[i].parentNode.removeChild(tags[i]);
								}
							}
							var stripTags = ['noscript', 'noframes', 'style', 'script', 'frameset'];
							for (var id in stripTags) {
								var tags = aDoc.getElementsByTagName(stripTags[id]);
								var i = tags.length;
								while (i--)
									tags[i].parentNode.removeChild(tags[i]);
							}
							ODPExtension.removeComments(aDoc);

							try {
								var aDoc = new XMLSerializer().serializeToString(aDoc.body);
							} catch (e) {
								var aDoc = new XMLSerializer().serializeToString(aDoc);
							}
							aData.txt = ODPExtension.stripTags(aDoc, ' ').replace(/[\t| ]+/g, ' ').replace(/\n\s+/g, '\n').trim();
							aData.language = ODPExtension.detectLanguage(aData.txt);
							//aData.language = 'Spanish';

							ODPExtension.urlFlag(aData);

							//because the linkcheck runs in a tab, it add stuff to the browser history that shouldn't be added
							//http://forums.mozillazine.org/viewtopic.php?p=9070125#p9070125
							if (aData.removeFromBrowserHistory)
								ODPExtension.removeURLFromBrowserHistory(aURL);

							//aTab.setAttribute('hidden', false);
							try {
								ODPExtension.tabClose(aTab);
							} catch (e) {}

							oRedirectionAlert.cache[aURL] = aTab = aDoc = newTabBrowser = null;
							aFunction(aData, aURL)

							aData = null;

							onThreadDone();

							oRedirectionAlert.itemsDone++;
							if (oRedirectionAlert.itemsDone == oRedirectionAlert.itemsWorking)
								oRedirectionAlert.unLoad();
						}

						function DOMContentLoaded(aEvent) {
							if (timedout === -1) {
								var aDoc = aEvent.originalTarget;
								if (!aDoc.defaultView)
									var topDoc = aDoc;
								else
									var topDoc = aDoc.defaultView.top.document;

								//its a frame
								if (aDoc != topDoc) {} else {

									timedout = 2;

									aData.htmlTab = new XMLSerializer().serializeToString(aDoc);
									aData.html = aData.htmlTab;
									aData.ids = ODPExtension.arrayMix(aData.ids, aData.html.match(/(pub|ua)-[^"'&\s]+/gmi) || [])

									aData.domTree = ODPExtension.domTree(aDoc);
									aData.hash = ODPExtension.md5(JSON.stringify(aData.domTree));

									aDoc.mediaCounted = true;
									var mediaTags = ['object', 'media', 'video', 'audio', 'embed'];
									for (var id in mediaTags)
										aData.mediaCount += aDoc.getElementsByTagName(mediaTags[id]).length;

									for (var id in mediaTags) {
										var tags = aDoc.getElementsByTagName(mediaTags[id]);
										var i = tags.length;
										while (i--) {
											try {
												tags[i].pause();
											} catch (e) {
												try {
													tags[i].stop();
												} catch (e) {}
											}
										}
									}

									setTimeout(function() {
										onTabLoad()
									}, 12000);
								}
							}
						}
						newTabBrowser.addEventListener("DOMContentLoaded", DOMContentLoaded, false);

						newTabBrowser.webNavigation.allowAuth = false;
						newTabBrowser.webNavigation.allowImages = false;
						//newTabBrowser.webNavigation.allowMedia = false; //does not work
						newTabBrowser.webNavigation.allowJavascript = true;
						newTabBrowser.webNavigation.allowMetaRedirects = true;
						newTabBrowser.webNavigation.allowPlugins = false;
						newTabBrowser.webNavigation.allowWindowControl = false;
						newTabBrowser.webNavigation.allowSubframes = true;

						//newTabBrowser.loadURI(aURL);
						if (!ODPExtension.preferenceGet('link.checker.use.cache'))
							newTabBrowser.loadURIWithFlags(aURL, newTabBrowser.webNavigation.LOAD_FLAGS_BYPASS_PROXY | newTabBrowser.webNavigation.LOAD_FLAGS_BYPASS_CACHE | newTabBrowser.webNavigation.LOAD_ANONYMOUS | newTabBrowser.webNavigation.LOAD_FLAGS_BYPASS_HISTORY, null, null);
						else
							newTabBrowser.loadURIWithFlags(aURL, newTabBrowser.webNavigation.LOAD_ANONYMOUS | newTabBrowser.webNavigation.LOAD_FLAGS_BYPASS_HISTORY, null, null);

						setTimeout(function() {
							if (timedout === -1) {
								timedout = 1;
								onTabLoad();
							}
						}, oRedirectionAlert.timeout + 5000); //give 60 seconds to load, else, just forget it.
					});

				};
				Requester.onerror = Requester.onabort = function(TIMEDOUT) {
					aData.checkType = 'XMLHttpRequestError'
					//ODPExtension.dump('Requester.onerror');
					//ODPExtension.dump(TIMEDOUT);
					if (tryAgain == 1) {
						//ODPExtension.dump('sending again..'+aURL);
						oRedirectionAlert.itemsDone++;
						clearTimeout(timer);
						oRedirectionAlert.check(aURL, aFunction, 0);
					} else {
						if (loaded)
							return null;
						loaded = true;
						var oHttp = {};
						oHttp.originalURI = {};
						oHttp.originalURI.spec = {};
						oHttp.URI = {};
						oHttp.URI.spec = {};
						oHttp.responseStatus = {};

						oHttp.originalURI.spec = aURL;
						oHttp.URI.spec = aURL;

						//detects if I'm offline

						if (typeof(TIMEDOUT) != 'undefined' && TIMEDOUT === 'TIMEDOUT') {
							oHttp.responseStatus = -5
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
								oHttp.responseStatus = -1337
							} else {
								try {
									oHttp.responseStatus = ODPExtension.createTCPErrorFromFailedXHR(Requester);
								} catch (e) {
									try {
										oHttp.responseStatus = Requester.status
									} catch (e) {
										oHttp.responseStatus = -1;
									}
								}
								if (oHttp.responseStatus === 0)
									oHttp.responseStatus = -1;
							}
						}
						oRedirectionAlert.onExamineResponse(oHttp);

						aData.stop = true;

						aData.subdomain = ODPExtension.getSubdomainFromURL(aData.urlLast);
						aData.domain = ODPExtension.getDomainFromURL(aData.urlLast);
						aData.ip = ODPExtension.getIPFromDomain(aData.subdomain);

						ODPExtension.urlFlag(aData);
						oRedirectionAlert.cache[aURL] = null;
						aFunction(aData, aURL)

						aData = null;

						oRedirectionAlert.itemsDone++;
						if (oRedirectionAlert.itemsDone == oRedirectionAlert.itemsWorking)
							oRedirectionAlert.unLoad();
					}
					return null;
				};
				Requester.open("GET", aURL, true);
				if (!ODPExtension.preferenceGet('link.checker.use.cache'))
					Requester.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_FLAGS_BYPASS_PROXY | Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE | Components.interfaces.nsIRequest.LOAD_ANONYMOUS | Components.interfaces.nsIRequest.LOAD_FLAGS_BYPASS_HISTORY;
				else
					Requester.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_ANONYMOUS | Components.interfaces.nsIRequest.LOAD_FLAGS_BYPASS_HISTORY

				if (tryAgain === 0)
					Requester.setRequestHeader('Referer', aURL);
				else
					Requester.setRequestHeader('Referer', 'https://www.google.com/search?q=' + ODPExtension.encodeUTF8(aURL));
				Requester.send(null);
				//in some situations, timeout is maybe ignored, but neither onload, onerror nor onabort are called
				timer = setTimeout(function() {
					if (!loaded) {
						//ODPExtension.dump('aborted'+aURL);
						Requester.onerror('TIMEDOUT');
					}
				}, oRedirectionAlert.timeout + 5000);
				//ODPExtension.dump('check');
			}
		};

		var oRedirectionAlert = new RedirectionAlert();
		oRedirectionAlert.init();

		return oRedirectionAlert;
	}
	//https://developer.mozilla.org/en-US/docs/How_to_check_the_security_state_of_an_XMLHTTPRequest_over_SSL
	this.createTCPErrorFromFailedXHR = function(xhr) {
		let status = xhr.channel.QueryInterface(Components.interfaces.nsIRequest).status;

		let errType;
		var errName = -1;
		if ((status & 0xff0000) === 0x5a0000) { // Security module
			const nsINSSErrorsService = Components.interfaces.nsINSSErrorsService;
			let nssErrorsService = Components.classes['@mozilla.org/nss_errors_service;1'].getService(nsINSSErrorsService);
			let errorClass;
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
				let nssErr = Math.abs(nsINSSErrorsService.NSS_SEC_ERROR_BASE) - (status & 0xffff);
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
				let sslErr = Math.abs(nsINSSErrorsService.NSS_SSL_ERROR_BASE) - (status & 0xffff);
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

	this.disableTabFeatures = function(aWindow) {
		try {
			aWindow.wrappedJSObject.alert = aWindow.wrappedJSObject.onbeforeunload = aWindow.wrappedJSObject.prompt = aWindow.wrappedJSObject.confirm = aWindow.wrappedJSObject.focus = function() {};
		} catch (e) {}
	}

	// comments of the error codes based or taken from http://www.dmoz.org/docs/en/errorcodes.html
	this.urlFlag = function(aData) {

		aData.status = {};
		aData.status.error = true;
		aData.status.code = false;
		aData.status.delete = false;
		aData.status.unreview = false;
		aData.status.suspicious = [];

		//HTTP redirections to HTTPS are not perceived as a redirection, log it
		if (aData.urlRedirections.length === 1 && aData.urlOriginal != aData.urlLast)
			aData.urlRedirections.push(aData.urlLast)

		var lastStatus = aData.statuses[aData.statuses.length - 1];

		var urlMalformed = aData.urlLast.indexOf('https:///') != -1 || aData.urlLast.indexOf('http:///') != -1 || aData.subdomain.indexOf(',') !== -1 || aData.subdomain.indexOf('%') !== -1 || !this.isPublicURL(aData.urlLast);

		//-6 BAd URL
		if (false || urlMalformed || lastStatus == 414 // Request-URI Too Large - The URL (usually created by a GET form request) is too large for the server to handle. Check to see that a lot of garbage didn't somehow get pasted in after the URL.
		|| lastStatus == 413 // Request Entity Too Large - The server is refusing to process a request because the request entity is larger than the server is willing or able to process. Should never occur for Robozilla.
		|| lastStatus == 400 // Bad Request	Usually occurs due to a space in the URL or other malformed URL syntax. Try converting spaces to %20 and see if that fixes the error.
		) {
			aData.status.code = -6;
			aData.status.errorString = 'Bad URL';
			aData.status.unreview = true;

			//-1 	Unable to Resolve Host 	They didn't pay their bill for their Domain name.
		} else if (false || aData.statuses.indexOf(-1) != -1 || aData.statuses.indexOf('DomainNotFound') != -1) {
			aData.status.code = -1;
			aData.status.errorString = 'Domain Not Found';
			aData.status.delete = true;

			//-401  SSL Error
		} else if (false || aData.statuses.indexOf('SecurityProtocol') != -1 || aData.statuses.indexOf('SecurityCertificate') != -1 || aData.statuses.indexOf('SecurityExpiredCertificateError') != -1 || aData.statuses.indexOf('SecurityRevokedCertificateError') != -1 || aData.statuses.indexOf('SecurityUntrustedCertificateIssuerError') != -1 || aData.statuses.indexOf('SecurityInadequateKeyUsageError') != -1 || aData.statuses.indexOf('SecurityCertificateSignatureAlgorithmDisabledError') != -1 || aData.statuses.indexOf('SecurityError') != -1 || aData.statuses.indexOf('SecurityNoCertificateError') != -1 || aData.statuses.indexOf('SecurityBadCertificateError') != -1 || aData.statuses.indexOf('SecurityUnsupportedCertificateTypeError') != -1 || aData.statuses.indexOf('SecurityUnsupportedTLSVersionError') != -1 || aData.statuses.indexOf('SecurityCertificateDomainMismatchError') != -1 || aData.statuses.indexOf('SecurityCertificateDomainMismatchError') != -1) {
			aData.status.code = -401;
			aData.status.errorString = 'SSL Error: ' + aData.statuses.join(',');
			aData.status.unreview = true;

			//-4 	Can't connect 	We can't connect to the HTTP server. The server is there but it didn't want to talk to Robozilla on the specified port.
		} else if (false || aData.statuses.indexOf(-4) != -1 || aData.statuses.indexOf('ConnectionRefused') != -1 || aData.statuses.indexOf('NetworkError') != -1) {
			aData.status.code = -4;
			aData.status.errorString = 'Can\'t Connect';
			aData.status.unreview = true;

			//-5 	Timeout Robozilla connected OK, and sent the request but Robozilla timed out waiting to fetch the page. This happens sometimes on really busy servers.
		} else if (false || aData.statuses.indexOf(-5) != -1 || aData.statuses.indexOf('NetworkTimeout') != -1 || lastStatus == 408 // Request Time-Out	- The server took longer than expected to return a page, and timed out. Similar to -5, but generated by the server, rather than Robozilla.
		|| lastStatus == 504 // Gateway Timeout - A server being used by this server has not responded in time.
		) {
			aData.status.code = -5;
			aData.status.errorString = 'Network Timeout';
			aData.status.unreview = true;

			//-1337 	Local Network error - probably the internet is gone
		} else if (false || aData.statuses.indexOf(-1337) != -1 || aData.statuses.indexOf('NetworkInterrupt') != -1) {
			aData.status.code = -1337;
			aData.status.errorString = 'Internet Gone!?';

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
			aData.status.unreview = true;

			//404 	Not Found
		} else if (false || lastStatus == 404 // Not Found
		|| lastStatus == 410 // Gone
		) {
			aData.status.code = lastStatus;
			aData.status.errorString = 'Not Found';
			aData.status.unreview = true;

			//-8 	Empty Page
		} else if (false ||
			(
			this.urlFlagSempty.indexOf(aData.txt.toLowerCase()) !== -1 && aData.mediaCount.length < 1)) {
			aData.status.code = -8;
			aData.statuses.push(aData.status.code);
			aData.status.errorString = 'Empty Page';
			aData.status.unreview = true;
			aData.status.match = aData.txt;

			//-1340 	Redirect OK	The server redirects to another page but it's OK and  probably very likelly can be autofixed
		} else if (
		(
			aData.statuses.indexOf(300) !== -1 // Moved
		|| aData.statuses.indexOf(301) !== -1 // Redirect Permanently
		|| aData.statuses.indexOf(302) !== -1 // Redirect Temporarily
		// || aData.statuses.indexOf(303) !== -1 // See Other
		|| aData.statuses.indexOf('meta/js') !== -1 // meta/js redirect
		|| aData.urlOriginal != aData.urlLast) && this.redirectionOKAutoFix(aData.urlOriginal, aData.urlLast)) {
			aData.status.code = -1340;
			aData.status.errorString = 'Redirect OK Candidate 4 Autofix';
			aData.status.error = false;

			//-1338 	Redirect OK	The server redirects to another page but it's OK
		} else if (
		(
			aData.statuses.indexOf(300) !== -1 // Moved
		|| aData.statuses.indexOf(301) !== -1 // Redirect Permanently
		|| aData.statuses.indexOf(302) !== -1 // Redirect Temporarily
		|| aData.statuses.indexOf(303) !== -1 // See Other
		|| aData.statuses.indexOf('meta/js') !== -1 // meta/js redirect
		|| aData.urlOriginal != aData.urlLast) && this.redirectionOK(aData.urlOriginal, aData.urlLast)) {
			aData.status.code = -1338;
			aData.status.errorString = 'Redirect OK';
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

			//200 OK
		} else if (false || lastStatus == 200 // OK
		) {
			aData.status.code = 200;
			aData.status.errorString = 'OK';
			aData.status.error = false;

			//-7 	Server Error	The server returned an unknown error code, and is probably mis-configured. The page may still show up okay, but it's a good idea to check it just in case.
		} else {
			aData.status.code = lastStatus;
			aData.status.errorString = 'Unknown Error';
		}

		//most important should go first (example, makes no sense to check for errors in a page that is just parked)
		var array = [''
				, 'pendingRenew'

				, 'forSale'
				, 'parked'

				, 'hacked'
				, 'hijacked'

				, 'gonePermanent'
				, 'goneTemporal'
				, 'serverPage'
				, 'emptyMeaningNoContent'
				, 'pageErrors'
				, 'underConstruction'
				, 'comingSoon'
				, 'suspended'
		]

		var data = (aData.urlRedirections.join('\n') + '\n' + aData.externalContent.join('\n') + '\n' + aData.headers + '\n' + aData.html).toLowerCase();
		var breaky = false;
		for (var name in array) {
			if (array[name] != '') {

				//bodyMatch
				for (var id in this['urlFlags'][array[name]]['body']) {
					string = this['urlFlags'][array[name]]['body'][id].trim();
					if (string != '' && (data.indexOf(string.toLowerCase().trim()) != -1)) {
						aData.status.error = true;
						aData.status.code = this['urlFlags'][array[name]]['errorCode'];
						if (this['urlFlags'][array[name]]['canDelete'])
							aData.status.delete = true;
						if (this['urlFlags'][array[name]]['canUnreview'])
							aData.status.unreview = true;
						aData.status.errorString = this['urlFlags'][array[name]]['errorString'];
						aData.statuses.push(aData.status.code);
						aData.status.match = string;
						breaky = true;
						break;
					}
				}
				if (breaky)
					break;
			}
		}

		//suspicious
		if (aData.contentType != '' && aData.contentType != 'text/plain' && aData.contentType != 'text/html' && aData.contentType != 'application/pdf' && aData.contentType != 'application/xhtml+xml') {
			aData.status.suspicious.push('Unknown content type: ' + aData.contentType);
			//ODPExtension.dump(aData);
		}
		if (aData.html.indexOf('frameset') != -1) {
			aData.status.suspicious.push('Document may has a FrameSet');
		}

		//experimenting
		/*		if (aData.status.error === false) {
			if (aData.hash in this.allDocuments) {
				if (aData.urlOriginal != this.allDocuments[aData.hash]) {
					aData.extended = 'This same ' + aData.urlOriginal + ' document found on ' + this.allDocuments[aData.hash];
					this.dump(aData.extended);
				}
			}
		}
		this.allDocuments[aData.hash] = aData.urlOriginal;*/
	}

	//this.allDocuments = [];

	this.redirectionOKAutoFix = function(oldURL, newURL) {
		if (oldURL == newURL)
			return false;

		oldURL = this.removeWWW(this.removeSchema(this.shortURLAggresive(oldURL))).replace(/\/+$/, '').toLowerCase().trim();
		newURL = this.removeSchema(newURL).replace(/\/+$/, '').replace(/^www\./, '').toLowerCase().trim();

		if (oldURL == newURL)
			return true;
		else
			return false;
	}

	this.redirectionOK = function(oldURL, newURL) {

		if (this.getSchema(oldURL) != this.getSchema(newURL))
			return false;
		oldURL = this.removeWWW(this.removeSchema(oldURL)).replace(/\/+$/, '').toLowerCase()
		newURL = this.removeWWW(this.removeSchema(newURL)).replace(/\/+$/, '').toLowerCase();

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
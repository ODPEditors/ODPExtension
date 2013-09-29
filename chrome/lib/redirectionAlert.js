(function()
{
		/*
			This file comes from an idea from here http://forums.dmoz.org/forum/viewtopic.php?t=920940&start=0#1716101
			The link checker was introduced here http://forums.dmoz.org/forum/viewtopic.php?t=920940&start=50#1758894
		*/
		//Problems:
		 /*
				CODES
					assign a code for security errors, (such mixed content, expired certificates and the like)
		 */

			var debugingThisFile = true;

			var redirectionAlertID = 0;

			this.redirectionAlert = function()
			{
				function RedirectionAlert(){ return this;}

				RedirectionAlert.prototype =
				{
					init:function()
					{
						this.id = String(redirectionAlertID++);
						this.timeout = 60*1000; //60 seconds for the website to load
						this.cache = [];
						this.cacheRedirects = [];
						this.cacheTabs = [];
						this.itemsWorking=0;
						this.itemsDone=0;
						var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
								observerService.addObserver(this, "http-on-examine-response", false);
								observerService.addObserver(this, "http-on-examine-merged-response", false);
								observerService.addObserver(this, "http-on-examine-cached-response", false);
								observerService.addObserver(this, 'content-document-global-created', false);
					},
					unLoad:function()
					{
						var self = this;
						setTimeout(function(){ self._unLoad(); }, 3000);
					},
					_unLoad:function()
					{
						if(this.itemsWorking != this.itemsDone)
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
					observe: function(aSubject, aTopic, aData)
					{
						if(aTopic == 'http-on-examine-response' || aTopic == 'http-on-examine-merged-response'  || aTopic == 'http-on-examine-cached-response' ) {
							aSubject.QueryInterface(Components.interfaces.nsIHttpChannel);

							// LISTEN for Tabs
							// this piece allows to get the HTTP code of urls that redirects via metarefresh or JS
							// allow to holds the urls of external content associated to a tab. !
							try {

								var notificationCallbacks = aSubject.notificationCallbacks ? aSubject.notificationCallbacks : aSubject.loadGroup.notificationCallbacks;
								if (!notificationCallbacks){}
								else{
									this.cacheTabs[aSubject.URI.spec] = aSubject.responseStatus;

									var domWin = notificationCallbacks.getInterface(Components.interfaces.nsIDOMWindow);
									var aTab = ODPExtension.tabGetFromChromeDocument(domWin);
									if(aTab && aTab.hasAttribute('ODPExtension-originalURI')) {
										var URI = aTab.getAttribute('ODPExtension-originalURI');
										this.cache[URI].externalContent.push(aSubject.URI.spec);
									}
								}
							} catch (e) { }

							// LISTEN for XMLHttpRequest
							this.onExamineResponse(aSubject);

						} else if(aTopic == 'content-document-global-created'){
			        if (aSubject instanceof Components.interfaces.nsIDOMWindow) {
			        	var aTab = ODPExtension.tabGetFromChromeDocument(aSubject);
			        	if(aTab && aTab.hasAttribute('ODPExtension-linkChecker')){
			        		ODPExtension.disableTabFeatures(aSubject);
			          }
			        }
						}
					},
					onExamineResponse: function (oHttp)
					{
						//skiping the examinations of requests NOT related to our redirection alert
						if(!this.cache[oHttp.originalURI.spec])
						{
							if(!this.cacheRedirects[oHttp.originalURI.spec])
							{
								//this examination comes from a request (browser, extension, document) not related to the current process: checking the status of the this document/selected links
								return;
							}
							else
							{
								//resolving: from where this redirection come from - this resolve when a redirect redirect again to another place
								var originalURI = this.cacheRedirects[oHttp.originalURI.spec];
							}
						}
						else
						{
							var originalURI = oHttp.originalURI.spec;
						}
						if(this.cache[originalURI].stop==true)
						{
							//resolving: this item was already checked to the end but all the request are still on examination
							//so: if you open a new tab with this item.url, that information willl be appended as a redirection (this return avoids this)
							return;
						}

						//normalize responseStatus
						var responseStatus = oHttp.responseStatus;
						if(responseStatus===0)
							responseStatus = -1;

						this.cache[originalURI].statuses.push(responseStatus);
						this.cache[originalURI].urlRedirections.push(oHttp.URI.spec);

						if(originalURI != oHttp.URI.spec)
						{
							this.cacheRedirects[oHttp.URI.spec] = originalURI;
							this.cache[originalURI].urlLast = oHttp.URI.spec;
						}
					},
					check:function(aURL, aFunction, tryAgain)
					{
						this.itemsWorking++;
						//ODPExtension.dump('check:function');
						if(typeof(tryAgain) == 'undefined')
							tryAgain = 1;

						if(!this.cache[aURL])
						{
							this.cache[aURL] = {};
							var aData = this.cache[aURL];
									aData.stop= false;

									aData.statuses=[];
									aData.headers='';
									aData.contentType='';

									aData.urlRedirections=[];
									aData.urlOriginal=aURL;
									aData.urlLast=aURL;

									aData.html='';
									aData.txt='';
									aData.hash='';

									aData.ip='';

									aData.htmlTitle='';
									aData.externalContent=[];

									aData.removeFromBrowserHistory = !ODPExtension.isVisitedURL(aURL);

						} else {
							var aData = this.cache[aURL];
						}
						var oRedirectionAlert = this;
						var Requester = new XMLHttpRequest();
								try{ Requester.mozAnon  = true; } catch(e) {}//If true, the request will be sent without cookie and authentication headers.
								try{ Requester.mozBackgroundRequest  = true; } catch(e) {} //Indicates whether or not the object represents a background service request. If true, no load group is associated with the request, and security dialogs are prevented from being shown to the user. Requires elevated privileges to access.

								var loaded = false;
								Requester.timeout = oRedirectionAlert.timeout;
								Requester.onload = function()
								{
									loaded = true;
									aData.stop = true;
									aData.headers = Requester.getAllResponseHeaders();
									aData.html = Requester.responseText;

									//now get the response as UTF-8
									ODPExtension.runThreaded('link.checker.utf8.html.content.'+oRedirectionAlert.id, ODPExtension.preferenceGet('link.checker.threads'), function(onThreadDone){

										var aTab = ODPExtension.tabOpen('about:blank');
												aTab.setAttribute('hidden', true);
												aTab.setAttribute('ODPExtension-linkChecker', true);
												aTab.setAttribute('ODPExtension-originalURI', aURL);
										var newTabBrowser = ODPExtension.browserGetFromTab(aTab);

										var timedout = 0;

										function onTabLoad(){
											if(timedout === 1) {
												timedout = 4;
											} else {
												timedout = 4;

												var aDoc = 	ODPExtension.documentGetFromTab(aTab);
														aData.contentType = aDoc.contentType;

												aData.html = new XMLSerializer().serializeToString(aDoc);

												var stripTags = ['noscript', 'object', 'noframes', 'style', 'script', 'frameset', 'embed'];
												var aDocCopy = aDoc.cloneNode(true);
												for(var id in stripTags){
													var tags = aDocCopy.getElementsByTagName(stripTags[id]);
													var i = tags.length;
													while (i--)
														tags[i].parentNode.removeChild(tags[i]);
												}
												ODPExtension.removeComments(aDocCopy);

												if(aDocCopy.body){
													aData.hash = ODPExtension.md5(JSON.stringify(ODPExtension.domTree(aDocCopy.body)));
													//aData.domTree = ODPExtension.domTree(aDocCopy.body);
												}

												try{
													aDocCopy = new XMLSerializer().serializeToString(aDocCopy.body);
												} catch(e){
													aDocCopy = new XMLSerializer().serializeToString(aDocCopy);
												}
												aData.txt = ODPExtension.stripTags(aDocCopy, ' ').replace(/[\t| ]+/g, ' ').replace(/\n\s+/g, '\n').trim();
												aData.language = ODPExtension.detectLanguage(aData.txt);

												aData.htmlTitle = ODPExtension.documentGetTitle(aDoc);
												aData.urlLast = ODPExtension.tabGetLocation(aTab);
												if(aData.urlRedirections[aData.urlRedirections.length-1] != aData.urlLast){
													aData.statuses.push('meta/js');
													aData.urlRedirections.push(aData.urlLast);
													if(!oRedirectionAlert.cacheTabs[aData.urlLast]){}
													else
														aData.statuses.push(oRedirectionAlert.cacheTabs[aData.urlLast]);
												}
											}

											ODPExtension.urlFlag(aData, aDoc);

											//because the linkcheck runs in a tab, it add stuff to the browser history that shouldn't be added
											//http://forums.mozillazine.org/viewtopic.php?p=9070125#p9070125
											if(aData.removeFromBrowserHistory)
												ODPExtension.removeURLFromBrowserHistory(aURL);

											aFunction(aData, aURL)

											try{	ODPExtension.tabClose(aTab); } catch(e){}

											onThreadDone();

											oRedirectionAlert.itemsDone++;
											if(oRedirectionAlert.itemsDone==oRedirectionAlert.itemsWorking)
												oRedirectionAlert.unLoad();
										}
										newTabBrowser.addEventListener("DOMContentLoaded", function(aEvent){
											timedout = 3;
											setTimeout(function(){
												if(timedout === 3) {
													timedout = 2;
													onTabLoad()
												}
											}, 14000);
										}, true);
										newTabBrowser.webNavigation.allowAuth = false;
										newTabBrowser.webNavigation.allowImages = false;
										//newTabBrowser.webNavigation.allowMedia = false; //does not work
										newTabBrowser.webNavigation.allowJavascript = true;
										newTabBrowser.webNavigation.allowMetaRedirects = true;
										newTabBrowser.webNavigation.allowPlugins = false;
										newTabBrowser.webNavigation.allowWindowControl = false;
										newTabBrowser.webNavigation.allowSubframes = true;

										//newTabBrowser.loadURI(aURL);
										if(ODPExtension.preferenceGet('link.checker.use.cache') === 0)
											newTabBrowser.loadURIWithFlags(aURL, newTabBrowser.webNavigation.LOAD_FLAGS_BYPASS_PROXY | newTabBrowser.webNavigation.LOAD_FLAGS_BYPASS_CACHE | newTabBrowser.webNavigation.LOAD_ANONYMOUS, null, null);
										else
											newTabBrowser.loadURIWithFlags(aURL, newTabBrowser.webNavigation.LOAD_ANONYMOUS, null, null);

										setTimeout(function(){ if(timedout === 0){ timedout = 1; onTabLoad(); } }, oRedirectionAlert.timeout);//give 60 seconds to load, else, just forget it.
									});

								};
								Requester.onerror = Requester.onabort = function(TIMEDOUT)
								{
									loaded = true;
									//ODPExtension.dump('Requester.onerror');
									if(tryAgain==1){
										oRedirectionAlert.itemsDone++;
										oRedirectionAlert.check(aURL, aFunction, 0);
									} else {
										var oHttp = {};
												oHttp.originalURI = {};
												oHttp.originalURI.spec = {};
												oHttp.URI = {};
												oHttp.URI.spec = {};
												oHttp.responseStatus = {};

												oHttp.originalURI.spec = aURL;
												oHttp.URI.spec = aURL;

										//detects if I'm offline

										if(typeof(TIMEDOUT) != 'undefined' && TIMEDOUT === 'TIMEDOUT'){
											oHttp.responseStatus = -5
										} else {
											if(
											   	Components
											   		.classes["@mozilla.org/network/io-service;1"]
											   		.getService(Components.interfaces.nsIIOService)
											   		.offline ||
											   	false //ODPExtension.getIPFromDomain('www.google.com', true) === '' // this blocks the browser because is sync
											){
												oHttp.responseStatus = -1337
											} else {
												try{
													oHttp.responseStatus = ODPExtension.createTCPErrorFromFailedXHR(Requester);
												} catch(e) {
													try{ oHttp.responseStatus = Requester.status} catch(e){ oHttp.responseStatus = -1; }
												}
												if(oHttp.responseStatus === 0)
													oHttp.responseStatus = -1;
											}
										}

										oRedirectionAlert.onExamineResponse(oHttp);

										aData.stop = true;
										ODPExtension.urlFlag(aData);
										aFunction(aData, aURL)

										oRedirectionAlert.itemsDone++;
										if(oRedirectionAlert.itemsDone==oRedirectionAlert.itemsWorking)
											oRedirectionAlert.unLoad();
									}
								};
								Requester.open("GET", aURL, true);
								if(ODPExtension.preferenceGet('link.checker.use.cache') === 0)
									Requester.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_FLAGS_BYPASS_PROXY | Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE | Components.interfaces.nsIRequest.LOAD_ANONYMOUS;
								else
									Requester.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_ANONYMOUS;

								if(tryAgain === 0)
									Requester.setRequestHeader('Referer', aURL);
								else
									Requester.setRequestHeader('Referer', 'https://www.google.com/search?q='+ODPExtension.encodeUTF8(aURL));
								Requester.send(null);
								//in some situations, timeout is maybe ignored, but neither onload, onerror nor onabort are called
								setTimeout(function(){
									//ODPExtension.dump(Requester.readyState);
									if(!loaded){
										//ODPExtension.dump('aborted');
										Requester.onabort('TIMEDOUT');
									}
								}, oRedirectionAlert.timeout+5000);
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
			      let nssErr = Math.abs(nsINSSErrorsService.NSS_SEC_ERROR_BASE)
			                       - (status & 0xffff);
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
			      let sslErr = Math.abs(nsINSSErrorsService.NSS_SSL_ERROR_BASE)
			                       - (status & 0xffff);
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
			        errName = -4;//ConnectionRefused
			        break;
			      // network timeout error
			      case 0x804B000E: // NS_ERROR_NET_TIMEOUT, network(14)
			        errName = -5;//NetworkTimeout
			        break;
			      // hostname lookup failed
			      case 0x804B001E: // NS_ERROR_UNKNOWN_HOST, network(30)
			        errName = -1;//DomainNotFound
			        break;
			      case 0x804B0047: // NS_ERROR_NET_INTERRUPT, network(71)
			        errName = -1337;//NetworkInterrupt
			        break;
			      default:
			        errName = -4;//NetworkError
			        break;
			    }
			  }
			  return errName;
		}

		this.disableTabFeatures = function(aWindow){
			try{
				aWindow.wrappedJSObject.alert = aWindow.wrappedJSObject.onbeforeunload = aWindow.wrappedJSObject.prompt = aWindow.wrappedJSObject.confirm = aWindow.wrappedJSObject.focus = function(){};
			} catch(e){}
		}

		// comments of the error codes based or taken from http://www.dmoz.org/docs/en/errorcodes.html
		this.urlFlag = function(aData, aDoc){

			aData.status = {};
			aData.status.error = true;
			aData.status.code = false;
			aData.status.delete = false;
			aData.status.unreview = false;
			aData.status.suspicious = [];

			aData.subdomain = this.getSubdomainFromURL(aData.urlLast);
			aData.domain = this.getDomainFromURL(aData.urlLast);
			aData.ip = this.getIPFromDomain(aData.subdomain);

			//HTTP redirections to HTTPS are not perceived as a redirection, log it
			if(aData.urlRedirections.length === 1 && aData.urlOriginal != aData.urlLast)
				aData.urlRedirections.push(aData.urlLast)

			var lastStatus = aData.statuses[aData.statuses.length-1];

			var urlMalformed = aData.urlLast.indexOf('https:///') != -1 || aData.urlLast.indexOf('http:///') != -1
													|| aData.subdomain.indexOf(',') !== -1
													|| aData.subdomain.indexOf('%') !== -1
													|| !this.isPublicURL(aData.urlLast);

			//links
			aData.linksInternal = []
			aData.linksExternal = []

			if(aDoc){
				var a = aDoc.getElementsByTagName('a');
				for(var i=0;i<a.length;i++){
					var link = a[i];
					if(link.href && link.href != '' && link.href.indexOf('http') === 0){
						var aDomain = this.getDomainFromURL(link.href)
						if(this.getDomainFromURL(aDomain) != aData.domain){
							aData.linksExternal.push({url:link.href, anchor:link.innerHTML, domain:aDomain});
						} else {
							aData.linksInternal.push({url:link.href, anchor:link.innerHTML, domain:aDomain});
						}
					}
				}
			}
			//-6 BAd URL
			if(false
			    || urlMalformed
			  	|| lastStatus == 414 // Request-URI Too Large - The URL (usually created by a GET form request) is too large for the server to handle. Check to see that a lot of garbage didn't somehow get pasted in after the URL.
			  	|| lastStatus == 413 // Request Entity Too Large - The server is refusing to process a request because the request entity is larger than the server is willing or able to process. Should never occur for Robozilla.
			  	|| lastStatus == 400 // Bad Request	Usually occurs due to a space in the URL or other malformed URL syntax. Try converting spaces to %20 and see if that fixes the error.
			) {
				aData.status.code = -6;
				aData.status.errorString = 'Bad URL';
				aData.status.unreview = true;

			//-1 	Unable to Resolve Host 	They didn't pay their bill for their Domain name.
			} else if(false
			   || aData.statuses.indexOf(-1) != -1
			   || aData.statuses.indexOf('DomainNotFound') != -1
			) {
				aData.status.code = -1;
				aData.status.errorString = 'Domain Not Found';
				aData.status.delete = true;

			//-401  SSL Error
			} else if(false
			   || aData.statuses.indexOf('SecurityProtocol') != -1
			   || aData.statuses.indexOf('SecurityCertificate') != -1
			   || aData.statuses.indexOf('SecurityExpiredCertificateError') != -1
			   || aData.statuses.indexOf('SecurityRevokedCertificateError') != -1
			   || aData.statuses.indexOf('SecurityUntrustedCertificateIssuerError') != -1
			   || aData.statuses.indexOf('SecurityInadequateKeyUsageError') != -1
			   || aData.statuses.indexOf('SecurityCertificateSignatureAlgorithmDisabledError') != -1
			   || aData.statuses.indexOf('SecurityError') != -1
			   || aData.statuses.indexOf('SecurityNoCertificateError') != -1
			   || aData.statuses.indexOf('SecurityBadCertificateError') != -1
			   || aData.statuses.indexOf('SecurityUnsupportedCertificateTypeError') != -1
			   || aData.statuses.indexOf('SecurityUnsupportedTLSVersionError') != -1
			   || aData.statuses.indexOf('SecurityCertificateDomainMismatchError') != -1
			   || aData.statuses.indexOf('SecurityCertificateDomainMismatchError') != -1
			) {
				aData.status.code = -401;
				aData.status.errorString = 'SSL Error: '+aData.statuses.join(',');
				aData.status.unreview = true;

			//-4 	Can't connect 	We can't connect to the HTTP server. The server is there but it didn't want to talk to Robozilla on the specified port.
			} else if(false
			   || aData.statuses.indexOf(-4) != -1
			   || aData.statuses.indexOf('ConnectionRefused') != -1
			   || aData.statuses.indexOf('NetworkError') != -1
			) {
				aData.status.code = -4;
				aData.status.errorString = 'Can\'t Connect';
				aData.status.unreview = true;

			//-5 	Timeout Robozilla connected OK, and sent the request but Robozilla timed out waiting to fetch the page. This happens sometimes on really busy servers.
			} else if(false
			   || aData.statuses.indexOf(-5) != -1
			   || aData.statuses.indexOf('NetworkTimeout') != -1
			   || lastStatus == 408 // Request Time-Out	- The server took longer than expected to return a page, and timed out. Similar to -5, but generated by the server, rather than Robozilla.
			   || lastStatus == 504 // Gateway Timeout - A server being used by this server has not responded in time.
			) {
				aData.status.code = -5;
				aData.status.errorString = 'Network Timeout';
				aData.status.unreview = true;

			//-1337 	Local Network error - probably the internet is gone
			} else if(false
			   || aData.statuses.indexOf(-1337) != -1
			   || aData.statuses.indexOf('NetworkInterrupt') != -1
			) {
				aData.status.code = -1337;
				aData.status.errorString = 'Internet Gone!?';

			//Server Error	The server returned an error code that looks like permanent.
			} else if(false
			   || lastStatus == 505 // HTTP Version Not Supported

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
			} else if(false
			   || lastStatus == 404 // Not Found
			   || lastStatus == 410 // Gone
			) {
				aData.status.code = lastStatus;
				aData.status.errorString = 'Not Found';
				aData.status.unreview = true;

			//-8 	Empty Page
			} else if(false
			   ||
			   (
			    this.urlFlagSempty.indexOf(aData.txt.toLowerCase()) !== -1
			    && aData.linksInternal.length < 1
			   )
			) {
				aData.status.code = -8;
				aData.statuses.push(aData.status.code);
				aData.status.errorString = 'Empty Page';
				aData.status.unreview = true;
				aData.status.match = aData.txt;

			//-1338 	Redirect OK	The server redirects to another page but it's OK
			} else if(
			   (
			   			aData.statuses.indexOf(300) !== -1 // Moved
				   || aData.statuses.indexOf(301) !== -1 // Redirect Permanently
				   || aData.statuses.indexOf(302) !== -1 // Redirect Temporarily
				   || aData.statuses.indexOf(303) !== -1 // See Other
				   || aData.statuses.indexOf('meta/js') !== -1 // meta/js redirect
				   || aData.urlOriginal != aData.urlLast
			   ) && this.redirectionOK(aData.urlOriginal, aData.urlLast)
			) {
				aData.status.code = -1338;
				aData.status.errorString = 'Redirect OK';
				aData.status.error = false;

			//-1339 	Redirect Must be corrected The server redirects to another page and must be corrected
			} else if(false
			   || aData.statuses.indexOf(300) !== -1 // Moved
			   || aData.statuses.indexOf(301) !== -1 // Redirect Permanently
			   || aData.statuses.indexOf(302) !== -1 // Redirect Temporarily
			   || aData.statuses.indexOf(303) !== -1 // See Other
			   || aData.statuses.indexOf('meta/js') !== -1 // meta/js redirect
			   || aData.urlOriginal != aData.urlLast
			) {
				aData.status.code = -1339;
				aData.status.errorString = 'Redirect';

			//200 OK
			} else if(false
			   || lastStatus == 200 // OK
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
				,'pendingRenew'

				,'forSale'
				,'parked'

				,'hacked'
				,'hijacked'

				,'gonePermanent'
				,'goneTemporal'
				,'serverPage'
				,'emptyMeaningNoContent'
				,'pageErrors'
				,'underConstruction'
				,'comingSoon'
				,'suspended'
			]

			var data = (aData.urlRedirections.join('\n')+'\n'+aData.externalContent.join('\n')+'\n'+aData.headers+'\n'+aData.html).toLowerCase();
			var breaky = false;
			for(var name in array){
				if(array[name] != '') {

					//bodyMatch
					for(var id in this['urlFlags'][array[name]]['body']) {
						string = this['urlFlags'][array[name]]['body'][id].trim();
						if(string != '' && (data.indexOf(string.toLowerCase().trim()) != -1)){
							aData.status.error = true;
							aData.status.code = this['urlFlags'][array[name]]['errorCode'];
							if(this['urlFlags'][array[name]]['canDelete'])
								aData.status.delete = true;
							if(this['urlFlags'][array[name]]['canUnreview'])
								aData.status.unreview = true;
							aData.status.errorString = this['urlFlags'][array[name]]['errorString'];
							aData.statuses.push(aData.status.code);
							aData.status.match = string;
							breaky = true;
							break;
						}
					}
					if(breaky)
						break;
				}
			}

			//suspicious
			if(aData.contentType != '' && aData.contentType != 'text/html' && aData.contentType != 'application/pdf' && aData.contentType != 'application/xhtml+xml'){
				aData.status.suspicious.push('Unknown content type: '+aData.contentType);
				//ODPExtension.dump(aData);
			}
			if(aData.html.indexOf('FrameSet') != -1){
				aData.status.suspicious.push('Document may has a FrameSet');
			}

/*
			To many false positives
			if(aData.html.indexOf('<title>'+aData.domain+'</title>') != -1){
				aData.status.suspicious.push('Maybe parked');
			}
*/

			//experimenting
			if(aData.status.error === false){
				if(aData.hash in this.badDocuments){
					if(aData.urlOriginal != this.badDocuments[aData.hash]){
						aData.extended = 'This same '+aData.urlOriginal+' document found on '+this.badDocuments[aData.hash];
						this.dump(aData.extended);
					}
				}
			}
			this.badDocuments[aData.hash] = aData.urlOriginal;
		}

		this.badDocuments = [];

		this.urlFlags = {
			parked: {
				errorCode: -8,
				errorString: 'Parked',
				canDelete: true,
				body:[''
					,"domainname=referer_detect"
					,"http://www.sedo.com/search/details.php4?domain="
					,"script src=\"http://dsparking.com"
					,'/?fp='
					,'/parked/dns/'
					,'000webhost.com</title>'
					,'200.62.55.254/estilos_parked.css'
					,'<!-- turing_cluster_prod -->'
					,'<form id="parking_form" method="get" action="'
					,'<form id="parking_form"'
					,'<h2>Domain Parked'
					,'adsense/domains/caf.js'
					,'display.cfm?domain='
					,'domain_profile.cfm?d='//domains http://www.hugedomains.com/domain_profile.cfm?d=skypeforandroid&e=com
					,'domainpark/show_afd_ads.js'
					,'domainredirect=1'
					,'frame src="http://onlinefwd.com'
					,'godaddy.com/parked'
					,'google.ads.domains'
					,'google.com/adsense/domains/caf.js'
					,'href="http://searchdiscovered.com'//src="http://searchdiscovered.com
					,'href="http://searchresultsguide.com'
					,'http://pagead2.googlesyndication.com/apps/domainpark/show_afd_ads.js'
					,'http://www.sedo.com/services/parking.php'
					,'images/parked_layouts'
					,'img.sedoparking.com/templates/'
					,'It has been reserved on gandi.net and parked as unused'
					,'mcc.godaddy.com/parked/park.aspx'
					,'parkedpage/style.css'
					,'quickfwd.com/?dn='
					,'src="http://dompark.'
					,'src="http://searchdiscovered.com'//src="http://searchdiscovered.com
					,'src="http://searchresultsguide.com'
					,'temporary Parking Page for'
					,'This domain is <a href="http://www.hugedomains'
					,'This domain is parked free, courtesy of'
					,'This page parked courtesy of'
					,'This web page is parked FREE, courtesy of GoDaddy.com'
					,'top.location="http://searchresultsguide.com'//http://searchresultsguide.com/?dn=howdoiuseandroid.com&pid=7POAYL1TT
					,'url=/?framerequest=1'
					,'window.location="http://www16.brinkster'
					/* parkeado */
					//	,'sedoparking.com'
					//,'ndparking.com/'
					//,'http://www.ndparking.com/'
					//	,'parklogic.com'
					,'</strong>se encuentra en parking</font>'
					,'<form name="parking_form"'
					,'<title>Parking dns'
					,'El dominio se encuentra en parking'
					,'href="/css/style_park.css">'
					,'href="/css/style_park.marquee4.css"'
					//	,'http://www.bodisparking.com/'
					,'domains.googlesyndication.com/apps/domainpark/'
					,'webregistrada.com.ar/parking.php'
					//	,'PARKINGSPA.COM'
					//,'parkinglot=1'
					//,"googlesyndication.com/apps/domainpark"
					//,"sedoparking"
					//"parkingcrew.net"
					//,"parkpage."
					//,"fastpark.net"
					,'onmouseover="window.status=\'Aparcamiento De Dominios\' return true;" title="Aparcamiento De Dominios">'
					,'parkingcrew.net/sale_form.php?domain_name'
				]
			}

			, forSale: {
				errorCode: -8,
				errorString: 'For Sale',
				canDelete: true,
				body:[''
					,"domainnamesales.com/lcontact?d="
					,"domainnamesales.com/return_js.php?d="
					,"This domain may be for sale"
					,'.com is for sale!'
					,'.net is for sale!'
					,'<img src="/images/default/forsale.jpg" alt="For Sale" width="150" height="64" border="0">'
					,'id="a-4sale" onmouseover="window.status=window.defaultStatus;return true;"><u><b>SALE</b>'
					,'The domain is available for purchase'
					,'This domain for SELL'
					,'this domain is for sale'
					,'This domain may be for sale'
					,'This domain maybe for sale'
					,'¡Esta pagina está a la venta!'
					,'In case of trademark issues please contact the domain owner'
				]
			}

			, pendingRenew: {
				errorCode: -8,
				errorString: 'Pending Review',
				canUnreview: true,
				body:[''
					,"and is pending renewal or deletion"
					,"and is pending renewal or deletion"
					,"This website is currently expired"
					,'has expired. If you owned this domain'
					,'has expired.</h2>'
					,'This domain has recently been'
					,'This domain name has expired'
					,'Click here</a> to renew it'
				]
			}

			, gonePermanent: {
				errorCode: -8,
				errorString: 'Gone',
				canDelete: true,
				body:[''
					,"<title>Blogger: Sign in</title>"
					,"<TITLE>Movistar.es - Error</TITLE>"
					,"The authors have deleted this site"
					,'msg-hidden">No hay ninguna entrada.</div>' //< blogspot empty
					,'<img src="/error/rcs/pxnada.gif" width="1" height="30">'
					,'<title> No such site available </title>'
					,'<title>Hometown Has Been Shutdown'
					,'Blog dado de baja'
					,'Dominio desactivado</font'
					,'dominio se encuentra desactivado'
					,'Due to the market diffculty, we are unable to continue provide the free web hosting service.'
					,'Espacio WEB no existe'
					,'has been removed because it violated Tripod\'s Terms of Service.'
					,'http://iphone.terra.es/error.htm'
					,'inicia.es/home/error'
					,'is now closed</title>'
					,'Location: http://perso.orange.es/error/error_wanadoo.htm'
					,'Location: http://www.abc.es/failover/pagina.html'
					,'miarroba.com/error'
					,'msngroupsclosure'
					,'su acceso ha sido denegado por seguridad'
					,'Unavailable Tripod Directory'
					,'Welcome to WordPress. This is your first post'
					,'<h1>Este blog solo admite a lectores invitados'
				]
			}


			, goneTemporal: {
				errorCode: -8,
				errorString: 'Not Found',
				canUnreview: true,
				body:[''
					,"<title>Página no encontrada</title>"
					,"http://www.host.sk/404.php"
					,"The page you are looking for could not be found"
					,'<h1>Sorry, this page is no longer available</h1>'
					,'<h4 class="errorHeading">404 - Not Found</h4>'
					,'<TITLE>404 Error page</TITLE>'
					,'<title>404 Not Found</title>'
					,'<title>Page Not Found</title>'
					,'<title>Sorry, We Can\'t Find That Page'
					,'<TITLE>The page cannot be found</TITLE>'
					,'<title>The page is Unavailable'
					,'La página web solicitada no se encuentra disponible en este momento'
					,'The requested object does not exist on this server.'
					,'The requested page could not be found.'
					,'this site is experiencing difficulties at this time'
					,'was not found on this server.'
					,'was not found on this server.</p>'
				]
			}

			, serverPage: {
				errorCode: -8,
				errorString: 'Server Default Page',
				canUnreview: true,
				body:[''
					,"cgi-sys/defaultwebpage"
					,"Ferozo Panel de Control de Hosting"
					,'"welcomeText">Server Default page</p>'
					,'0;URL=/cgi-sys/defaultwebpage.cgi'
					,'<b>Welcome to a Brinkster Member\'s site!</b>'
					,'<h1>Default Web Site Page</h1>'
					,'<h1>It works!</h1>'
					,'<h3>Advance Web Hosting Solution'
					,'<title>cPanel'
					,'<TITLE>Default Index</TITLE>'
					,'<title>Default Parallels Plesk Panel Page</title>'
					,'<title>Default Web Site Page</title>'
					,'<title>Default Web Site Page</title>'
					,'<title>DreamHost</title>'
					,'<title>DreamHost</title>'
					,'<title>Domain Default page'
					,'<title>Free Website Hosting'
					,'<title>HostGator'
					,'<title>IIS7</title>'
					,'<title>Kloxo Control Panel</title>'
					,'<title>Manage Domain Name</title>'
					,'<title>Parallels H-'
					,'<title>Test Page for Apache Installation</title>'
					,'<title>Test Page for the Apache'
					,'<title>Web hosting'
					,'<title>Welcome to DiscountASP.NET Web Hosting</title>'
					,'class="welcomeText">Domain Default page</p>'
					,'Default Parallels Plesk Panel Page'
					,'Esta es la página por defecto del dominio'
					//,'Free Web Hosting Provider'
					,'is the Plesk default page'
					,'ISPmanager control panel'
					,'Media Temple</title>'
					,'myhosting.com/Signup/domainselect.aspx'
					,'No web site is configured at this address.'
					,'Panel de Control de Hosting'
					,'Sign Up for Free Web Hosting'
					,'This page is autogenerated by <a href="http://www.parallels'
					,'To change this page, upload your website into the public_html directory'
					,'Unlugar Web Hosting</a>'
				]
			}

			, emptyMeaningNoContent: {
				errorCode: -8,
				errorString: 'No Content',
				canUnreview: true,
				body:[''
					,'<h1>Your website is up and running!</h1>'
					,'<th>Welcome to your future Web Site Creator</th>'
					,'site has not yet been published.</title>'
					,'The domain owner may currently be creating a great site for this domain'
					,'This domain has just been registered for one of our customers'
					,'This is a default template, indicating that the webmaster has not yet uploaded'
					,'This is your first post. Edit or delete it'
					,'To create a website, do one of the following'
					,'You can access your hosting account control panel'
					,'<h1>This domain name has been registered with '
				]
			}

			, pageErrors: {
				errorCode: -8,
				errorString: 'Has Errors',
				canUnreview: true,
				body:[''
					,"<b>Fatal error</b>:  require_once("
					,"<h1>Bad Request (Invalid Hostname)</h1>"
					,"<title>Index of /"
					,'(using password: YES)'
					,'<b>Fatal error</b>:  Allowed memory size'
					,'<b>Fatal error</b>:  Cannot redeclare'
					,'<b>Parse error</b>:  syntax error'
					,'<h1>Forbidden</h1>'
					,'<title>403 Forbidden</title>'
					,'<title>500 - Internal server error.</title>'
					,'<title>Index of /'
					,'<TITLE>Index of /</TITLE>'
					,'Database Error: Unable to connect'
					,'Forbidden</title>'
					,'header already sent.'
					,'Microsoft OLE DB Provider for SQL Server'
				]
			}

			, underConstruction: {
				errorCode: -8,
				errorString: 'Under Construction',
				canUnreview: true,
				body:[''
					,"<title>Site under maintenance"
					,"Estamos trabajando. Pronto estaremos de vuelta"
					,"Pagina en mantenimiento"
					,'<title ID=titletext>En construcción</title>'
					,'<title>Cette page est en construction</title>'
					,'<title>Sitio fuera de línea'
					,'<title>Under Construction</title>'
					,'<title>Web Page Under Construction</title>'
					,'Be project</b> està en construcció'
					,'El sitio está desactivado por tareas de mantenimiento'
					,'esta actualmente en contrucción...'
					,'Estamos actualizando la web'
					,'Estamos construyendo nuestra nueva página'
					,'ID=titletext>Under Construction</title>'
					,'Página en Construcción'
					,'PAGINA EN CONSTRUCCION'
					,'SITIO EN CONSTRUCCION'
					,'Sitio en construcción'
					,'Site closed for maintenance'
					,'This site is under construction'
					,'underconstruction.networksolutions.com'
					,'img/under_construction'
					,'Estamos en obras en la página'
					,'>En construcción<'
					,'la pagina está en remodelación'
				]
			}

			, comingSoon: {
				errorCode: -8,
				errorString: 'Coming Soon',
				canUnreview: true,
				body:[''
					,'<p>coming soon</p>'
					,'<title>Coming Soon -'
					,'<title>coming soon'
					,'<title>This Web site coming soon</title'
					,'Coming Soon!</h1>'
					,'Real content coming soon'
				]
			}

			, suspended: {
				errorCode: -8,
				errorString: 'Suspended',
				canUnreview: true,
				body:[''
					,"cgi-sys/suspendedpage.cgi"
					,'<b>This Account Has Been Suspended</b>'
					,'<title>Account Suspended</title>'
					,'<title>Servicio suspendido.</title>'
					,'<title>Sitio Suspendido</title>'
					,'<title>Your website has been suspended!</title>'
					,'Bandwidth Limit Exceeded</TITLE>'
					,'suspended.page/">here'
					,'suspendida por razones de seguridad</title>'
					,'This account has been suspended</title>'
					,'/suspended.page/'
				]
			}

			, hacked: {
				errorCode: -8,
				errorString: 'Hacked',
				canUnreview: true,
				body:[''
					,'<title>Hacked By '
					,'HaCked By Virus-IM'
				]
			}

			, hijacked: {
				errorCode: -8,
				errorString: 'Hijacked',
				canDelete: true,
				body:[''
					,'.credonic.com'
					,'/?fp='
					,'/www.dotearth.com/servlet/DeRedirect'
					,'<div class="relHdr">Related Searches</div>'
					,'<frame name="pp"'
					,'<frame src="http://domain.dot.tk/p/?d='
					,'<html lang="ja"'
					,'<title>"Domain-Name.bz"'
					,'Below are sponsored listings for goods and services related to'
					,'buy phentermine'
					,'class="resMain"><h2>Sponsored listings for'
					,'Disclaimer: Domain owner maintains no relationship with third party advertisers'
					,'hosting24.com/count.php"><'
					,'http://www.searchnut.com/?domain=refererdetect'
					,'iframe src=\'http://cw.gabbly.com/'
					,'iframe src="http://cw.gabbly.com/'
					,'star-domain.jp/'
					,'traffic.ddc.com'
				]
			}
		};

		this.urlFlagSempty = [''
			,'test'
			,'test page'
			,'hello'
			,'hello!'
			,':)'
			,':-)'
			,':'
			,'-'
			,'yes'
			,'no'
			,':-('
			,':('
			,'welcome'
			,'welcome!'
		];

		this.redirectionOK = function(oldURL, newURL){

			oldURL = this.removeWWW(this.removeSchema(oldURL)).replace(/\/+$/, '').toLowerCase()
			newURL = this.removeWWW(this.removeSchema(newURL)).replace(/\/+$/, '').toLowerCase();

			if(oldURL == newURL){
				return true;
			} else if(newURL.indexOf(oldURL) === 0){
				return true;
			} else {
				return false;
			}
		}

	return null;

}).apply(ODPExtension);

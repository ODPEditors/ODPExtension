(function()
{
		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

			this.redirectionAlert = function()
			{
				function RedirectionAlert(){ return this;}

				RedirectionAlert.prototype =
				{
					init:function()
					{
						this.cache = Array();
						this.cacheRedirects = Array();
						this.itemsWorking=0;
						this.itemsDone=0;
						var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
								observerService.addObserver(this, "http-on-examine-response", false);
					},
					unLoad:function()
					{
						delete(this.cache);
						delete(this.cacheRedirects);
						delete(this.itemsWorking);
						delete(this.itemsDone);

						var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
							observerService.removeObserver(this, "http-on-examine-response", false);
					},
					observe: function(aSubject, aTopic, aData)
					{
						if(aTopic == 'http-on-examine-response') {
							aSubject.QueryInterface(Components.interfaces.nsIHttpChannel);
							this.onExamineResponse(aSubject);
						}
					},
					onExamineResponse: function (oHttp)
					{
						//skiping the examinations of requests NOT related to our redirection alert
						if(!this.cache[oHttp.originalURI.asciiSpec])
						{
							if(!this.cacheRedirects[oHttp.originalURI.asciiSpec])
							{
								//this examination comes from a request (browser, extension, document) not related to the current process: checking the status of the this document/selected links
								return;
							}
							else
							{
								//resolving: from where this redirection come from - this resolve when a redirect redirect again to another place
								var originalURI = this.cacheRedirects[oHttp.originalURI.asciiSpec];
							}
						}
						else
						{
							var originalURI = oHttp.originalURI.asciiSpec;
						}
						if(this.cache[originalURI].stop==true)
						{
							//resolving: this item was already checked to the end but all the request are still on examination
							//so: if you open a new tab with this item.url, that information willl be appended as a redirection
							return;
						}

						//normalize responseStatus
						var responseStatus = oHttp.responseStatus;
						if(responseStatus===0)
							responseStatus = '-1';


						this.cache[originalURI].latestStatus = responseStatus;
						if(!this.cache[originalURI].firstStatus)
							this.cache[originalURI].firstStatus = responseStatus;
						else
							this.cache[originalURI].statusLog += '-'+responseStatus;

						if(originalURI != oHttp.URI.asciiSpec)
						{
							this.cacheRedirects[oHttp.URI.asciiSpec] = originalURI;
							this.cache[originalURI].redirectionsLog += oHttp.URI.asciiSpec+'\n';
						}


					},
					check:function(aURL, aFunction, tryAgain)
					{
						this.itemsWorking++;

						if(typeof(tryAgain) == 'undefined')
							tryAgain = 1;

						if(!this.cache[aURL])
						{
							this.cache[aURL] = {};
							this.cache[aURL].stop= false;

							this.cache[aURL].statusLog='';
							this.cache[aURL].redirectionsLog='';
						}
						var oRedirectionAlert = this;

						var Requester = new XMLHttpRequest();

								Requester.onload = function()
								{
									oRedirectionAlert.cache[aURL].stop = true;
									aFunction(oRedirectionAlert.cache[aURL], aURL)

									oRedirectionAlert.itemsDone++;
									//ODPExtension.dump(oRedirectionAlert.itemsDone+' / '+oRedirectionAlert.itemsWorking);
									if(oRedirectionAlert.itemsDone==oRedirectionAlert.itemsWorking)
										oRedirectionAlert.unLoad();
								};
								Requester.onerror = function()
								{

									if(tryAgain==1){
										oRedirectionAlert.itemsDone++;
										oRedirectionAlert.check(aURL, aFunction, 0);
									} else {
										var oHttp = {};
												oHttp.originalURI = {};
												oHttp.originalURI.asciiSpec = {};
												oHttp.URI = {};
												oHttp.URI.asciiSpec = {};
												oHttp.responseStatus = {};

												oHttp.originalURI.asciiSpec = aURL;
												oHttp.URI.asciiSpec = aURL;
										try{
											oHttp.responseStatus = Requester.status;
										} catch(e) {
											oHttp.responseStatus = '-1';
										}
										if(oHttp.responseStatus === 0)
											oHttp.responseStatus = '-1';

										oRedirectionAlert.onExamineResponse(oHttp);

										oRedirectionAlert.cache[aURL].stop = true;

										aFunction(oRedirectionAlert.cache[aURL], aURL)

										oRedirectionAlert.itemsDone++;
										//ODPExtension.dump(oRedirectionAlert.itemsDone+' / '+oRedirectionAlert.itemsWorking);
										if(oRedirectionAlert.itemsDone==oRedirectionAlert.itemsWorking)
											oRedirectionAlert.unLoad();
									}
								};
								Requester.open("GET", aURL, true);
								Requester.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;
								Requester.setRequestHeader('Referer', 'http://www.google.com/search?q='+ODPExtension.encodeUTF8(aURL)+'&ie=utf-8&oe=utf-8');
								Requester.send(null);
							}
				};

				var oRedirectionAlert = new RedirectionAlert();
						oRedirectionAlert.init();

				return oRedirectionAlert;
		}

	return null;

}).apply(ODPExtension);

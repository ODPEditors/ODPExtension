/*
	EXTENSION CONTROLLER - SETS AND CALL LISTENERS AND SHUTDOWN FUNCTIONS, ALSO DUMPS MESSAGES TO THE CONSOLE
	tito (ed:development) <tito.bouzout@gmail.com>
*/

var ODPExtension = {};

// Extension controller

(function () {
	/*ODPExtension global variables*/
	this.debugingGlobal = false; //it output to the console all calls to dump no matter what debugingThisFile value is
	this.extensionHasBeenLoaded = false; //this one is useful to notify to the XPCOMponents that the extension is "usable"

	//new line caracter detection
	var osVersion = String(Components.classes["@mozilla.org/xre/app-info;1"]
		.getService(Components.interfaces.nsIXULRuntime).OS).toLowerCase();
	//NOTE: The new line separator should be used only when copying things to the clipboard or when contructing HTML for the user.
	//Internal new lines should be \n
	if (osVersion.indexOf('mac') != -1 || osVersion.indexOf('darwin') != -1 || osVersion.indexOf('leopard') != -1) {
		this.__NEW_LINE__ = '\n';
		this.__DIRECTORY_SEPARATOR__ = '/';
	} else if (osVersion.indexOf('win') != -1) {
		this.__NEW_LINE__ = '\n';
		this.__DIRECTORY_SEPARATOR__ = '\\';
	} else {
		this.__NEW_LINE__ = '\n';
		this.__DIRECTORY_SEPARATOR__ = '/';
	}
	this.__LINE__ = '\n';
	this.windowID = Date.now();
	/*this function local variables*/
	var debugingThisFile = false; //sets debuging on/off for this JavaScript file
	//console
	var consoleService = Components.classes["@mozilla.org/consoleservice;1"].
	getService(Components.interfaces.nsIConsoleService);
	//controller properties
	var listeners = []; //an array of functions to add as listeners
	var shutdown = []; //an array of functions that will remove things added by the extension
	var focusedLocation = 'about:blank'; //holds the location of the focused tab TOP document

	var urlBarListener; //the ProgressListener

	var callsToInitListeners = 0; //this is just dumb protection, if the extension found more calls to initListeners than removeListeners will throw an error
	var callsToRemoveListeners = 0; //
	var popupShowingListeners = [];

	//registerExtension - waiting for the browser to init the extension
	this.registerExtension = function () {
		this.dump('registerExtension', debugingThisFile);
		window.addEventListener("load", ODPExtension.init, false);
		window.addEventListener("unload", ODPExtension.unregisterExtension, false);
	};
	// init the extension, called when the browser has been loaded
	this.init = function () {
		ODPExtension.dump('init', debugingThisFile);
		window.removeEventListener("load", ODPExtension.init, false); //load is not more needed
		ODPExtension.addListener('browserInstantiated', ODPExtension.registerTheListeners);
		ODPExtension.initLoadListeners();
	};
	//register this extension to the "TheListeners" component
	this.registerTheListeners = function () {
		var theListeners = Components.classes['@particle.universe.odp.tito/TheListeners;7']
			.getService().wrappedJSObject;
		theListeners.registerExtension('ODPExtension', 'development@dmoz.org');
	}
	//unregisterExtension - removing extension from browser, listeners, menus, vars, etcs
	this.unregisterExtension = function () {
		ODPExtension.dump('unregisterExtension', debugingThisFile);
		window.removeEventListener("unload", ODPExtension.unregisterExtension, false);
		ODPExtension.removeListeners(true);
		ODPExtension.shutDown();
		ODPExtension.destroy();
		return null;
	};
	//adding listeners waiting for the browser to load
	this.addListener = function (aListener, aFunction) {
		this.dump('addListener:' + aListener + ':' + aFunction, debugingThisFile);
		if (!listeners[aListener])
			listeners[aListener] = [];
		listeners[aListener][listeners[aListener].length] = aFunction;
	};
	//start a complex listener
	this.startComplexListener = function (aListener) {
		var theListeners = Components.classes['@particle.universe.odp.tito/TheListeners;7']
			.getService().wrappedJSObject;
		theListeners.addComplexListener(aListener, 'ODPExtension');
	}
	//stop a complex listener
	this.stopComplexListener = function (aListener) {
		var theListeners = Components.classes['@particle.universe.odp.tito/TheListeners;7']
			.getService().wrappedJSObject;
		try {
			theListeners.removeComplexListener(aListener, 'ODPExtension');
		} catch (e) {}
	}

	//removes a listener from the array of listeners
	this.removeListener = function (aListener, aFunction) {
		this.dump('removeListener', debugingThisFile);
		for (var id in listeners[aListener]) {
			if (listeners[aListener][id].toSource() == aFunction.toSource()) {
				this.dump('removeListener:' + aListener + ':' + aFunction, debugingThisFile);
				delete(listeners[aListener][id]);
				break;
			}
		}
	};
	//adds aFunction to the array of functions to be called when the extension is unregistered
	this.addShutDown = function (aFunction) {
		this.dump('addShutDown:' + aFunction, debugingThisFile);
		shutdown[shutdown.length] = aFunction;
	}
	//executing listeners - automatically init the BASIC listeners when the browser fully loaded
	this.initLoadListeners = function () {
		this.dump('initLoadListeners', debugingThisFile);
		//browser instantiated -
		//called just when a new instance of firefox is created (no window, many windows can be from one instance)
		//this is useful for example to get just one preferences observer for all the windows.
		if (listeners['browserInstantiated']) {
			if (!this.sharedObjectExists('browserInstantiated')) {
				this.sharedObjectGet('browserInstantiated');
				for (var id in listeners['browserInstantiated']) {
					this.dump('initLoadListeners:browserInstantiated:' + listeners['browserInstantiated'][id], debugingThisFile);
					listeners['browserInstantiated'][id]();
				}
			}
		}

		//before the browser load listener
		if (listeners['beforeBrowserLoad']) {
			for (var id in listeners['beforeBrowserLoad']) {
				this.dump('initLoadListeners:beforeBrowserLoad:' + listeners['beforeBrowserLoad'][id], debugingThisFile);
				listeners['beforeBrowserLoad'][id]();
			}
		}

		//on first run
		if (listeners['onFirstRun']) {
			if (!this.preferenceGet('first.run')) {
				this.preferenceSet('first.run', true);
				for (var id in listeners['onFirstRun']) {
					this.dump('initLoadListeners:onFirstRun:' + listeners['onFirstRun'][id], debugingThisFile);
					listeners['onFirstRun'][id]();
				}
			}
		}

		//before the browser load listener
		if (listeners['databaseCreate']) {
			for (var id in listeners['databaseCreate']) {
				this.dump('initLoadListeners:databaseCreate:' + listeners['databaseCreate'][id], debugingThisFile);
				listeners['databaseCreate'][id]();
			}
		}

		//before the browser load listener
		if (listeners['databaseReady']) {
			for (var id in listeners['databaseReady']) {
				this.dump('initLoadListeners:databaseReady:' + listeners['databaseReady'][id], debugingThisFile);
				listeners['databaseReady'][id]();
			}
		}

		//browser load
		//called when a new window of the browser is created
		if (listeners['browserLoad']) {
			for (var id in listeners['browserLoad']) {
				this.dump('initLoadListeners:browserLoad:' + listeners['browserLoad'][id], debugingThisFile);
				listeners['browserLoad'][id]();
			}
		}

		//after the browser load listener
		if (listeners['afterBrowserLoad']) {
			for (var id in listeners['afterBrowserLoad']) {
				this.dump('initLoadListeners:afterBrowserLoad:' + listeners['afterBrowserLoad'][id], debugingThisFile);
				listeners['afterBrowserLoad'][id]();
			}
		}

		this.extensionHasBeenLoaded = true;
	};
	this.initListeners = function () {
		this.dump('initListeners', debugingThisFile);
		//dumb protection
		callsToInitListeners++;
		if (callsToInitListeners - callsToRemoveListeners > 1)
			this.error('To re initListeners() You must call removeListeners() first');
		//popupshowing
		if (listeners['tabContextMenuShowing']) {
			this.dump('initListeners:tabContextMenuShowing', debugingThisFile);
			this.tabContextMenu().addEventListener('popupshowing', ODPExtension.dispatchtabContextMenuShowing, false);
		}
		if (listeners['contextMenuShowing']) {
			this.dump('initListeners:contextMenuShowing', debugingThisFile);
			this.contentAreaContextMenu().addEventListener('popupshowing', ODPExtension.dispatchContentAreaContextMenuShowing, false);
		}
		//onLocationChange
		if (listeners['onLocationChange'] || listeners['onLocationChangeNotDocumentLoad']) {
			this.dump('initListeners:onLocationChange', debugingThisFile);

			urlBarListener = {
				QueryInterface: function (aIID) {
					if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
						aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
						aIID.equals(Components.interfaces.nsISupports))
						return this;
					throw Components.results.NS_NOINTERFACE;
				},
				onLocationChange: function (aProgress, aRequest, aURI) {
					//ODPExtension.dump('onLocationChange:onLocationChange', true);
					ODPExtension.dispatchOnLocationChange(false);
				},
				onStateChange: function (aWebProgress, aRequest, aFlag, aStatus) {},
				onProgressChange: function (aWebProgress, aRequest, curSelf, maxSelf, curTot, maxTot) {},
				onStatusChange: function (aWebProgress, aRequest, aStatus, aMessage) {},
				onSecurityChange: function (aWebProgress, aRequest, aState) {}
			};
			gBrowser.addProgressListener(urlBarListener);
			/* REGISTRATION of this "event" CONTINUE IN THE NEXT IF OR ELSE IF*/
		}
		//DOMContentLoaded
		if (listeners['DOMContentLoadedNoFrames'] || listeners['DOMContentLoadedWithFrames']) {
			this.dump('initListeners:DOMContentLoaded', debugingThisFile);
			window.addEventListener("DOMContentLoaded", ODPExtension.dispatchDOMContentLoaded, false);
		}
		//onLocationChange needs to look the load of documents
		else if (listeners['onLocationChange'] || listeners['onLocationChangeNotDocumentLoad']) {
			this.dump('initListeners:onLocationChange:DOMContentLoaded', debugingThisFile);
			window.addEventListener("DOMContentLoaded", ODPExtension.dispatchDOMContentLoaded, false);
		}

		//onModifyRequest
		if (listeners['onModifyRequest']) {
			this.startComplexListener('onModifyRequest');
		}

		//onOverLink
		if (listeners['onOverLink']) {
			//setOverLink listener, this was found on fission, with the help of mau in the extdev IRC channel
			//ironically fission was breaking this extension.. by not executing code that is behind their code..
			//solved by executing my code before fission and allowing fission to run they own code..
			if (this.trim(XULBrowserWindow.setOverLink.toString()).indexOf("ODPExtension.dispatchEvent") != -1) { /*dumb protection*/ } else {
				/*
								README :
									This code is executed by "No Referrer" extension
									Since then this code is part of the library.
									Other extension will not execute this code.
									Also this is a valid usage of eval.
									Read this:
									http://adblockplus.org/blog/five-wrong-reasons-to-use-eval-in-an-extension
									then this:
									http://piro.sakura.ne.jp/latest/blosxom/mozilla/xul/2010-02-08_eval-en.htm
									Thanks
							*/
				/*
							function (url, anchorElt) {
								if (gURLBar) {
									url = url.replace(/[\u200e\u200f\u202a\u202b\u202c\u202d\u202e]/g, encodeURIComponent);
									gURLBar.setOverLink(url);
								}
							}
							*/
				eval('' + /* unable to do this without using eval(.*/ "XULBrowserWindow.setOverLink = " + this.trim(XULBrowserWindow.setOverLink.toString()).replace(/(\{)/, "$1 ODPExtension.dispatchEvent('onOverLink', (typeof(url) == 'undefined' ? link : url));"));
			}
		}
		//title change
		if (listeners['titleChange']) {
			this.dump('initListeners:DOMTitleChanged', debugingThisFile);
			window.addEventListener("DOMTitleChanged", ODPExtension.dispatchDOMTitleChanged, false);
		}

		if (listeners['tabClose']) {
			gBrowser.tabContainer.addEventListener("TabClose", ODPExtension.dispatchTabClosed, false);
		}
		if (listeners['tabSelect']) {
			gBrowser.tabContainer.addEventListener("TabSelect", ODPExtension.dispatchTabSelected, false);
		}

		//onListenersLoad
		if (listeners['onListenersLoad']) {
			this.dump('initListeners:onListenersLoad', debugingThisFile);
			for (var id in listeners['onListenersLoad']) {
				this.dump('initListeners:onListenersLoad:' + listeners['onListenersLoad'][id], debugingThisFile);
				listeners['onListenersLoad'][id]();
			}
		}
	};
	//this is just cool. dispatch an event of this 'core'
	this.dispatchEvent = function () {
		//this.dump('dispatchEvent:'+arguments[0], debugingThisFile);

		var aListener = arguments[0];
		var aListeners = listeners[aListener];
		if (aListeners) {
			for (var id in aListeners) {
				//if (aListener != 'onModifyRequest') //spams the console
				//	this.dump('dispatchEvent:' + aListener + ':' + aListeners[id], debugingThisFile);

				//I never use too many arguments
				aListeners[id](
					arguments[1], arguments[2], arguments[3], arguments[4], arguments[5],
					arguments[6], arguments[7], arguments[8], arguments[9], arguments[10]);
			}
		}
	}

	//this is just cool. dispatch an event of this 'core'
	this.dispatchGlobalEvent = function () {
		this.dump('dispatchGlobalEvent:' + arguments[0], debugingThisFile);

		var aListener = arguments[0];
		var windows = this.windowsGet();
		for (var id in windows) {
			//this.dump('dispatchGlobalEvent:window:'+id, debugingThisFile);
			windows[id]['ODPExtension'].dispatchEvent(aListener,
				arguments[1], arguments[2], arguments[3], arguments[4], arguments[5],
				arguments[6], arguments[7], arguments[8], arguments[9], arguments[10]);
		}
	}

	//notifies to other instances of this extension that aFunction needs to be called
	this.notifyOtherInstances = function () {
		this.dump('notifyOtherInstances', debugingThisFile);

		var aFunction = arguments[0];
		var windows = this.windowsGet();
		var window = this.windowGetFocused();
		for (var id in windows) {
			if (windows[id] != window) {
				try {
					windows[id]['ODPExtension'][aFunction](
						arguments[1], arguments[2], arguments[3], arguments[4], arguments[5],
						arguments[6], arguments[7], arguments[8], arguments[9], arguments[10]);
				} catch (e) {}
			}
		}
	}
	//notifies to all the instances of this extension that aFunction needs to be called
	this.notifyInstances = function () {
		this.dump('notifyInstances', debugingThisFile);

		var aFunction = arguments[0];
		var windows = this.windowsGet();
		for (var id in windows) {
			try {
				windows[id]['ODPExtension'][aFunction](
					arguments[1], arguments[2], arguments[3], arguments[4], arguments[5],
					arguments[6], arguments[7], arguments[8], arguments[9], arguments[10]);
			} catch (e) {}
		}
	}
	//notifies to the instance of this extension in the focused window that aFunction needs to be called
	this.notifyFocused = function () {
		this.dump('notifyFocused', debugingThisFile);

		var aFunction = arguments[0];
		var win = this.windowGetFocused();
		try {
			win['ODPExtension'][aFunction](
				arguments[1], arguments[2], arguments[3], arguments[4], arguments[5],
				arguments[6], arguments[7], arguments[8], arguments[9], arguments[10]);
		} catch (e) {}
	}
	//fires the listener onLocationChange
	/*
				The objective is to notify to x functions that the tab you have focused changed it's URL OR that the tab focused document finished loading.
				The intention is to notify to the extension that is time to refresh the UI or x
				So a focused "about:blank" tab will receive 2 notifications when you write google.com and press enter in the location bar
				It's time to refresh the UI when the URL starting load ;and when the URL finish loading BUT this: ONLY for the focused tab
				This will listen the DOMContentLoaded and the urlBarListener but it will don't do nothing with the content(document) of the tab it self. (to work with document see DOMContentLoadedNoFrames or DOMContentLoadedWithFrames)
				Listening to "TabOpen","TabMove","TabClose","TabSelect" is not necesary beacuse urlBarListener is fired with this events and back/forward calls !important;
			*/
	this.dispatchOnLocationChange = function (focusedDocumentHasBeenLoaded) {
		var aDoc = window.top.getBrowser().browsers[window.top.getBrowser().mTabBox.selectedIndex].contentDocument;
		var aLocation = this.IDNDecodeURL(this.string(aDoc.location));

		if (focusedDocumentHasBeenLoaded || aLocation != focusedLocation) {
			this.dump('dispatchOnLocationChange:aLocation:' + aLocation + ':focusedDocumentHasBeenLoaded:' + focusedDocumentHasBeenLoaded, debugingThisFile);
			focusedLocation = aLocation;

			if (!focusedDocumentHasBeenLoaded) {
				if (listeners['onLocationChangeNotDocumentLoad']) {
					for (var id in listeners['onLocationChangeNotDocumentLoad']) {
						listeners['onLocationChangeNotDocumentLoad'][id](focusedLocation);
					}
				}
			}
			if (listeners['onLocationChange']) {
				for (var id in listeners['onLocationChange']) {
					listeners['onLocationChange'][id](focusedLocation);
				}
			}

		}

	}
	//fires the listener fireDOMContentLoaded
	this.dispatchDOMContentLoaded = function (event) {
		//ODPExtension.dump('dispatchDOMContentLoaded', debugingThisFile);

		var aDoc = event.originalTarget;
		if (!aDoc.defaultView)
			var topDoc = aDoc;
		else
			var topDoc = aDoc.defaultView.top.document;

		if (aDoc != topDoc) //its a frame
		{
			//calling listeners for frames
			if (listeners['DOMContentLoadedWithFrames']) {
				//ODPExtension.dump('dispatchDOMContentLoaded:framedDocument:aDoc.location:'+aDoc.location, debugingThisFile);
				for (var id in listeners['DOMContentLoadedWithFrames']) {
					listeners['DOMContentLoadedWithFrames'][id](aDoc);
				}
			}

		} else {
			//notify to onLocationChange that the document has been loaded but only if this loaded document is the current focused one
			if (listeners['onLocationChange']) {
				if (aDoc == window.top.getBrowser().browsers[window.top.getBrowser().mTabBox.selectedIndex].contentDocument) {
					ODPExtension.dispatchOnLocationChange(true);
				}
			}

			//calling listeners for frames but for top document too
			if (listeners['DOMContentLoadedWithFrames']) {
				//ODPExtension.dump('dispatchDOMContentLoaded:topDocument:aDoc.location:'+aDoc.location, debugingThisFile);
				for (var id in listeners['DOMContentLoadedWithFrames']) {
					listeners['DOMContentLoadedWithFrames'][id](aDoc);
				}
			}
			//calling listeners for top document
			if (listeners['DOMContentLoadedNoFrames']) {
				//ODPExtension.dump('dispatchDOMContentLoaded:topDocument:aDoc.location:'+aDoc.location, debugingThisFile);
				for (var id in listeners['DOMContentLoadedNoFrames']) {
					listeners['DOMContentLoadedNoFrames'][id](aDoc);
				}
			}
		}
	}
	//fires the listener popupshowing for the tabContextMenu
	this.dispatchtabContextMenuShowing = function (event) {
		if (event.originalTarget == event.currentTarget) {
			ODPExtension.dump('dispatchtabContextMenuShowing', debugingThisFile);

			for (var id in listeners['tabContextMenuShowing']) {
				ODPExtension.dump('dispatchtabContextMenuShowing:' + listeners['tabContextMenuShowing'][id], debugingThisFile);
				listeners['tabContextMenuShowing'][id](event);
			}
		}
	}
	//fires when the title of a document change
	this.dispatchDOMTitleChanged = function (event) {
		ODPExtension.dump('dispatchDOMTitleChanged', debugingThisFile);

		var aDoc = event.originalTarget;
		if (!aDoc.defaultView)
			var topDoc = aDoc;
		else
			var topDoc = aDoc.defaultView.top.document;

		if (aDoc != topDoc) {} //its a frame
		else {
			for (var id in listeners['titleChange']) {
				ODPExtension.dump('dispatchDOMTitleChanged:' + listeners['titleChange'][id], debugingThisFile);
				listeners['titleChange'][id](event.originalTarget);
			}
		}

	}

	//fires when the title of a document change
	this.dispatchTabClosed = function (event) {
		ODPExtension.dump('dispatchTabClosed', debugingThisFile);
		for (var id in listeners['tabClose']) {
			ODPExtension.dump('dispatchTabClosed:' + listeners['tabClose'][id], debugingThisFile);
			listeners['tabClose'][id](event.originalTarget);
		}
	}
	this.dispatchTabSelected = function (event) {
		ODPExtension.dump('dispatchTabSelected', debugingThisFile);
		for (var id in listeners['tabSelect']) {
			ODPExtension.dump('dispatchTabSelected:' + listeners['tabSelect'][id], debugingThisFile);
			listeners['tabSelect'][id](event.originalTarget);
		}
	}

	//fires the listener popupshowing for the contentAreaContextMenu
	this.dispatchContentAreaContextMenuShowing = function (event) {
		//this.stack('asd');
		if (event.originalTarget == event.currentTarget) {
			ODPExtension.dump('dispatchContentAreaContextMenuShowing', debugingThisFile);

			for (var id in listeners['contextMenuShowing']) {
				ODPExtension.dump('dispatchContentAreaContextMenuShowing:' + listeners['contextMenuShowing'][id], debugingThisFile);
				listeners['contextMenuShowing'][id](event);
			}
		}
	}

	//remove the listeners added by the extension
	this.removeListeners = function (theWindowWasClosed) {
		this.dump('removeListeners', debugingThisFile);
		//dumb protection
		callsToRemoveListeners++;

		if (listeners['tabContextMenuShowing']) {
			this.dump('removeListeners:tabContextMenuShowing', debugingThisFile);
			this.tabContextMenu().removeEventListener('popupshowing', ODPExtension.dispatchtabContextMenuShowing, false);
		}
		if (listeners['contextMenuShowing']) {
			this.dump('removeListeners:contextMenuShowing', debugingThisFile);
			this.contentAreaContextMenu().removeEventListener('popupshowing', ODPExtension.dispatchContentAreaContextMenuShowing, false);
		}

		//onLocationChange
		if (listeners['onLocationChange'] || listeners['onLocationChangeNotDocumentLoad']) {
			this.dump('removeListeners:onLocationChange', debugingThisFile);
			gBrowser.removeProgressListener(urlBarListener);
		}
		//DOMContentLoaded and onLocationChange
		if (listeners['DOMContentLoadedNoFrames'] || listeners['DOMContentLoadedWithFrames']) {
			this.dump('removeListeners:DOMContentLoaded', debugingThisFile);
			window.removeEventListener("DOMContentLoaded", ODPExtension.dispatchDOMContentLoaded, false);
		} else if (listeners['onLocationChange'] || listeners['onLocationChangeNotDocumentLoad']) {
			this.dump('removeListeners:onLocationChange:DOMContentLoaded', debugingThisFile);
			window.removeEventListener("DOMContentLoaded", ODPExtension.dispatchDOMContentLoaded, false);
		}
		//onOverLink
		if (listeners['onOverLink']) {
			if (XULBrowserWindow) //when the window is closed this variable no exists any more
			{
				if (this.trim(XULBrowserWindow.setOverLink.toString()).indexOf("ODPExtension.dispatchEvent") != -1) {
					this.dump('removeListeners:onOverLink', debugingThisFile);
					/*
									README :
										This code is executed by "No Referrer" extension
										Since then this code is part of the library.
										Other extension will not execute this code.
										Also this is a valid usage of eval.
										Read this:
										http://adblockplus.org/blog/five-wrong-reasons-to-use-eval-in-an-extension
										then this:
										http://piro.sakura.ne.jp/latest/blosxom/mozilla/xul/2010-02-08_eval-en.htm
										Thanks
								*/
					eval('' + /* unable to do this without using eval(.*/ "XULBrowserWindow.setOverLink = " + this.trim(XULBrowserWindow.setOverLink.toString()).replace("ODPExtension.dispatchEvent('onOverLink', (typeof(url) == 'undefined' ? link : url));", '').replace('ODPExtension.dispatchEvent("onOverLink", (typeof(url) == "undefined" ? link : url));', ''));
				}
			}
		}
		//title change
		if (listeners['titleChange']) {
			this.dump('removeListeners:DOMTitleChanged', debugingThisFile);
			window.removeEventListener("DOMTitleChanged", ODPExtension.dispatchDOMTitleChanged, false);
		}

		if (listeners['tabClose']) {
			this.dump('removeListeners:tabClose', debugingThisFile);
			gBrowser.tabContainer.removeEventListener("TabClose", ODPExtension.dispatchTabClosed, false);
		}
		if (listeners['tabSelect']) {
			this.dump('removeListeners:tabSelect', debugingThisFile);
			gBrowser.tabContainer.removeEventListener("TabSelect", ODPExtension.dispatchTabSelected, false);
		}

		/* complex listeners */

		//when the user closes a window then the listeners are removed.
		//but we don't want to remove global complex listeners because other opened windows needs to listening
		if (theWindowWasClosed) {} else {
			//onModifyRequest
			if (listeners['onModifyRequest']) {
				this.dump('removeListeners:onModifyRequest', debugingThisFile);
				var theListeners = Components.classes['@particle.universe.odp.tito/TheListeners;7']
					.getService().wrappedJSObject;
				try {
					theListeners.removeComplexListener('onModifyRequest', 'ODPExtension');
				} catch (e) {}
			}
		}
	}
	//calling functions that remove things added by the extension
	this.shutDown = function () {
		this.dump('shutDown', debugingThisFile);
		for (var id in shutdown) {
			this.dump('shutDown:' + shutdown[id], debugingThisFile);
			shutdown[id]();
		}
	}
	//sets to null this add-on
	this.destroy = function () {
		this.dump('destroy', debugingThisFile);
		this.dump('exit', debugingThisFile);
		if (debugingThisFile)
			ODPExtension.alert('ODPExtension completed the shutdown on this window. Time to look the error console if there is any errors. Looks like the window will be closed');
	}
	//output to the console messages
	this.dump = function (something, debugingThisFile, aTitle) {
		if (!aTitle)
			aTitle = '';
		else
			aTitle = aTitle + ':';
		if (debugingThisFile || this.debugingGlobal || typeof (debugingThisFile) == 'undefined') {
			if (typeof (something) == 'string' || typeof (something) == 'number')
				consoleService.logStringMessage('ODPExtension:' + aTitle + something);
			else if (typeof (something) == 'undefined')
				consoleService.logStringMessage('ODPExtension:' + aTitle + 'undefined');
			else if (something == null)
				consoleService.logStringMessage('ODPExtension:' + aTitle + 'null');
			else {
				if (console && console.log) {
					console.log('ODPExtension: ' + aTitle);
					console.log(something)
				}
			}
		}
	};
	//output to the console an error
	this.error = function (aMsg) {

			var stack = String(new Error().stack)

		ODPExtension.errorString = 'ODPExtension : ' + aMsg + "\n\n" + stack;
		setTimeout(function () {
			throw new Error('ODPExtension : ' + aMsg) + "\n\n" + stack;
		}, 0);
	};
	this.getError = function () {
		var error = String(ODPExtension.errorString)
		ODPExtension.errorString = null
		return error;
	}
	//output to the console the stack
	this.stack = function (aMsg) {
		var stack = new Error().stack
		aMsg = new Error('ODPExtension : ' + aMsg) + "\n\n" + stack;
		throw aMsg;
	};
	//restarts the browser
	this.restart = function () {
		Components.classes["@mozilla.org/toolkit/app-startup;1"]
			.getService(Components.interfaces.nsIAppStartup)
			.quit(Components.interfaces.nsIAppStartup.eRestart | Components.interfaces.nsIAppStartup.eAttemptQuit);
	}
	this.gc = function () {
		for (var i = 0; i < 2; i++) {

			Components.utils.forceGC();

			window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
				.getInterface(Components.interfaces.nsIDOMWindowUtils)
				.garbageCollect();

			window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
				.getInterface(Components.interfaces.nsIDOMWindowUtils)
				.cycleCollect();
		}
	}

	//registerExtension
	this.registerExtension();

	return null;

}).apply(ODPExtension);
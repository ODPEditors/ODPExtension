/*

	the total list of available apis to plugins

*/

var api = {}
add('onLoad', function(){
	giveAPIs(window)
});

function giveAPIs(source) {


	//escapeHTML
	source.api.h = function (aText) {
		return ODP.h(aText);
	}

	//super basic
	source.api.setTimeout = function (aFunction, aTime) {
		return setTimeout(aFunction, aTime);
	};
	source.api.setInterval = function (aFunction, aTime) {
		return setInterval(aFunction, aTime);
	};
	source.api.clearTimeout = function (aID) {
		clearTimeout(aID);
	};
	source.api.clearInterval = function (aID) {
		clearInterval(aID);
	};

	//almost super basic
	source.api.alert = function (aString) {
		ODP.alert(aString);
	};
	source.api.prompt = function (aString, aDefault) {
		return ODP.prompt(aString, aDefault);
	};
	source.api.confirm = function (aString) {
		return ODP.confirm(aString);
	};

	//basic
	source.api.console = console;
	source.api.l = console.log;
	source.api.dump = function (aData) {
		ODP.dump(aData);
	};
	source.api.arrayUnique = function (array) {
		return ODP.arrayUnique(array);
	}

	//browser related
	source.api.tabOpen = function (aURLs, selected, aPostData, inNoTree) {
		return ODP.tabOpen(aURLs, selected, aPostData, inNoTree);
	}
	source.api.tabOpenEditable = function (which) {
		var uris = []
		var sites = []
		which.forEach(function (d) {
			uris[uris.length] = d.url()
			sites[sites.length] = d
		});
		ODP.panelFastAddOpenTabsWithLinkedPanel(uris, sites, true);
	}
	source.api.tabClose = function (aTab) {
		return ODP.tabClose(aTab);
	}
	source.api.tabSelect = function (aTab) {
		ODP.tabSelect(aTab);
	}

	//utilities, template engine
	source.api.html = function (html) {
		return _.template(html);
	}

	//slice related
	source.api.sitesGetVisible = sitesGetVisible;
	source.api.sitesGetSelected = sitesGetSelected;
	source.api.sitesGetModified = sitesGetModified;
	source.api.sitesGetAll = sitesGetAll;

	source.api.sitesSelectAll = sitesSelectAll;
	source.api.sitesSelectNone = sitesSelectNone;
	source.api.sitesSelectInvert = sitesSelectInvert;

	source.api.sitesCount = function(){ return total_count; }
	source.api.sitesCountVisible = function(){ return total_visible; }
	source.api.sitesCountModified = function(){ return total_modified; }
	source.api.sitesCountSelected = function(){ return total_selected; }

	//sub tools
	source.api.linkChecker = function () {

		var oRedirectionAlert = ODP.redirectionAlert();
		return {
			check: function (aURL, aFunction) {
				oRedirectionAlert.check(aURL, function (aData, aURL) {
					aFunction(aData, aURL);
				});
			}
		}
	}

	//a reference to other addons
	source.api.addon = addon;

	//odp related
	source.api.promptForCategory = function (aFunction) {
		ODP.promptForCategory(aFunction);
	};
	source.api.categoryGetURLEdit = function (aURL) {
		return ODP.categoryGetURLEdit(aURL);
	}
	source.api.getDomainFromURL = function (aURL) {
		return ODP.getDomainFromURL(aURL);
	}
	source.api.getSubdomainFromURL = function (aURL) {
		return ODP.getSubdomainFromURL(aURL);
	}

	source.api.ODP = ODP;
}

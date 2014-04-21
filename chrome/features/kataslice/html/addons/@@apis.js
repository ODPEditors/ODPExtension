/*

	the total list of available apis to plugins

*/

var api ={}


function giveAPIs(source) {
	source.api = api
}

add('onLoad', function(){

	//escapeHTML
	api.h = function (aText) {
		return ODP.h(aText);
	}

	//super basic
	api.setTimeout = function (aFunction, aTime) {
		return setTimeout(aFunction, aTime);
	};
	api.setInterval = function (aFunction, aTime) {
		return setInterval(aFunction, aTime);
	};
	api.clearTimeout = function (aID) {
		clearTimeout(aID);
	};
	api.clearInterval = function (aID) {
		clearInterval(aID);
	};

	//almost super basic
	api.alert = function (aString) {
		ODP.alert(aString);
	};
	api.prompt = function (aString, aDefault) {
		return ODP.prompt(aString, aDefault);
	};
	api.confirm = function (aString) {
		return ODP.confirm(aString);
	};

	//basic
	api.console = console;
	api.l = console.log;
	api.dump = function (aData) {
		ODP.dump(aData);
	};
	api.arrayUnique = function (array) {
		return ODP.arrayUnique(array);
	}

	//browser related
	api.tabOpen = function (aURLs, selected, aPostData, inNoTree) {
		return ODP.tabOpen(aURLs, selected, aPostData, inNoTree);
	}
	api.tabOpenEditable = function (which) {
		var uris = []
		var sites = []
		which.forEach(function (d) {
			uris[uris.length] = d.url()
			sites[sites.length] = d
		});
		ODP.panelFastAddOpenTabsWithLinkedPanel(uris, sites, true);
	}
	api.tabClose = function (aTab) {
		return ODP.tabClose(aTab);
	}
	api.tabSelect = function (aTab) {
		ODP.tabSelect(aTab);
	}

	//utilities, template engine
	api.html = function (html) {
		return _.template(html);
	}

	//slice related
	api.sitesGetVisible = sitesGetVisible;
	api.sitesGetSelected = sitesGetSelected;
	api.sitesGetModified = sitesGetModified;
	api.sitesGetAll = sitesGetAll;

	api.sitesSelectAll = sitesSelectAll;
	api.sitesSelectNone = sitesSelectNone;
	api.sitesSelectInvert = sitesSelectInvert;

	api.sitesCount = function(){ return total_count; }
	api.sitesCountVisible = function(){ return total_visible; }
	api.sitesCountModified = function(){ return total_modified; }
	api.sitesCountSelected = function(){ return total_selected; }

	//sub tools
	api.linkChecker = function () {

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
	api.addon = addon;

	//odp related
	api.promptForCategory = function (aFunction) {
		ODP.promptForCategory(aFunction);
	};
	api.categoryGetURLEdit = function (aURL) {
		return ODP.categoryGetURLEdit(aURL);
	}

	api.ODP = ODP;

});
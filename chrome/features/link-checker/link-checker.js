(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.linkChecker = function() {
		var aResult = {};
		aResult.domain = this.getDomainFromURL(this.focusedURL);
		aResult.data = [];

		var oRedirectionAlert = this.redirectionAlert();
		var self = this;
		var progress = this.progress('link.cheker.' + oRedirectionAlert.id, function() {
			if (self.preferenceGet('link.checker.generate.graph'))
				self.linkCheckerDoneGraph(aResult);
		});
		progress.reset();
		progress.progress();

		//look at selected links
		var items = this.getAllLinksItemsPreferSelected(this.tabGetFocused());
		if (items.length > 0) {
			for (var id in items)
				this.linkCheckerItem(items[id], oRedirectionAlert, aResult, id);
		}
	}
	this.linkCheckerItem = function(item, oRedirectionAlert, aResult, aNumber) {
		var href = this.IDNDecodeURL(this.string(item.href))
		if (!href || this.isGarbage(href) || !this.canFollowURL(href, this.focusedURL) ||
		    		(aNumber < 300 && /*this function is very expensive, limit to first N items*/!this.isVisible(item)))
			return;

		var tooltiptext = this.decodeUTF8Recursive(href);
		item.setAttribute('tooltiptext', tooltiptext);
		item.setAttribute('title', tooltiptext);
		if (!item.hasAttribute('original_text'))
			item.setAttribute('original_text', item.innerHTML);
		else
			item.innerHTML = item.getAttribute('original_text');

		var progress = this.progress('link.cheker.' + oRedirectionAlert.id);
		progress.add();
		progress.progress();

		item.style.setProperty('border', '1px solid green', 'important');
		item.style.removeProperty('background-color');
		item.style.removeProperty('color');

		oRedirectionAlert.check(href, function(aData, aURL) {
			ODPExtension.linkCheckerCheckDone(aData, aURL, item, oRedirectionAlert, aResult);
		});
	}

	this.linkCheckerCheckDone = function(aData, aURL, item, oRedirectionAlert, aResult) {
		if (ODPExtension.preferenceGet('link.checker.generate.graph'))
			aResult.data[aResult.data.length] = aData;

		var progress = this.progress('link.cheker.' + oRedirectionAlert.id);
		progress.remove();
		progress.progress();

		if (!item)
			return;
		var tooltiptext;
		if (this.shared.me)
			tooltiptext = ODPExtension.decodeUTF8(aData.urlRedirections.join('\n') + '\n' + aData.status.suspicious.join('\n') + '\n' + (aData.status.match || ''))
		else
			tooltiptext = ODPExtension.decodeUTF8(aData.urlRedirections.join('\n') + '\n' + aData.status.suspicious.join('\n'))

			item.setAttribute('title', tooltiptext.trim() + '\n' + aData.txt.slice(0, 255)+'…');

		if (aData.status.error && aData.status.canDelete) {
			//red
			item.style.setProperty('color', 'white', 'important');
			item.style.setProperty('background-color', '#EB6666', 'important');
		} else if (aData.status.error && aData.status.canUnreview) {
			//purple
			item.style.setProperty('color', 'white', 'important');
			item.style.setProperty('background-color', '#6F6FFC', 'important');
		}
		else if (aData.status.suspicious.length) {
			//orange
			item.style.setProperty('color', 'black', 'important');
			item.style.setProperty('background-color', 'orange', 'important');

		} else if (aData.statuses[aData.statuses.length - 1] == '200' && aData.status.error === false) {
			//green
			item.style.setProperty('color', 'white', 'important');
			item.style.setProperty('background-color', '#669933', 'important');
		} else {
			//yellow light
			item.style.setProperty('color', 'black', 'important');
			item.style.setProperty('background-color', '#FFFFCC', 'important');
		}

		item.innerHTML = '[' +
			aData.statuses.join(', ') + ' | ' +
			aData.status.code + ' | ' +
			aData.status.errorString + ' | ' +
			aData.ip + ' | ' +
			aData.language + ' | ' +
			this.h(aData.title) + ' | ' +
			aData.checkType +
			'] ' + item.getAttribute('original_text');
		item.setAttribute('note', '' + aData.statuses.join(', ') + ' | ' + aData.status.code + ' | ' + aData.status.errorString);
		item.setAttribute('error', aData.status.code);
		item.setAttribute('newurl', aData.urlLast);
	}

	this.linkCheckerDoneGraph = function(aResult) {

		aResult.domain = (aResult.domain || 'graph').toUpperCase();

		//trace links
		var links = [];
		for (var id in aResult.data) {
			var site = aResult.data[id];
			if (this.isNoiseDomain(site.domain))
				continue;
			links.push({
				source: aResult.domain,
				target: site.ip.replace(/\.[0-9]+$/, '.*'),
				type: "green"
			});
			links.push({
				source: site.ip.replace(/\.[0-9]+$/, '.*'),
				target: site.domain,
				type: "black"
			});
		}

		//multiple links to same domain should be removed, to allow the graph count properly the weight
		links = this.arrayUniqueObjects(links, function(o) {
			return o.source + '_' + o.target;
		});

		this.tabOpen('chrome://ODPExtension/content/features/link-checker/html/index.n.html#' + JSON.stringify(links))

		//trace links
		var links = [];
		for (var id in aResult.data) {
			var site = aResult.data[id];
			if (this.isNoiseDomain(site.domain))
				continue;
			links.push({
				source: aResult.domain,
				target: site.domain,
				type: "green"
			});
			for (var link in site.linksExternal) {
				if (!this.isNoiseDomain(site.linksExternal[link].domain))
					links.push({
						source: site.domain,
						target: site.linksExternal[link].domain,
						type: "dotted"
					});
			}
		}

		//multiple links to same domain should be removed, to allow the graph count properly the weight
		links = this.arrayUniqueObjects(links, function(o) {
			return o.source + '_' + o.target;
		});

		this.tabOpen('chrome://ODPExtension/content/features/link-checker/html/index.l.html#' + JSON.stringify(links))
	}
	return null;

}).apply(ODPExtension);
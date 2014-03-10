(function() {
	//returns the current focused location-TODO:REVIEW
	this.documentFocusedGetLocation = function() {
		return String(window.top.getBrowser().browsers[window.top.getBrowser().mTabBox.selectedIndex].contentDocument.location);
	}
	//returns the current focused document-REVIEW
	this.documentGetFocused = function() {
		return window.top.getBrowser().browsers[window.top.getBrowser().mTabBox.selectedIndex].contentDocument;
	}
	//gets the title of the  aTab-REVIEW
	this.documentGetFromTab = function(aTab) {
		return this.browserGetFromTab(aTab).contentDocument;
	}
	//returns a location for a document
	this.documentGetLocation = function(aDoc) {
		return String(aDoc.location);
	}
	//returns the  content of the meta description of a document
	this.documentGetMetaDescription = function(aDoc) {
		return this.trim(this.stripTags(this.htmlEntityDecode(this.stripTags(this.documentGetRAWMetaDescription(aDoc), ' ')), ' '));
	}
	//returns the  content of the meta description of a document
	this.documentGetRAWMetaDescription = function(aDoc) {
		var tobj = aDoc.evaluate("//*/meta[translate(@name, 'DESCRIPTION', 'description') = 'description']", aDoc, null, XPathResult.ANY_TYPE, null);

		var metaTag = tobj.iterateNext();
		if (metaTag) {
			return metaTag.getAttribute('content');
		} else {
			var tobj = aDoc.evaluate("//*/meta[translate(@http-equiv, 'DESCRIPTION', 'description') = 'description']", aDoc, null, XPathResult.ANY_TYPE, null);

			var metaTag = tobj.iterateNext();
			if (metaTag) {
				return metaTag.getAttribute('content');
			} else {
				return '';
			}
		}
	}
	var documentGetIDsRegExp = /(pub|ua)-[^"'&\s]+/gmi
	this.documentGetIDs = function(aDoc, ids){
		var window = aDoc.defaultView.wrappedJSObject;
		if(!ids)
			ids = []
		if (window && window.frames.length) {
			for (var a = 0; a < window.frames.length; a++) {
				if ( window.frames && window.frames[a] && !! window.frames[a].google_ad_url) {
					var idss = window.frames[a].google_ad_url.match(documentGetIDsRegExp)
					for (var id in idss)
						ids[ids.length] = idss[id]
				}
				if ( window.frames && window.frames[a] && !! window.frames[a].src) {
					var idss = window.frames[a].src.match(documentGetIDsRegExp)
					for (var id in idss)
						ids[ids.length] = idss[id]
				}
			}
		}
		if (!!window._uacct)
			ids[ids.length] = window._uacct

		return this.normalizeIDs(ids);
	}
	this.normalizeIDs = function(ids,ids2){
		for(var id in ids2)
			ids[ids.length] = ids2[id]
		for(var id in ids)
			ids[id] = ids[id].replace(/\:[^\:]+$/, '').toLowerCase()
		for(var id in ids){
			if(ids[id].indexOf('ua-') === 0)
				ids[id] = ids[id].replace(/^(ua-[0-9]+)[^0-9].*$/i, '$1');
			else if(ids[id].indexOf('pub-') === 0)
				ids[id] = ids[id].slice(0, 20);
			else if(ids[id].indexOf('ca-pub-') === 0)
				ids[id] = ids[id].slice(0, 23);
		}
		var blacklist = [
			/^ua-[a-z]/i,
			/^ua-[0-9]+\./,
			/^pub-[a-z]/,
			/^ca-pub-[a-z]/,
		]
		var found= false, id, i, _ids = [];
		for(id in ids){
			found = false
			for(i in blacklist){
				if(blacklist[i].test(ids[id])){
					found = true
					break;
				}
			}
			if(!found)
				_ids[_ids.length] = ids[id]
		}
		_ids.sort()
		return this.arrayUnique(_ids)
	}
	//gets the title of the  aTab-REVIEW
	this.documentGetTitle = function(aDoc) {
		return this.trim(this.stripTags(this.htmlEntityDecode(String(aDoc.title))));
	}
	//returns the TOP document
	this.documentGetTop = function(aDoc) {
		if (!aDoc.defaultView)
			return aDoc;
		else
			return aDoc.defaultView.top.document;
	}
	//returns true if the document has a frameset
	this.documentHasFrameSet = function() {
		var aDoc = this.documentGetFocused();
		if (aDoc.body && String(aDoc.body).indexOf('FrameSet') != -1)
			return true;
		else
			return false;
	}

	return null;

}).apply(ODPExtension);
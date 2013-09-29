(function() {
	//returns true or false if searchQuery is found in aString
	this.searchEngineSearch = function(searchQuery, aString) {
		//normalizing aString - search is caseinsensitive
		aString = this.trim(aString).toLowerCase();

		//finding "or" conditions
		searchQuery = this.trim(searchQuery).toLowerCase().replace(/ or /gi, ',').replace(/ +/g, ' ');
		searchQuery = searchQuery.split(',');
		//for each "or" condition - if no "or" conditions was found, this will loop one time.
		for (var id in searchQuery) {
			//getting words
			var subQuery = this.trim(searchQuery[id]).split(' ');
			//found flag
			var found = false;

			//foreach word to search
			for (var id2 in subQuery) {
				var word = this.trim(subQuery[id2]);

				if (word == '' || word == '-' || word == '+') {
					continue;
				} else if (word[0] == '-' && aString.indexOf(word.replace(/^\-/, '')) != -1) {
					found = false;
					break;
				} else if (word[0] != '-' && aString.indexOf(word) == -1) {
					found = false;
					break;
				} else {
					found = true;
				}
			}
			if (found)
				return true;
		}
		return false;
	};
	//returns a aString with a searchQuery highlighted
	this.searchEngineSearchHigh = function(searchQuery, aString, snippetSize) {
		//validating snippet size
		if (!snippetSize)
			snippetSize = 100000000000;
		else if (snippetSize == 'short')
			snippetSize = 600;
		else if (snippetSize == 'medium')
			snippetSize = 1200;
		else if (snippetSize == 'big')
			snippetSize = 1800;
		else
			snippetSize = 1000;

		//normalizing aString - search is caseinsensitive
		aString = this.trim(this.htmlEntityDecode(aString));
		var aStringLower = this.trim(this.htmlEntityDecode(aString)).toLowerCase();

		//finding al the words to highlight
		searchQuery = this.trim(searchQuery).replace(/ +/g, ' ').split(' ');
		searchQuery = this.arrayUnique(searchQuery);
		//deleting negations
		for (var id in searchQuery) {
			if (searchQuery[id][0] == '-') {
				searchQuery[id] = '';
			}
		}
		searchQuery = this.arrayUnique(searchQuery);

		//shorting aString to the relevant part of the search query
		var index;
		var found = false;
		for (var id in searchQuery) {
			if (searchQuery[id] != '' && ((index = aStringLower.indexOf(searchQuery[id])) != -1)) {
				index = index - (snippetSize / 2);
				if (index < 1) {
					index = 0;
					var buffer = '';
				} else {
					var buffer = '…';
				}
				for (var a = 0; a < snippetSize; a++) {
					if (!aString[(index + a)])
						break;
					buffer += aString[(index + a)];
				}
				if (a == snippetSize && aString[(snippetSize + 1)])
					buffer += '…';
				aString = this.trim(buffer);
				found = true;
				break;
			}
		}
		if (!found) {
			var buffer = '';
			for (var a = 0; a < snippetSize; a++) {
				if (!aString[a])
					break;
				buffer += aString[a];
			}
			if (a == snippetSize && aString[(snippetSize + 1)])
				buffer += '…';
			aString = this.trim(buffer);
		}
		//highliting word
		for (var id in searchQuery) {
			if (searchQuery[id] != '' && searchQuery[id] != '█' && searchQuery[id] != '/' && searchQuery[id] != '>' && searchQuery[id] != '<')
				aString = aString.split(searchQuery[id]).join('<█>' + searchQuery[id] + '</█>');
		}
		//data security

		aString = this.htmlSpecialCharsEncode(aString).replace(/&lt;█&gt;/g, '<b>').replace(/&lt;\/█&gt;/g, '</b>');

		return aString;
	};

	return null;

}).apply(ODPExtension);
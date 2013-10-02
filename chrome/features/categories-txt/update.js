(function() {

	this.addListener('onIdle', function() {
		ODPExtension.categoriesTXTUpdate();
	});

	//handle the update of the categories.txt database if needed
	this.categoriesTXTUpdate = function(forceUpdate) {
		//lock this function, this will avoid problems with the unintentional "double click" on the update button
		if (!this.shared.categories.txt.lock) {
			this.shared.categories.txt.lock = true;

			//take a look into the "date" of the file, to see if we need an update
			var Requester = new XMLHttpRequest();
				Requester.onerror = function() {
					ODPExtension.shared.categories.txt.lock = false;
				};
				Requester.onload = function() {
					//if fails don't do nothing
					if (Requester.status != '200') {
						ODPExtension.shared.categories.txt.lock = false;
					} else {
						var aDate = '';
						var aData = Requester.responseText.split('\n');
						for(var id in aData){
							if(aData[id].indexOf('categories.txt.gz') != -1){
								aData = aData[id].trim().replace(/\s+/g, ' ').split(' ');
								aData.reverse();
								aData = aData[2];
								if(aData != '')
									aDate = ODPExtension.serverDateLocale(aData);
								break;
							}
						}
						if(aDate == '')
							aDate = ODPExtension.sqlDateLocale(ODPExtension.date());
						//yay an update!
						if (forceUpdate || ( aDate != ODPExtension.preferenceGet('locked.categories.txt.last.update')))
							ODPExtension.categoriesTXTUpdateLoad(aDate);
						else
							ODPExtension.shared.categories.txt.lock = false;
					}
				};
				Requester.open("GET", 'http://rdf.dmoz.org/rdf/', true);
				Requester.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;
				Requester.send(null);
		}
	}
	//the progress meter
	this.categoriesTXTUpdateLoad = function(aDate) {
		var Requester = new XMLHttpRequest();
		Requester.onerror = function() {
			ODPExtension.shared.categories.txt.lock = false;
		};
		Requester.onload = function() {
			//if fails don't do nothing
			if (Requester.status != '200') {
				ODPExtension.shared.categories.txt.lock = false;
			} else {
				var aTotalSize = (Requester.getResponseHeader('Content-Length') || '').trim();
				if (aTotalSize != '')
					ODPExtension.categoriesTXTUpdateProcess(aDate, aTotalSize);
				else
					ODPExtension.categoriesTXTUpdateProcess(aDate, '6000000');
			}
		};
		Requester.open("HEAD", 'http://rdf.dmoz.org/rdf/categories.txt.gz', true);
		Requester.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;
		Requester.send(null);
	}

	return null;

}).apply(ODPExtension);
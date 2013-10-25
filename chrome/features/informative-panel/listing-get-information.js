(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	var focusedURL = '';
	var focusedURLLast = '';

	//updates the content when switching tabs
	this.addListener('onLocationChangeNotDocumentLoad', function(aLocation) {
		var aDoc = ODPExtension.documentGetFocused();
		if (ODPExtension.editingFormURLExists(aDoc)) {
			focusedURL = (ODPExtension.getElementNamed('newurl', aDoc) || ODPExtension.getElementNamed('url', aDoc)).value;
		} else {
			focusedURL = aLocation;
		}
		ODPExtension.listingGetInformation(focusedURL);
	});

	this.addListener('onLocationChange', function(aLocation) {
		var aDoc = ODPExtension.documentGetFocused();
		if (ODPExtension.editingFormURLExists(aDoc)) {
			focusedURL = (ODPExtension.getElementNamed('newurl', aDoc) || ODPExtension.getElementNamed('url', aDoc)).value;
			ODPExtension.listingGetInformation(focusedURL);
		}
	});
	var db, query_domain_count, query_domain_select, query_slice;
	this.addListener('databaseReady', function() {

		db = ODPExtension.rdfDatabaseOpen();
		if (db.exists) {

			var select = ' as sorting, u.id as site_id, u.uri as uri, u.title as title, u.description as description, u.mediadate as mediadate, u.pdf as pdf, u.atom as atom, u.rss as rss, u.cool as cool, c.category as category';

			var where_subdomain = ' h.host = :subdomain and h.id = u.subdomain_id and u.category_id = c.id ';
			var where_domain = ' h.host = :domain and h.id = u.domain_id and  u.category_id = c.id ';

			query_domain_count = db.query(' select count(u.id) from uris u, hosts h where h.host = :domain and h.id = u.domain_id');
			query_domain_select = db.query(' select 1 ' + select + ' from  hosts h, uris u, categories c where ' + where_domain);

			query_slice = db.query(' \
			                       \
			                       	/* 1 exaclty this url */ \
								  \
										select *, min(sorting) as dale from( \
									SELECT  \
											0 ' + select + '   \
										FROM  \
											 hosts h, uris u, categories c \
										where  \
											' + where_subdomain + ' and \
											 u.path = :path \
									/* this subdomain, this domain limit 2 */ \
									UNION \
										select * from(SELECT  \
											1 ' + select + '   \
										FROM  \
											 hosts h, uris u, categories c \
										where  \
											' + where_subdomain + ' and \
											 u.path = "" limit 2 ) \
									UNION \
										select * from(SELECT  \
											1 ' + select + '   \
										FROM  \
											 hosts h, uris u, categories c \
										where  \
											' + where_domain + ' and \
											 u.path = "" limit 2 ) \
			                       	/* 2 url LIKE url% - all under this url */ \
									UNION \
										SELECT  \
											2 ' + select + '   \
										FROM  \
											 hosts h, uris u, categories c \
										where  \
											' + where_subdomain + ' and \
											u.path GLOB :path_glob \
			                       	/* 3 - path no hash, url LIKE urlWithOutVars% - all under this url with the file name with out the hash */ \
									UNION \
										SELECT  \
											3 ' + select + '   \
										FROM  \
											 hosts h, uris u, categories c \
										where  \
											' + where_subdomain + ' and \
											u.path GLOB :path_no_hash \
			                       	/* 3.1 - path url LIKE urlWithOutVars% - all under this url with the file name with out the vars */ \
									UNION \
										SELECT  \
											3 ' + select + '   \
										FROM  \
											 hosts h, uris u, categories c \
										where  \
											' + where_subdomain + ' and \
											u.path GLOB :path_no_vars \
									/* 4 - url LIKE urlWithOutFileName% - all under the first folder from right to left */ \
									UNION \
										SELECT  \
											4 ' + select + '   \
										FROM  \
											 hosts h, uris u, categories c \
										where  \
											' + where_subdomain + ' and \
											u.path GLOB :path_no_file_name \
									\
									/* 5 - url LIKE urlToTheFirstFolder% - all under the first folder from left to right */ \
									UNION \
										SELECT  \
											 5 ' + select + '   \
										FROM  \
											 hosts h, uris u, categories c \
										where  \
											' + where_subdomain + ' and \
											u.path GLOB :path_parent_folder \
									\
									/* 5.2 first folder - url LIKE urlToTheFirstFolder% - all under the first folder from left to right */ \
									UNION \
										SELECT  \
											6 ' + select + '   \
										FROM  \
											 hosts h, uris u, categories c \
										where  \
											' + where_subdomain + ' and \
											u.path GLOB :path_first_folder \
									\
									/* 6 - url = urlDomain or url = urlDomain/ - exactly this current subdomain/domain */ \
									UNION \
										SELECT  \
											7 ' + select + '   \
										FROM  \
											 hosts h, uris u, categories c \
										where  \
											' + where_subdomain + ' and u.path = "" \
									\
									/* 7 - url LIKE urlDomain/% - all under this current subdomain/domain */ \
									UNION \
										SELECT  \
											8 ' + select + '   \
										FROM  \
											 hosts h, uris u, categories c \
										where  \
											' + where_subdomain + ' \
									\
					/* 8 - url LIKE %.urlDomain or url LIKE %.urlDomain - exaclty subdomains of this current domain/subdomain \
									UNION \
										SELECT  \
											9 ' + select + '   \
										FROM  \
											 hosts h, uris u, categories c \
										where  \
											' + where_domain + ' and u.path = "" \
									\
					*/ \
									/* 9 - url LIKE %.urlDomain/% - listings of the subdomains of this domain/subdomain */ \
									/* 10 - url LIKE %.urlFullDomain or url LIKE %.urlFullDomain/ - exactly subdomains of this domain */ \
									UNION \
										SELECT  \
											10 ' + select + '   \
										FROM  \
											 hosts h, uris u, categories c \
										where  \
											' + where_domain + ' and h.id != u.subdomain_id and path = "" \
									\
									/* 11 - url LIKE %.urlFullDomain/% - listings of the subdomains of this domain */ \
									UNION \
										SELECT  \
											11 ' + select + '   \
										FROM  \
											 hosts h, uris u, categories c \
										where  \
											' + where_domain + ' and h.id != u.subdomain_id \
									\
									/* 12 - url LIKE urlFullDomain/% - listings of this domain */ \
									UNION \
										SELECT  \
											12 ' + select + '   \
										FROM  \
											 hosts h, uris u, categories c \
										where  \
											' + where_domain + ' \
									group by site_id  order by sorting asc LIMIT 200 \
									) group by site_id  order by dale asc LIMIT 30 \
									/* 13 - url = urlFullDomain or url = urlFullDomain/ - exaclty this domain */ \
							 \
						   ');
		}

	});

	var panel;
	this.addListener('userInterfaceLoad', function() {
		panel = ODPExtension.getElement('panel');
		panel_move = ODPExtension.getElement('panel-move');
	});

	var cacheDomainsWithListings = [],
		cacheDomainsWithNOListings = []
		this.listingGetInformation = function(aLocation) {
			if (aLocation == focusedURLLast)
				return;
			focusedURLLast = aLocation;

			if (!this.preferenceGet('ui.informative.panel') || !this.preferenceGet('enabled') || !db.exists) {
				//listing check disabled
				this.listingInformation = '';
				this.panelShow(false);
				this.extensionIconUpdateStatus();
				return;
			} else if (!db.tableExists('uris')) {
				this.listingInformation = 'error';
				this.panelShow(false);
				this.extensionIconUpdateStatus();
				return;
			}
			/*else if (this.cantLeakURL(aLocation)) { //currently the data is local
			//private URI
			this.listingInformation = '';
			panel.setAttribute('hidden', true);
			this.extensionIconUpdateStatus();
			return;
		}*/

			//update the icon status
			this.listingInformationURL = this.decodeUTF8Recursive(aLocation);
			this.listingInformation = 'loading';
			this.extensionIconUpdateStatus();

			//get the data
			var aLocationID = this.getURLID(aLocation);
			aLocationID.path = this.shortURL(aLocationID.path)
			aLocationID.path_no_hash = this.removeHash(aLocationID.path)
			aLocationID.path_no_vars = this.removeVariables(aLocationID.path_no_hash)
			aLocationID.path_no_file_name = this.removeFileName2(aLocationID.path_no_vars)
			aLocationID.path_parent_folder = this.removeFileName2(aLocationID.path_no_file_name)
			aLocationID.path_first_folder = this.removeFromTheFirstFolder2(aLocationID.path_parent_folder)

			//ODPExtension.dump('query:' + aLocation);

			//check if the domain has few listings and is cached
			if ( !! cacheDomainsWithListings[aLocationID.domain]) {
				this.listingGetInformationLoaded(cacheDomainsWithListings[aLocationID.domain], aLocation, aLocationID);
			}
			//check if the domain has NO listing and is cached
			else if ( !! cacheDomainsWithNOListings[aLocationID.domain]) {
				this.listingGetInformationLoaded([], aLocation, aLocationID);
			} else {
				query_domain_count.params('domain', aLocationID.domain);
				query_domain_count.execute(function(aData) {
					if (aData[0]['count(u.id)'] < 1) {
						if (cacheDomainsWithNOListings.length > 1000)
							cacheDomainsWithNOListings = []
						cacheDomainsWithNOListings[aLocationID.domain] = true;
						ODPExtension.listingGetInformationLoaded([], aLocation, aLocationID);
					} else if (aData[0]['count(u.id)'] < 30) {
						query_domain_select.params('domain', aLocationID.domain);
						query_domain_select.execute(function(aData) {
							if (cacheDomainsWithListings.length > 50)
								cacheDomainsWithListings = []
							cacheDomainsWithListings[aLocationID.domain] = aData;
							ODPExtension.listingGetInformationLoaded(aData, aLocation, aLocationID);
						});
					} else {
						query_slice.params('domain', aLocationID.domain);
						query_slice.params('subdomain', aLocationID.subdomain);
						query_slice.params('path', aLocationID.path);
						query_slice.params('path_glob', aLocationID.path + '*');
						query_slice.params('path_no_hash', aLocationID.path_no_hash + '*');
						query_slice.params('path_no_vars', aLocationID.path_no_vars + '*');
						query_slice.params('path_no_file_name', aLocationID.path_no_file_name + '*');
						query_slice.params('path_parent_folder', aLocationID.path_parent_folder + '*');
						query_slice.params('path_first_folder', aLocationID.path_first_folder + '*');
						query_slice.execute(function(aData) {
							ODPExtension.listingGetInformationLoaded(aData, aLocation, aLocationID);
						});
					}
				});
			}
		}

	this.listingGetInformationLoaded = function(aData, aLocation, aLocationID) {
		//check if the retreived data is for this focused tab
		if (aLocation == focusedURL && this.preferenceGet('enabled')) {

			//validate the response
			if (aData.length == 0) {
				this.listingInformation = 'nada';
				this.extensionIconUpdateStatus();
				this.panelShow(false);
				return;
			} else {
				this.listingInformation = 'loading';
				this.extensionIconUpdateStatus();
			}

			//if there is a need to remove the www
			var focusedLocationWWW = this.decodeUTF8Recursive(this.removeSchema(this.shortURL(focusedURL).replace(/\/+$/, ''))).toLowerCase();
			var focusedLocationNoWWW = this.removeWWW(focusedURL);
			var focusedLocationDomain = this.getDomainFromURL(focusedURL);
			var focusedLocationSubdomain = this.getSubdomainFromURL(focusedURL);

			/* resutls comparation to see if the URI is listed*/
			var listed_same_uri = -1;
			var listed_domain_uri = -1;
			var listed_other_uri = -1;
			var aSelected = -1;

			this.listingInformationData = aData;
			//this.dump(aData);
			//looking for the most close url
			for (var i = 0; i < aData.length; i++) {
				var siteURLWWW = this.decodeUTF8Recursive(this.removeSchema(this.shortURL(aData[i].uri).replace(/\/+$/, ''))).toLowerCase();
				var siteURLNoWWW = this.removeWWW(siteURLWWW);

				if (
					siteURLWWW == focusedLocationWWW ||
					siteURLNoWWW == focusedLocationNoWWW ||
					siteURLWWW == focusedLocationNoWWW ||
					siteURLNoWWW == focusedLocationWWW) {
					listed_same_uri = i;
					break;
				} else if (
					siteURLWWW == focusedLocationDomain ||
					siteURLNoWWW == focusedLocationDomain ||
					siteURLWWW == focusedLocationDomain ||
					siteURLNoWWW == focusedLocationSubdomain) {
					listed_domain_uri = i;
				} else {
					listed_other_uri = i;
				}
				aData[i].type = ''
				if (aData[i].pdf)
					aData[i].type = 'PDF'
				if (aData[i].atom)
					aData[i].type = 'Atom'
				if (aData[i].rss)
					aData[i].type = 'RSS'
			}

			if (listed_same_uri > -1) {
				this.listingInformation = 'listed';
				aSelected = listed_same_uri;
			} else if (listed_domain_uri > -1) {
				this.listingInformation = 'listed-domain-uri';
				aSelected = listed_domain_uri;
			} else if (listed_other_uri > -1) {
				this.listingInformation = 'listed-other-uri';
				aSelected = listed_other_uri;
			}
			this.extensionIconUpdateStatus();

			this.getElement('panel').setAttribute('listed', this.listingInformation); //the border of the panel
			this.getElement('panel-move').setAttribute('listed', this.listingInformation); //the color of the move button


			if (this.preferenceGet('ui.informative.panel')) {
				this.panelInformationBuildHeader(aSelected);
				this.panelInformationBuildRelated(aSelected);
				//the user maybe unchecked all the visual options
				if (this.preferenceGet('ui.informative.panel')) {
					this.panelShow(true);
				} else {
					this.panelShow(false);
				}
			} else {
				this.panelShow(false);
			}
			this.panelInformationToggle(!this.preferenceGet('ui.informative.panel.closed'), false);
		} else {
			this.extensionIconUpdateStatus();
		}
	}
	return null;

}).apply(ODPExtension);
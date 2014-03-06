(function () {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	var db, query_slice;
	this.addListener('databaseReady', function () {

		db = ODPExtension.rdfDatabaseOpen();
		if (db.exists) {

			var select = ' as sorting, u.id as site_id, u.uri as uri, u.title as title, u.description as description, c.category as category ';

			var where_subdomain = ' h.host = :subdomain and h.id = u.subdomain_id and u.category_id = c.id ';
			var where_domain = ' h.host = :domain and h.id = u.domain_id and  u.category_id = c.id ';

			query_domain = db.query(' \
									SELECT  \
											0 ' + select + '   \
										FROM  \
											 hosts h, uris u, categories c \
										where  \
											' + where_domain + ' ')

			query_subdomain = db.query(' \
									SELECT  \
											0 ' + select + '   \
										FROM  \
											 hosts h, uris u, categories c \
										where  \
											' + where_subdomain + ' ')

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
									group by site_id  order by sorting asc LIMIT 5 \
									) group by site_id  order by dale asc LIMIT 30 \
									/* 13 - url = urlFullDomain or url = urlFullDomain/ - exaclty this domain */ \
							 \
						   ');
		}

	});

	this.listingsHighlight = function () {

		var progress = this.progress('link.highlight');
		progress.reset();
		progress.progress();

		//look at selected links
		var items = this.getAllLinksItemsPreferSelected(this.tabGetFocused());
		if (items.length > 0) {
			for (var id in items)
				this.listingsHighlightItem(items[id], progress);
		}
	}
	//general blacklisting..
	this.listingsHighlightItem = function (item, progress) {
		if (!item.href || this.isGarbage(item.href) || !this.canFollowURL(item.href, this.focusedURL))
			return;

		var tooltiptext = this.decodeUTF8Recursive(item.href);
		item.setAttribute('tooltiptext', tooltiptext);
		item.setAttribute('title', tooltiptext);
		if (!item.hasAttribute('original_text'))
			item.setAttribute('original_text', item.innerHTML);
		else
			item.innerHTML = item.getAttribute('original_text');
		progress.add();
		progress.progress();

		this.runThreaded('link.highlight.', 1, function (onThreadDone) {

			item.style.setProperty('border', '1px solid green', 'important');
			item.style.setProperty('padding', '2px', 'important');
			item.style.removeProperty('background-color');
			item.style.removeProperty('color');

			ODPExtension.listingsHighlightCheckDone(item, progress);
			onThreadDone();
		});
	}

	this.listingsHighlightCheckDone = function (item, progress) {

		if (!item)
			return;

		//first syling
		item.style.setProperty('color', 'black', 'important');
		item.style.setProperty('background-color', '#FFFFCC', 'important');

		var aLocation = item.href;

		//get the data
		var aLocationID = this.getURLID(aLocation);
		aLocationID.path = this.shortURL(aLocationID.path)
		aLocationID.path_no_hash = this.removeHash(aLocationID.path)
		aLocationID.path_no_vars = this.removeVariables(aLocationID.path_no_hash)
		aLocationID.path_no_file_name = this.removeFileName2(aLocationID.path_no_vars)
		aLocationID.path_parent_folder = this.removeFileName2(aLocationID.path_no_file_name)
		aLocationID.path_first_folder = this.removeFromTheFirstFolder2(aLocationID.path_parent_folder)

		//query_slice.params('domain', aLocationID.domain);
		query_slice.params('subdomain', aLocationID.subdomain);
		query_slice.params('path', aLocationID.path);
		query_slice.params('path_glob', aLocationID.path + '*');
		query_slice.params('path_no_hash', aLocationID.path_no_hash + '*');
		query_slice.params('path_no_vars', aLocationID.path_no_vars + '*');
		query_slice.params('path_no_file_name', aLocationID.path_no_file_name + '*');
		query_slice.params('path_parent_folder', aLocationID.path_parent_folder + '*');
		query_slice.params('path_first_folder', aLocationID.path_first_folder + '*');
		query_slice.execute(function (aData) {

			var responseURL = '',
				responseCategory = '',
				results = 0,
				itemSubdomain = ODPExtension.removeWWW(ODPExtension.getSubdomainFromURL(item.href)),
				itemDomain = ODPExtension.getDomainFromURL(item.href);
			var foundDomain = false;

			for (var id = 0; id < aData.length; id++) {

				responseURL = aData[id].uri;
				responseCategory = aData[id].category;

				var tooltiptext = ODPExtension.categoryTitle(ODPExtension.categoryAbbreviate(responseCategory + '\n' + aData[id].uri + '\n' + aData[id].title + '\n' + aData[id].description))

				if (ODPExtension.decodeUTF8Recursive(ODPExtension.removeSchema(ODPExtension.shortURL(item.href).replace(/\/+$/, ''))).replace(/\/$/, '').toLowerCase() == ODPExtension.decodeUTF8Recursive(ODPExtension.removeSchema(ODPExtension.shortURL(responseURL).replace(/\/+$/, ''))).replace(/\/$/, '').toLowerCase()) {
					item.style.setProperty('color', 'white', 'important');
					item.style.setProperty('background-color', '#669933', 'important');
					item.setAttribute('title', tooltiptext);
					item.setAttribute('tooltiptext', tooltiptext);
					item.setAttribute('category', ODPExtension.encodeUTF8(responseCategory));
					item.setAttribute('onclick', "if(event.ctrlKey){window.open('" + ODPExtension.categoryGetURL(responseCategory) + "', '_blank');return false;}");
					break;
				} else if (itemSubdomain == ODPExtension.removeWWW(ODPExtension.getSubdomainFromURL(responseURL))) {
					foundDomain = true;
					item.style.setProperty('color', 'white', 'important');
					item.style.setProperty('background-color', '#626CAF', 'important');
					item.setAttribute('title', tooltiptext);
					item.setAttribute('tooltiptext', tooltiptext);
					item.setAttribute('category', ODPExtension.encodeUTF8(responseCategory));
					item.setAttribute('onclick', "if(event.ctrlKey){window.open('" + ODPExtension.categoryGetURL(responseCategory) + "', '_blank');return false;}");
				} else if (itemDomain == ODPExtension.getDomainFromURL(responseURL)) {
					foundDomain = true;
					item.style.setProperty('color', 'white', 'important');
					item.style.setProperty('background-color', '#626CAF', 'important');
					item.setAttribute('title', tooltiptext);
					item.setAttribute('tooltiptext', tooltiptext);
					item.setAttribute('category', ODPExtension.encodeUTF8(responseCategory));
					item.setAttribute('onclick', "if(event.ctrlKey){window.open('" + ODPExtension.categoryGetURL(responseCategory) + "', '_blank');return false;}");
				} else if (!foundDomain) {
					item.style.setProperty('color', 'white', 'important');
					item.style.setProperty('background-color', '#666666', 'important');
					item.setAttribute('title', tooltiptext);
					item.setAttribute('tooltiptext', tooltiptext);
					item.setAttribute('category', ODPExtension.encodeUTF8(responseCategory));
					item.setAttribute('onclick', "if(event.ctrlKey){window.open('" + ODPExtension.categoryGetURL(responseCategory) + "', '_blank');return false;}");
				}
			}

			progress.remove();
			progress.progress();
		});

	}

	this.domainGetListings = function (aURL, aFunction) {
		var aLocationID = this.getURLID(aURL);
		query_domain.params('domain', aLocationID.domain);
		query_domain.execute(function (aData) {
			aFunction(aData)
		});
	}

	this.subdomainGetListings = function (aURL, aFunction) {
		var aLocationID = this.getURLID(aURL);
		query_subdomain.params('subdomain', aLocationID.subdomain);
		query_subdomain.execute(function (aData) {
			aFunction(aData)
		});
	}

	return null;

}).apply(ODPExtension);
(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.rdfParserStart = function() {

		if (!this.confirm(this.getString('rdf.processing.please.dont.touch.your.browser')))
			return;

		var timer = this.timer('rdf.parser')
		timer.start('all');

		this.rdfParserStarted = (new Date().toLocaleString())
		var progress = this.progress('rdf.parser');
		progress.reset();

		var aData = '';
		var aTopic = '';
		var ids = [];
		var hosts = [];
		var currentCatID = 1;
		var currentHostID = 1;

		var unicodeConverter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
		unicodeConverter.charset = "UTF-8";
		unicodeConverter = unicodeConverter.ConvertToUnicode;

		var binInputStream = Components.classes["@mozilla.org/binaryinputstream;1"].createInstance(Components.interfaces.nsIBinaryInputStream);

		var subStrCount = this.subStrCount;
		var stripTags = this.stripTags;
		var htmlSpecialCharsDecode = this.htmlSpecialCharsDecode;
		var getURLID = this.getURLID;

		var resourceValueRegExp = /.+\:resource="([^"]*)".+/;
		var resourceIndexRegExp = /.+\:resource="([^\:]*)\:([^"]*)".+/;
		var idValueRegExp = /.+\:id="([^"]*)".+/;
		var categorySanitizeRegExp1 = /^[^\:]+\:/;
		var categorySanitizeRegExp2 = /^Top\//;
		var categorySanitizeRegExp3 = /\/+$/;

		var categorySanitize = function(aCategory) {
			return htmlSpecialCharsDecode(aCategory.replace(categorySanitizeRegExp1, '').replace(categorySanitizeRegExp2, '').replace(categorySanitizeRegExp3, ''));
		}

		var structureU8 = [
			'http://rdf.dmoz.org/rdf/ad-structure.rdf.u8.gz'
			, 'http://rdf.dmoz.org/rdf/kt-structure.rdf.u8.gz'
			, 'http://rdf.dmoz.org/rdf/structure.rdf.u8.gz'
		]
		var contentU8 = [
			//'http://rdf.dmoz.org/rdf/ad-content.rdf.u8.gz'
			//,
			'http://rdf.dmoz.org/rdf/kt-content.rdf.u8.gz'
			, 'http://rdf.dmoz.org/rdf/content.rdf.u8.gz'
		]
		var aConnection = this.rdfDatabaseOpen();

		this.dump('Cleaning database tables...');
		try {
			aConnection.aConnection.executeSimpleSQL('DROP TABLE IF EXISTS `categories`');
			aConnection.aConnection.executeSimpleSQL('DROP TABLE IF EXISTS `editors`');
			aConnection.aConnection.executeSimpleSQL('DROP TABLE IF EXISTS `related`');
			aConnection.aConnection.executeSimpleSQL('DROP TABLE IF EXISTS `altlang`');
			aConnection.aConnection.executeSimpleSQL('DROP TABLE IF EXISTS `link`');
			aConnection.aConnection.executeSimpleSQL('DROP TABLE IF EXISTS `newsgroup`');
			aConnection.aConnection.executeSimpleSQL('DROP TABLE IF EXISTS `hosts`');
			aConnection.aConnection.executeSimpleSQL('DROP TABLE IF EXISTS `uris`');
			aConnection.vacuum();
		} catch (e) {
			this.rdfDatabaseClose();
			ODPExtension.fileRemove('RDF.sqlite');
			aConnection = this.rdfDatabaseOpen();
		}
		this.dump('Database tables cleaned...');

		this.dump('Creating database tables and statements...');
		aConnection.begin();
		aConnection.executeSimple('	CREATE TABLE `categories` 	( `id` INTEGER PRIMARY KEY NOT NULL, `parent` INTEGER NOT NULL, `catid` INTEGER NOT NULL, `depth` INTEGER NOT NULL, `category` TEXT NOT NULL, `category_reversed` TEXT NOT NULL, `name` TEXT NOT NULL, `last_update` DATETIME NOT NULL, `description` TEXT NOT NULL)');
		aConnection.executeSimple('	CREATE TABLE `editors`		( `id` INTEGER PRIMARY KEY NOT NULL, `editor` TEXT NOT NULL, `category_id` INTEGER NOT NULL)');
		aConnection.executeSimple('	CREATE TABLE `related`		( `id` INTEGER PRIMARY KEY NOT NULL, `to` INTEGER NOT NULL, `from` INTEGER NOT NULL)');
		aConnection.executeSimple('	CREATE TABLE `altlang` 		( `id` INTEGER PRIMARY KEY NOT NULL, `to` INTEGER NOT NULL, `from` INTEGER NOT NULL)');
		aConnection.executeSimple('	CREATE TABLE `link` 		( `id` INTEGER PRIMARY KEY NOT NULL, `to` INTEGER NOT NULL, `from` INTEGER NOT NULL, `name` TEXT NOT NULL, `position` INTEGER NOT NULL)');
		aConnection.executeSimple('	CREATE TABLE `newsgroup`	( `id` INTEGER PRIMARY KEY NOT NULL, `newsgroup` TEXT NOT NULL, `category_id` INTEGER NOT NULL )');
		aConnection.executeSimple('	CREATE TABLE `hosts`	( `id` INTEGER PRIMARY KEY NOT NULL, `host` TEXT NOT NULL)');
		aConnection.executeSimple('	CREATE TABLE `uris`			( `id` INTEGER PRIMARY KEY NOT NULL, `schemaWWW` TEXT NOT NULL, `subdomain_id` INTEGER NOT NULL, `domain_id` INTEGER NOT NULL, `uri` TEXT NOT NULL, `path` TEXT NOT NULL, `title` TEXT NOT NULL, `description` TEXT NOT NULL, `mediadate` DATE NOT NULL, `pdf` INTEGER NOT NULL, `atom` INTEGER NOT NULL, `rss` INTEGER NOT NULL, `cool` INTEGER NOT NULL, `category_id` INTEGER NOT NULL)');

		var insertCategory = aConnection.aConnection.createStatement('INSERT INTO `categories` ( `id`, `parent`, `catid`,`depth`, `category`,`category_reversed`, `name` , `last_update` , `description` ) VALUES ( :id, :parent , :catid, :depth, :category, :category_reversed, :name, :last_update , :description )')
		var insertEditor = aConnection.aConnection.createStatement('INSERT INTO `editors` ( `editor`, `category_id` ) VALUES ( :editor, :category_id )')
		var insertRelated = aConnection.aConnection.createStatement('INSERT INTO `related` ( `to`, `from` ) VALUES ( :to, :from )')
		var insertAltlang = aConnection.aConnection.createStatement('INSERT INTO `altlang` ( `to`, `from` ) VALUES ( :to, :from )')
		var insertLink = aConnection.aConnection.createStatement('INSERT INTO `link` ( `to`, `from` , `name`, `position` ) VALUES ( :to, :from, :name, :position )')
		var insertNewsgroup = aConnection.aConnection.createStatement('INSERT INTO `newsgroup` ( `newsgroup`, `category_id`) VALUES ( :newsgroup, :category_id )')
		var insertHost = aConnection.aConnection.createStatement('INSERT INTO `hosts` ( `id`, `host`) VALUES ( :id, :host )')
		var insertURI = aConnection.aConnection.createStatement('INSERT INTO `uris` ( `schemaWWW`, `subdomain_id`, `domain_id`, `uri`, `path`, `title`, `description`, `mediadate`, `pdf`, `atom`, `rss`, `cool`, `category_id`) VALUES (:schemaWWW, :subdomain_id, :domain_id, :uri, :path, :title, :description, :mediadate, :pdf, :atom, :rss, :cool, :category_id )')
		this.dump('Database tables and statements created...');

		function StreamListenerCategoriesTXT() {
			return this;
		}
		StreamListenerCategoriesTXT.prototype = {

			onStartRequest: function(aRequester, aContext) {
				ODPExtension.dump('Setting categories IDs...');
			},
			onDataAvailable: function(aRequester, aContext, aInputStream, aOffset, aCount) {

				binInputStream.setInputStream(aInputStream);
				aData += binInputStream.readBytes(binInputStream.available());
				binInputStream.close();

				var data = aData.trimLeft().split('\n');
				aData = data.pop();
				data = unicodeConverter(data.join('\n')).split('\n')

				var category, path, leaf, parent;
				for (var i = 0, total = data.length; i < total; i++) {
					category = data[i];
					if (!ids[category]) {
						parent = category.split('/'), leaf = parent.pop(), parent = parent.join('/');
						if (!ids[parent])
							ids[parent] = currentCatID++;
						ids[category] = currentCatID++;
						progress.add();
					}
				}
				if (progress.done % 100 === 0)
					progress.progress();
			},

			onStopRequest: function(aRequester, aContext, aStatusCode) {

				var data = unicodeConverter(aData).trim().split('\n');
				aData = '';

				var category, parent, leaf, parent;
				for (var i = 0, total = data.length; i < total; i++) {
					category = data[i];
					if (!ids[category]) {
						parent = category.split('/'), leaf = parent.pop(), parent = parent.join('/');
						if (!ids[parent])
							ids[parent] = currentCatID++;
						ids[category] = currentCatID++;
						progress.add();
					}
				}
				ODPExtension.gc();
				progress.progress();
				ODPExtension.dump('Categories IDs set...');
				aConnection.commit();
				aConnection.begin();
				var url = structureU8.shift()
				progress.message = 'Processing ' + url;
				ODPExtension.dump('Processing ' + url);
				ODPExtension.rdfParserDownload(url, new StreamListenerStructureRDF());
			}
		}

		function StreamListenerStructureRDF() {
			return this;
		}
		StreamListenerStructureRDF.prototype = {

			onStartRequest: function(aRequester, aContext) {
				//timer.start('downloading');
			},
			onDataAvailable: function(aRequester, aContext, aInputStream, aOffset, aCount) {

				binInputStream.setInputStream(aInputStream);
				aData += binInputStream.readBytes(binInputStream.available());
				binInputStream.close();

				if (aData.indexOf('</Topic') != -1)
					this.onLoadTopic();
				if (progress.done % 100 === 0)
					progress.progress();
			},
			//ie: a link to Test/Wold/Lunfardo/
			onMissingCategory: function(aCategories) {
				aCategories = aCategories.split('/');
				var aCategory = '',
					path = '';
				for (var id in aCategories) {
					aCategory += aCategories[id] + '/'
					path = aCategory.replace(/\/$/, '');
					if (!ids[path]) {
						parent = path.split('/'), leaf = parent.pop(), parent = parent.join('/');
						ids[path] = currentCatID++;
						//saving
						insertCategory.params['id'] = ids[path];
						insertCategory.params['parent'] = ids[parent];
						insertCategory.params['catid'] = 0;
						insertCategory.params['category'] = aCategory;
						insertCategory.params['category_reversed'] = aCategory.split('').reverse().join('');
						insertCategory.params['name'] = leaf;
						insertCategory.params['depth'] = subStrCount(path, '/') + 1;
						insertCategory.params['last_update'] = '0000-00-00 00:00:00';
						insertCategory.params['description'] = '';
						insertCategory.execute();
					}
				}
				return ids[path];
			},
			onLoadTopic: function(last) {

				var data = aData.trimLeft().split('\n');
				if (!last)
					aData = data.pop();
				data = (aTopic + unicodeConverter(data.join('\n'))).split('\n')
				aTopic = '';

				var category, path, leaf, parent;
				for (var i = 0, total = data.length; i < total; i++) {

					value = data[i].trim();
					aTopic += value;
					aTopic += "\n";

					if (value.indexOf('<Topic') === 0) {

						var aCategory = {};
						aCategory.category = categorySanitize(value.replace(idValueRegExp, '$1'));
						aCategory.id = ids[aCategory.category];

						parent = aCategory.category.split('/'), leaf = parent.pop(), parent = parent.join('/');

						aCategory.parent = ids[parent];
						aCategory.name = leaf;

						aCategory.catid = '';
						aCategory.lastUpdate = '';
						aCategory.description = '';

						aCategory.editors = []
						aCategory.related = []
						aCategory.altlang = []
						aCategory.link = []
						aCategory.newsgroup = []
						i++;

						for (; i < total; i++) {
							value = data[i].trim();
							aTopic += value;
							aTopic += "\n";

							if (value.indexOf('</Topic') === 0) {
								progress.remove();
								//ODPExtension.dump(aCategory);
								try {
									//saving
									insertCategory.params['id'] = aCategory.id;
									insertCategory.params['parent'] = aCategory.parent;
									insertCategory.params['catid'] = aCategory.catid;
									insertCategory.params['category'] = aCategory.category + '/';
									insertCategory.params['category_reversed'] = (aCategory.category + '/').split('').reverse().join('');
									insertCategory.params['name'] = aCategory.name;
									insertCategory.params['depth'] = subStrCount(aCategory.category, '/') + 1;
									insertCategory.params['last_update'] = aCategory.lastUpdate;
									insertCategory.params['description'] = aCategory.description;
									insertCategory.execute();
								} catch (e) {
									ODPExtension.dump('---------');
									ODPExtension.dump(aConnection.aConnection.lastErrorString);
									ODPExtension.dump(aTopic);
									ODPExtension.dump(aCategory);
								}
								for (var a = 0; a < aCategory.editors.length; a++) {
									insertEditor.params['editor'] = aCategory.editors[a];
									insertEditor.params['category_id'] = aCategory.id;
									insertEditor.execute();
								}
								for (var a = 0; a < aCategory.related.length; a++) {
									insertRelated.params['to'] = aCategory.related[a];
									insertRelated.params['from'] = aCategory.id;
									insertRelated.execute();
								}
								for (var a = 0; a < aCategory.altlang.length; a++) {
									insertAltlang.params['to'] = aCategory.altlang[a].link;
									insertAltlang.params['from'] = aCategory.id;
									insertAltlang.execute();
								}
								for (var a = 0; a < aCategory.link.length; a++) {
									insertLink.params['to'] = aCategory.link[a].link;
									insertLink.params['from'] = aCategory.id;
									insertLink.params['name'] = aCategory.link[a].name;
									insertLink.params['position'] = aCategory.link[a].position;
									insertLink.execute();
								}
								for (var a = 0; a < aCategory.newsgroup.length; a++) {
									insertNewsgroup.params['newsgroup'] = aCategory.newsgroup[a];
									insertNewsgroup.params['category_id'] = aCategory.id;
									insertNewsgroup.execute();
								}

								aTopic = '';
								aCategory = {};
								break;
							} else if (value.indexOf('<catid') === 0)
								aCategory.catid = stripTags(value);
							else if (value.indexOf('<lastUpdate') === 0)
								aCategory.lastUpdate = stripTags(value);
							else if (value.indexOf('<d:Description') === 0)
								aCategory.description = htmlSpecialCharsDecode(stripTags(value));
							else if (value.indexOf('<editor') === 0)
								aCategory.editors[aCategory.editors.length] = value.replace(resourceValueRegExp, '$1');
							else if (value.indexOf('<newsgroup') === 0)
								aCategory.newsgroup[aCategory.newsgroup.length] = value.replace(resourceValueRegExp, '$1');
							else if (value.indexOf('<related') === 0)
								aCategory.related[aCategory.related.length] = ids[categorySanitize(value.replace(resourceValueRegExp, '$1'))] || this.onMissingCategory(categorySanitize(value.replace(resourceValueRegExp, '$1')));
							else if (value.indexOf('<altlang') === 0) {
								var tmp = {};
								tmp.link = ids[categorySanitize(value.replace(resourceValueRegExp, '$1'))] || this.onMissingCategory(categorySanitize(value.replace(resourceValueRegExp, '$1')));
								aCategory.altlang[aCategory.altlang.length] = tmp;
							} else if (value.indexOf('<symbolic') === 0) {
								var tmp = {};
								tmp.name = htmlSpecialCharsDecode(value.replace(resourceIndexRegExp, '$1'));
								tmp.link = ids[categorySanitize(value.replace(resourceValueRegExp, '$1'))] || this.onMissingCategory(categorySanitize(value.replace(resourceValueRegExp, '$1')));

								if (value.indexOf('<symbolic ') === 0)
									tmp.position = 0;
								else if (value.indexOf('<symbolic1') === 0)
									tmp.position = 1;
								else
									tmp.position = 2;
								aCategory.link[aCategory.link.length] = tmp;
							}
						}
					}
				}
			},

			onStopRequest: function(aRequester, aContext, aStatusCode) {
				progress.progress();

				this.onLoadTopic(true);
				aData = '';
				aTopic = '';

				ODPExtension.gc();

				var url = structureU8.shift()
				if (!url || url == '') {

					ODPExtension.dump('Commiting start...');
					aConnection.commit();
					ODPExtension.dump('Commiting end...');

					ODPExtension.dump('Finalizing statements...');
					insertEditor.finalize();
					insertRelated.finalize();
					insertAltlang.finalize();
					insertLink.finalize();
					insertNewsgroup.finalize();
					ODPExtension.dump('Statements finalized...');

					ODPExtension.gc();

					ODPExtension.dump('Creating database index...');
					aConnection.begin();
					aConnection.executeSimple('	CREATE UNIQUE INDEX IF NOT EXISTS `categories_category` ON `categories` (`category`) ');
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `categories_parent` ON `categories` (`parent`) ');
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `categories_depth` ON `categories` (`depth`) ');
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `categories_name` ON `categories` (`name`) ');

					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `related_to` ON `related` (`to`) ');
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `related_from` ON `related` (`from`) ');
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `related_from_to` ON `related` (`from`, `to`) ');

					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `altlang_to` ON `altlang` (`to`) ');
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `altlang_from` ON `altlang` (`from`) ');
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `altlang_from_to` ON `altlang` (`from`, `to`) ');

					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `link_to` ON `link` (`to`) ');
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `link_from` ON `link` (`from`) ');
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `link_from_to` ON `link` (`from`, `to`) ');
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `link_name` ON `link` (`name`) ');
					aConnection.commit();
					ODPExtension.dump('Database index created...');

					//ids = null;
					ODPExtension.gc();

					progress.done = 0;
					progress.running = '5000000~'
					progress.progress();

					aConnection.begin();
					var url = contentU8.shift()
					progress.message = 'Processing ' + url;
					ODPExtension.dump('Processing ' + url + '...');
					ODPExtension.rdfParserDownload(url, new StreamListenerContentRDF());

				} else {
					ODPExtension.dump('Processing ' + url + '...');
					progress.message = 'Processing ' + url;
					ODPExtension.rdfParserDownload(url, new StreamListenerStructureRDF());
				}
			}
		}


		function StreamListenerContentRDF() {
			return this;
		}
		StreamListenerContentRDF.prototype = {

			onStartRequest: function(aRequester, aContext) {
				//timer.start('downloading');

			},
			onDataAvailable: function(aRequester, aContext, aInputStream, aOffset, aCount) {

				binInputStream.setInputStream(aInputStream);
				aData += binInputStream.readBytes(binInputStream.available());
				binInputStream.close();

				if (aData.indexOf('</ExternalPage') != -1)
					this.onLoadSite();
				if (progress.done % 1000 === 0)
					progress.progress();
			},
			//ie: a link to Test/Wold/Lunfardo/
			onMissingCategory: function(aCategories) {
				ODPExtension.dump('problematic category:' + aCategories);
				aCategories = aCategories.split('/');
				var aCategory = '',
					path = '';
				for (var id in aCategories) {
					aCategory += aCategories[id] + '/'
					path = aCategory.replace(/\/$/, '');
					if (!ids[path]) {
						parent = path.split('/'), leaf = parent.pop(), parent = parent.join('/');
						ids[path] = currentCatID++;
						//saving
						insertCategory.params['id'] = ids[path];
						insertCategory.params['parent'] = ids[parent];
						insertCategory.params['catid'] = 0;
						insertCategory.params['category'] = aCategory;
						insertCategory.params['category_reversed'] = aCategory.split('').reverse().join('');
						insertCategory.params['name'] = leaf;
						insertCategory.params['depth'] = subStrCount(path, '/') + 1;
						insertCategory.params['last_update'] = '0000-00-00 00:00:00';
						insertCategory.params['description'] = '';
						insertCategory.execute();
					}
				}
				return ids[path];
			},
			onLoadSite: function(last) {

				var data = aData.trimLeft().split('\n');
				if (!last)
					aData = data.pop();
				data = (aTopic + unicodeConverter(data.join('\n'))).split('\n')
				aTopic = '';
				var params = insertURI.params,
					insert = insertURI;
				for (var i = 0, total = data.length; i < total; i++) {

					value = data[i].trim();
					aTopic += value;
					aTopic += "\n";

					if (value.indexOf('<ExternalPage') === 0) {

						var aSite = getURLID(htmlSpecialCharsDecode(value.split('about="')[1].slice(0, -2)));


						/*						aSite.subdomain_id = ODPExtension.getSubdomainFromURL(aSite.uri);
						aSite.domain_id = ODPExtension.getDomainFromURL(aSite.uri);
						aSite.schemaWWW = ODPExtension.getSchema(aSite.uri) + ODPExtension.getWWW(aSite.subdomain_id);
						aSite.subdomain_id = ODPExtension.removeWWW(aSite.subdomain_id);
						aSite.path = ODPExtension.decodeUTF8Recursive(ODPExtension.removeSubdomain(aSite.uri)).toLowerCase();*/

						if (!hosts[aSite.subdomain]) {
							hosts[aSite.subdomain] = currentHostID++;
							insertHost.params['id'] = hosts[aSite.subdomain];
							insertHost.params['host'] = aSite.subdomain;
							insertHost.execute();
						}
						aSite.subdomain = hosts[aSite.subdomain];

						if (!hosts[aSite.domain]) {
							hosts[aSite.domain] = currentHostID++;
							insertHost.params['id'] = hosts[aSite.domain];
							insertHost.params['host'] = aSite.domain;
							insertHost.execute();
						}
						aSite.domain = hosts[aSite.domain];

						aSite.rss = 0;
						aSite.pdf = 0;
						aSite.atom = 0;

						aSite.cool = 0;

						aSite.mediadate = '';

						aSite.title = '';
						aSite.description = '';

						aSite.category_id = 0;

						i++;

						for (; i < total; i++) {
							value = data[i].trim();
							aTopic += value;
							aTopic += "\n";

							if (value.indexOf('</ExternalPage') === 0) {
								progress.remove();
								if (progress.done % 100000 == 0) {
									aConnection.commit();
									aConnection.begin();
								}

								try {
									//saving
									params['schemaWWW'] = aSite.schemaWWW;
									params['subdomain_id'] = aSite.subdomain;
									params['domain_id'] = aSite.domain;
									params['uri'] = aSite.uri;
									params['path'] = aSite.path

									params['title'] = aSite.title;
									params['description'] = aSite.description;

									params['mediadate'] = aSite.mediadate;

									params['pdf'] = aSite.pdf;
									params['atom'] = aSite.atom;
									params['rss'] = aSite.rss;

									params['cool'] = aSite.cool;

									params['category_id'] = aSite.category_id;

									insert.execute();
								} catch (e) {
									ODPExtension.dump('---------');
									ODPExtension.dump(aConnection.aConnection.lastErrorString);
									ODPExtension.dump(aSite);
									ODPExtension.dump(aTopic);
								}
								aTopic = '';
								aSite = {};
								break;
							} else if (value.indexOf('<d:Description') === 0)
								aSite.description = htmlSpecialCharsDecode(stripTags(value));
							else if (value.indexOf('<d:Title') === 0)
								aSite.title = htmlSpecialCharsDecode(stripTags(value));
							else if (value.indexOf('<topic>') === 0)
								aSite.category_id = ids[categorySanitize(stripTags(value))] || this.onMissingCategory(categorySanitize(stripTags(value)));
							else if (value.indexOf('<mediadate') === 0)
								aSite.mediadate = stripTags(value).slice(0, 10);
							else if (value.indexOf('<priority') === 0)
								aSite.cool = 1;
							else if (value.indexOf('<type') === 0) {
								value = value.toLowerCase()
								if (value.indexOf('rss') != -1)
									aSite.rss = 1;
								else if (value.indexOf('pdf') != -1)
									aSite.pdf = 1;
								else if (value.indexOf('atom') != -1)
									aSite.atom = 1;
							}
						}
					}
				}
			},

			onStopRequest: function(aRequester, aContext, aStatusCode) {
				progress.progress();

				this.onLoadSite(true);
				aData = '';
				aTopic = '';

				ODPExtension.gc();

				var url = contentU8.shift()
				if (!url || url == '') {

					ids = null;
					hosts = null;
					ODPExtension.gc();

					ODPExtension.dump('Commiting start...');
					aConnection.commit();
					ODPExtension.dump('Commiting end...');

					ODPExtension.dump('Finalizing statements...');
					insertURI.finalize();
					insertHost.finalize();
					insertCategory.finalize();
					ODPExtension.dump('Statements finalized...');

					progress.progress();

					ODPExtension.gc();

					ODPExtension.dump('Creating database index...');
					aConnection.begin();
					aConnection.executeSimple('	CREATE UNIQUE INDEX IF NOT EXISTS `hosts_host` ON `hosts` (`host`) ');
					aConnection.commit();

					ODPExtension.gc();

					aConnection.begin();
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `uris_subdomain_id` ON `uris` (`subdomain_id`) ');
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `uris_domain_id` ON `uris` (`domain_id`) ');
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `uris_path` ON `uris` (`path`) ');
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `uris_path_domain` ON `uris` (`path`,`domain_id`) ');
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `uris_path_subdomain` ON `uris` (`path`,`subdomain_id`) ');
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `uris_subdomain_domain` ON `uris` (`subdomain_id`,`domain_id`) ');
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `uris_subdomain_domain_path` ON `uris` (`subdomain_id`,`domain_id`,`path`) ');
					aConnection.commit();
					ODPExtension.dump('Database index created...');

					ODPExtension.rdfDatabaseClose();
					ODPExtension.rdfDatabaseOpen();

					ODPExtension.gc();

					ODPExtension.dispatchGlobalEvent('databaseReady');
					ODPExtension.dispatchGlobalEvent('userInterfaceUpdate', ODPExtension.preferenceGet('enabled'))

					ODPExtension.rdfParserComplete();

				} else {
					ODPExtension.dump('Processing ' + url + '...');
					progress.message = 'Processing ' + url;
					ODPExtension.rdfParserDownload(url, new StreamListenerContentRDF());
				}

			}
		}

		progress.message = 'Processing http://rdf.dmoz.org/rdf/categories.txt.gz';
		this.rdfParserDownload('http://rdf.dmoz.org/rdf/categories.txt.gz', new StreamListenerCategoriesTXT());
	}

	this.rdfParserDownload = function(aURL, aListener) {
		var aChannel = this.service('ios').newChannelFromURI(this.newURI(aURL));
		aChannel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;

		var converterService = Components.classes["@mozilla.org/streamConverters;1"].getService(Components.interfaces.nsIStreamConverterService);
		var aConverter = converterService.asyncConvertData("gzip", "uncompressed", aListener, null);
		aChannel.asyncOpen(aConverter, null);
	}
	this.rdfParserComplete = function() {
		this.notifyTab(this.getString('rdf.processing.completed').replace('{END}', (new Date().toLocaleString()))
			.replace('{START}', this.rdfParserStarted));
		this.windowGetAttention(); //flash the window in the taskbar
	}

	this.rdfParserSetTable = function(aFile) //finding generated at
	{
		var file = this.rdfFileOpen(aFile);
		if (!file) {
			this.rdfFileClose(file[0], file[1]);
			this.dump('File no exists:' + aFile);
			return false;
		}

		var header, table;

		header = '';

		var cont = true;
		var line = {};
		var value = '';

		for (; cont = file[1].readLine(line);) {
			value = this.trim(line.value);

			if (value.indexOf('<!-- Generated at ') === 0) {
				table = value.replace(/<!-- Generated at ([0-9]{4}-[0-9]{2}-[0-9]{2}).*/, '$1').split('-').join('');
			}
			if (value.indexOf('<Topic') === 0) {
				break;
			}
			header += value;
		}

		this.rdfFileClose(file[0], file[1]);
		return [header, table];
	}
	this.rdfParserFind = function(aFile, aQuery) {

		var header_table = this.rdfParserSetTable(aFile);
		var file = this.rdfFileOpen(aFile);
		if (!file) {
			this.rdfFileClose(file[0], file[1]);
			this.dump('File no exists:' + aFile);
			return false;
		}

		//initializing parsing

		var cont = true;
		var line = {};
		var value = '';
		var aTopic = '';
		var result = {};
		result.count = 0;
		result.data = header_table[0];
		//parsing

		for (; cont = file[1].readLine(line);) {
			value = this.trim(line.value);

			if (value.indexOf('<Topic') === 0) {
				aTopic = value;
				aTopic += '\n';
				for (; cont = file[1].readLine(line);) {
					value = this.trim(line.value);
					if (value.indexOf('<Topic') === 0) {
						if (aTopic.indexOf(aQuery) != -1) {
							result.data += aTopic;
							result.count++;
						}
						break;
					}
					aTopic += value;
					aTopic += '\n';
				}
			}
		}

		this.rdfFileClose(file[0], file[1]);

		result.data += '</RDF>';

		return result;
	}

	this.rdfFileOpen = function(aFilePath) {
		var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		file.initWithPath(aFilePath);

		if (!file.exists())
			return false;

		var istream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
		istream.init(file, 0x01, 0444, 0);
		istream.QueryInterface(Components.interfaces.nsILineInputStream);

		var is = Components.classes["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);

		is.init(istream, "UTF-8", 1024, 0xFFFD);
		is.QueryInterface(Components.interfaces.nsIUnicharLineInputStream);

		return [istream, is];
	}

	this.rdfFileClose =  function(istream, is) {
		istream.close();
		is.close();
	}

	return null;

}).apply(ODPExtension);
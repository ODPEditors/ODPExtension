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
		var currentID = 1;

		var unicodeConverter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
		unicodeConverter.charset = "UTF-8";
		unicodeConverter = unicodeConverter.ConvertToUnicode;

		var binInputStream = Components.classes["@mozilla.org/binaryinputstream;1"].createInstance(Components.interfaces.nsIBinaryInputStream);

		var subStrCount = this.subStrCount;
		var stripTags = this.stripTags;
		var htmlSpecialCharsDecode = function(aString) { //.split('\\"').join('"'); WTF!?
			return aString.split('&lt;').join('<').split('&gt;').join('>').split('&quot;').join('"').split('&apos;').join("'").split('&amp;').join('&').split('\\"').join('"');
		};

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
			'http://rdf.dmoz.org/rdf/ad-structure.rdf.u8.gz',
			'http://rdf.dmoz.org/rdf/kt-structure.rdf.u8.gz',
			'http://rdf.dmoz.org/rdf/structure.rdf.u8.gz'
		]
		var aConnection = this.rdfDatabaseOpen();

		this.dump('Cleaning database tables...');
		aConnection.executeSimple('DROP TABLE IF EXISTS `categories`');
		aConnection.executeSimple('DROP TABLE IF EXISTS `editors`');
		aConnection.executeSimple('DROP TABLE IF EXISTS `related`');
		aConnection.executeSimple('DROP TABLE IF EXISTS `altlang`');
		aConnection.executeSimple('DROP TABLE IF EXISTS `link`');
		aConnection.executeSimple('DROP TABLE IF EXISTS `newsgroup`');
		aConnection.executeSimple('DROP TABLE IF EXISTS `uris`');
		aConnection.vacuum();
		this.dump('Database tables cleaned...');

		this.dump('Creating database tables and statements...');
		aConnection.executeSimple('	CREATE TABLE `categories` 	( `id` INTEGER PRIMARY KEY NOT NULL, `parent` INTEGER  NOT NULL, `catid` INTEGER NOT NULL, `depth` INTEGER NOT NULL, `category` TEXT NOT NULL, `category_reversed` TEXT NOT NULL, `name` TEXT  NOT NULL, `last_update` DATETIME  NOT NULL, `description` TEXT NOT NULL)');
		aConnection.executeSimple('	CREATE TABLE `editors`		( `id` INTEGER PRIMARY KEY NOT NULL, `editor` TEXT  NOT NULL, `category_id` INTEGER  NOT NULL)');
		aConnection.executeSimple('	CREATE TABLE `related`		( `id` INTEGER PRIMARY KEY NOT NULL, `to` INTEGER  NOT NULL, `from` INTEGER  NOT NULL)');
		aConnection.executeSimple('	CREATE TABLE `altlang` 		( `id` INTEGER PRIMARY KEY NOT NULL, `to` INTEGER  NOT NULL, `from` INTEGER  NOT NULL)');
		aConnection.executeSimple('	CREATE TABLE `link`    		( `id` INTEGER PRIMARY KEY NOT NULL, `to` INTEGER  NOT NULL, `from` INTEGER  NOT NULL, `name` TEXT NOT NULL, `position` INTEGER  NOT NULL)');
		aConnection.executeSimple('	CREATE TABLE `newsgroup`	( `id` INTEGER PRIMARY KEY NOT NULL, `newsgroup` TEXT  NOT NULL, `category_id` INTEGER  NOT NULL )');
		aConnection.executeSimple('	CREATE TABLE `uris`			( `id` INTEGER PRIMARY KEY NOT NULL, `newsgroup` TEXT  NOT NULL, `category_id` INTEGER  NOT NULL )');

		var insertCategory = aConnection.aConnection.createStatement('INSERT INTO `categories` ( `id`, `parent`, `catid`,`depth`, `category`,`category_reversed`,  `name` , `last_update` , `description` ) VALUES (  :id, :parent ,   :catid, :depth, :category,  :category_reversed,   :name, :last_update ,   :description )')
		var insertEditor = aConnection.aConnection.createStatement('INSERT INTO `editors` ( `editor`, `category_id` ) VALUES (  :editor, :category_id )')
		var insertRelated = aConnection.aConnection.createStatement('INSERT INTO `related` ( `to`, `from` ) VALUES (  :to, :from )')
		var insertAltlang = aConnection.aConnection.createStatement('INSERT INTO `altlang` ( `to`, `from` ) VALUES (  :to, :from )')
		var insertLink = aConnection.aConnection.createStatement('INSERT INTO `link` ( `to`, `from` , `name`, `position`  ) VALUES (  :to, :from, :name, :position )')
		var insertNewsgroup = aConnection.aConnection.createStatement('INSERT INTO `newsgroup` ( `newsgroup`, `category_id`) VALUES (  :newsgroup, :category_id )')
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
							ids[parent] = currentID++;
						ids[category] = currentID++;
						progress.add();
					}
				}
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
							ids[parent] = currentID++;
						ids[category] = currentID++;
						progress.add();
					}
				}
				ODPExtension.gc();
				progress.progress();
				ODPExtension.dump('Categories IDs set...');
				aConnection.begin();
				ODPExtension.rdfParserDownload(structureU8.shift(), new StreamListenerStructureRDF());
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
						ids[path] = currentID++;
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
									ODPExtension.dump(e.message);
									ODPExtension.dump(aCategory);
									ODPExtension.dump(aConnection.aConnection.lastErrorString);
									ODPExtension.dump(aTopic);
									ODPExtension.dump('---------');
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
							} else {
								if (
									value.indexOf('<Target') === 0 ||
									value.indexOf('</Alias') === 0 ||
									value.indexOf('<Alias') === 0 ||
									value.indexOf('<narrow') === 0 ||
									value.indexOf('<narrow') === 0 ||
									value.indexOf('<d:Title') === 0 ||
									value.indexOf('<letterbar') === 0) {} else {
									ODPExtension.dump('WTF 1');
									ODPExtension.dump(value);
								}
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
					ODPExtension.dump('Finalizing statements...');
					insertCategory.finalize();
					insertEditor.finalize();
					insertRelated.finalize();
					insertAltlang.finalize();
					insertLink.finalize();
					insertNewsgroup.finalize();
					ODPExtension.dump('Statements finalized...');

					ODPExtension.dump('Commiting start...');
					aConnection.commit();
					ODPExtension.dump('Commiting end...');

				ODPExtension.gc();

					ODPExtension.dump('Creating database index...');
					aConnection.begin();
					aConnection.executeSimple('	CREATE UNIQUE INDEX IF NOT EXISTS `categories_category` ON `categories` (`category`) ');
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `categories_parent` ON `categories` (`parent`) ');
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `categories_depth` ON `categories` (`depth`) ');
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `categories_name` ON `categories` (`name`) ');

					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `related_to` ON `related` (`to`) ');
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `related_from` ON `related` (`from`) ');

					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `altlang_to` ON `altlang` (`to`) ');
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `altlang_from` ON `altlang` (`from`) ');

					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `link_to` ON `link` (`to`) ');
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `link_from` ON `link` (`from`) ');
					aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `link_name` ON `link` (`name`) ');
					aConnection.commit();
					ODPExtension.dump('Database index created...');

					aConnection.vacuum();

					ids = null;
					ODPExtension.gc();

					progress.progress();

					ODPExtension.rdfParserComplete();

				} else {
					ODPExtension.dump('Processing ' + url + '...');
					ODPExtension.rdfParserDownload(url, new StreamListenerStructureRDF());
				}

			}
		}

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
		this.notifyTabs(
			this.getString('rdf.processing.completed').replace('{END}', (new Date().toLocaleString()))
			.replace('{START}', this.rdfParserStarted));
		this.windowGetAttention(); //flash the window in the taskbar
	}

	this.rdfParserSetTable = function(aFile) //finding generated at
	{
		if (!this.fileOpen(aFile)) {
			this.fileClose()
			this.dump('File no exists:' + aFile);
			return false;
		}

		this.rdfHeader = '';
		this.rdfFooter = '</RDF>';

		var cont = true;
		var line = {};
		var value = '';

		for (; cont = this.is.readLine(line);) {
			value = this.trim(line.value);

			if (value.indexOf('<!-- Generated at ') === 0) {
				this.table = value.replace(/<!-- Generated at ([0-9]{4}-[0-9]{2}-[0-9]{2}).*/, '$1').split('-').join('');
			}
			if (value.indexOf('<Topic') === 0) {
				break;
			}
			this.rdfHeader += value;
		}

		this.fileClose();
		this.dump('Table id set...');
		return true;
	}
	this.rdfParserFind = function(aFile, aQuery)
	{
		this.rdfParserSetTable(aFile);

		if (!this.fileOpen(aFile)) {
			this.fileClose()
			this.dump('File no exists:' + aFile);
			return;
		}

		//initializing parsing

		var cont = true;
		var line = {};
		var value = '';
		var aTopic = '';
		var result = {};
		result.count = 0;
		result.data = this.rdfHeader;
		//parsing

		for (; cont = this.is.readLine(line);) {
			value = this.trim(line.value);

			if (value.indexOf('<Topic') === 0) {
				aTopic = value;
				aTopic += '\n';

				for (; cont = this.is.readLine(line);) {
					value = this.trim(line.value);

					aTopic += value;
					aTopic += '\n';

					if (value.indexOf('</Topic') === 0) {
						if (aTopic.indexOf(aQuery) != -1) {
							result.data += aTopic;
							result.count++;
						}
						break;
					}
				}
			}
		}

		this.fileClose();

		result.data += this.rdfFooter;

		return result;
	}

	return null;

}).apply(ODPExtension);
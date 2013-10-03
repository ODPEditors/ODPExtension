(function() {

	//downloads the categories.txt and sends the result to the process that will split that file into multiples files
	this.categoriesTXTUpdateProcess = function(aDate, aTotalSize) {

		var timer = this.timer('categoriesTXTUpdateDownload')
			timer.start('all');

		var progress = this.progress('local.category.finder');
			progress.reset();
			progress.done = '0%';
			progress.running = '';
			progress.message = this.getString('local.category.finder') + ' : ' + this.getString('progress.download'); //%

		var stringCategories = this.getString('categories');

		//old folder
		this.fileRemove('categories.txt/');

		var aData = '';
		var ids = [];
		var currentID = 1;
		var count = 0;
		var iterations = 0;

		var unicodeConverter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
			unicodeConverter.charset = "UTF-8";
			unicodeConverter = unicodeConverter.ConvertToUnicode;

		var subStrCount = this.subStrCount;
		//timer.start('open database');
		var aConnection = this.rdfDatabaseOpen();
			//	aConnection = storageService.openSpecialDatabase('memory');//for tests, faster
			aConnection.executeSimple('PRAGMA temp_store = 2');
			aConnection.executeSimple('PRAGMA journal_mode = memory');
			aConnection.executeSimple('drop table if exists `categories_txt`');
			aConnection.executeSimple('	CREATE TABLE IF NOT EXISTS `categories_txt` ( `id` INTEGER PRIMARY KEY ASC  NOT NULL, `parent` INTEGER  NOT NULL, `category` TEXT NOT NULL, `name` TEXT  NOT NULL, `depth` INTEGER  NOT NULL)');
		var insertCategory = aConnection.aConnection.createStatement('INSERT INTO `categories_txt` ( `id`,`parent`,`category`,`name`,`depth`) VALUES ( :id,:parent, :category, :name, :depth )')
			aConnection.begin();
		//timer.stop('open database');

		function StreamListener(){ return this;}
		StreamListener.prototype = {

			onStartRequest :  function(aRequester, aContext) {
				//timer.start('downloading');
			},
			onDataAvailable :  function(aRequester, aContext, aInputStream, aOffset, aCount) {

				progress.done = Math.floor(100 * (aOffset / aTotalSize)) + '% - '+count+' '+stringCategories;
				progress.running = Math.floor((new Date() - timer.timers['all']['start'])/1000) + ' secs'
				progress.progress();

				var binInputStream = Components.classes["@mozilla.org/binaryinputstream;1"]
					.createInstance(Components.interfaces.nsIBinaryInputStream);
				binInputStream.setInputStream(aInputStream);
				aData += binInputStream.readBytes(binInputStream.available());
				binInputStream.close();

				var data = aData.trimLeft().split('\n');
				aData = data.pop();
				//timer.start('converting to utf8');
				data = unicodeConverter(data.join('\n')).split('\n')
				//timer.stop('converting to utf8');

				//timer.start('start insertion');
				var category, path, leaf, parent, params = insertCategory.params;
				for (var i = 0, total = data.length; i < total; i++) {
					category = data[i];
					if (!ids[category]) {
						count++;
						parent = category.split('/'), leaf = parent.pop(), parent = parent.join('/');
						if(!ids[parent])
							ids[parent] = currentID++;
						params['id'] = ids[category] = currentID++,
						params['parent'] = ids[parent],
						params['category'] = category + '/',
						params['name'] = leaf,
						params['depth'] = subStrCount(category, '/')+1,
						insertCategory.execute();
					}
				}
				//timer.stop('start insertion');
			},

			onStopRequest : function(aRequester, aContext, aStatusCode) {

				progress.progress();

				//timer.stop('downloading');

				//timer.start('converting to utf8');
				var data = unicodeConverter(aData).trim().split('\n');
				aData = null;
				//timer.stop('converting to utf8');

				//timer.start('start insertion');
				var category, parent, leaf, parent, params = insertCategory.params;
				for (var i = 0, total = data.length; i < total; i++) {
					category = data[i];
					if (!ids[category]) {
						count++;
						parent = category.split('/'), leaf = parent.pop(), parent = parent.join('/');
						if(!ids[parent])
							ids[parent] = currentID++;
						params['id'] = ids[category] = currentID++,
						params['parent'] = ids[parent],
						params['category'] = category + '/',
						params['name'] = leaf,
						params['depth'] = subStrCount(category, '/')+1,
						insertCategory.execute();
					}
				}
				//timer.stop('start insertion');

				ids = null;
				insertCategory.finalize();

				ODPExtension.gc();

				progress.done = '100% - '+count+' '+stringCategories;
				progress.running = Math.floor((new Date() - timer.timers['all']['start'])/1000) + ' secs'
				progress.progress();

				//timer.start('creating index');
				aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `parent` ON `categories_txt` (`parent`) ');
				aConnection.executeSimple('	CREATE UNIQUE INDEX IF NOT EXISTS `category` ON `categories_txt` (`category`) ');
				aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `name` ON `categories_txt` (`name`) ');
				aConnection.executeSimple('	CREATE INDEX IF NOT EXISTS `depth` ON `categories_txt` (`depth`) ');
				//timer.stop('creating index');

				//timer.start('commiting');
				aConnection.commit();
				//timer.stop('commiting');

				timer.stop('all');
				//timer.display();

				aChannel = null;

				ODPExtension.preferenceSet('locked.categories.txt.last.update', aDate);

				ODPExtension.shared.categories.txt.lock = false;

				ODPExtension.notifyTab(ODPExtension.getString('categories.txt.has.been.updated').replace('{DATE}', ODPExtension.preferenceGet('locked.categories.txt.last.update'))+' '+Math.floor((new Date() - timer.timers['all']['start'])/1000) + ' secs');

				progress.running = Math.floor((new Date() - timer.timers['all']['start'])/1000) + ' secs'
				progress.progress();
				progress.ok();

				ODPExtension.gc();

				ODPExtension.notifyFocused('preferencesLoadGlobal');
				ODPExtension.dispatchGlobalEvent('userInterfaceUpdate', ODPExtension.preferenceGet('enabled'))
			}
		}

		var aChannel = this.service('ios').newChannelFromURI(this.newURI('http://rdf.dmoz.org/rdf/categories.txt.gz'));
			aChannel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;

		var converterService = Components.classes["@mozilla.org/streamConverters;1"].getService(Components.interfaces.nsIStreamConverterService);
		var aConverter = converterService.asyncConvertData("gzip", "uncompressed", new StreamListener(), null);
			aChannel.asyncOpen(aConverter, null);
	}

	return null;

}).apply(ODPExtension);
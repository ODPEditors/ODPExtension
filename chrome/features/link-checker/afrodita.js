(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.afrodita = function() {

//LC

	this.dump('Creating database tables and statements...');

	var lc = this.linkCheckerDatabaseOpen();
		lc.begin();
		lc.executeSimple('	CREATE TABLE IF NOT EXISTS `uris`  ( `id` INTEGER PRIMARY KEY NOT NULL, `uri` TEXT NOT NULL DEFAULT "")');

//ALTER

	this.dump('Creating database tables and statements...');

		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `version` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}

		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `checked` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `processed` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `finished_loading` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}

		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `date_start` DATETIME NOT NULL DEFAULT "0000-00-00 00:00:00" ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `date_end` DATETIME NOT NULL DEFAULT "0000-00-00 00:00:00" ');}catch(e){}

		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `content_type` TEXT NOT NULL DEFAULT "" ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `check_type` TEXT NOT NULL DEFAULT "" ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `site_type` TEXT NOT NULL DEFAULT "" ');}catch(e){}

		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `hash` TEXT NOT NULL DEFAULT "" ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `match` TEXT NOT NULL DEFAULT "" ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `match_hash` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}

		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `domain` TEXT NOT NULL DEFAULT "" ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `domain_id` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `subdomain` TEXT NOT NULL DEFAULT "" ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `ip` TEXT NOT NULL DEFAULT "" ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `ns` TEXT NOT NULL DEFAULT "" ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `ids` TEXT NOT NULL DEFAULT "" ');}catch(e){}

		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `language` TEXT NOT NULL DEFAULT "" ');}catch(e){}

		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `word_count` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `media_count` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `frame_count` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `has_frameset` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `intrusive_popups` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `is_download` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}

		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `statuses` TEXT NOT NULL DEFAULT "" ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `status_delete` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `status_unreview` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `status_code` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `status_first` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `status_last` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `status_error` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}

		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `status_error_string` TEXT NOT NULL DEFAULT "" ');}catch(e){}

		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `status_suspicious` TEXT NOT NULL DEFAULT "" ');}catch(e){}

		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `meta_title` TEXT NOT NULL DEFAULT "" ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `meta_description` TEXT NOT NULL DEFAULT "" ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `uri_last` TEXT NOT NULL DEFAULT "" ');}catch(e){}

		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `links_internal_count` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `links_external_count` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `broken_included_content` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `broken_content_count` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `image_count` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `script_count` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}
		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `redirection_count` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}

		try{lc.executeSimple('ALTER TABLE `uris` ADD COLUMN `load_time` INTEGER NOT NULL DEFAULT 0 ');}catch(e){}

		this.dump('Creating field indexes...');

		//INDEX:
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `uri` ON `uris` (`uri`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `version` ON `uris` (`version`) ');

		lc.executeSimple('	CREATE UNIQUE INDEX IF NOT EXISTS `version` ON `uris` (`version`,`uri`) ');

		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `checked` ON `uris` (`checked`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `processed` ON `uris` (`processed`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `finished_loading` ON `uris` (`finished_loading`) ');

		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `date_start` ON `uris` (`date_start`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `date_end` ON `uris` (`date_end`) ');

		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `content_type` ON `uris` (`content_type`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `check_type` ON `uris` (`check_type`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `site_type` ON `uris` (`site_type`) ');

		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `hash` ON `uris` (`hash`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `match` ON `uris` (`match`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `match_hash` ON `uris` (`match_hash`) ');

		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `domain` ON `uris` (`domain`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `domain_id` ON `uris` (`domain_id`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `subdomain` ON `uris` (`subdomain`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `ip` ON `uris` (`ip`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `ns` ON `uris` (`ns`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `ids` ON `uris` (`ids`) ');

		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `language` ON `uris` (`language`) ');

		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `word_count` ON `uris` (`word_count`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `media_count` ON `uris` (`media_count`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `frame_count` ON `uris` (`frame_count`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `has_frameset` ON `uris` (`has_frameset`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `intrusive_popups` ON `uris` (`intrusive_popups`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `is_download` ON `uris` (`is_download`) ');

		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `statuses` ON `uris` (`statuses`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `status_delete` ON `uris` (`status_delete`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `status_unreview` ON `uris` (`status_unreview`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `status_code` ON `uris` (`status_code`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `status_first` ON `uris` (`status_first`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `status_last` ON `uris` (`status_last`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `status_error` ON `uris` (`status_error`) ');

		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `status_error_string` ON `uris` (`status_error_string`) ');

		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `status_suspicious` ON `uris` (`status_suspicious`) ');

		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `meta_title` ON `uris` (`meta_title`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `meta_description` ON `uris` (`meta_description`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `uri_last` ON `uris` (`uri_last`) ');

		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `links_internal_count` ON `uris` (`links_internal_count`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `links_external_count` ON `uris` (`links_external_count`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `broken_included_content` ON `uris` (`broken_included_content`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `broken_content_count` ON `uris` (`broken_content_count`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `image_count` ON `uris` (`image_count`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `script_count` ON `uris` (`script_count`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `redirection_count` ON `uris` (`redirection_count`) ');

		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `load_time` ON `uris` (`load_time`) ');

		lc.commit();

//IMPORTING URIS

		this.dump('Importing URIs for this RDF version...');

		var rdf = this.rdfDatabaseOpen();
		//rdf version
		var version = rdf.query('PRAGMA user_version');
		version = version.fetchObjects().user_version

		var select = rdf.query('select distinct(u.uri), u.domain_id from uris u ');
		var insert = lc.aConnection.createStatement(' insert or ignore into `uris` (`uri`,`domain_id`,`version`) values (:uri, :domain_id, :version)');

		var a = 0;
		lc.begin();
		while(row = select.fetchObjects()){
			insert.params['uri'] = row.uri;
			insert.params['domain_id'] = row.domain_id;
			insert.params['version'] = version;
			insert.execute();
		}
		lc.commit();

		ODPExtension.gc();

//LINK CHECK

		this._afrodita();

	}

	this._afrodita = function() {

		ODPExtension.gc();

			var lc = this.linkCheckerDatabaseOpen();

			var oRedirectionAlert = this.redirectionAlert();
			var select = lc.query(' select id, uri from uris where `checked` = 0 group by domain_id order by RANDOM() ');
			var update = lc.aConnection.createStatement(' update `uris` set `checked` = 1, \
			                                            			\
																	`finished_loading` = :finished_loading, \
																	 \
																	`date_start` = :date_start, \
																	`date_end` = :date_end, \
																	\
																	`content_type` = :content_type, \
																	`check_type` = :check_type, \
																	`site_type` = :site_type, \
																	\
																	`hash` = :hash, \
																	`match` = :match, \
																	`match_hash` = :match_hash, \
																	\
																	`domain` = :domain, \
																	`subdomain` = :subdomain, \
																	`ip` = :ip, \
																	`ns` = :ns, \
																	`ids` = :ids, \
																	\
																	`language` = :language, \
																	\
																	`word_count` = :word_count, \
																	`media_count` = :media_count, \
																	`frame_count` = :frame_count, \
																	`has_frameset` = :has_frameset, \
																	`intrusive_popups` = :intrusive_popups, \
																	`is_download` = :is_download, \
																	\
																	`statuses` = :statuses, \
																	`status_delete` = :status_delete, \
																	`status_unreview` = :status_unreview, \
																	`status_code` = :status_code, \
																	`status_first` = :status_first, \
																	`status_last` = :status_last, \
																	`status_error` = :status_error, \
																	\
																	`status_error_string` = :status_error_string, \
																	\
																	`status_suspicious` = :status_suspicious, \
																	\
																	`meta_title` = :meta_title, \
																	`meta_description` = :meta_description, \
																	`uri_last` = :uri_last, \
																	\
																	`links_internal_count` = :links_internal_count, \
																	`links_external_count` = :links_external_count, \
																	`broken_included_content` = :broken_included_content, \
																	`broken_content_count` = :broken_content_count, \
																	`image_count` = :image_count, \
																	`script_count` = :script_count, \
																	`redirection_count` = :redirection_count \
																	\
																	`load_time` = :load_time \
			 													where `uri` = :uri and `checked` = 0');

			var row;
			var progress = this.progress('link.cheker.' + oRedirectionAlert.id);
			progress.progress();

			while (row = select.fetchObjects()) {

				(function(id, uri) {
					progress.add();
					oRedirectionAlert.check(uri, function(aData, aURL) {
						progress.remove();
						progress.progress();

						update.params['finished_loading'] = aData.status.finishedLoading ? 1 : 0;

						update.params['date_start'] = aData.dateStart;
						update.params['date_end'] = aData.dateEnd;

						update.params['content_type'] = aData.contentType;
						update.params['check_type'] = aData.checkType;
						update.params['site_type'] = aData.siteType;

						update.params['hash'] = aData.hash;
						update.params['match'] = aData.hash;
						update.params['match_hash'] = aData.matchHash;

						update.params['domain'] = aData.domain;
						update.params['subdomain'] = aData.subdomain;
						update.params['ip'] = aData.ip;
						update.params['ns'] = aData.ns;
						update.params['ids'] =  aData.ids.join(',');

						update.params['language'] = aData.language;

						update.params['word_count'] = aData.wordCount;
						update.params['media_count'] = aData.mediaCount;
						update.params['frame_count'] = aData.frames;
						update.params['has_frameset'] = aData.hasFrameset;
						update.params['intrusive_popups'] = aData.intrusivePopups;
						update.params['is_download'] = aData.isDownload ? 1 : 0;

						update.params['statuses'] = aData.statuses.join(',');
						update.params['status_delete'] = aData.status.canDelete ? 1 : 0;
						update.params['status_unreview'] =  aData.status.canUnreview ? 1 : 0;
						update.params['status_code'] = aData.status.code;
						update.params['status_first'] = aData.statuses[0];
						update.params['status_last'] = aData.statuses[aData.statuses.length-1];
						update.params['status_error'] = aData.status.error ? 1 : 0;

						update.params['status_error_string'] = aData.status.errorString;

						update.params['status_suspicious'] = aData.status.suspicious.join('\n');

						update.params['meta_title'] = aData.title;
						update.params['meta_description'] = aData.metaDescription;
						update.params['uri_last'] = aData.urlLast;

						update.params['links_internal_count'] = aData.linksInternal.length;
						update.params['links_external_count'] = aData.linksExternal.length;

						var broken = 0;
						for(var id in aData.externalContent){
							if(aData.externalContent[id].status != 200)
								broken++
						}
						update.params['broken_included_content'] = Math.floor(100 * (broken/ aData.externalContent.length)) || 0;
						update.params['broken_content_count'] = broken;
						update.params['image_count'] = aData.imageCount;
						update.params['script_count'] = aData.scriptCount;
						update.params['redirection_count'] = aData.urlRedirections.length;

						update.params['load_time'] = ((ODPExtension.sqlDate(aData.dateEnd) - ODPExtension.sqlDate(aData.dateStart))/1000) || 0

						update.params['uri'] = uri;
						update.execute();
						aData = null
					});
				})(row.id, row.uri);
			}
	}

	//console.log('Tabs loading content: Tabs opened:'+gBrowser.tabContainer.childNodes.length)

//SELECT CONTNET contentTypes
/*
	var db = ODPExtension.rdfDatabaseOpen();
	var select = db.query(' select * from uris where `checked` = 1 order by id desc limit 20');

	var row, txt = '', site, count=0;
	while (row = select.fetchObjects()) {
		//site = JSON.parse(row.c_json);
		console.log(row);
	}*/

//update soa
/*
	var db = ODPExtension.rdfDatabaseOpen();
	var select = db.query('select distinct(u.domain_id), h.host from uris u, hosts h where u.c_checked = 1 and u.c_ns = "" and u.domain_id = h.id group by u.domain_id');
	var update = db.aConnection.createStatement(' update `uris` set `ns` = :c_ns where domain_id = :domain_id');

	while(row = select.fetchObjects()){
		var ns = ODPExtension.readURLAsync('http://localhost/mimizu/soa.php?host='+row.host);
		update.params['ns'] = ns;
		update.params['domain_id'] = row.domain_id;
		update.execute();
	}*/

/*


	//	 DE LOS HASHES ABRI TODOS LOS >= a 40

	//GROUP BY

		//all hashes not blacklisted
		SELECT distinct(c_hash), count(*) as total, uri, c_uri_last from uris u, categories c where c_checked = 1 and c_hash_ok = 0 and u.category_id = c.id and c.category glob "*Español*" group by c_hash order by total desc limit 1000

		//all ids
		SELECT distinct(ids), count(*) as total, uri, uri_last from uris  where checked = 1  group by ids order by total desc limit 1000

		//by status
		SELECT distinct(status_error_string), count(*) as total, uri, uri_last from uris  where checked = 1  group by status_error_string order by total desc limit 1000

		//check for framed redirects
		SELECT uri, c_uri_last from uris u, categories c where c_checked = 1 and u.category_id = c.id and c.category glob "*Español*" and c_hash = "a13e6f2bb4f1c652bf4229a6b0fe27af"

		//whitelist hash
		update uris set c_hash_ok = 1 where c_hash = "bee884663e65108218ffabc2a772c81a"

		//all name servers not blacklisted
		SELECT distinct(c_ns), count(*) as total, uri, c_uri_last from uris u where c_checked = 1 and c_list_white = 0 and c_list_black = 0 group by c_ns order by total desc limit 1000



	SELECT  count(*) as total from uris where c_checked = 1 and c_ns = ""

	SELECT  count(*) as total from uris where c_checked = 1 and c_ns = ""

	SELECT distinct(c_ids), count(*) as total, uri, c_uri_last from uris u, categories c where c.category glob "*Español*" and c.id = u.category_id group by c_ids order by total desc limit 100

	SELECT distinct(c_ids), count(*) as total, uri, c_uri_last from uris u, categories c where c.category glob "*Español*" and c.id = u.category_id group by c_ids order by total desc limit 100

*/

	this.afroditaPlay = function(){

		this.tabOpen('chrome://odpextension/content/features/SQLiteRAW/html/index.html');
	}

	return null;

}).apply(ODPExtension);
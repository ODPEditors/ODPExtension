(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.afroditaImportURLs = function() {

//LC

	this.dump('Creating database tables and statements...');

	var lc = this.afroditaDatabaseOpen();
		lc.begin();
		lc.executeSimple('	CREATE TABLE IF NOT EXISTS `uris`  ( \
							 `id` INTEGER PRIMARY KEY NOT NULL, \
							 `uri` TEXT NOT NULL DEFAULT "", \
							\
							`version` INTEGER NOT NULL DEFAULT 0 , \
							`subdomain_id` INTEGER NOT NULL DEFAULT 0 , \
							\
							`checked` INTEGER NOT NULL DEFAULT 0 , \
							`processed` INTEGER NOT NULL DEFAULT 0 , \
							`loading_success` INTEGER NOT NULL DEFAULT 0 , \
							\
							`date_start` DATETIME NOT NULL DEFAULT "0000-00-00 00:00:00" , \
							`date_end` DATETIME NOT NULL DEFAULT "0000-00-00 00:00:00" , \
							\
							`content_type` TEXT NOT NULL DEFAULT "" , \
							`check_type` TEXT NOT NULL DEFAULT "" , \
							`site_type` TEXT NOT NULL DEFAULT "" , \
							\
							`hash` TEXT NOT NULL DEFAULT "" , \
							`original_hash` TEXT NOT NULL DEFAULT "" , \
							`hash_body` TEXT NOT NULL DEFAULT "" , \
							`match` TEXT NOT NULL DEFAULT "" , \
							`match_hash` INTEGER NOT NULL DEFAULT 0 , \
							`domain` TEXT NOT NULL DEFAULT "" , \
							`subdomain` TEXT NOT NULL DEFAULT "" , \
							`ip` TEXT NOT NULL DEFAULT "" , \
							`ns` TEXT NOT NULL DEFAULT "" , \
							`ids` TEXT NOT NULL DEFAULT "" , \
							\
							`language` TEXT NOT NULL DEFAULT "" , \
							`headers` TEXT NOT NULL DEFAULT "" , \
							\
							`word_count` INTEGER NOT NULL DEFAULT 0 , \
							`str_length` INTEGER NOT NULL DEFAULT 0 , \
							`media_count` INTEGER NOT NULL DEFAULT 0 , \
							`frame_count` INTEGER NOT NULL DEFAULT 0 , \
							`has_frameset` INTEGER NOT NULL DEFAULT 0 , \
							`intrusive_popups` INTEGER NOT NULL DEFAULT 0 , \
							`is_download` INTEGER NOT NULL DEFAULT 0 , \
							\
							`statuses` TEXT NOT NULL DEFAULT "" , \
							`status_delete` INTEGER NOT NULL DEFAULT 0 , \
							`status_unreview` INTEGER NOT NULL DEFAULT 0 , \
							`status_code` INTEGER NOT NULL DEFAULT 0 , \
							`status_first` INTEGER NOT NULL DEFAULT 0 , \
							`status_last` INTEGER NOT NULL DEFAULT 0 , \
							`status_error` INTEGER NOT NULL DEFAULT 0 , \
							\
							`status_error_string` TEXT NOT NULL DEFAULT "" , \
							\
							`status_suspicious` TEXT NOT NULL DEFAULT "" , \
							\
							`meta_title` TEXT NOT NULL DEFAULT "" , \
							`meta_description` TEXT NOT NULL DEFAULT "" , \
							`meta_keywords` TEXT NOT NULL DEFAULT "" , \
							`meta_author` TEXT NOT NULL DEFAULT "" , \
							`meta_copyright` TEXT NOT NULL DEFAULT "" , \
							`meta_robots` TEXT NOT NULL DEFAULT "" , \
							`meta_generator` TEXT NOT NULL DEFAULT "" , \
							`uri_last` TEXT NOT NULL DEFAULT "" , \
							`uri_link_redirect` TEXT NOT NULL DEFAULT "" , \
							\
							`links_internal_count` INTEGER NOT NULL DEFAULT 0 , \
							`links_external_count` INTEGER NOT NULL DEFAULT 0 , \
							`included_total` INTEGER NOT NULL DEFAULT 0 , \
							`included_broken` INTEGER NOT NULL DEFAULT 0 , \
							`included_broken_count` INTEGER NOT NULL DEFAULT 0 , \
							`image_count` INTEGER NOT NULL DEFAULT 0 , \
							`script_count` INTEGER NOT NULL DEFAULT 0 , \
							`redirection_count` INTEGER NOT NULL DEFAULT 0 , \
							`rss_count` INTEGER NOT NULL DEFAULT 0 , \
							`atom_count` INTEGER NOT NULL DEFAULT 0 , \
							`hash_known` INTEGER NOT NULL DEFAULT 0 , \
							\
							`load_time` INTEGER NOT NULL DEFAULT 0,  \
							`bayes` TEXT NOT NULL DEFAULT ""  \
						 )');
	//alter table uris add column `hash_body` TEXT NOT NULL DEFAULT ""

	this.dump('Creating database tables and statements...');

		this.dump('Creating field indexes...');

		//INDEX:
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `uri` ON `uris` (`uri`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `version` ON `uris` (`version`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `subdomain_id` ON `uris` (`subdomain_id`) ');

		lc.executeSimple('	CREATE UNIQUE INDEX IF NOT EXISTS `uri_version` ON `uris` (`uri`,`version`) ');
		lc.executeSimple('	CREATE UNIQUE INDEX IF NOT EXISTS `uri_subdomain_id_version` ON `uris` (`uri`,`subdomain_id`,`version`) ');

		lc.commit();

//IMPORTING URIS

		this.dump('Importing URIs for this RDF version...');

		var rdf = this.rdfDatabaseOpen();
		//rdf version
		var version = rdf.query('PRAGMA user_version');
		version = version.fetchObjects().user_version

		var select = rdf.query('select distinct(u.uri), u.subdomain_id from uris u, categories c where c.id = u.category_id and (c.category glob "Computers/Programming/*" or c.category glob "Computers/Software/*" or c.category glob "Reference/Libraries/Library_and_Information_Science/*")');

		var insert = lc.aConnection.createStatement(' insert or ignore into `uris` (`uri`,`subdomain_id`,`version`) values (:uri, :subdomain_id, :version)');

		var a = 0;
		lc.begin();
		var row
		while(row = select.fetchObjects()){
			insert.params['uri'] = row.uri;
			insert.params['subdomain_id'] = row.subdomain_id;
			insert.params['version'] = version;
			insert.execute();
		}
		lc.commit();

		this.dump('Importing done...');

		ODPExtension.gc();

		lc.begin();

		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `checked` ON `uris` (`checked`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `processed` ON `uris` (`processed`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `loading_success` ON `uris` (`loading_success`) ');

		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `date_start` ON `uris` (`date_start`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `date_end` ON `uris` (`date_end`) ');

		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `content_type` ON `uris` (`content_type`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `check_type` ON `uris` (`check_type`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `site_type` ON `uris` (`site_type`) ');

		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `hash` ON `uris` (`hash`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `match` ON `uris` (`match`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `match_hash` ON `uris` (`match_hash`) ');

		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `domain` ON `uris` (`domain`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `subdomain` ON `uris` (`subdomain`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `ip` ON `uris` (`ip`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `ns` ON `uris` (`ns`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `ids` ON `uris` (`ids`) ');

		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `language` ON `uris` (`language`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `headers` ON `uris` (`headers`) ');

		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `word_count` ON `uris` (`word_count`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `str_length` ON `uris` (`str_length`) ');
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
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `meta_keywords` ON `uris` (`meta_keywords`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `meta_author` ON `uris` (`meta_author`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `meta_copyright` ON `uris` (`meta_copyright`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `meta_robots` ON `uris` (`meta_robots`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `meta_generator` ON `uris` (`meta_generator`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `uri_last` ON `uris` (`uri_last`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `uri_link_redirect` ON `uris` (`uri_link_redirect`) ');

		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `links_internal_count` ON `uris` (`links_internal_count`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `links_external_count` ON `uris` (`links_external_count`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `included_total` ON `uris` (`included_total`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `included_broken` ON `uris` (`included_broken`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `included_broken_count` ON `uris` (`included_broken_count`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `image_count` ON `uris` (`image_count`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `script_count` ON `uris` (`script_count`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `redirection_count` ON `uris` (`redirection_count`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `rss_count` ON `uris` (`rss_count`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `atom_count` ON `uris` (`atom_count`) ');

		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `load_time` ON `uris` (`load_time`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `bayes` ON `uris` (`bayes`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `hash_known` ON `uris` (`hash_known`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `original_hash` ON `uris` (`original_hash`) ');
		lc.executeSimple('	CREATE INDEX IF NOT EXISTS `hash_body` ON `uris` (`hash_body`) ');

		lc.commit();

		this.dump('Done...');

	}

	this.afroditaContinue = function() {

		var uris = [];
		this.afroditaGetASAP(uris)
		this.afroditaGetQueue(uris)

		this._afroditaContinue(uris)
	}
	this.afroditaContinueASAP = function() {

		var uris = [];
		this.afroditaGetASAP(uris)
		this._afroditaContinue(uris)
	}

	this.afroditaGetASAP = function(uris) {

		var lc = this.afroditaDatabaseOpen(), row;

		// must check asap
		var select = lc.query(' select uri from uris where `checked` = 3 order by RANDOM() limit 150000 ');
		while (row = select.fetchObjects()) {
			uris[uris.length] = row.uri
		}
		select.finalize();

	}
	this.afroditaGetQueue = function(uris) {

		var lc = this.afroditaDatabaseOpen(), row;

		//queue
		var select = lc.query(' select distinct(subdomain_id), uri from uris where `checked` = 0 group by subdomain_id order by RANDOM() limit 150000 ');
		while (row = select.fetchObjects()) {
			uris[uris.length] = row.uri
		}
		select.finalize();
	}

	this._afroditaContinue = function(uris){

		var oRedirectionAlert = this.redirectionAlert();
		var lc = this.afroditaDatabaseOpen();
		var update = lc.aConnection.createStatement(' update `uris` set `checked` = 1, \
																\
																`loading_success` = :loading_success, \
																 \
																`date_start` = :date_start, \
																`date_end` = :date_end, \
																\
																`content_type` = :content_type, \
																`check_type` = :check_type, \
																`site_type` = :site_type, \
																\
																`hash` = :hash, \
																`original_hash` = :original_hash, \
																`hash_body` = :hash_body, \
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
																`headers` = :headers, \
																\
																`word_count` = :word_count, \
																`str_length` = :str_length, \
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
																`meta_keywords` = :meta_keywords, \
																`meta_author` = :meta_author, \
																`meta_copyright` = :meta_copyright, \
																`meta_robots` = :meta_robots, \
																`meta_generator` = :meta_generator, \
																`uri_last` = :uri_last, \
																`uri_link_redirect` = :uri_link_redirect, \
																\
																`links_internal_count` = :links_internal_count, \
																`links_external_count` = :links_external_count, \
																`included_total` = :included_total, \
																`included_broken` = :included_broken, \
																`included_broken_count` = :included_broken_count, \
																`image_count` = :image_count, \
																`script_count` = :script_count, \
																`redirection_count` = :redirection_count, \
																`rss_count` = :rss_count, \
																`atom_count` = :atom_count, \
																`hash_known` = :hash_known, \
																\
																`load_time` = :load_time \
															where `uri` = :uri ');

		function updateEntry(aData, aURL) {

			update.params['loading_success'] = aData.loadingSuccess ? 1 : 0;

			update.params['date_start'] = aData.dateStart;
			update.params['date_end'] = aData.dateEnd;

			update.params['content_type'] = aData.contentType;
			update.params['check_type'] = aData.checkType;
			update.params['site_type'] = aData.siteType;

			update.params['hash'] = aData.hash;
			update.params['original_hash'] = aData.hashOriginal;
			update.params['hash_body'] = aData.hashBody;
			update.params['match'] = aData.status.match;
			update.params['hash_known'] = aData.hashKnown || 0;
			update.params['match_hash'] = aData.status.matchHash ? 1 : 0;

			update.params['domain'] = aData.domain;
			update.params['subdomain'] = aData.subdomain;
			update.params['ip'] = aData.ip;
			update.params['ns'] = aData.ns;
			update.params['ids'] =  aData.ids.join(',');

			update.params['language'] = aData.language;
			update.params['headers'] = aData.headers;

			update.params['word_count'] = aData.wordCount;
			update.params['str_length'] = aData.strLength;
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
			update.params['meta_keywords'] = aData.metaKeywords;
			update.params['meta_author'] = aData.metaAuthor;
			update.params['meta_copyright'] = aData.metaCopyright;
			update.params['meta_robots'] = aData.metaRobots;
			update.params['meta_generator'] = aData.metaGenerator;
			update.params['uri_last'] = aData.urlLast;
			if( (aData.linksInternal.length + aData.linksExternal.length) == 1){
				if(aData.linksInternal.length)
					update.params['uri_link_redirect'] = aData.linksInternal[0].url;
				else
					update.params['uri_link_redirect'] = aData.linksExternal[0].url;
			} else {
				update.params['uri_link_redirect'] = '';
			}

			update.params['links_internal_count'] = aData.linksInternal.length;
			update.params['links_external_count'] = aData.linksExternal.length;

			var broken = 0;
			for(var i in aData.externalContent){
				if(aData.externalContent[i].status != 200)
					broken++
			}

			update.params['included_total'] = aData.externalContent.length;
			update.params['included_broken'] = Math.floor(100 * (broken/ aData.externalContent.length));
			update.params['included_broken_count'] = broken;
			update.params['image_count'] = aData.imageCount;
			update.params['script_count'] = aData.scriptCount;
			update.params['redirection_count'] = aData.urlRedirections.length;
			update.params['rss_count'] = aData.metaRSS.length;
			update.params['atom_count'] = aData.metaAtom.length;

			update.params['load_time'] = aData.loadTime

			update.params['uri'] = aURL;
			update.executeAsync();

			aData = null
		}
		for(var a=0;a<uris.length;a++) {
			oRedirectionAlert.check(String(uris[a]), updateEntry);
		}
	}

	this.afroditaOpen = function(){

		this.tabOpen('chrome://odpextension/content/features/SQLiteRAW/html/index.html');
	}

	return null;

}).apply(ODPExtension);
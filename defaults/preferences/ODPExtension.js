//EXTENSION

	pref('extensions.development@dmoz.org.description', 'chrome://ODPExtension/locale/js.properties');
	pref('extensions.ODPExtension.extension.directory', '');
	pref('extensions.ODPExtension.storage', '');//an alternative storage for a huge amount of files, valid value absolute as "drive:/folder"

//TOGGLES

	pref('extensions.ODPExtension.enabled', true);
	pref('extensions.ODPExtension.first.run', false);
	pref('extensions.ODPExtension.last.enabled', true);
	pref('extensions.ODPExtension.toolbars.toggle', false);

//PREFERENCES

	pref('extensions.ODPExtension.preferences.font.size', '13');

///LINKCHECKER

	pref('extensions.ODPExtension.link.checker.threads', 8);
	pref('extensions.ODPExtension.link.checker.use.cache', true);
	pref('extensions.ODPExtension.link.checker.generate.graph', false);
	pref('extensions.ODPExtension.link.checker.hidden.tabs', true);
	pref('extensions.ODPExtension.link.checker.cache.result', false);
	pref('extensions.ODPExtension.link.checker.watching.period', 3000);
	pref('extensions.ODPExtension.link.checker.grace.period', 6000);
	pref('extensions.ODPExtension.link.checker.timeout', 80000);
	pref('extensions.ODPExtension.link.checker.cache.use.cache.for.result', false);

//USER INTERFACE - DONE

	//FAST ADD - DONE
		pref('extensions.ODPExtension.ui.fast.add.panel.closed', true);


	//CONTEXT MENU - DONE

		pref('extensions.ODPExtension.ui.context.menu.translate', true);
		pref('extensions.ODPExtension.ui.context.menu.guess.language', false);
		pref('extensions.ODPExtension.ui.context.menu.word.reference', true);
		pref('extensions.ODPExtension.ui.context.menu.url.tools', true);
		pref('extensions.ODPExtension.ui.context.menu.frame.selected', true);
		pref('extensions.ODPExtension.ui.context.menu.frames', true);

	//FROM CATEGORY

		pref('extensions.ODPExtension.ui.from.category.auto', false);

		pref('extensions.ODPExtension.ui.context.menu.from.category', true);
		pref('extensions.ODPExtension.ui.context.menu.from.category.in.tab.context.menu', true);
		pref('extensions.ODPExtension.ui.context.menu.from.categories', true);
		pref('extensions.ODPExtension.ui.context.menu.from.editor', true);
		pref('extensions.ODPExtension.ui.context.menu.from.editors', true);

	//INFORMATIVE PANEL - DONE

		pref('extensions.ODPExtension.ui.informative.panel', true);
		pref('extensions.ODPExtension.ui.informative.panel.closed', false);
		pref('extensions.ODPExtension.ui.informative.panel.r', 50);
		pref('extensions.ODPExtension.ui.informative.panel.b', 90);
		pref('extensions.ODPExtension.ui.informative.panel.url', true);
		pref('extensions.ODPExtension.ui.informative.panel.title', true);
		pref('extensions.ODPExtension.ui.informative.panel.description', true);
		pref('extensions.ODPExtension.ui.informative.panel.categories.titles.urls', true);
		pref('extensions.ODPExtension.ui.informative.panel.categories.align.left', false);
		pref('extensions.ODPExtension.ui.informative.panel.urlbar', false);

//PRIVACY - DONE

	pref('extensions.ODPExtension.privacy.queries.exclude.domains' , '*.block-all-subdomains-of-this-domain.org%0Ablock-this-domain.org');
	pref('extensions.ODPExtension.privacy.queries.exclude.strings' , 'email%3D%0Asomething else...');
	pref('extensions.ODPExtension.privacy.queries.exclude.ips', false);
	pref('extensions.ODPExtension.privacy.queries.exclude.https', true);
	pref('extensions.ODPExtension.privacy.no.referrer', true);
	pref('extensions.ODPExtension.privacy.private.browsing.on', true);

//URL TOOLS - DONE

	pref('extensions.ODPExtension.url.tools.urls', '--Archive%0AWeb%20Archive%20URL%7Chttp%3A%2F%2Fweb.archive.org%2F%7BURL%7D%0AWeb%20Archive%20domain%7Chttp%3A%2F%2Fweb.archive.org%2F%7BWWW_DOMAIN%7D%0AWeb%20Archive%20owner%20domain%7Chttp%3A%2F%2Fweb.archive.org%2F%7BOWNER_DOMAIN%7D%0A-%0AGoogle%20cache%20URL%7Chttp%3A%2F%2Fwebcache.googleusercontent.com%2Fsearch%3Fq%3Dcache%3A%7BURL%7CE%7D%0AGoogle%20cache%20domain%7Chttp%3A%2F%2Fwebcache.googleusercontent.com%2Fsearch%3Fq%3Dcache%3A%7BSCHEMA%7CE%7D%7BWWW_DOMAIN%7CE%7D%0A%0A-%0A--Search%0AFind%20domain%20in%20ODP%7Chttp%3A%2F%2Fwww.dmoz.org%2Fsearch%3Febuttons%3D1%26q%3D%7BDOMAIN%7D%0AHighligh%20all%20links%20listed%20on%20the%20directory%7Ccommand_highlightListings%0A-%0AGoogle%20site%20search%7Chttp%3A%2F%2Fgoogle.com%2Fsearch%3Fq%3D%7BASK%7D%2520site%253A%7BSCHEMA%7CE%7D%7BWWW_DOMAIN%7CE%7D%0AGoogle%20site%20search%20in%20this%20folder%7Chttps%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3D%7BASK%7D%2520site%253A%7BURL_LAST_FOLDER%7CE%7D%0AGoogle%20site%20search%20in%20root%20folder%7Chttps%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3D%7BASK%7D%2520site%253A%7BURL_FIRST_FOLDER%7CE%7D%0A%0A-%0A--Whois%0Adomaintools.com%7Chttp%3A%2F%2Fwhois.domaintools.com%2F%7BWWW_DOMAIN%7D%0A.es%7Chttp%3A%2F%2Fwww.esreg.com%2Fwhois.php%3Fdomain%3D%7BWWW_DOMAIN%7D%0A%0A-%0A--URL%20Utilities%0ALink%20mining%20in%20overdrive%7Chttp%3A%2F%2Fpmoz.info%2Fpickaxe.php5%3Furl%3D%7BURL%7D%26MineIt%3DMine%2Bpage%26starturl%3D%26maxurls%3D%0A-%0AShow%20page%20with%20URLY%7Chttp%3A%2F%2Fpmoz.info%2Furly.php5%3Furl%3D%7BURL%7D%0AShow%20headers%20w3.org%7Chttp%3A%2F%2Fcgi.w3.org%2Fcgi-bin%2Fheaders%3Furl%3D%7BURL%7D%0A-%0ACheck%20the%20HTTP%20Status%20of%20links%7Ccommand_checkHTTPStatus');

//URL NOTES - DONE

	pref('extensions.ODPExtension.url.notes.update', 'Correcting%20URL%20from%20%7BURL%7D%20to%20%7BNEW_URL%7D%0ACorrecting%20redirect%20from%20%7BURL%7D%20to%20%7BNEW_URL%7D%0ACorrecting%20the%20%20spelling.%0ACorrecting%20the%20title.%0AProcessing%20red%20site.%20Site%20works.%0AProcessing%20red%2C%20site%20loads%20slowly%20but%20load.%0ARemoving%20inappropriate%20caps%20from%20the%20description.%0ARemoving%20promotional%20language%20from%20the%20description%0ARemoving%20site%20title%20from%20the%20description.%20(there%20is%20no%20need%20to%20repeat%20the%20title%20in%20the%20description)');
	pref('extensions.ODPExtension.url.notes.unreview', 'Content%20not%20found%0AParked.%0ASite%20contains%20errors.');
	pref('extensions.ODPExtension.url.notes.delete', 'Affiliate%20of%20%7BASK%7D%0AAffiliate.%0ADuplicate%20already%20listed%20on%20relevant%20category%20%7BALREADY_IN%7D%0ADuplicate%20already%20listed.%0ADuplicate%20already%20pending%20review.%0AIrrelevant%20deep%20link.%0ANot%20enough%20content.%0ASite%20has%20no%20content.%0ASite%20no%20longer%20exists%20and%20not%20replacement%20found.%0ASite%20password%20protected%2C%20%20not%20replacement%20found.');
	pref('extensions.ODPExtension.url.notes.copy', 'Building%20a%20mock-up%20category%20on%20test%2Fbookmarks.%0ABuilding%20a%20new%20category.%0ACopying%20to%20regional%20branch%0ACopying%20to%20topic%20branch');
	pref('extensions.ODPExtension.url.notes.move', 'Moving%20to%20relevant%20category.%0ANo%20regional%20content%2C%20moving%20to%20topic.%0ASite%20has%20regional%20content%2C%20moving%20to%20the%20appropriated%20region.');
	pref('extensions.ODPExtension.url.notes.form.submit', true);
	pref('extensions.ODPExtension.url.notes.form.submit.confirm', true);

//ADVANCED - DONE

	//pref('extensions.ODPExtension.advanced.urls.word.reference', 'http%3A%2F%2Fbuscon.rae.es%2FdraeI%2FSrvltGUIBusUsual%3FLEMA%3D%7BSELECTED_TEXT%7D%26TIPO_BUS%3D3%26submit%3DConsultar%0Ahttp%3A%2F%2Fen.wikipedia.org%2Fwiki%2F%7BSELECTED_TEXT%7D%0Ahttp%3A%2F%2Fes.wikipedia.org%2Fwiki%2F%7BSELECTED_TEXT%7D%0Ahttp%3A%2F%2Ffr.wikipedia.org%2Fwiki%2F%7BSELECTED_TEXT%7D%0Ahttp%3A%2F%2Fit.wikipedia.org%2Fwiki%2F%7BSELECTED_TEXT%7D%0Ahttp%3A%2F%2Fru.wikipedia.org%2Fwiki%2F%7BSELECTED_TEXT%7D');
	pref('extensions.ODPExtension.advanced.urls.odp.private.no.referrer', '');
	pref('extensions.ODPExtension.advanced.urls.rdf', '');
	pref('extensions.ODPExtension.locked.categories.txt.last.update', 'Never');

	pref('extensions.ODPExtension.ui.show.ip', true);


//languages display - ALL DONE
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.ca', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.zh-CN', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.zh-TW', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.da', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.nl', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.en', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.fr', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.de', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.it', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.ja', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.pl', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.ru', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.es', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.sv', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.tr', false);

pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.af', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.sq', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.ar', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.be', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.bg', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.hr', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.cs', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.et', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.tl', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.fi', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.gl', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.el', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.ht', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.iw', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.hi', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.hu', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.is', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.id', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.ga', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.ko', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.lv', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.lt', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.mk', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.ms', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.mt', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.no', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.fa', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.pt', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.ro', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.sr', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.sk', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.sl', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.sw', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.th', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.uk', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.vi', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.cy', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.yi', false);
pref('extensions.ODPExtension.me', true);

//EXTENSION 

	pref('extensions.development@dmoz.org.description', 'chrome://ODPExtension/locale/js.properties');
	pref('extensions.ODPExtension.last.db.backup', '');
	pref('extensions.ODPExtension.version', '3.130816.56');
	pref('extensions.ODPExtension.extension.directory', '');

//TOGGLES

	pref('extensions.ODPExtension.enabled', true);
	pref('extensions.ODPExtension.last.enabled', true);
	pref('extensions.ODPExtension.toolbars.toggle', false);

//PREFERENCES

	pref('extensions.ODPExtension.preferences.font.size', '13');
	

//USER INTERFACE - DONE

	//ICON POSITION - DONE
	
		pref('extensions.ODPExtension.ui.icon.position.status.bar', false);
		pref('extensions.ODPExtension.ui.icon.position.no.icon', false);
		pref('extensions.ODPExtension.ui.icon.position.location.bar', true);
		
	//ICON CLICKS - DONE
		//CLICK
			pref('extensions.ODPExtension.event.click.icon.left.single', 'copyLocation');
			pref('extensions.ODPExtension.event.click.icon.left.single.ctrl', 'copyLocationPHPBB');
			pref('extensions.ODPExtension.event.click.icon.left.single.shift', 'copyLocationHTML');
			pref('extensions.ODPExtension.event.click.icon.left.single.alt', '');
	
			pref('extensions.ODPExtension.event.click.icon.middle.single', 'domainSiteSE');
			pref('extensions.ODPExtension.event.click.icon.middle.single.ctrl', '');
			pref('extensions.ODPExtension.event.click.icon.middle.single.shift', '');
			pref('extensions.ODPExtension.event.click.icon.middle.single.alt', '');
	
			pref('extensions.ODPExtension.event.click.icon.right.single', 'openDContextMenu');
			pref('extensions.ODPExtension.event.click.icon.right.single.ctrl', '');
			pref('extensions.ODPExtension.event.click.icon.right.single.shift', '');
			pref('extensions.ODPExtension.event.click.icon.right.single.alt', '');
			
		//DOUBLE CLICK						 
			pref('extensions.ODPExtension.event.click.icon.left.double', 'domainSiteODP');
			pref('extensions.ODPExtension.event.click.icon.left.double.ctrl', '');
			pref('extensions.ODPExtension.event.click.icon.left.double.shift', '');
			pref('extensions.ODPExtension.event.click.icon.left.double.alt', '');
	
			pref('extensions.ODPExtension.event.click.icon.middle.double', '');
			pref('extensions.ODPExtension.event.click.icon.middle.double.ctrl', '');
			pref('extensions.ODPExtension.event.click.icon.middle.double.shift', '');
			pref('extensions.ODPExtension.event.click.icon.middle.double.alt', '');
	
			pref('extensions.ODPExtension.event.click.icon.right.double', 'highlightListings');
			pref('extensions.ODPExtension.event.click.icon.right.double.ctrl', '');
			pref('extensions.ODPExtension.event.click.icon.right.double.shift', '');
			pref('extensions.ODPExtension.event.click.icon.right.double.alt', '');

	//CONTEXT MENU - DONE

		pref('extensions.ODPExtension.ui.context.menu.translate', true);
		pref('extensions.ODPExtension.ui.context.menu.translate.menu.not.in.sub', false);
		pref('extensions.ODPExtension.ui.context.menu.translate.menu.in.sub', false);
		pref('extensions.ODPExtension.ui.context.menu.translate.menu.in.sub.if.to.many', true);
		pref('extensions.ODPExtension.ui.context.menu.translate.menu.in.sub.if.to.many.is', 3);

		pref('extensions.ODPExtension.ui.context.menu.word.reference', true);
		pref('extensions.ODPExtension.ui.context.menu.url.tools', true);
		pref('extensions.ODPExtension.ui.context.menu.frame.selected', true);
		pref('extensions.ODPExtension.ui.context.menu.frames', true);
		
	//FROM CATEGORY

		pref('extensions.ODPExtension.ui.from.category.auto', false);
		pref('extensions.ODPExtension.ui.from.category.selected.array.unique', true);
		pref('extensions.ODPExtension.ui.from.category.selected.array.sort', true);
	
		pref('extensions.ODPExtension.ui.context.menu.from.category', true);
		pref('extensions.ODPExtension.ui.context.menu.from.category.in.tab.context.menu', true);
		pref('extensions.ODPExtension.ui.context.menu.from.categories', true);
		pref('extensions.ODPExtension.ui.context.menu.from.editor', true);
		pref('extensions.ODPExtension.ui.context.menu.from.editors', true);

	//INFORMATIVE PANEL - DONE

		pref('extensions.ODPExtension.ui.informative.panel', true);
		pref('extensions.ODPExtension.ui.informative.panel.closed', false);
		pref('extensions.ODPExtension.ui.informative.panel.x', -390);
		pref('extensions.ODPExtension.ui.informative.panel.y', -51);
		pref('extensions.ODPExtension.ui.informative.panel.url', true);
		pref('extensions.ODPExtension.ui.informative.panel.title', true);
		pref('extensions.ODPExtension.ui.informative.panel.description', true);
		pref('extensions.ODPExtension.ui.informative.panel.categories.titles.urls', true);
		pref('extensions.ODPExtension.ui.informative.panel.categories.align.left', false);

	//PAGES STYLES

		pref('extensions.ODPExtension.ui.forum.pages.custom.nicknames', false);
		pref('extensions.ODPExtension.ui.forum.pages.show.inactive', false);
		pref('extensions.ODPExtension.ui.forum.pages.show.newbies', false);
		
	//CSS editor pages
	
		pref('extensions.ODPExtension.forms.css', true);

	//scratch pad
	
		pref('extensions.ODPExtension.scratch.pad', 'This is the "ODP scratch pad" \n\nHere you can save any text that will be maintained in sync between browser windows and after browser restart.\n\nSometimes may fail so don\'t trust it to much');

//PRIVACY - DONE

	pref('extensions.ODPExtension.privacy.queries.exclude.domains' , '*.block-all-subdomains-of-this-domain.org%0Ablock-this-domain.org');
	pref('extensions.ODPExtension.privacy.queries.exclude.strings' , 'email%3D');
	pref('extensions.ODPExtension.privacy.queries.exclude.ips', false);
	pref('extensions.ODPExtension.privacy.queries.exclude.https', true);
	pref('extensions.ODPExtension.privacy.no.referrer', true);
	pref('extensions.ODPExtension.privacy.private.browsing.on', true);
	
	//LISTINGS BEHAVIOR
		//METHOD
		pref('extensions.ODPExtension.privacy.listing.method.url', false);
		pref('extensions.ODPExtension.privacy.listing.method.domain', false);
		pref('extensions.ODPExtension.privacy.listing.method.none', true);
		//WHEN
		pref('extensions.ODPExtension.privacy.listing.when.location', true);
		pref('extensions.ODPExtension.privacy.listing.when.click', false);
	
//CATEGORY ABBREVIATIONS - DONE
	
	pref('extensions.ODPExtension.category.abbreviation.find', 'Arts%2F%0ABusiness%2F%0AComputers%2F%0AGames%2F%0AHealth%2F%0AHome%2F%0ANews%2F%0ARecreation%2F%0AReference%2F%0AScience%2F%0AShopping%2F%0ASociety%2F%0ASports%2F%0AAdult%2F%0A%2FOpen_Directory_Project%0AKids_and_Teens%2F%0ARegional%2F%0ABookmarks%2F%0AWorld_Test%2F%0ATest%2F%0AUnited_States%2F%0ANorth_America%2F%0AInternet%2F%0AIndustries%2F%0A%2FBusiness_and_Economy%0ALocalities%2F%0A%2FComputers_and_Internet%0AGovernment%2F%0ADevelopment%0ASearch_Engines%0A%2FCiencia_y_tecnolog%C3%ADa%0A%2FComputaci%C3%B3n_e_Internet%0A%2FDeportes_y_tiempo_libre%0A%2FEconom%C3%ADa_y_negocios%0A%2FGu%C3%ADas_y_directorios%0A%2FNoticias_y_medios%0A%2FViajes_y_turismo%0A%2FMedios_de_comunicaci%C3%B3n%0A%2FArgentina%0A%2FBolivia%0A%2FChile%0A%2FColombia%0A%2FCosta_Rica%0A%2FCuba%0A%2FEcuador%0A%2FEspa%C3%B1a%0A%2FEstados_Unidos%0A%2FGuatemala%0A%2FGuinea_Ecuatorial%0A%2FHonduras%0A%2FM%C3%A9xico%0A%2FNicaragua%0A%2FPanam%C3%A1%0A%2FParaguay%0A%2FPer%C3%BA%0A%2FPuerto_Rico%0A%2FEl_Salvador%0A%2FUruguay%0A%2FVenezuela%0A%2FDepartamentos%0A%2FProvincias%0A%2FAm%C3%A9rica%0A%2FEuropa%0A%2FGobierno%0A%2FEducaci%C3%B3n%0A%2FUniversidades%0A%2FFacultades_y_Escuelas%0A%2FSoftware%0A%2FEducation');
	pref('extensions.ODPExtension.category.abbreviation.replace', 'Art%2F%0ABus%2F%0AC%2F%0AG%2F%0AHe%2F%0AHo%2F%0AN%2F%0ARec%2F%0ARef%2F%0ASci%2F%0ASh%2F%0ASoc%2F%0ASp%2F%0AAd%2F%0A%2FODP%0AK%26T%2F%0AR%2F%0AB%2F%0AWT%2F%0AT%2F%0AUSA%2F%0ANA%2F%0AI%2F%0AInd%2F%0A%2FB%26E%0ALoc%2F%0A%2FComp%26Int%0AGov%2F%0ADev%0ASE%0A%2FCyT%0A%2FCeI%0A%2FD%26TL%0A%2FEyN%0A%2FGyD%0A%2FNyM%0A%2FVyT%0A%2FMdC%0A%2FAR%0A%2FBO%0A%2FCL%0A%2FCO%0A%2FCR%0A%2FCU%0A%2FEC%0A%2FES%0A%2FUSA%0A%2FGT%0A%2FGQ%0A%2FHN%0A%2FMX%0A%2FNI%0A%2FPA%0A%2FPY%0A%2FPE%0A%2FPR%0A%2FSV%0A%2FUY%0A%2FVE%0A%2FDptos%0A%2FProv%0A%2FAm%C3%A9%0A%2FEur%0A%2FGob%0A%2FEDU%0A%2FUniver%0A%2FFyE%0A%2FSoft%0A%2FEDU');

//CATEGORY BROWSER - DONE

	pref('extensions.ODPExtension.category.browser', 'World%2FCatal%C3%A0%0AWorld%2FDansk%0AWorld%2FDeutsch%0AWorld%2FEspa%C3%B1ol%0AWorld%2FFran%C3%A7ais%0AWorld%2FItaliano%0AWorld%2FJapanese%0AWorld%2FPortugu%C3%AAs%0AWorld%2FRussian%0AWorld%2FSvenska%0AWorld%2FT%C3%BCrk%C3%A7e');
	
//MISCELANEA - DONE

	pref('extensions.ODPExtension.ui.abbreviate.category.names', true);


//URL TOOLS - DONE

	pref('extensions.ODPExtension.url.tools.urls', '--Archive%0AWeb%20Archive%20URL%7Chttp%3A%2F%2Fweb.archive.org%2Fweb%2F*%2F%7BURL%7D%0AWeb%20Archive%20domain%7Chttp%3A%2F%2Fweb.archive.org%2Fweb%2F*%2F%7BWWW_DOMAIN%7D%0AWeb%20Archive%20owner%20domain%7Chttp%3A%2F%2Fweb.archive.org%2Fweb%2F*%2F%7BOWNER_DOMAIN%7D%0A-%0AGoogle%20cache%20URL%7Chttp%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3Dcache%253A%7BURL%7CE%7D%0AGoogle%20cache%20domain%7Chttp%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3Dcache%253A%7BSCHEMA%7CE%7D%7BWWW_DOMAIN%7CE%7D%0A%0A-%0A--Search%0AFind%20domain%20in%20ODP%7Chttp%3A%2F%2Fsearch.dmoz.org%2Fcgi-bin%2Fsearch%3Febuttons%3D1%26search%3D%7BDOMAIN%7D%0AHighligh%20all%20links%20listed%20on%20the%20directory%7Ccommand_highlightListings%0A-%0AGoogle%20site%20search%7Chttp%3A%2F%2Fgoogle.com%2Fsearch%3Fq%3D%7BASK%7D%2520site%253A%7BSCHEMA%7CE%7D%7BWWW_DOMAIN%7CE%7D%0AGoogle%20site%20search%20in%20this%20folder%7Chttp%3A%2F%2Fgoogle.com%2Fsearch%3Fq%3D%7BASK%7D%2520site%253A%7BURL_LAST_FOLDER%7CE%7D%0AGoogle%20site%20search%20in%20root%20folder%7Chttp%3A%2F%2Fgoogle.com%2Fsearch%3Fq%3D%7BASK%7D%2520site%253A%7BURL_FIRST_FOLDER%7CE%7D%0A%0A-%0A--Whois%0Adomaintools.com%7Chttp%3A%2F%2Fwhois.domaintools.com%2F%7BWWW_DOMAIN%7D%0A.es%7Chttp%3A%2F%2Fwww.esreg.com%2Fwhois.php%3Fdomain%3D%7BWWW_DOMAIN%7D%0A%0A-%0A--URL%20Utilities%0AGuess%20Language%20zaphod%7Chttp%3A%2F%2Fodp.dlugan.com%2Fzaphod.cgi%3Furl%3D%7BURL%7D%0ALink%20mining%20in%20overdrive%7Chttp%3A%2F%2Fpmoz.info%2Fpickaxe.php5%3Furl%3D%7BURL%7D%26MineIt%3DMine%2Bpage%26starturl%3D%26maxurls%3D%0A-%0AShow%20page%20with%20URLY%7Chttp%3A%2F%2Fpmoz.info%2Furly.php5%3Furl%3D%7BURL%7D%0AShow%20headers%20w3.org%7Chttp%3A%2F%2Fcgi.w3.org%2Fcgi-bin%2Fheaders%3Furl%3D%7BURL%7D%0A-%0ACheck%20the%20HTTP%20Status%20of%20links%7Ccommand_checkHTTPStatus');

//URL NOTES - DONE
	
	pref('extensions.ODPExtension.url.notes.update', 'Correcting%20URL%20from%20%7BURL%7D%20to%20%7BNEW_URL%7D%0ACorrecting%20redirect%20from%20%7BURL%7D%20to%20%7BNEW_URL%7D%0ACorrecting%20the%20%20spelling.%0ACorrecting%20the%20title.%0AProcessing%20red%20site.%20Site%20works.%0AProcessing%20red%2C%20site%20loads%20slowly%20but%20load.%0ARemoving%20inappropriate%20caps%20from%20the%20description.%0ARemoving%20promotional%20language%20from%20the%20description%0ARemoving%20site%20title%20from%20the%20description.%20(there%20is%20no%20need%20to%20repeat%20the%20title%20in%20the%20description)');
	pref('extensions.ODPExtension.url.notes.unreview', 'Content%20not%20found%0AParked.%0ASite%20contains%20errors.');
	pref('extensions.ODPExtension.url.notes.delete', 'Affiliate%20of%20%7BASK%7D%0AAffiliate.%0ADuplicate%20already%20listed%20on%20relevant%20category%20%7BALREADY_IN%7D%0ADuplicate%20already%20listed.%0ADuplicate%20already%20pending%20review.%0AIrrelevant%20deep%20link.%0ANot%20enough%20content.%0ASite%20has%20no%20content.%0ASite%20no%20longer%20exists%20and%20not%20replacement%20found.%0ASite%20password%20protected%2C%20%20not%20replacement%20found.');
	pref('extensions.ODPExtension.url.notes.copy', 'Building%20a%20mock-up%20category%20on%20test%2Fbookmarks.%0ABuilding%20a%20new%20category.%0ACopying%20to%20regional%20branch%0ACopying%20to%20topic%20branch');
	pref('extensions.ODPExtension.url.notes.move', 'Moving%20to%20relevant%20category.%0ANo%20regional%20content%2C%20moving%20to%20topic.%0ASite%20has%20regional%20content%2C%20moving%20to%20the%20appropriated%20region.');
	pref('extensions.ODPExtension.url.notes.form.submit', true);
	pref('extensions.ODPExtension.url.notes.form.submit.confirm', true);

//ADVANCED - DONE

	pref('extensions.ODPExtension.advanced.urls.word.reference', 'http%3A%2F%2Fbuscon.rae.es%2FdraeI%2FSrvltGUIBusUsual%3FLEMA%3D%7BSELECTED_TEXT%7D%26TIPO_BUS%3D3%26submit%3DConsultar%0Ahttp%3A%2F%2Fen.wikipedia.org%2Fwiki%2F%7BSELECTED_TEXT%7D%0Ahttp%3A%2F%2Fes.wikipedia.org%2Fwiki%2F%7BSELECTED_TEXT%7D%0Ahttp%3A%2F%2Ffr.wikipedia.org%2Fwiki%2F%7BSELECTED_TEXT%7D%0Ahttp%3A%2F%2Fit.wikipedia.org%2Fwiki%2F%7BSELECTED_TEXT%7D%0Ahttp%3A%2F%2Fru.wikipedia.org%2Fwiki%2F%7BSELECTED_TEXT%7D');
	pref('extensions.ODPExtension.advanced.urls.odp.private.no.referrer', '%5E%5Ba-z%5D%2B%5C%3A%2F%2B(%5B%5E%2F%5D%2B)%3F%5C.%3F(editors%7Cforums%7Cresearch%7Cbeta%7Crdf%7Ctools%7Cpassport)%5C.dmoz%5C.org%2F%0A%5E%5Ba-z%5D%2B%5C%3A%2F%2B(%5B%5E%2F%5D%2B)%3F%5C.%3Fodp%5C.danielmclean%5C.id%5C.au%2F%0A%5E%5Ba-z%5D%2B%5C%3A%2F%2B(%5B%5E%2F%5D%2B)%3F%5C.%3Fodp%5C.dlugan%5C.com%2F%0A%5E%5Ba-z%5D%2B%5C%3A%2F%2B(%5B%5E%2F%5D%2B)%3F%5C.%3Fodp%5C.jtlabs%5C.net%2F%0A%5E%5Ba-z%5D%2B%5C%3A%2F%2B(%5B%5E%2F%5D%2B)%3F%5C.%3Fodp%5C.tubert%5C.org%2F%0A%5E%5Ba-z%5D%2B%5C%3A%2F%2B(%5B%5E%2F%5D%2B)%3F%5C.%3Fpmoz%5C.info%2F%0A%5E%5Ba-z%5D%2B%5C%3A%2F%2B(%5B%5E%2F%5D%2B)%3F%5C.%3Frobert%5C.mathmos%5C.net%2Fodp%2F%0A%5E%5Ba-z%5D%2B%5C%3A%2F%2B(%5B%5E%2F%5D%2B)%3F%5C.%3Frpfuller%5C.com%2F%0A%5E%5Ba-z%5D%2B%5C%3A%2F%2B(%5B%5E%2F%5D%2B)%3F%5C.%3Frpfuller%5C.org%2F');
	pref('extensions.ODPExtension.advanced.urls.rdf', '');
	pref('extensions.ODPExtension.last.rdf.update', 'Never');
	pref('extensions.ODPExtension.advanced.urls.domain.explorer', 'http%3A%2F%2Fsiteexplorer.search.yahoo.com%2Fsearch%3Fp%3D%7BSCHEMA%7D%7BWWW_DOMAIN%7D%0Ahttp%3A%2F%2Fwww.bing.com%2Fsearch%3Fq%3Dsite%253A%7BWWW_DOMAIN%7D%0Ahttp%3A%2F%2Fwww.google.com%2Fsearch%3Fsafe%3Doff%26q%3Dsite%253A%7BWWW_DOMAIN%7D');
	pref('extensions.ODPExtension.advanced.urls.categories.txt', 'http%3A%2F%2Frdf.dmoz.org%2Frdf%2Fcategories.txt');
	pref('extensions.ODPExtension.locked.advanced.urls.categories.txt.last.update', 'Never');
	
	pref('extensions.ODPExtension.advanced.use.private.odp.when.posible', true);
	pref('extensions.ODPExtension.advanced.use.power.extensions', true);
	pref('extensions.ODPExtension.advanced.categories.txt.auto.update', true);
	pref('extensions.ODPExtension.locked.advanced.local.category.finder.last.selected', 'Arts.txt');
	
	pref('extensions.ODPExtension.single.key.command', false);


//TAB BEHAVIOR - done

	pref('extensions.ODPExtension.tab.behavior.translate.tab.new.tab', true);
	pref('extensions.ODPExtension.tab.behavior.translate.tab.new.window', false);
	pref('extensions.ODPExtension.tab.behavior.translate.tab.selected', true);
	pref('extensions.ODPExtension.tab.behavior.translate.tab.sub.browser', true);
	pref('extensions.ODPExtension.tab.behavior.translate.tab.sub.browser.position', 'L');

	pref('extensions.ODPExtension.tab.behavior.informative.panel.tab.new.tab', true);
	pref('extensions.ODPExtension.tab.behavior.informative.panel.tab.new.window', false);
	pref('extensions.ODPExtension.tab.behavior.informative.panel.tab.selected', false);
	pref('extensions.ODPExtension.tab.behavior.informative.panel.tab.sub.browser', false);
	pref('extensions.ODPExtension.tab.behavior.informative.panel.tab.sub.browser.position', 'L');

	pref('extensions.ODPExtension.tab.behavior.frame.from.menu.tab.new.tab', true);
	pref('extensions.ODPExtension.tab.behavior.frame.from.menu.tab.new.window', false);
	pref('extensions.ODPExtension.tab.behavior.frame.from.menu.tab.selected', true);
	pref('extensions.ODPExtension.tab.behavior.frame.from.menu.tab.sub.browser', false);
	pref('extensions.ODPExtension.tab.behavior.frame.from.menu.tab.sub.browser.position', 'L');

	pref('extensions.ODPExtension.tab.behavior.frame.selected.tab.new.tab', true);
	pref('extensions.ODPExtension.tab.behavior.frame.selected.tab.new.window', false);
	pref('extensions.ODPExtension.tab.behavior.frame.selected.tab.selected', true);
	pref('extensions.ODPExtension.tab.behavior.frame.selected.tab.sub.browser', false);
	pref('extensions.ODPExtension.tab.behavior.frame.selected.tab.sub.browser.position', 'L');

	pref('extensions.ODPExtension.tab.behavior.odp.search.tab.new.tab', true);
	pref('extensions.ODPExtension.tab.behavior.odp.search.tab.new.window', false);
	pref('extensions.ODPExtension.tab.behavior.odp.search.tab.selected', true);
	pref('extensions.ODPExtension.tab.behavior.odp.search.tab.sub.browser', true);
	pref('extensions.ODPExtension.tab.behavior.odp.search.tab.sub.browser.position', 'B');

	pref('extensions.ODPExtension.tab.behavior.domain.site.tab.new.tab', true);
	pref('extensions.ODPExtension.tab.behavior.domain.site.tab.new.window', false);
	pref('extensions.ODPExtension.tab.behavior.domain.site.tab.selected', false);
	pref('extensions.ODPExtension.tab.behavior.domain.site.tab.sub.browser', false);
	pref('extensions.ODPExtension.tab.behavior.domain.site.tab.sub.browser.position', 'L');

	pref('extensions.ODPExtension.tab.behavior.url.tools.tab.new.tab', true);
	pref('extensions.ODPExtension.tab.behavior.url.tools.tab.new.window', false);
	pref('extensions.ODPExtension.tab.behavior.url.tools.tab.selected', false);
	pref('extensions.ODPExtension.tab.behavior.url.tools.tab.sub.browser', false);
	pref('extensions.ODPExtension.tab.behavior.url.tools.tab.sub.browser.position', 'L');

	pref('extensions.ODPExtension.tab.behavior.word.reference.tab.new.tab', false);
	pref('extensions.ODPExtension.tab.behavior.word.reference.tab.new.window', false);
	pref('extensions.ODPExtension.tab.behavior.word.reference.tab.selected', false);
	pref('extensions.ODPExtension.tab.behavior.word.reference.tab.sub.browser', true);
	pref('extensions.ODPExtension.tab.behavior.word.reference.tab.sub.browser.position', 'L');

//languages display - ALL DONE
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.ca', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.zh-CN', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.zh-TW', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.da', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.nl', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.en', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.fr', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.de', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.it', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.ja', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.pl', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.ru', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.es', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.sv', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.tr', true);
			
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.af', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.sq', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.ar', true);
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
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.hi', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.hu', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.is', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.id', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.ga', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.ko', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.lv', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.lt', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.mk', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.ms', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.mt', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.no', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.fa', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.pt', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.ro', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.sr', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.sk', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.sl', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.sw', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.th', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.uk', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.vi', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.cy', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.display.yi', false);

//languages priority
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.ca', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.zh-CN', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.zh-TW', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.da', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.nl', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.en', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.fr', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.de', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.it', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.ja', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.pl', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.ru', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.es', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.sv', true);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.tr', true);
			
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.af', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.sq', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.ar', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.be', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.bg', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.hr', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.cs', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.et', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.tl', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.fi', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.gl', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.el', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.ht', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.iw', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.hi', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.hu', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.is', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.id', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.ga', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.ko', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.lv', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.lt', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.mk', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.ms', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.mt', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.no', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.fa', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.pt', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.ro', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.sr', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.sk', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.sl', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.sw', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.th', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.uk', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.vi', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.cy', false);
pref('extensions.ODPExtension.ui.context.menu.translate.lang.priority.yi', false);
(function() {
	//sets the preferences for this extension

	this.preferences.menuList = [

		'preferences.font.size'
	];

	this.preferences.radios = [
	];

	this.preferences.ints = [
		'ui.informative.panel.r', //DONE
		'ui.informative.panel.b', //DONE
		'link.checker.threads'
	];

	this.preferences.colors = [];
	this.preferences.strings = [
		'extension.directory', //DONE
		'advanced.urls.rdf', //DONE
		'locked.categories.txt.last.update', //DONE
		'url.tools.urls' //DONE
	];
	this.preferences.stringsMultiline = [

	];
	this.preferences.stringsMultilineSort = [

		//'advanced.urls.word.reference', //DONE
		'advanced.urls.odp.private.no.referrer', //DONE

		'privacy.queries.exclude.domains', //DONE
		'privacy.queries.exclude.strings', //DONE

		'url.notes.update',
		'url.notes.unreview',
		'url.notes.delete',
		'url.notes.copy',
		'url.notes.move'
	];

	this.preferences.bools = [
		//extension - DONE
		'enabled',
		'first.run',
		'last.enabled',
		'toolbars.toggle',

		//link checker
		'link.checker.use.cache',
		'link.checker.generate.graph',
		'link.checker.hidden.tabs',

		//privacy - DONE
		'privacy.no.referrer',
		'privacy.queries.exclude.ips',
		'privacy.queries.exclude.https',
		'privacy.private.browsing.on',

		//context menu - DONE
		'ui.context.menu.guess.language',
		'ui.context.menu.word.reference',
		'ui.context.menu.url.tools',
		'ui.context.menu.frame.selected',
		'ui.context.menu.frames',

		//from menus - DONE
		'ui.context.menu.from.category',
		'ui.context.menu.from.category.in.tab.context.menu',
		'ui.context.menu.from.categories',
		'ui.context.menu.from.editor',
		'ui.context.menu.from.editors',

		//informative panel - DONE
		'ui.informative.panel',
		'ui.informative.panel.closed',
		'ui.informative.panel.categories.titles.urls',
		'ui.informative.panel.categories.align.left',
		'ui.informative.panel.url',
		'ui.informative.panel.title',
		'ui.informative.panel.description',
		'ui.informative.panel.urlbar',

		//miscelanea - DONE
		'ui.from.category.auto',

		//url notes - DONE
		'url.notes.form.submit',
		'url.notes.form.submit.confirm',

		//languages - ALL DONE
		'ui.context.menu.translate',
		//languages display
		'ui.context.menu.translate.lang.display.ca',
		'ui.context.menu.translate.lang.display.zh-CN',
		'ui.context.menu.translate.lang.display.zh-TW',
		'ui.context.menu.translate.lang.display.da',
		'ui.context.menu.translate.lang.display.nl',
		'ui.context.menu.translate.lang.display.en',
		'ui.context.menu.translate.lang.display.fr',
		'ui.context.menu.translate.lang.display.de',
		'ui.context.menu.translate.lang.display.it',
		'ui.context.menu.translate.lang.display.ja',
		'ui.context.menu.translate.lang.display.pl',
		'ui.context.menu.translate.lang.display.ru',
		'ui.context.menu.translate.lang.display.es',
		'ui.context.menu.translate.lang.display.sv',
		'ui.context.menu.translate.lang.display.tr',

		'ui.context.menu.translate.lang.display.af',
		'ui.context.menu.translate.lang.display.sq',
		'ui.context.menu.translate.lang.display.ar',
		'ui.context.menu.translate.lang.display.be',
		'ui.context.menu.translate.lang.display.bg',
		'ui.context.menu.translate.lang.display.hr',
		'ui.context.menu.translate.lang.display.cs',
		'ui.context.menu.translate.lang.display.et',
		'ui.context.menu.translate.lang.display.tl',
		'ui.context.menu.translate.lang.display.fi',
		'ui.context.menu.translate.lang.display.gl',
		'ui.context.menu.translate.lang.display.el',
		'ui.context.menu.translate.lang.display.ht',
		'ui.context.menu.translate.lang.display.iw',
		'ui.context.menu.translate.lang.display.hi',
		'ui.context.menu.translate.lang.display.hu',
		'ui.context.menu.translate.lang.display.is',
		'ui.context.menu.translate.lang.display.id',
		'ui.context.menu.translate.lang.display.ga',
		'ui.context.menu.translate.lang.display.ko',
		'ui.context.menu.translate.lang.display.lv',
		'ui.context.menu.translate.lang.display.lt',
		'ui.context.menu.translate.lang.display.mk',
		'ui.context.menu.translate.lang.display.ms',
		'ui.context.menu.translate.lang.display.mt',
		'ui.context.menu.translate.lang.display.no',
		'ui.context.menu.translate.lang.display.fa',
		'ui.context.menu.translate.lang.display.pt',
		'ui.context.menu.translate.lang.display.ro',
		'ui.context.menu.translate.lang.display.sr',
		'ui.context.menu.translate.lang.display.sk',
		'ui.context.menu.translate.lang.display.sl',
		'ui.context.menu.translate.lang.display.sw',
		'ui.context.menu.translate.lang.display.th',
		'ui.context.menu.translate.lang.display.uk',
		'ui.context.menu.translate.lang.display.vi',
		'ui.context.menu.translate.lang.display.cy',
		'ui.context.menu.translate.lang.display.yi',
		'me'

	];

	/*
			examples of listeners for preferenes

			//called when the "form" (window/dialog/xul) was filled with all the preferences
			this.addListener('onPreferencesFilled', function(){alert('the preferences form was filled!')});

			//called when the preferences were applied to the shared object "pref" and NOT to setBoolPref, setIntPref..
			//clean user input, do stuff, don't save the preference is not the intention ( apply is preview )
		*/

	this.addListener('onPreferencesApplied', function() {
		//dispatch to focused window (global)
		ODPExtension.notifyFocused('preferencesLoadGlobal');

		//dispatch to all the windows (local)
		ODPExtension.dispatchGlobalEvent('preferencesLoadLocal');
		ODPExtension.dispatchGlobalEvent('onLocationChangeNotDocumentLoad', '');
		ODPExtension.dispatchGlobalEvent('onLocationChange', '');
		ODPExtension.dispatchGlobalEvent('userInterfaceUpdate', ODPExtension.preferenceGet('enabled'))
	});

	//called when the preferences were saved to the shared object "pref" and to setBoolPref, setIntPref..
	//clean user input, do stuff, re-save modified preferences
	this.addListener('onPreferencesSaved', function() {
		//dispatch to focused window (global)
		ODPExtension.notifyFocused('preferencesLoadGlobal');

		//dispatch to all the windows (local)
		ODPExtension.dispatchGlobalEvent('preferencesLoadLocal');
		ODPExtension.dispatchGlobalEvent('onLocationChangeNotDocumentLoad', '');
		ODPExtension.dispatchGlobalEvent('onLocationChange', '');
		ODPExtension.dispatchGlobalEvent('userInterfaceUpdate', ODPExtension.preferenceGet('enabled'))
	});

	//called when the preferences observer notices a change in a preference, usually by about:config modification
	//or when the user modified a preferences by some menuitem or something, BUT not by the preference window
	this.addListener('onPreferenceSet', function(aName, aValue) {
		//dispatch to focused window (global)
		ODPExtension.notifyFocused('preferencesLoadGlobal');

		//dispatch to all the windows (local)
		ODPExtension.dispatchGlobalEvent('preferencesLoadLocal');
		ODPExtension.dispatchGlobalEvent('onLocationChangeNotDocumentLoad', '');
		ODPExtension.dispatchGlobalEvent('onLocationChange', '');
		ODPExtension.dispatchGlobalEvent('userInterfaceUpdate', ODPExtension.preferenceGet('enabled'))

		if (aName == 'enabled')
			ODPExtension.notifyInstances('checkListeners');
	});

	//when the window or dialog that holds the preferences is closed this event is fired
	this.addListener('onPreferencesWindowClosed', function() {
		//dispatch to focused window (global)
		ODPExtension.notifyFocused('preferencesLoadGlobal');

		//dispatch to all the windows (local)
		ODPExtension.dispatchGlobalEvent('preferencesLoadLocal');
		ODPExtension.dispatchGlobalEvent('onLocationChangeNotDocumentLoad', '');
		ODPExtension.dispatchGlobalEvent('onLocationChange', '');
		ODPExtension.dispatchGlobalEvent('userInterfaceUpdate', ODPExtension.preferenceGet('enabled'))
	});

	return null;

}).apply(ODPExtension);
(function()
{
		//sets the preferences for this extension

			this.preferences.menuList = [

										//EVENTS - ALL DONE

											 'event.click.icon.left.single',
											 'event.click.icon.left.single.ctrl',
											 'event.click.icon.left.single.shift',
											 'event.click.icon.left.single.alt',

											 'event.click.icon.middle.single',
											 'event.click.icon.middle.single.ctrl',
											 'event.click.icon.middle.single.shift',
											 'event.click.icon.middle.single.alt',

											 'event.click.icon.right.single',
											 'event.click.icon.right.single.ctrl',
											 'event.click.icon.right.single.shift',
											 'event.click.icon.right.single.alt',

											 'event.click.icon.left.double',
											 'event.click.icon.left.double.ctrl',
											 'event.click.icon.left.double.shift',
											 'event.click.icon.left.double.alt',

											 'event.click.icon.middle.double',
											 'event.click.icon.middle.double.ctrl',
											 'event.click.icon.middle.double.shift',
											 'event.click.icon.middle.double.alt',

											 'event.click.icon.right.double',
											 'event.click.icon.right.double.ctrl',
											 'event.click.icon.right.double.shift',
											 'event.click.icon.right.double.alt',

											'preferences.font.size'
										 ];

			this.preferences.radios = [

										'privacy.listing.method.url',//DONE
										'privacy.listing.method.domain',//DONE
										'privacy.listing.method.none',//DONE

										'privacy.listing.when.location',//DONE
										'privacy.listing.when.click'//DONE
									   ];

			this.preferences.ints = [
									 'ui.informative.panel.x',//DONE
									 'ui.informative.panel.y',//DONE
									 'link.checker.threads',
									 'link.checker.use.cache'
									];

			this.preferences.colors = [];
			this.preferences.strings = [

										'extension.directory',//DONE
										'advanced.urls.rdf',//DONE
										'advanced.urls.categories.txt',//DONE
										'locked.advanced.urls.categories.txt.last.update',//DONE
										'locked.advanced.local.category.finder.last.selected',//DONE
										'last.rdf.update',//DONE
										'url.tools.urls'//DONE
										];
			this.preferences.stringsMultiline = [



												 ];
			this.preferences.stringsMultilineSort = [

													 'advanced.urls.word.reference',//DONE
													 'advanced.urls.odp.private.no.referrer',//DONE
													 'advanced.urls.domain.explorer',//DONE

													 'privacy.queries.exclude.domains',//DONE
													 'privacy.queries.exclude.strings',//DONE

													 'url.notes.update',
													 'url.notes.unreview',
													 'url.notes.delete',
													 'url.notes.copy',
													 'url.notes.move'
													 ];

			this.preferences.bools = [
									  	//extension - DONE
											'enabled',
											'last.enabled',
											'toolbars.toggle',
											'single.key.command',

										//privacy - DONE
											'privacy.no.referrer',
											'privacy.queries.exclude.ips',
											'privacy.queries.exclude.https',
											'privacy.private.browsing.on',

										//context menu - DONE
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

										//forums
											'ui.forum.pages.custom.nicknames',

										//informative panel - DONE
											'ui.informative.panel',
											'ui.informative.panel.closed',
											'ui.informative.panel.categories.titles.urls',
											'ui.informative.panel.categories.align.left',
											'ui.informative.panel.url',
											'ui.informative.panel.title',
											'ui.informative.panel.description',

										//miscelanea - DONE
											'ui.from.category.auto',
											'ui.from.category.selected.array.unique',//hidden pref
											'ui.from.category.selected.array.sort',//hidden pref

										//url notes - DONE

											'url.notes.form.submit',
											'url.notes.form.submit.confirm',

										//forms css

											'forms.css',

										//tab behavior - DONE

											//informative.panel
											'tab.behavior.informative.panel.tab.new.tab',
											'tab.behavior.informative.panel.tab.new.window',
											'tab.behavior.informative.panel.tab.selected',
											//translate
											'tab.behavior.translate.tab.new.tab',
											'tab.behavior.translate.tab.new.window',
											'tab.behavior.translate.tab.selected',
											//frame from menu
										 	'tab.behavior.frame.from.menu.tab.new.tab',
										 	'tab.behavior.frame.from.menu.tab.new.window',
										 	'tab.behavior.frame.from.menu.tab.selected',
											//frame selected
										 	'tab.behavior.frame.selected.tab.new.tab',
										 	'tab.behavior.frame.selected.tab.new.window',
										 	'tab.behavior.frame.selected.tab.selected',
											//odp search
										 	'tab.behavior.odp.search.tab.new.tab',
										 	'tab.behavior.odp.search.tab.new.window',
										 	'tab.behavior.odp.search.tab.selected',
											//url tools
										 	'tab.behavior.url.tools.tab.new.tab',
										 	'tab.behavior.url.tools.tab.new.window',
										 	'tab.behavior.url.tools.tab.selected',
											//word reference
										 	'tab.behavior.word.reference.tab.new.tab',
										 	'tab.behavior.word.reference.tab.new.window',
										 	'tab.behavior.word.reference.tab.selected',
											//domain site
										 	'tab.behavior.domain.site.tab.new.tab',
										 	'tab.behavior.domain.site.tab.new.window',
										 	'tab.behavior.domain.site.tab.selected',

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
											'ui.context.menu.translate.lang.display.yi'

									];

		/*
			examples of listeners for preferenes

			//called when the "form" (window/dialog/xul) was filled with all the preferences
			this.addListener('onPreferencesFilled', function(){alert('the preferences form was filled!')});

			//called when the preferences were applied to the shared object "pref" and NOT to setBoolPref, setIntPref..
			//clean user input, do stuff, don't save the preference is not the intention ( apply is preview )
		*/

			this.addListener('onPreferencesApplied', function()
															{
																//dispatch to focused window (global)
																ODPExtension.notifyFocused('preferencesLoadGlobal');

																//dispatch to all the windows (local)
																ODPExtension.notifyInstances('preferencesLoadLocal');
																ODPExtension.notifyInstances('dispatchOnLocationChange', true);
																ODPExtension.notifyInstances('userInterfaceUpdate');
															});

			//called when the preferences were saved to the shared object "pref" and to setBoolPref, setIntPref..
			//clean user input, do stuff, re-save modified preferences
			this.addListener('onPreferencesSaved', function()
															{
																//dispatch to focused window (global)
																ODPExtension.notifyFocused('preferencesLoadGlobal');

																//dispatch to all the windows (local)
																ODPExtension.notifyInstances('preferencesLoadLocal');
																ODPExtension.notifyInstances('dispatchOnLocationChange', true);
																ODPExtension.notifyInstances('userInterfaceUpdate');

															});

			//called when the preferences observer notices a change in a preference, usually by about:config modification
			//or when the user modified a preferences by some menuitem or something, BUT not by the preference window
			this.addListener('onPreferenceSet', function(aName, aValue)
														{
																//dispatch to focused window (global)
																ODPExtension.notifyFocused('preferencesLoadGlobal');

																//dispatch to all the windows (local)
																ODPExtension.notifyInstances('preferencesLoadLocal');
																ODPExtension.notifyInstances('dispatchOnLocationChange', true);
																ODPExtension.notifyInstances('userInterfaceUpdate');

																if(aName=='enabled')
																	ODPExtension.notifyInstances('checkListeners');

														});

			//when the window or dialog that holds the preferences is closed this event is fired
			this.addListener('onPreferencesWindowClosed', function()
														{
																//dispatch to focused window (global)
																ODPExtension.notifyFocused('preferencesLoadGlobal');

																//dispatch to all the windows (local)
																ODPExtension.notifyInstances('preferencesLoadLocal');
																ODPExtension.notifyInstances('dispatchOnLocationChange', true);
																ODPExtension.notifyInstances('userInterfaceUpdate');


														});

	return null;

}).apply(ODPExtension);

(function() {
	//
	this.fromCategoryCommand = function() {
		this.getElement('category-browser').hidePopup();

		var aCommand = this.fromCategoryAction;

		this.fromCategoryAction = '';

		var aCategories = [];

		if (this.fromCategoryClickType == 'single')
			aCategories[aCategories.length] = this.fromCategorySelectedCategory;
		else {
			aCategories = this.fromCategorySelectedCategories;
			/*if(aCategories[0].length == 0)
					{
						this.error("fromCategoryClickType 'multiple' expected 'single'.");
					}*/
		}

		if (this.preferenceGet('ui.from.category.selected.array.unique'))
			aCategories = this.arrayUnique(aCategories);
		if (this.preferenceGet('ui.from.category.selected.array.sort'))
			aCategories = aCategories.sort(this.sortLocale);

		//this.dump('fromCategoryCommand:aCommand:'+aCommand);
		//this.dump('fromCategoryCommand:aValue:'+aCategories);

		var inSelectedTab = (aCategories.length == 1);

		//add site
		if (aCommand == 'add-site') {
			this.openURL('http://www.dmoz.org/editors/editurl/add?url=' + this.encodeUTF8(this.fromCategorySecondaryValue) + '&cat=' + this.encodeUTF8(aCategories[0]), true, false, true);
			return;
		}
		//url notes
		else if (aCommand == 'url-notes-copy-unreview') {
			this.odpURLNotesApply(null, 'copy.unreview', this.fromCategorySecondaryValue, this.documentGetFocused(), aCategories[0]);
			return;
		} else if (aCommand == 'url-notes-copy-publish') {
			this.odpURLNotesApply(null, 'copy.publish', this.fromCategorySecondaryValue, this.documentGetFocused(), aCategories[0]);
			return;
		} else if (aCommand == 'url-notes-move-unreview') {
			this.odpURLNotesApply(null, 'move.unreview', this.fromCategorySecondaryValue, this.documentGetFocused(), aCategories[0]);
			return;
		} else if (aCommand == 'url-notes-move-publish') {
			this.odpURLNotesApply(null, 'move.publish', this.fromCategorySecondaryValue, this.documentGetFocused(), aCategories[0]);
			return;
		}
		//editors
		if (aCommand == 'command_editor_feedback') {
			if (this.fromCategoryClickType == 'single') {
				if (this.fromEditorSelectedEditor == '') {
					this.fromEditorSelectedEditor = this.prompt(this.getString('editor.enter'));
					if (this.fromEditorSelectedEditor == '')
						return;
				}
				this.openURL('http://www.dmoz.org/editors/manage/sendemail?to=' + this.fromEditorSelectedEditor, true, false, true);
			} else {
				if (this.fromEditorSelectedEditors.length == 0) {
					this.fromEditorSelectedEditor = this.prompt(this.getString('editor.enter'));
					if (this.fromEditorSelectedEditor == '')
						return;
					else
						this.fromEditorSelectedEditors[this.fromEditorSelectedEditors.length] = this.fromEditorSelectedEditor;
				}
				this.openURL('http://www.dmoz.org/editors/manage/sendemail?to=' + (this.fromEditorSelectedEditors.join('+')), true, false, true);
			}
			return;
		} else if (aCommand == 'command_editor_log_new_editors') {
			this.openURL('http://www.dmoz.org/editors/log/search?cat=&editor=&type=all&function=queue_granteditor', true, false, inSelectedTab);
			return;
		}

		if (
			aCommand == 'command_editor_profile_editor' ||
			aCommand == 'command_editor_profile_public' ||
			aCommand == 'command_editor_log_summary' ||
			aCommand == 'command_editor_log_detail' ||
			aCommand == 'command_editor_log_request' ||
			aCommand == 'command_editor_log_cool' ||
			aCommand == 'command_editor_log_new_cat' ||
			aCommand == 'command_editor_log_del_cat' ||
			aCommand == 'command_editor_tool_arwen') {
			var editors = [];
			if (this.fromCategoryClickType == 'single') {
				if (this.fromEditorSelectedEditor == '') {
					this.fromEditorSelectedEditor = this.prompt(this.getString('editor.enter'));
					if (this.fromEditorSelectedEditor == '')
						return;
				}

				editors[editors.length] = this.fromEditorSelectedEditor;
			} else {
				if (this.fromEditorSelectedEditors.length == 0) {
					this.fromEditorSelectedEditor = this.prompt(this.getString('editor.enter'));
					if (this.fromEditorSelectedEditor == '')
						return;
					else
						this.fromEditorSelectedEditors[this.fromEditorSelectedEditors.length] = this.fromEditorSelectedEditor;
				}
				editors = this.fromEditorSelectedEditors;
			}

			for (var id in editors) {
				if (aCommand == 'command_editor_profile_editor')
					this.openURL('http://www.dmoz.org/editors/profile/view?editor=' + editors[id], true, false, inSelectedTab);
				else if (aCommand == 'command_editor_profile_public')
					this.openURL('http://www.dmoz.org/public/profile?editor=' + editors[id], true, false, inSelectedTab);
				else if (aCommand == 'command_editor_log_summary')
					this.openURL('http://www.dmoz.org/editors/log/editsummary?editor=' + editors[id], true, false, inSelectedTab);
				else if (aCommand == 'command_editor_log_detail')
					this.openURL('http://www.dmoz.org/editors/log/search?cat=&editor=' + editors[id] + '&type=all&function=', true, false, inSelectedTab);
				else if (aCommand == 'command_editor_log_request')
					this.openURL('http://www.dmoz.org/editors/log/requestlog?editor=' + editors[id], true, false, inSelectedTab);
				else if (aCommand == 'command_editor_log_cool')
					this.openURL('http://www.dmoz.org/editors/log/search?cat=&editor=' + editors[id] + '&type=all&function=url_*cool', true, false, inSelectedTab);
				else if (aCommand == 'command_editor_log_new_cat')
					this.openURL('http://www.dmoz.org/editors/log/search?cat=&editor=' + editors[id] + '&type=all&function=ont_add', true, false, inSelectedTab);
				else if (aCommand == 'command_editor_log_del_cat')
					this.openURL('http://www.dmoz.org/editors/log/search?cat=&editor=' + editors[id] + '&type=all&function=ont_deletenode', true, false, inSelectedTab);
				else if (aCommand == 'command_editor_tool_arwen')
					this.openURL('http://odp.kazhar.org/arwen/view/' + editors[id], true, false, inSelectedTab);
			}
			return;
		}



		//required data

		//categories.txt dependent
		if (
		(
			aCommand == 'search_display_subcategories' ||
			aCommand == 'search_display_all_subcategories' ||
			aCommand == 'search_find_subcategory' ||
			aCommand == 'search_find_subcategory_called' ||
			aCommand == 'find_category_localy') && !this.categoriesTXTRequired()) {
			return;
		}


		//prompt
		var searchFor;
		if (
		(
			aCommand == 'search_find_subcategory' ||
			aCommand == 'search_find_subcategory_called' ||
			aCommand == 'find_dmoz' ||

		aCommand == 'rdf_find_category_description_search' ||
			aCommand == 'command_rdf_find_string_on_node' ||
			aCommand == 'rdf_find_category_with_name_exact' ||
			aCommand == 'rdf_find_category_with_name' ||
			aCommand == 'rdf_find_category_with_path' ||

		aCommand.indexOf('search_in_cat') != -1) &&
			((searchFor = this.prompt(this.getString('search.ellipsis'))) == '')) {
			return;
		}


		//no multiple items, should return

		//paste
		if (aCommand == 'command_paste') {
			goDoCommand('cmd_paste');
			return;
		}
		//cut
		else if (aCommand == 'command_cut') {
			goDoCommand('cmd_cut');
			return;
		}
		//cut
		else if (aCommand == 'command_delete') {
			goDoCommand('cmd_delete');
			return;
		} else if (aCommand == 'command_copy_selection') {
			goDoCommand('cmd_copy');
			return;
		} else if (aCommand == 'command_toolbox') {
			this.openURL('http://tools.dmoz.org/', true, false, true);
			return;
		} else if (aCommand == 'command_editor_produced_tool_CatFinder') {
			this.openURL('http://odp.danielmclean.id.au/catFinder/', true, false, true);
			return;
		} else if (aCommand == 'command_editor_produced_tool_LinkFinder') {
			this.openURL('http://odp.danielmclean.id.au/linkFinder/', true, false, true);
			return;
		} else if (aCommand == 'command_editor_produced_tool_FatCat') {
			this.openURL('http://odp.danielmclean.id.au/fatcat/', true, false, true);
			return;
		} else if (aCommand == 'command_editor_produced_tool_TemplateChecker') {
			this.openURL('http://odp.danielmclean.id.au/templateChecker/', true, false, true);
			return;
		} else if (aCommand == 'command_editor_produced_tool_Birthdays') {
			this.openURL('http://dmoz.dk/birthdays/', true, false, true);
			return;
		} else if (aCommand == 'editor_produced_tool_Notice') {
			this.openURL('http://odp.jtlabs.net/notice/', true, false, true);
			return;
		} else if (aCommand == 'command_editor_produced_tool_Redbust') {
			this.openURL('http://odp.jtlabs.net/clean.pl', true, false, true);
			return;
		} else if (aCommand == 'editor_produced_tool_Anduril') {
			this.openURL('http://odp.kazhar.org/anduril', true, false, true);
			return;
		} else if (aCommand == 'editor_produced_tool_Planificotron') {
			this.openURL('http://odp.kazhar.org/planificotron', true, false, true);
			return;
		} else if (aCommand == 'command_editor_produced_tool_AutoCat') {
			this.openURL('http://pmoz.info/autocat/', true, false, true);
			return;
		} else if (aCommand == 'command_editor_produced_tool_Rellinkerator') {
			this.openURL('http://pmoz.info/rellinkerator.php', true, false, true);
			return;
		} else if (aCommand == 'command_editor_produced_tool_Tattle') {
			this.openURL('http://pmoz.info/qc/tattle/', true, false, true);
			return;
		} else if (aCommand == 'command_editor_produced_tool_Frog') {
			this.openURL('http://pmoz.info/qc/frog.php5', true, false, true);
			return;
		} else if (aCommand == 'command_editor_produced_tool_Flash') {
			this.openURL('http://pmoz.info/flash/', true, false, true);
			return;
		} else if (aCommand == 'command_editor_produced_tool_Feedback_If_New_Editor') {
			this.openURL('http://research.dmoz.org/~windharp/tools/FeedbackIfNewEditor.cgi', true, false, true);
			return;
		} else if (aCommand == 'command_editor_produced_tool_Numbers') {
			this.openURL('http://robert.mathmos.net/odp/numbers/', true, false, true);
			return;
		} else if (aCommand == 'command_editor_produced_tool_Cat_Descriptor') {
			this.openURL('http://odp.dmoz-es.org/catdescriptor/', true, false, true);
			return;
		} else if (aCommand == 'command_editor_produced_tool_PNF') {
			this.openURL('http://odp.jtlabs.net/pnf/', true, false, true);
			return;
		} else if (aCommand == 'command_tool_spell_check') {
			this.openURL('http://odp.rpfuller.com/spell/', true, false, true);
			return
		} else if (aCommand == 'command_encode') {
			this.selectionEncode();
			return;
		} else if (aCommand == 'command_decode_links') {
			this.selectionDecode();
			return
		}
		//RDF Tools
		//parsing
		else if (aCommand == 'command_rdf_parse_files') {
			this.rdfParser();
			return;
		} else if (aCommand == 'command_rdf_find_string_on_node') {
			this.rdfFind(searchFor);
			return;
		}


		//copy
		else if (
			aCommand == 'copy' ||
			aCommand == 'copy_edit_cat' ||
			aCommand == 'copy_worldlinkerate' ||
			aCommand == 'copy_encoded' ||
			aCommand == 'copy_abreviated' ||
			aCommand == 'copy_phpbb_link_with_anchor') {
			var aData = '';

			for (var id in aCategories) {
				var aValue = aCategories[id];

				//copy
				if (aCommand == 'copy') {
					aData += aValue + '/' + this.__NEW_LINE__;
				} else if (aCommand == 'copy_edit_cat') {
					aData += 'http://www.dmoz.org/editors/editcat/index?cat=' + this.encodeUTF8(aValue + '/') + this.__NEW_LINE__;
				} else if (aCommand == 'copy_worldlinkerate') {
					aData += 'http://odp.rpfuller.com/worldlinkerator/worldlinkerator.cgi?cat=' + this.encodeUTF8(aValue + '/') + '&server=dmoz8080' + this.__NEW_LINE__;
				} else if (aCommand == 'copy_encoded') {
					aData += this.encodeUTF8(aValue + '/') + this.__NEW_LINE__;
				} else if (aCommand == 'copy_abreviated') {
					aData += '[url=' + this.categoryGetURL(aValue) + ']' + this.categoryAbbreviate(aValue + '/') + '[/url] ' + this.__NEW_LINE__;
				} else if (aCommand == 'copy_phpbb_link_with_anchor') {
					var anchor = this.trim(this.prompt(this.getString('anchor.text') + ' : ' + aValue));
					if (anchor != '')
						aData += '[url=' + this.categoryGetURL(aValue) + ']' + anchor + '[/url] ' + this.__NEW_LINE__;
					else
						aData += '[url=' + this.categoryGetURL(aValue) + ']' + this.categoryAbbreviate(aValue + '/') + '[/url] ' + this.__NEW_LINE__;
				}
			}

			this.copyToClipboard(this.trim(aData));

			return;
		}



		//ask for RDF

		//one time notices

		if (aCommand.indexOf('rdf_') === 0 && !this.fileExists('ODPRDF.sqlite')) {
			if (this.confirm(this.getString('rdf.there.is.no.database.based.on.rdf.data'))) {
				this.rdfParser();
			}
			return;
		}

		//multiples or no multiples

		for (var id in aCategories) {
			var aValue = aCategories[id];

			//one time notices
			if (aCommand.indexOf('linkfinder') != -1 && aCommand.indexOf('linkfinder_altlangs') == -1) {
				this.notifyOnce(this.getString('link.finder.automatic.branch.selection').replace(/{CATEGORY}/, aValue.replace(/^([^\/]+)\/?.*/, "$1")), 'link_finder_branch_automatic_selection');
			}

			//open
			if (aCommand == 'cat_open')
				this.openURL(this.categoryGetURL(aValue), true, false, inSelectedTab);
			else if (aCommand == 'cat_open_desc')
				this.openURL(this.encodeURI('http://www.dmoz.org/desc/' + aValue), true, false, inSelectedTab);
			else if (aCommand == 'cat_open_faq')
				this.openURL(this.encodeURI('http://www.dmoz.org/faq/' + aValue), true, false, inSelectedTab);
			//edit cat
			else if (aCommand == 'edit_cat')
				this.openURL('http://www.dmoz.org/editors/editcat/index?cat=' + this.encodeUTF8(aValue + '/'), true, false, inSelectedTab);
			else if (aCommand == 'edit_cat_desc')
				this.openURL('http://www.dmoz.org/editors/editcat/desc?cat=' + this.encodeUTF8(aValue + '/'), true, false, inSelectedTab);
			else if (aCommand == 'edit_cat_pricat')
				this.openURL('http://www.dmoz.org/editors/editcat/priority?cat=' + this.encodeUTF8(aValue + '/'), true, false, inSelectedTab);
			else if (aCommand == 'edit_cat_addlink')
				this.openURL('http://www.dmoz.org/editors/editcat/addrelation?cat=' + this.encodeUTF8(aValue + '/') + '&type=symbolic', true, false, inSelectedTab);
			else if (aCommand == 'edit_cat_related')
				this.openURL('http://www.dmoz.org/editors/editcat/editrelation?cat=' + this.encodeUTF8(aValue + '/') + '&type=related', true, false, inSelectedTab);
			else if (aCommand == 'edit_cat_altlang')
				this.openURL('http://www.dmoz.org/editors/editcat/editrelation?cat=' + this.encodeUTF8(aValue + '/') + '&type=altlang', true, false, inSelectedTab);
			else if (aCommand == 'edit_cat_faq')
				this.openURL('http://www.dmoz.org/editors/editfaq.cgi?cat=' + this.encodeUTF8(aValue + '/'), true, false, inSelectedTab);
			else if (aCommand == 'edit_cat_usenet')
				this.openURL('http://www.dmoz.org/editors/editcat/editlink?cat=' + this.encodeUTF8(aValue + '/'), true, false, inSelectedTab);
			else if (aCommand == 'new_subcat')
				this.openURL('http://www.dmoz.org/editors/editcat/new?cat=' + this.encodeUTF8(aValue + '/'), true, false, inSelectedTab);
			else if (aCommand == 'change_mozilla')
				this.openURL('http://www.dmoz.org/editors/editcat/editImage?cat=' + this.encodeUTF8(aValue + '/') + '&flag=' + this.encodeUTF8('/'), true, false, inSelectedTab);
			//unrev
			else if (aCommand == 'edit_cat_unreview')
				this.openURL('http://www.dmoz.org/editors/editunrev/listurl?cat=' + this.encodeUTF8(aValue + '/'), true, false, inSelectedTab);

			else if (aCommand == 'edit_cat_unreview_power')
				this.openURL('http://www.dmoz.org/editors/editunrev/listurl?cat=' + this.encodeUTF8(aValue + '/') + '&mode=power', true, false, inSelectedTab);
			else if (aCommand == 'edit_cat_unreview_power_url')
				this.openURL('http://www.dmoz.org/editors/editunrev/listurl?cat=' + this.encodeUTF8(aValue + '/') + '&mode=power&sort=url', true, false, inSelectedTab);
			else if (aCommand == 'edit_cat_unreview_power_title')
				this.openURL('http://www.dmoz.org/editors/editunrev/listurl?cat=' + this.encodeUTF8(aValue + '/') + '&mode=power&sort=title', true, false, inSelectedTab);
			else if (aCommand == 'edit_cat_unreview_power_ip')
				this.openURL('http://www.dmoz.org/editors/editunrev/listurl?cat=' + this.encodeUTF8(aValue + '/') + '&mode=power&sort=ip', true, false, inSelectedTab);
			else if (aCommand == 'edit_cat_unreview_power_email')
				this.openURL('http://www.dmoz.org/editors/editunrev/listurl?cat=' + this.encodeUTF8(aValue + '/') + '&mode=power&sort=email', true, false, inSelectedTab);
			else if (aCommand == 'edit_cat_unreview_super')
				this.openURL('http://www.dmoz.org/editors/editunrev/listurl?cat=' + this.encodeUTF8(aValue + '/') + '&mode=super#unrevedit', true, false, inSelectedTab);
			else if (aCommand == 'edit_cat_unreview_super_url')
				this.openURL('http://www.dmoz.org/editors/editunrev/listurl?cat=' + this.encodeUTF8(aValue + '/') + '&mode=super&sort=url#unrevedit', true, false, inSelectedTab);
			else if (aCommand == 'edit_cat_unreview_super_title')
				this.openURL('http://www.dmoz.org/editors/editunrev/listurl?cat=' + this.encodeUTF8(aValue + '/') + '&mode=super&sort=title#unrevedit', true, false, inSelectedTab);
			else if (aCommand == 'edit_cat_unreview_super_cat')
				this.openURL('http://www.dmoz.org/editors/editunrev/listurl?cat=' + this.encodeUTF8(aValue + '/') + '&mode=super&sort=category#unrevedit', true, false, inSelectedTab);
			else if (aCommand == 'edit_cat_unreview_super_ip')
				this.openURL('http://www.dmoz.org/editors/editunrev/listurl?cat=' + this.encodeUTF8(aValue + '/') + '&mode=super&sort=ip#unrevedit', true, false, inSelectedTab);
			else if (aCommand == 'edit_cat_unreview_super_email')
				this.openURL('http://www.dmoz.org/editors/editunrev/listurl?cat=' + this.encodeUTF8(aValue + '/') + '&mode=super&sort=email#unrevedit', true, false, inSelectedTab);
			else if (aCommand == 'edit_cat_updates')
				this.openURL('http://pmoz.info/hunt.php5?cat=' + this.encodeUTF8(aValue) + '&updates=on', true, false, inSelectedTab);
			else if (aCommand == 'edit_cat_errors')
				this.openURL('http://pmoz.info/hunt.php5?cat=' + this.encodeUTF8(aValue) + '&reds=on', true, false, inSelectedTab);
			else if (aCommand == 'edit_cat_greenbusts')
				this.openURL('http://pmoz.info/hunt.php5?cat=' + this.encodeUTF8(aValue) + '&greenbusts=on', true, false, inSelectedTab);
			//logs
			else if (aCommand == 'cat_log_edit')
				this.openURL('http://www.dmoz.org/editors/log/search?cat=' + this.encodeUTF8(aValue + '/*') + '&editor=&type=all&function=', true, false, inSelectedTab);
			else if (aCommand == 'cat_log_cool')
				this.openURL('http://www.dmoz.org/editors/log/search?cat=' + this.encodeUTF8(aValue + '/*') + '&editor=&type=all&function=url_*cool', true, false, inSelectedTab);
			else if (aCommand == 'cat_log_new_editor')
				this.openURL('http://www.dmoz.org/editors/log/search?cat=' + this.encodeUTF8(aValue + '/*') + '&editor=&type=all&function=queue_granteditor', true, false, inSelectedTab);
			else if (aCommand == 'cat_log_new_editor_permissions')
				this.openURL('http://www.dmoz.org/editors/log/search?cat=' + this.encodeUTF8(aValue + '/*') + '&editor=&type=all&function=queue_granteditor+OR+function%3Aqueue_grantrequest', true, false, inSelectedTab);
			else if (aCommand == 'cat_log_new_editor_permissions_recent')
				this.openURL('http://www.dmoz.org/editors/log/search?cat=' + this.encodeUTF8(aValue + '/*') + '&editor=&type=all&function=queue_granteditor+OR+function%3Aqueue_grantrequest+AND+timestamp%3A+[NOW-30DAY+TO+NOW]', true, false, inSelectedTab);
			else if (aCommand == 'cat_log_new_cat')
				this.openURL('http://www.dmoz.org/editors/log/search?cat=' + this.encodeUTF8(aValue + '/*') + '&editor=&type=all&function=ont_add', true, false, inSelectedTab);
			else if (aCommand == 'cat_log_catmv')
				this.openURL('http://www.dmoz.org/editors/log/search?cat=' + this.encodeUTF8(aValue + '/*') + '&editor=&type=all&function=ont_move', true, false, inSelectedTab);
			else if (aCommand == 'cat_log_del_cat')
				this.openURL('http://www.dmoz.org/editors/log/search?cat=' + this.encodeUTF8(aValue + '/*') + '&editor=&type=all&function=ont_deletenode', true, false, inSelectedTab);
			else if (aCommand == 'cat_log_cat_terms')
				this.openURL('http://www.dmoz.org/editors/log/search?cat=' + this.encodeUTF8(aValue + '/*') + '&editor=&type=all&function=ont_setterms', true, false, inSelectedTab);
			//link finder
			else if (aCommand == 'linkfinder_links_from_here_or_from_any')
				this.openURL('http://odp.danielmclean.id.au/linkFinder/index.cgi?links=from&category=' + this.encodeUTF8(aValue + '/') + '&subcats=on&sym=on ', true, false, inSelectedTab);
			else if (aCommand == 'linkfinder_links_to_here')
				this.openURL('http://odp.danielmclean.id.au/linkFinder/index.cgi?links=to&category=' + this.encodeUTF8(aValue + '/') + '&sym=on ', true, false, inSelectedTab);
			else if (aCommand == 'linkfinder_links_to_here_or_to_any')
				this.openURL('http://odp.danielmclean.id.au/linkFinder/index.cgi?links=to&category=' + this.encodeUTF8(aValue + '/') + '&subcats=on&sym=on ', true, false, inSelectedTab);
			else if (aCommand == 'linkfinder_related_from_here_or_from_any')
				this.openURL('http://odp.danielmclean.id.au/linkFinder/index.cgi?links=from&category=' + this.encodeUTF8(aValue + '/') + '&subcats=on&rel=on ', true, false, inSelectedTab);
			else if (aCommand == 'linkfinder_related_to_here')
				this.openURL('http://odp.danielmclean.id.au/linkFinder/index.cgi?links=to&category=' + this.encodeUTF8(aValue + '/') + '&rel=on ', true, false, inSelectedTab);
			else if (aCommand == 'linkfinder_related_to_here_or_to_any')
				this.openURL('http://odp.danielmclean.id.au/linkFinder/index.cgi?links=to&category=' + this.encodeUTF8(aValue + '/') + '&subcats=on&rel=on ', true, false, inSelectedTab);
			else if (aCommand == 'linkfinder_altlangs_from_here_or_from_any')
				this.openURL('http://odp.danielmclean.id.au/linkFinder/index.cgi?links=from&category=' + this.encodeUTF8(aValue + '/') + '&subcats=on&alt=on ', true, false, inSelectedTab);
			else if (aCommand == 'linkfinder_altlangs_to_here')
				this.openURL('http://odp.danielmclean.id.au/linkFinder/index.cgi?links=to&category=' + this.encodeUTF8(aValue + '/') + '&alt=on ', true, false, inSelectedTab);
			else if (aCommand == 'linkfinder_altlangs_to_here_or_to_any')
				this.openURL('http://odp.danielmclean.id.au/linkFinder/index.cgi?links=to&category=' + this.encodeUTF8(aValue + '/') + '&subcats=on&alt=on ', true, false, inSelectedTab);
			//editor
			else if (aCommand == 'find_in_cat_editors_rdf')
				this.openURL('http://odp.jtlabs.net/notice/index.cgi?category=' + this.encodeUTF8(aValue + '/') + '&type=rdf&all=on&edit=on', true, false, inSelectedTab);
			else if (aCommand == 'find_in_cat_editors_scan')
				this.openURL('http://odp.jtlabs.net/notice/index.cgi?category=' + this.encodeUTF8(aValue + '/') + '&type=scan&all=on&edit=on', true, false, inSelectedTab);
			//tools
			else if (aCommand == 'tool_eddy')
				this.openURL('http://odp.dlugan.com/eddy.cgi?cat=' + this.encodeUTF8(aValue + '/'), true, false, inSelectedTab);
			else if (aCommand == 'tool_cat_spider')
				this.openURL('http://spidertools.net/catspider.php?cat=' + this.encodeUTF8(aValue + '/'), true, false, inSelectedTab);
			else if (aCommand == 'tool_worldlinkerate')
				this.openURL('http://odp.rpfuller.org/worldlinkerator/worldlinkerator.cgi?cat=' + this.encodeUTF8(aValue + '/') + '&server=dmoz8080', true, false, inSelectedTab);
			else if (aCommand == 'tool_clean_ghost')
				this.openURL('http://www.dmoz.org/editors/clean_ghosts.cgi?cat=' + this.encodeUTF8(aValue + '/'), true, false, inSelectedTab);
			/*else if(aCommand=='tool_pub')
						this.openURL('http://www.dmoz.org/editors/pub.cgi?cat='+this.encodeUTF8(aValue+'/'), true, false, inSelectedTab);*/
			else if (aCommand == 'tool_cat_bingo')
				this.openURL('http://odp.kazhar.org/catbingo?q=' + this.encodeUTF8(aValue + '/') + '&gen=1', true, false, inSelectedTab);
			else if (aCommand == 'tool_Olderupdate')
				this.openURL('http://odp.kazhar.org/olderupdate?q=' + this.encodeUTF8(aValue + '/') + '&gen=1', true, false, inSelectedTab);

			//RDF Tools
			//altlangs
			//misc tools
			else if (aCommand == 'rdf_find_altlangs_subcategories_without_incoming')
				this.rdfFindAltlangsCategoriesWithoutIncoming(aValue + '/');
			else if (aCommand == 'rdf_find_altlangs_subcategories_without_outgoing')
				this.rdfFindAltlangsCategoriesWithoutOutgoing(aValue + '/');
			else if (aCommand == 'rdf_find_altlangs_subcategories_without_incoming_with_outgoing')
				this.rdfFindAltlangsCategoriesWithoutIncomingWithOutgoing(aValue + '/');
			else if (aCommand == 'rdf_find_altlangs_subcategories_without_outgoing_with_incoming')
				this.rdfFindAltlangsCategoriesWithoutOutgoingWithIncoming(aValue + '/');
			else if (aCommand == 'rdf_find_altlangs_non_reciprocal')
				this.rdfFindAltlangsNonReciprocal(aValue + '/');

			//dmclean's linkfinder port
			else if (aCommand == 'rdf_find_altlangs_to_here')
				this.rdfFindAltlangsToHere(aValue + '/');
			else if (aCommand == 'rdf_find_altlangs_to_here_or_to_any')
				this.rdfFindAltlangsToHereToAny(aValue + '/');
			else if (aCommand == 'rdf_find_altlangs_from_here')
				this.rdfFindAltlangsFromHere(aValue + '/');
			else if (aCommand == 'rdf_find_altlangs_from_here_or_from_any')
				this.rdfFindAltlangsFromHereFromAny(aValue + '/');

			//@links
			//dmclean's linkfinder port
			else if (aCommand == 'rdf_find_links_to_here')
				this.rdfFindLinksToHere(aValue + '/');
			else if (aCommand == 'rdf_find_links_to_here_or_to_any')
				this.rdfFindLinksToHereToAny(aValue + '/');
			else if (aCommand == 'rdf_find_links_from_here')
				this.rdfFindLinksFromHere(aValue + '/');
			else if (aCommand == 'rdf_find_links_from_here_or_from_any')
				this.rdfFindLinksFromHereFromAny(aValue + '/');
			//miscelanea
			else if (aCommand == 'rdf_find_links_from_here_from_any_with_invalid_name')
				this.rdfFindLinksFromHereFromAnyWithInvalidName(aValue + '/');
			else if (aCommand == 'rdf_find_links_to_here_to_any_with_invalid_name')
				this.rdfFindLinksToHereToAnyWithInvalidName(aValue + '/');

			//related
			else if (aCommand == 'rdf_find_related_link_examinate')
				this.rdfRelatedLinkExamination(aValue + '/');
			//dmclean's linkfinder port
			else if (aCommand == 'rdf_find_related_to_here')
				this.rdfFindRelatedToHere(aValue + '/');
			else if (aCommand == 'rdf_find_related_to_here_or_to_any')
				this.rdfFindRelatedToHereToAny(aValue + '/');
			else if (aCommand == 'rdf_find_related_from_here')
				this.rdfFindRelatedFromHere(aValue + '/');
			else if (aCommand == 'rdf_find_related_from_here_or_from_any')
				this.rdfFindRelatedFromHereFromAny(aValue + '/');

			else if (aCommand == 'rdf_find_related_to_different_language')
				this.rdfFindRelatedToDifferentLanguage(aValue + '/');

			//categories
			//subcategories
			else if (aCommand == 'rdf_find_category_subcategories')
				this.rdfFindCategorySubcategories(aValue + '/');
			else if (aCommand == 'rdf_find_category_subcategories_recursive')
				this.rdfFindCategorySubcategoriesRecursive(aValue + '/');
			//names
			else if (aCommand == 'rdf_find_categories_with_invalid_names')
				this.rdfFindCategorySubcategoriesWithInvalidName(aValue + '/');
			else if (aCommand == 'rdf_find_category_with_name_exact')
				this.rdfFindCategorySubcategoriesWithNameExact(aValue + '/', searchFor);
			else if (aCommand == 'rdf_find_category_with_name')
				this.rdfFindCategorySubcategoriesWithName(aValue + '/', searchFor);
			else if (aCommand == 'rdf_find_category_with_path')
				this.rdfFindCategorySubcategoriesWithPath(aValue + '/', searchFor);
			//editors
			else if (aCommand == 'rdf_find_editors_from_here_or_from_any')
				this.rdfFindEditorsFromHereFromAny(aValue + '/');
			else if (aCommand == 'rdf_find_editors_from_here')
				this.rdfFindEditorsFromHere(aValue + '/');

			//descriptions
			else if (aCommand == 'rdf_find_category_description')
				this.rdfFindCategoryDescription(aValue + '/');
			else if (aCommand == 'rdf_find_category_description_recursive')
				this.rdfFindCategoryDescriptionRecursive(aValue + '/');

			else if (aCommand == 'rdf_find_category_description_empty')
				this.rdfFindCategoryDescriptionEmpty(aValue + '/');
			else if (aCommand == 'rdf_find_category_description_search')
				this.rdfFindCategoryDescriptionSearch(aValue + '/', searchFor);
			//custom
			else if (aCommand == 'rdf_find_hyperlinks_to_here') {
				this.rdfFindAltlangsToHereToAny(aValue + '/');
				this.rdfFindRelatedToHereToAny(aValue + '/');
				this.rdfFindLinksToHereToAny(aValue + '/');
			} else if (aCommand == 'rdf_category_spell_check') {
				//building the form
				//xul content
				var aLabel = this.createFormLabel(this.getString('select.a.dictionary'));

				var menuList = this.create('menulist');
				menuList.setAttribute('name', 'aDictionary');

				var menupopup = this.create('menupopup');

				var dictionaries = this.spellGetDictionaryList();
				for (var id in dictionaries) {
					var add = this.create('menuitem')
					add.setAttribute('label', dictionaries[id])
					add.setAttribute('value', dictionaries[id])
					menupopup.appendChild(add);
				}
				menuList.appendChild(menupopup);

				var aHiddenValue = this.createFormHiddenInput('aCategory', aValue + '/');

				var buttons = [];
				var button = [];
				button[0] = this.getString('search');
				button[1] = function(formData) {
					ODPExtension.rdfCategorySpellCheck(formData['aCategory'], formData['aDictionary']);
				}
				buttons[buttons.length] = button;
				var button = [];
				button[0] = this.getString('close');

				buttons[buttons.length] = button;

				this.form('spell.check', this.getString('category.spell.check'), [aLabel, menuList, aHiddenValue], buttons, true);
			}

			//search
			else if (aCommand == 'search_display_subcategories')
				this.categoryFinderQuery(aValue + '/[^/]+$', null, aValue)
			else if (aCommand == 'search_display_all_subcategories')
				this.categoryFinderQuery(aValue + '/', null, aValue)
			else if (aCommand == 'search_find_subcategory')
				this.categoryFinderQuery(aValue + '/ ' + searchFor + ' ', null, aValue);
			//else if(aCommand=='search_find_subcategory_called')
			//this.categoryFinderQuery(aValue+'/.*?'+searchFor+'([^/]*)?$', null, aValue);
			else if (aCommand == 'find_dmoz')
				this.openURL('http://www.dmoz.org/search?q=' + this.encodeUTF8(searchFor) + '&cat=' + this.encodeUTF8(aValue + '/') + '&all=no&ebuttons=1', true, false, inSelectedTab);
			else if (aCommand.indexOf('search_in_cat') != -1) {
				if (aCommand == 'search_in_cat_description')
					this.openURL('http://odp.rpfuller.com/cds/index.cgi?term=c%3A' + this.encodeUTF8(aValue + '*') + '+d%3A' + this.encodeUTF8(searchFor + '*'), true, false, inSelectedTab);
				else if (aCommand == 'search_in_cat_site_title')
					this.openURL('http://www.dmoz.org/search?q=' + this.encodeUTF8('t:' + searchFor) + '&cat=' + this.encodeUTF8(aValue + '/') + '&all=no&ebuttons=1', true, false, inSelectedTab);
				else if (aCommand == 'search_in_cat_site_description')
					this.openURL('http://www.dmoz.org/search?q=' + this.encodeUTF8('d:' + searchFor) + '&cat=' + this.encodeUTF8(aValue + '/') + '&all=no&ebuttons=1', true, false, inSelectedTab);
				else if (aCommand == 'search_in_cat_site_url')
					this.openURL('http://www.dmoz.org/search?q=' + this.encodeUTF8('u:' + searchFor) + '&cat=' + this.encodeUTF8(aValue + '/') + '&all=no&ebuttons=1', true, false, inSelectedTab);
			}

		} //end for


	}

	return null;

}).apply(ODPExtension);
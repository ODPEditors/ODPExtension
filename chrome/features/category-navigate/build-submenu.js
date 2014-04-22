(function() {

	var db_history, query_history;
	var db_rdf, query_links, query_relcats, query_altlangs
	this.addListener('databaseReady', function() {
		db_history = ODPExtension.categoriesHistoryDatabaseOpen();
		if (db_history.exists)
			query_history = db_history.query('select categories_history_category from categories_history where categories_history_category GLOB :categories_history_category_glob and regexp(:categories_history_category, categories_history_category) ');
		db_rdf = ODPExtension.rdfDatabaseOpen();
		if (db_rdf.exists) {
			query_links = db_rdf.query(' \
												 	SELECT \
														l.`name`, c.`category` \
													FROM \
														`categories` c , \
														`link` l \
													where \
														l.`from` IN \
														( \
														 	SELECT \
																c.`id` \
															FROM \
																`categories` c  \
															WHERE \
																c.`category` = :category \
														 ) AND \
														c.`id` = l.`to` \
													order by \
														l.`name` asc \
												');

			query_relcats = db_rdf.query(' \
												 	SELECT \
														c.`category` \
													FROM \
														`categories` c , \
														`related` r \
													where \
														r.`from` = ( \
														 	SELECT \
																c.`id` \
															FROM \
																`categories` c  \
															WHERE \
																c.`category` = :category \
														 ) and \
														c.`id` = r.`to` \
													order by \
														r.`to` asc \
												');
			query_altlangs = db_rdf.query(' \
												 	SELECT \
														c.`category` \
													FROM \
														`categories` c , \
														`altlang` a \
													where \
														a.`from` IN \
														( \
														 	SELECT \
																c.`id` \
															FROM \
																`categories` c  \
															WHERE \
																c.`category` = :category \
														 ) AND \
														c.`id` = a.`to` \
													order by \
														a.`to` asc \
												');
		}
	});

	//build the XUL for the menu that is currently browseable
	this.categoryBrowserNavigateBuildSubMenu = function(item, aCategories) {

		var aCategory = item.getAttribute('value')

		//normal menu
		var menu = this.create('menu');
		menu.setAttribute('label', item.getAttribute('label'));
		menu.setAttribute('value', item.getAttribute('value'));
		menu.setAttribute('done', 'true');

		var menupopup = this.create('menupopup');
		menupopup.setAttribute('ignorekeys', true);

		//alphabar menu if any
		var menuAlphabar = this.create('menu');
		menuAlphabar.setAttribute('label', 'Alphabar');
		menuAlphabar.setAttribute('done', 'true');
		//menuAlphabar.setAttribute('value', item.getAttribute('value'));

		var menupopupAlphabar = this.create('menupopup');
		menupopupAlphabar.setAttribute('ignorekeys', true);

		if (this.categoryIsRTL(item.getAttribute('value'))) {
			menu.setAttribute('direction', 'rtl');
			menupopup.setAttribute('direction', 'rtl');
			menupopupAlphabar.setAttribute('direction', 'rtl');
		}

		var aCategoryLastChildName;
		//adding the categories
		for (var id in aCategories) {
			aCategoryLastChildName = this.categoryGetLastChildName(aCategories[id]);
			var add = this.create("menuitem");
			add.setAttribute("label", this.categoryAbbreviate(aCategoryLastChildName));
			add.setAttribute("value", aCategories[id]);
			if (this.categoryIsRTL(aCategories[id]))
				add.setAttribute('direction', 'rtl');
			if (aCategoryLastChildName.length == 1)
				menupopupAlphabar.appendChild(add);
			else
				menupopup.appendChild(add);
		}

		if (db_history.exists) {
			query_history.params('categories_history_category_glob', aCategory + '/*');
			query_history.params('categories_history_category', '^'+aCategory + '/[^/]+$');
			var row;
			var aCategoriesFromHistory = []
			for (var i = 0; row = db_history.fetchObjects(query_history); i++) {
				var tmp = row.categories_history_category.replace(/\*$/, '')
				if(!this.inArray(aCategories, tmp)) {
					aCategoriesFromHistory.push(tmp);
					aCategories[aCategories.length] = tmp
				}
			}
			if(aCategoriesFromHistory.length > 0) {
				menupopup.appendChild(this.create('menuseparator'));
				//adding the categories
				for (var id in aCategoriesFromHistory) {
					aCategoryLastChildName = this.categoryGetLastChildName(aCategoriesFromHistory[id]);
					var add = this.create("menuitem");
						add.setAttribute("label", this.categoryAbbreviate(aCategoryLastChildName));
						add.setAttribute("value", aCategoriesFromHistory[id]);
					if (this.categoryIsRTL(aCategoriesFromHistory[id]))
						add.setAttribute('direction', 'rtl');
					if (aCategoryLastChildName.length == 1)
						menupopupAlphabar.appendChild(add);
					else
						menupopup.appendChild(add);
				}
			}
		}

		if (db_rdf.exists) {

			//@links
			query_links.params('category', aCategory+'/');
			var row;
			var _aCategories = []
			for (var i = 0; row = db_rdf.fetchObjects(query_links); i++) {
				_aCategories.push([row.name, row.category]);
			}
			if(_aCategories.length > 0) {
				menupopup.appendChild(this.create('menuseparator'));
				//adding the categories
				for (var id in _aCategories) {
					var add = this.create("menuitem");
						add.setAttribute("label", '@'+this.categoryAbbreviate(_aCategories[id][0]));
						add.setAttribute("value", _aCategories[id][1].replace(/\/$/, ''));
					if (this.categoryIsRTL(_aCategories[id][1]))
						add.setAttribute('direction', 'rtl');
					menupopup.appendChild(add);
				}
			}

			//relcats
			query_relcats.params('category', aCategory+'/');
			var row;
			var _aCategories = []
			for (var i = 0; row = db_rdf.fetchObjects(query_relcats); i++) {
				_aCategories.push(row.category);
			}
			if(_aCategories.length > 0) {
				menupopup.appendChild(this.create('menuseparator'));
				//adding the categories
				for (var id in _aCategories) {
					var add = this.create("menuitem");
						add.setAttribute("label", '>'+this.categoryAbbreviate(this.categoryGetLastThreeChildName(_aCategories[id].replace(/\/$/, ''))));
						add.setAttribute("value", _aCategories[id].replace(/\/$/, ''));
					if (this.categoryIsRTL(_aCategories[id]))
						add.setAttribute('direction', 'rtl');
					menupopup.appendChild(add);
				}
			}

			//altlangs
			query_altlangs.params('category', aCategory+'/');
			var row;
			var _aCategories = []
			for (var i = 0; row = db_rdf.fetchObjects(query_altlangs); i++) {
				_aCategories.push(row.category);
			}
			if(_aCategories.length > 0) {
				menupopup.appendChild(this.create('menuseparator'));

				//altlangs
				var menuAltlangs = this.create('menu');
				menuAltlangs.setAttribute('label', 'Altlangs');
				menuAltlangs.setAttribute('direction', 'ltr');
				menuAltlangs.setAttribute('done', 'true');

				var menupopupAltlangs = this.create('menupopup');
				menupopupAltlangs.setAttribute('ignorekeys', true);
				menupopupAltlangs.setAttribute('direction', 'ltr');

				//adding the categories
				for (var id in _aCategories) {
					var add = this.create("menuitem");
						add.setAttribute("label", this.categoryAbbreviate(_aCategories[id].replace(/\/$/, '')));
						add.setAttribute("value", _aCategories[id].replace(/\/$/, ''));
					if (this.categoryIsRTL(_aCategories[id]))
						add.setAttribute('direction', 'rtl');
					menupopupAltlangs.appendChild(add);
				}

				menuAltlangs.appendChild(menupopupAltlangs);
				menupopup.appendChild(this.create('menuseparator'));
				menupopup.appendChild(menuAltlangs);
			}
		}

		//if there is an Alphabar put the alphabar in a submenu
		if (menupopupAlphabar.childNodes.length > 0) {
			//but if there is only an alphabar or there is less than 5 elements
			//do not put the alphabar in a submenu
			if (menupopup.childNodes.length === 0 || menupopupAlphabar.childNodes.length < 5) {
				while (menupopupAlphabar.firstChild) {
					menupopup.appendChild(menupopupAlphabar.firstChild);
				}
			} else {
				menupopup.appendChild(this.create('menuseparator'));
				menuAlphabar.appendChild(menupopupAlphabar);
				menupopup.appendChild(menuAlphabar);
			}
		}
		menu.appendChild(menupopup);

		//parents menu
		//if (this.subStrCount(item.getAttribute('value'), '/') > 0) {
			var menuParents = this.create('menu');
			menuParents.setAttribute('label', 'Parents');
			menuParents.setAttribute('style', 'font-weight:bold;');
			menuParents.setAttribute('direction', 'ltr');
			menuParents.setAttribute('done', 'true');

			var menupopupParents = this.create('menupopup');
			menupopupParents.setAttribute('ignorekeys', true);
			menupopupParents.setAttribute('direction', 'ltr');

			var aNodes = item.getAttribute('value').split('/');
			var path = '';
			for (var id in aNodes) {
				if (id == aNodes.length - 1)
					break;
				path += aNodes[id] + '/';
				var add = this.create('menuitem');
				add.setAttribute('value', path.replace(/\/$/, ''));
				if (this.categoryIsRTL(path))
					add.setAttribute('direction', 'rtl');
				add.setAttribute('label', this.categoryAbbreviate(path).replace(/\/$/, ''));
				menupopupParents.appendChild(add);
			}
			menuParents.appendChild(menupopupParents);
			menupopup.appendChild(this.create('menuseparator'));
			menupopup.appendChild(menuParents);
		//}

		//appending the menus
		this.removeDuplicateSeparators(menupopup);

		var focused = item && item.hasAttribute('isFocused')
		if (item && item.parentNode) {
			if (item.hasAttribute('id'))
				menu.setAttribute('id', item.getAttribute('id'));
			if(item.hasAttribute('style'))
				menu.setAttribute('style', item.getAttribute('style'));
			if(item.hasAttribute('direction') && !menu.hasAttribute('direction') )
				menu.setAttribute('direction', item.getAttribute('direction'));
			if (item.hasAttribute('temporal'))
				menu.setAttribute('temporal', item.getAttribute('temporal'));

			try {
				item.parentNode.replaceChild(menu, item);
			} catch (e) {
				item.appendChild(menupopup);
			}
			if (focused) {

				for (var i = 0; menu.parentNode && i < menu.parentNode.childNodes.length; i++) {
					if (menu.parentNode.childNodes[i].tagName == 'menu') {
						menu.parentNode.childNodes[i].firstChild.hidePopup();
					}
				}
				menupopup.openPopup(menu, 'end_before');

			}
		}

	}
	return null;

}).apply(ODPExtension);
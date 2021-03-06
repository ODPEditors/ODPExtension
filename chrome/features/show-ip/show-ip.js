(function () {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	var label, tooltip, menupopup, cache = []
		this.addListener('userInterfaceLoad', function () {
			label = ODPExtension.getElement('toolbarbutton-show-ip');
			menupopup = ODPExtension.getElement('toolbarbutton-show-ip-menupopup');
			ODPExtension.moveNodeBelow(label, label.parentNode.firstChild)
			tooltip = ODPExtension.getElement('show-ip-tooltip-data');
		});

	var database = false;
	var insert, query_inclusive, query_exclusive;

	this.addListener('IPResolved', function (aDomain, aData) {
		//if (ODPExtension.shared.me)
			ODPExtension.showIPDatabaseInsertID(aData, ODPExtension.removeWWW(aDomain));
	});
	this.addListener('databaseCreate', function () {
		//if (ODPExtension.shared.me)
			ODPExtension.showIPDatabaseCreateTable();
	});
	this.addListener('databaseReady', function () {
		//if (ODPExtension.shared.me)
			ODPExtension.showIPDatabaseStatements();
	});

	//updates show or hide the ODP URL Notes toolbarbuttons
	this.addListener('onLocationChange', function (aLocation) {
		if (ODPExtension.preferenceGet('ui.show.ip')) {
			ODPExtension.showIPUpdateLabel(aLocation);
			label.setAttribute('hidden', false)
		} else
			label.setAttribute('hidden', true)
	});

	this.addListener('DOMContentLoadedNoFrames', function (aDoc) {
		ODPExtension.showIPOnDocumentLoaded(aDoc, []);
	});

	this.addListener('DOMContentLinkChecked', function (aDoc, aIDs) {
		ODPExtension.showIPOnDocumentLoaded(aDoc, aIDs);
	});

	this.showIPOnDocumentLoaded = function (aDoc, aIDs) {
		if (aDoc.defaultView) {
			var ids = []
			for (var id in aIDs)
				ids[ids.length] = aIDs[id]

			ids = this.documentGetIDs(aDoc, ids);

			if (ids.length) {
				var aDomain = this.getSubdomainFromURL(this.documentGetLocation(aDoc))
				var aDomainNOWWW = this.removeWWW(aDomain)
				for (var id in ids) {
					this.showIPDatabaseInsertID(ids[id], aDomainNOWWW)
				}
				if ( !! cache[aDomain]) {
					this.showIPDatabaseInsertID(cache[aDomain], aDomainNOWWW)
				} else {
					this.getIPFromDomainAsync(aDomain, function (aData) {
						ODPExtension.showIPDatabaseInsertID(aData, aDomainNOWWW)
						cache[aDomain] = aData
					});
				}
			}
		}
	}
	//hides or shows the toolbatbuttons (update,unreview,delete,options) when the user hits the edit url form

	this.showIPUpdateLabel = function (aLocation) {

		var aDomain = this.getSubdomainFromURL(aLocation)

		if ( !! cache[aDomain])
			label.setAttribute('value', cache[aDomain])
		else {
			this.getIPFromDomainAsync(aDomain, function (aData) {
				cache[aDomain] = aData
				if (aLocation == ODPExtension.focusedURL) {
					label.setAttribute('value', aData);
				}
			});
		}
	}

	this.showIPUpdateMenu = function (aEvent) {
		//if (this.shared.me) {

			this.removeChilds(menupopup);
			var row, row2, items = [], added = 0;
			var aDomain = this.removeWWW(this.getSubdomainFromURL(this.documentFocusedGetLocation()))

			//On Same IP
			var ip = label.getAttribute('value')
			query_exclusive.params('name', ip)
			query_exclusive.params('value', aDomain)
			while (row = database.fetchObjects(query_exclusive)) {
				var add = this.create("menuitem");
				add.setAttribute('class', 'menuitem-iconic');
				add.setAttribute("label", row.value);
				add.setAttribute("value", 'http://' + row.value);
				items[items.length] = add
				added++;
			}
			if (items.length) {
				menupopup.appendChild(this.create("menuseparator"));
				var add = this.create("menuitem");
				add.setAttribute('class', 'menuitem-iconic');
				add.setAttribute("label", 'On Same IP');
				add.setAttribute("disabled", true);
				menupopup.appendChild(add);
				for (var id in items) {
					menupopup.appendChild(items[id]);
				}
			}

			items = []

			//with same id
			var ids = this.documentGetIDs(this.documentGetFocused())
			query_inclusive_value.params('value', aDomain)
			while (row = database.fetchObjects(query_inclusive_value))
				ids[ids.length] = row.name
			ids = this.normalizeIDs(ids);
			for (var id in ids) {
				if(ids[id] != ip){
					query_exclusive.params('name', ids[id])
					query_exclusive.params('value', aDomain)
					while (row = database.fetchObjects(query_exclusive)) {
						var add = this.create("menuitem");
						add.setAttribute('class', 'menuitem-iconic');
						add.setAttribute("label", row.name + ' ' + row.value);
						add.setAttribute("value", 'http://' + row.value);
						items[items.length] = add
						added++;
					}
				}
			}
			if (items.length) {
				menupopup.appendChild(this.create("menuseparator"));
				var add = this.create("menuitem");
				add.setAttribute('class', 'menuitem-iconic');
				add.setAttribute("label", 'On Same ID');
				add.setAttribute("disabled", true);
				menupopup.appendChild(add);
				for (var id in items)
					menupopup.appendChild(items[id]);
			}

			if (added) {
				//open all
				menupopup.appendChild(this.create("menuseparator"));
				var add = this.create("menuitem");
				add.setAttribute('class', 'menuitem-iconic');
				add.setAttribute("label", 'Open All in Tabs');
				add.setAttribute("oncommand", 'ODPExtension.showIPMenuOpenAll()');
				menupopup.appendChild(add);
			}
		//}

	}

	this.showIPUpdateOver = function (aEvent) {
		//if (this.shared.me) {
			this.removeChilds(tooltip);
			var label = this.create('label');

			var ids = this.documentGetIDs(this.documentGetFocused())
			label.setAttribute('value', ids.join('\n'));
			tooltip.appendChild(label)
		//}
	}
	this.showIPMenuOpenAll = function () {
		var items = []
		for (var a = 0; a < menupopup.childNodes.length; a++) {
			var item = menupopup.childNodes[a]
			if (item.hasAttribute('locked') || item.getAttribute('value').indexOf('http') !== 0)
				continue
			items[items.length] = item.getAttribute('value')
		}
		items = this.arrayUnique(items);
		for(var id in items)
			this.tabOpen(items[id], false, false, false)
	}

	this.showIPDatabaseOpen = function () {
		if (!database) {
			database = this.databaseGet('IDs');
			database.executeSimple('PRAGMA temp_store = 2');
			database.executeSimple('PRAGMA read_uncommitted = true');
			//The MEMORY journaling mode stores the rollback journal in volatile RAM. This saves disk I/O but at the expense of database safety and integrity. If the application using SQLite crashes in the middle of a transaction when the MEMORY journaling mode is set, then the database file will very likely go corrupt.
			//database.executeSimple('PRAGMA journal_mode = memory');
		}
		return database;
	}
	this.showIPDatabaseClose = function () {
		if (database) {
			database.close();
			database = false;
		}
	}
	this.showIPDatabaseInsertID = function (aName, aValue) {
		if (aName != aValue) {
			insert.params('name', aName);
			insert.params('value', aValue);

			insert.executeAsync(true);
		}
	}

	this.showIPDatabaseCreateTable = function () {
			var db = this.showIPDatabaseOpen()
			db.create('\
									CREATE TABLE IF NOT EXISTS \
										`ids` \
									( \
										`id` INTEGER PRIMARY KEY ASC NOT NULL , \
										`name` TEXT NOT NULL , \
										`value` TEXT NOT NULL \
									) \
			');
			db.executeSimple('	CREATE INDEX IF NOT EXISTS `name` ON `ids` (`name`) ');
			db.executeSimple('	CREATE INDEX IF NOT EXISTS `value` ON `ids` (`value`) ');
			db.executeSimple('	CREATE UNIQUE INDEX IF NOT EXISTS `name_value` ON `ids` (`name`, `value`) ');

			this.showIPDatabaseClose()
			this.showIPDatabaseOpen()
	}

	this.showIPDatabaseStatements = function () {
		//if (this.shared.me) {
			insert = database.query('INSERT INTO `ids` ( `name`, `value` ) VALUES (:name, :value) ');
			query_exclusive = database.query('select * from ids where name = :name and value != :value order by value asc, name asc LIMIT 300');
			query_inclusive = database.query('select * from ids where name = :name order by value asc, name asc LIMIT 300');
			query_inclusive_value = database.query('select * from ids where value = :value order by value asc, name asc LIMIT 300');
		//}
	}

	return null;

}).apply(ODPExtension);
(function () {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	var label, menupopup, cache = []
		this.addListener('userInterfaceLoad', function () {
			label = ODPExtension.getElement('toolbarbutton-show-ip');
			menupopup = ODPExtension.getElement('toolbarbutton-show-ip-menupopup');
			ODPExtension.moveNodeBelow(label, label.parentNode.firstChild)
		});

	var database = false;
	var insert, query;

	this.addListener('IPResolved', function (aDomain, aData) {
		ODPExtension.showIPDatabaseInsertIp(aDomain, aData);
	});
	this.addListener('databaseCreate', function () {
		ODPExtension.showIPDatabaseCreateTable();
	});
	this.addListener('databaseReady', function () {
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

	//hides or shows the toolbatbuttons (update,unreview,delete,options) when the user hits the edit url form

	this.showIPUpdateLabel = function (aLocation) {

		var aSubdomain = this.getSubdomainFromURL(aLocation)
		if ( !! cache[aSubdomain])
			label.setAttribute('value', cache[aSubdomain])
		else {
			this.getIPFromDomainAsync(aSubdomain, function (aData) {
				cache[aSubdomain] = aData
				if (aLocation == ODPExtension.focusedURL) {
					label.setAttribute('value', aData);
				}
			});
		}
	}

	this.showIPUpdateMenu = function (aEvent) {
		//empty the menu
		this.removeChilds(menupopup);

		var ip = label.getAttribute('value')
		query.params('ip', ip)
		var row;
		while (row = database.fetchObjects(query)) {

			var add = this.create("menuitem");
			add.setAttribute('class', 'menuitem-iconic');
			add.setAttribute("label", row.domain);
			add.setAttribute("value", 'http://'+row.domain);
			menupopup.appendChild(add);
		}
		menupopup.appendChild(this.create("menuseparator"));

		var add = this.create("menuitem");
		add.setAttribute('class', 'menuitem-iconic');
		add.setAttribute("label", 'Open All in Tabs');
		add.setAttribute("oncommand", 'ODPExtension.showIPMenuOpenAll()');
		menupopup.appendChild(add);

	}
	this.showIPMenuOpenAll = function(){
		for(var a=0;a<menupopup.childNodes.length;a++){
			var item = menupopup.childNodes[a]
			if(item.hasAttribute('locked') || item.getAttribute('value').indexOf('http') !== 0)
				continue
			this.tabOpen(item.getAttribute('value'), false, false, false)
		}
	}

	this.showIPDatabaseOpen = function () {
		if (!database) {
			database = this.databaseGet('IPs');
			database.executeSimple('PRAGMA temp_store = 2');
			database.executeSimple('PRAGMA journal_mode = memory');
		}
		return database;
	}
	this.showIPDatabaseClose = function () {
		if (database) {
			database.close();
			database = false;
		}
	}
	this.showIPDatabaseInsertIp = function (aDomain, aIP) {
		insert.params('ip', aIP);
		insert.params('domain', aDomain);

		database.insertAsync(insert, true);
	}

	this.showIPDatabaseCreateTable = function () {

		var db = this.showIPDatabaseOpen()
		db.create('\
								CREATE TABLE IF NOT EXISTS \
									`ips` \
								( \
									`id` INTEGER PRIMARY KEY ASC NOT NULL , \
									`ip` TEXT NOT NULL , \
									`domain` TEXT NOT NULL \
								) \
						');
		db.executeSimple('	CREATE INDEX IF NOT EXISTS `ip` ON `ips` (`ip`) ');
		db.executeSimple('	CREATE INDEX IF NOT EXISTS `domain` ON `ips` (`domain`) ');
		db.executeSimple('	CREATE UNIQUE INDEX IF NOT EXISTS `ip_domain` ON `ips` (`ip`, `domain`) ');

		this.showIPDatabaseClose()
		this.showIPDatabaseOpen()
	}

	this.showIPDatabaseStatements = function () {
		insert = database.query('INSERT INTO `ips` ( `ip`, `domain` ) VALUES (:ip, :domain) ');

		query = database.query('select * from ips where ip = :ip order by domain asc LIMIT 300');
	}

	return null;

}).apply(ODPExtension);
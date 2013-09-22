(function() {
	//builds the menulist or "select" of the local category finder toolbar

	this.categoryFinderMenuListUpdate = function(list) {
		this.removeChilds(list);
		var lastSelected = this.preferenceGet('locked.advanced.local.category.finder.last.selected');
		var selectedItem = false;
		var databases = this.shared.categories.txt.databases;

		//THE TOPICAL CATEGORIES

		for (var id in databases) {
			var database = databases[id];

			if (database != '' && database.indexOf('World') == -1 && database.indexOf('Regional') == -1 && database.indexOf('Kids') == -1 && database.indexOf('Adult') == -1) {
				var item = this.create('menuitem');
				item.setAttribute('database', database);
				item.setAttribute('label', database.replace('.txt', '').replace(/-/g, ' : ').replace(/_/g, ' '));
				list.appendChild(item);
			}
		}

		//KT

		var item = this.create('menuseparator');
		item.setAttribute('class', 'thin');
		list.appendChild(item);

		var item = this.create('menuitem');
		item.setAttribute('database', 'Kids_and_Teens.txt');
		item.setAttribute('label', 'Kids_and_Teens.txt'.replace('.txt', '').replace(/-/g, ' : ').replace(/_/g, ' '));
		list.appendChild(item);

		//ENGLISH REGIONAL
		var item = this.create('menuseparator');
		item.setAttribute('class', 'thin');
		list.appendChild(item);

		for (var id in databases) {
			var database = databases[id];
			if (database != '' && database.indexOf('World') == -1 && database.indexOf('Regional') != -1) {
				var item = this.create('menuitem');
				item.setAttribute('database', database);
				item.setAttribute('label', database.replace('.txt', '').replace(/-/g, ' : ').replace(/_/g, ' ').replace('Regional : ', ''));
				list.appendChild(item);
			}
		}

		//WORLD
		var item = this.create('menuseparator');
		item.setAttribute('class', 'thin');
		list.appendChild(item);

		for (var id in databases) {
			var database = databases[id];
			if (database != '' && database.indexOf('World') != -1) {
				var item = this.create('menuitem');
				item.setAttribute('database', database);
				item.setAttribute('label', database.replace('.txt', '').replace(/-/g, ' : ').replace(/_/g, ' ').replace('World : ', ''));
				list.appendChild(item);
			}
		}

		//Adult
		var item = this.create('menuseparator');
		item.setAttribute('class', 'thin');
		list.appendChild(item);

		var item = this.create('menuitem');
		item.setAttribute('database', 'Adult.txt');
		item.setAttribute('label', 'Adult'.replace('.txt', '').replace(/-/g, ' : ').replace(/_/g, ' '));
		list.appendChild(item);


		//re select last selected
		var somethingFound = false;
		for (var i = 0; i < list.childNodes.length; i++) {
			if (list.childNodes[i].hasAttribute('database') && list.childNodes[i].getAttribute('database') == lastSelected) {
				list.parentNode.selectedItem = list.childNodes[i];
				somethingFound = true;
				break;
			}
		}
		if (!somethingFound)
			list.parentNode.selectedItem = list.firstChild.nextSibling.nextSibling;
	}
	return null;

}).apply(ODPExtension);
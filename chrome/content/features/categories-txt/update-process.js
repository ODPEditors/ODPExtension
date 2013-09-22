(function() {

	//this separates the categories.txt file in multiples files to do quickly searchs of category names
	this.categoriesTXTUpdateProcess = function() {
		this.categoriesTXT = this.categoriesTXT.split('\n').sort(this.sortLocale);
		var aDate = this.categoriesTXTDate;

		this.categoriesTXTDate = null;
		delete this.categoriesTXTDate;

		var categoryCount = this.categoriesTXT.length;

		var progress = this.progress('local.category.finder');
		progress.reset();
		progress.done = '0';
		progress.running = categoryCount - 1;
		progress.message = this.getString('local.category.finder') + ' : ' + this.getString('progress.process');

		var
		aCategory = '',
			aCategoryLast = '',
			aDatabase = '',
			aDatabaseLast = '',
			aSubDatabase = '',
			aData = '',
			aNodes,
			aCategoryCount = 0;

		this.fileRemove('categories.txt/');

		//the file is not trimed i=1
		for (var i = 0; i < categoryCount; i++) {
			aCategory = this.categorySanitize(this.categoriesTXT[i]);

			if (aCategory == '')
				continue;

			if (i % 50000 == 0) {
				progress.done = i;
				progress.progress();
			}

			aNodes = aCategory.split('/');

			//if there is a subcategory and the subcategory is not an alphabar
			if (aNodes[1] && !/^.$/.test(aNodes[1], 'i')) {
				if (aNodes[0] == 'World' || aNodes[0] == 'Regional')
					aDatabase = aNodes[0] + '-' + aNodes[1] + '.txt';
				else
					aDatabase = aNodes[0] + '.txt';

				if (aDatabase != aDatabaseLast && aData != '') {
					//the first iteration
					if (aDatabaseLast == '')
						aDatabaseLast = aDatabase;

					//too many categories in one file
					if (aCategoryCount > 10000 && aCategoryLast.indexOf('World/') === 0) {
						var aData2 = [];
						aData = aData.split('\n');
						for (var id in aData) {
							if (aData[id] == '')
								continue;
							aNodes = aData[id].split('/');
							aSubDatabase = aNodes[0] + '-' + aNodes[1] + (aNodes[2] ? '-' + aNodes[2] : '-') + '.txt';
							if (!aData2[aSubDatabase])
								aData2[aSubDatabase] = '';
							aData2[aSubDatabase] += aData[id] + '\n';
						}
						for (var id in aData2) {
							this.fileWrite('categories.txt/' + id, aData2[id]);
							//this.dump('categories.txt/'+id);
						}
						aData2 = null;
					} else {
						this.fileWrite('categories.txt/' + aDatabaseLast, aData);
						//this.dump('categories.txt/'+aDatabaseLast);
					}
					aDatabaseLast = aDatabase;
					aData = aCategory;
					aData += '\n';
					aCategoryCount = 1;
				} else {
					aData += aCategory;
					aData += '\n';
					aCategoryCount++;
					aCategoryLast = aCategory;
				}
			}
			//cleaning mem
			this.categoriesTXT[i] = '';
		}
		//the last iteration is not saved inside the bucle
		this.fileWrite('categories.txt/' + aDatabase, aData);
		//	this.dump('categories.txt/'+aDatabase);
		//cleaning mem
		aData = null;
		this.categoriesTXT = null;
		delete this.categoriesTXT;

		progress.done = categoryCount - 1;
		progress.progress();

		if (!aDate)
			this.preferenceSet('locked.advanced.urls.categories.txt.last.update', this.ucFirst(new Date().toLocaleString()));
		else
			this.preferenceSet('locked.advanced.urls.categories.txt.last.update', aDate);

		this.shared.categories.txt.lock = false;

		this.notifyInstances('userInterfaceUpdate');

		this.notifyTab(this.getString('categories.txt.has.been.updated').replace('{DATE}', this.preferenceGet('locked.advanced.urls.categories.txt.last.update')));
	}


	return null;

}).apply(ODPExtension);
(function()
{

			var debugingThisFile = true;

		//load local objects

			this.preferencesLoadLocal = function()
			{
			//	this.dump('preferencesLoadLocal', debugingThisFile);

				//preferences
					this.usePowerExtensionsWhenAvailable = this.preferenceGet('advanced.use.power.extensions');
				//from category
					this.fromCategoryTimeout = null;
					this.fromCategorySelectedCategory = '';
					this.fromCategorySelectedCategories = [];
					this.fromCategoryUpdating = false;
					this.fromCategoryCanceledAutoPopup = false;

				//toolbarbuttons
					this.odpNotesButtonsHidden = true;
				//RDF
					this.rdfDatabaseFile = this.pathSanitize(this.extensionDirectory().path+'/RDF.sqlite');
				//head of temporal files
					this.fileCreateTemporalHead = '<link rel="stylesheet" type="text/css" href="chrome://ODPExtensionxHTML/content/css.css"/><script src="chrome://ODPExtensionxHTML/content/js.js" type="application/x-javascript"></script>';
			}

	return null;

}).apply(ODPExtension);

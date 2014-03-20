(function() {
	//returns the directory for this extension
	this.extensionDirectory = function() {
		//if the user has chose an invalid profile folder
		//or the user never selected a profile folder
		//then use the default profile folder
		if (!this.preferenceExists('extension.directory', 'char') ||
			(
			this.preferenceExists('extension.directory', 'char') &&
			(
			this.preferenceGet('extension.directory') == '' ||
			this.preferenceGet('extension.directory') == 'false' ||
			this.preferenceGet('extension.directory') == 'null' ||
			this.preferenceGet('extension.directory') == '/' ||
			this.preferenceGet('extension.directory') == 'undefined'))) {
			var extensionDirectory = Components.classes["@mozilla.org/file/directory_service;1"]
				.getService(Components.interfaces.nsIProperties)
				.get("ProfD", Components.interfaces.nsIFile);

			//security - works always in a folder with the name of this extension
			extensionDirectory.append('ODPExtension');

			if (!extensionDirectory.exists() || !extensionDirectory.isDirectory()) // if it doesn't exist, create
				extensionDirectory.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, parseInt("0755", 8));

			if (this.preferenceExists('extension.directory', 'char'))
				this.preferenceSet('extension.directory', extensionDirectory.path);

			return extensionDirectory;
		} else {
			//else use the directory selected by the user
			var file = Components.classes["@mozilla.org/file/local;1"].
			createInstance(Components.interfaces.nsILocalFile);

			var path = this.pathSanitize(this.preferenceGet('extension.directory'));

			//security check use always a directory with the name of ODPExtension
			if (path.toLowerCase().indexOf('ODPExtension'.toLowerCase()) != -1) {} else
				path = this.pathSanitize(this.preferenceGet('extension.directory') + '/ODPExtension/');

			//correct the directory
			this.preferenceSet('extension.directory', path);

			file.initWithPath(path)

			if (!file.exists() || !file.isDirectory()) // if it doesn't exist, create
				file.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, parseInt("0755", 8));

			return file;
		}
	}
	//asks the user to open a file
	this.fileAskUserFileOpen = function(aFileName, anExtension) {
		if (!aFileName)
			aFileName = '';
		var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);

		fp.init(window, "ODP Extension", fp.modeOpen);
		fp.defaultExtension = anExtension;
		fp.defaultString = aFileName;
		fp.appendFilter('*.' + anExtension, '*.' + anExtension);

		if (fp.show() != fp.returnCancel) {
			return fp;
		} else {
			return null;
		}
	}
	//asks the user to save a file
	this.fileAskUserFileSave = function(aFileName, anExtension) {
		var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);

		fp.init(window, "ODP Extension", fp.modeSave);
		fp.defaultExtension = anExtension;
		fp.defaultString = aFileName + '.' + anExtension;
		fp.appendFilter('*.' + anExtension, '*.' + anExtension);

		if (fp.show() != fp.returnCancel) {
			return fp;
		} else {
			return null;
		}
	}
	//asks for a location of a folder
	this.fileAskUserFolderSelect = function(aMsg) {
		var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);

		if (!aMsg)
			fp.init(window, "ODP Extension", fp.modeGetFolder);
		else
			fp.init(window, "ODP Extension : " + aMsg, fp.modeGetFolder);

		if (fp.show() != fp.returnCancel) {
			return fp;
		} else {
			return false;
		}
	}
	//copy a file to a desired location
	this.fileCopy = function(sourceFile, destinationFile) {
		try {
			sourceFile = this.pathSanitize(sourceFile);
			destinationFile = this.pathSanitize(destinationFile);
			//remove the target file if exists
			this.fileRemove(destinationFile, true);

			var aDestination = Components.classes["@mozilla.org/file/local;1"]
				.createInstance(Components.interfaces.nsILocalFile);
			aDestination.initWithPath(destinationFile);

			var aFile = Components.classes["@mozilla.org/file/local;1"]
				.createInstance(Components.interfaces.nsILocalFile);
			aFile.initWithPath(sourceFile);

			aFile.copyTo(aDestination.parent, aDestination.leafName);
		} catch (e) {
			this.error('Can\'t copy the file "' + sourceFile + '" to "' + destinationFile + '"\nBrowser says: ' + e);
		}
	}
	//creates a temporal file and returns the url of that file-REVIEW
	this.fileCreateTemporal = function(aName, aTitle, aData) {
		//WTF!!!!!!!!!!!!!!!!!!!!?

		var file = Components.classes["@mozilla.org/file/directory_service;1"]
			.getService(Components.interfaces.nsIProperties)
			.get("TmpD", Components.interfaces.nsIFile);
		//security - works always in a folder with with the name of this extension
		file.append('ODPExtension');
		if (!file.exists() || !file.isDirectory()) // if it doesn't exist, create
		{
			file.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, parseInt("0755", 8));
		}
		file.append(aName);
		file.createUnique(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, parseInt("0644", 8));

		var WriteStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
		// use 0x02 | 0x10 to open file for appending.
		WriteStream.init(file, 0x02 | 0x08 | 0x20, parseInt("0644", 8), 0); // write, create, truncate

		var why_not_a_simple_fopen_fwrite = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);

		why_not_a_simple_fopen_fwrite.init(WriteStream, "utf-8", 0, 0xFFFD); // U+FFFD = replacement character
		var head;
		if (aData.indexOf('<!DOCTYPE') != -1 || aName.indexOf('.html') == -1) {} else {
			head = '<!DOCTYPE HTML><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><title>' + this.htmlSpecialCharsEncode(aTitle) + '</title>';
			if (!this.fileCreateTemporalHead) {} else
				head += this.fileCreateTemporalHead;

			aData = head + '</head><body>' + aData + '</body></html>';
		}
		why_not_a_simple_fopen_fwrite.writeString(aData);
		why_not_a_simple_fopen_fwrite.close();
		WriteStream.close();

		var path = String(file.path);

		aName = aTitle = aData = file = WriteStream = why_not_a_simple_fopen_fwrite = head = null

		return path;
	}
	this.fileDame = function(aFilePath) {
		var aFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		aFile.initWithPath(this.pathSanitize(aFilePath));
		return aFile;
	}
	//returns the dirname of a file
	this.fileDirname = function(aFilePath) {
		aFilePath = this.pathSanitize(aFilePath);

		var aDestination = Components.classes["@mozilla.org/file/local;1"]
			.createInstance(Components.interfaces.nsILocalFile);
		aDestination.initWithPath(aFilePath);

		var dirname = aDestination.parent.path;
		return dirname;
	}
	//returns true if a file exists
	this.fileExists = function(aFilePath, isSecure) {
		try {
			if(!isSecure)
				aFilePath = this.pathSanitize(this.extensionDirectory().path + '/' + aFilePath);
			else
				aFilePath = this.pathSanitize(aFilePath);

			var aFile = Components.classes["@mozilla.org/file/local;1"]
				.createInstance(Components.interfaces.nsILocalFile);
			aFile.initWithPath(aFilePath);

			if (aFile.exists())
				return true;
			else
				return false;
		} catch (e) {
			this.error('Can\'t check if file exists "' + aFilePath + '"\nBrowser says: ' + e);
			return false;
		}
	}
	//returns the content of a file
	this.fileRead = function(aFilePath, useInsecure) {
		try {
			if(!this.fileExists(aFilePath, useInsecure)){
				this.error('File does not exists "' + aFilePath + '"');
				return ''
			} else {

				var aFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				if (!useInsecure)
					aFile.initWithPath(this.pathSanitize(this.extensionDirectory().path + '/' + aFilePath));
				else
					aFile.initWithPath(this.pathSanitize(aFilePath));


				var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
				converter.charset = "UTF-8"; /* The character encoding you want, using UTF-8 here */

				var is = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
				is.init(aFile, 0x01, parseInt("0444", 8), 0);

				var sis = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
				sis.init(is);

				var aData = converter.ConvertToUnicode(sis.read(sis.available()));

				is.close();
				sis.close();
				return aData;
			}

		} catch (e) {
			this.error('Can\'t read the file "' + aFilePath + '"\nBrowser says: ' + e);
			return false;
		}
	}
	//removes a file from the file system
	this.fileRemove = function(aFileOrDirectory, isSecure) {
		if (isSecure)
			aFileOrDirectory = this.pathSanitize(aFileOrDirectory);
		else {
			if (!aFileOrDirectory)
				aFileOrDirectory = '/';
			aFileOrDirectory = this.pathSanitize(this.extensionDirectory().path + '/' + aFileOrDirectory);
		}


		var aFile = Components.classes["@mozilla.org/file/local;1"]
			.createInstance(Components.interfaces.nsILocalFile);
		aFile.initWithPath(aFileOrDirectory);

		//security check - be sure to delete a file from this extension
		if (aFile.exists() && (String(aFile.path).toLowerCase().indexOf('ODPExtension'.toLowerCase()) != -1 || isSecure)) {
			try {
				//this.dump('Deleting:'+aFile.path, true);
				aFile.remove(true)
			} catch (e) {
				this.error('Can\'t remove the file or directory:"' + aFileOrDirectory + '"\nBrowser says: ' + e);
			}
		} else if (aFile.exists()) {
			this.error("This add-on don't enjoys deleting files outside of your extension's profile directory. \nThe file : " + aFile.path);
		}
	}
	//writes content to a file, delete the file if exists
	this.fileWrite = function(aFilePath, aData, isSecure) {
		try {
			if (isSecure)
				aFilePath = this.pathSanitize(aFilePath);
			else
				//only write files to this extension directory
				aFilePath = this.pathSanitize(this.extensionDirectory().path + '/' + aFilePath);

			//remove the file if exists
			this.fileRemove(aFilePath, isSecure);

			//create the directory if not exists
			this.folderCreate(this.fileDirname(aFilePath));

			//write the content to the file
			var aFile = Components.classes["@mozilla.org/file/local;1"]
				.createInstance(Components.interfaces.nsILocalFile);
			aFile.initWithPath(aFilePath);

			var WriteStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
			// use 0x02 | 0x10 to open file for appending.
			//WriteStream.init(aFile, 0x02 | 0x08 | 0x20,  parseInt("0644", 8), 0); // write, create, truncatefile,
			WriteStream.init(aFile, 0x02 | 0x08 | 0x20, parseInt("0666", 8), 0); // write, create, truncatefile,

			var why_not_a_simple_fopen_fwrite = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);

			why_not_a_simple_fopen_fwrite.init(WriteStream, "utf-8", 0, 0xFFFD); // U+FFFD = replacement character
			why_not_a_simple_fopen_fwrite.writeString(aData);

			why_not_a_simple_fopen_fwrite.close();
			WriteStream.close();
			var path = aFile.path;

			return path;
		} catch (e) {}
		this.error('Can\'t write to the file "' + aFilePath + '"\nBrowser says: ' + e);
		return null;
	}
	var NetUtil = {}
	Components.utils['import']("resource://gre/modules/NetUtil.jsm", NetUtil);
	var FileUtils = {}
	Components.utils['import']("resource://gre/modules/FileUtils.jsm", FileUtils);

	this.fileWriteAsync = function(aFilePath, aData, isSecure){
		try {
			if (isSecure)
				aFilePath = this.pathSanitize(aFilePath);
			else
				//only write files to this extension directory
				aFilePath = this.pathSanitize(this.extensionDirectory().path + '/' + aFilePath);

			//remove the file if exists
			this.fileRemove(aFilePath, isSecure);

			//create the directory if not exists
			this.folderCreate(this.fileDirname(aFilePath));

			//write the content to the file
			var aFile = Components.classes["@mozilla.org/file/local;1"]
				.createInstance(Components.interfaces.nsILocalFile);
			aFile.initWithPath(aFilePath);

			var ostream = FileUtils.FileUtils.openSafeFileOutputStream(aFile)

			var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].
			                createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
			converter.charset = "UTF-8";
			var istream = converter.convertToInputStream(aData);

			// The last argument (the callback) is optional.
			NetUtil.NetUtil.asyncCopy(istream, ostream, function(status) {
			  if (!Components.isSuccessCode(status)) {
				ODPExtension.error('Can\'t write to the file "' + aFilePath + '"\n');
			  }
			});
		} catch (e) {
			ODPExtension.error('Can\'t write to the file "' + aFilePath + '"\n');
		}
	}

	//creates a folder if not exists
	this.folderCreate = function(aFolderPath) {
		try {
			aFolderPath = this.pathSanitize(aFolderPath);

			var aFolder = Components.classes["@mozilla.org/file/local;1"]
				.createInstance(Components.interfaces.nsILocalFile);
			aFolder.initWithPath(aFolderPath);

			if (!aFolder.exists() || !aFolder.isDirectory()) // if it doesn't exist, create
			{
				aFolder.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, parseInt("0755", 8));
			}
		} catch (e) {
			this.error('Can\'t create the folder :"' + aFolderPath + '"\nBrowser says: ' + e);
		}
	}
	//returns an array with the of all the files in a folder
	this.folderListContent = function(aFolderPath) {
		aFolderPath = this.pathSanitize(this.extensionDirectory().path + '/' + aFolderPath);

		this.folderCreate(aFolderPath);

		var aDirectory = Components.classes["@mozilla.org/file/local;1"].
		createInstance(Components.interfaces.nsILocalFile);

		aDirectory.initWithPath(aFolderPath);

		var folderContent = [],
			entry, dirList = [],
			aName, entries = aDirectory.directoryEntries;

		while (entries.hasMoreElements()) {
			entry = entries.getNext();
			entry.QueryInterface(Components.interfaces.nsIFile);

			aName = this.string(entry.path).replace(/\\/g, '/').split('/').pop();
			if (aName == '')
				continue;
			folderContent[folderContent.length] = aName;
		}
		return folderContent.sort(this.sortLocale); //this.sortLocale(
	}
	this.folderOpen = function(aFilePath) {
		var aFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		aFile.initWithPath(this.pathSanitize(aFilePath));
		try {
			aFile.reveal();
		} catch (e) {
			var aURI = Components.classes["@mozilla.org/network/io-service;1"]
				.getService(Components.interfaces.nsIIOService)
				.newFileURI(aFilePath);
			this.openURI(aURI);
		}
	}
	//return a good file path for this system, also fix when a profile changes the OS
	this.pathSanitize = function(aFilePath) {
		//aFilePath = aFilePath.split('\\').join('/').split('/').join(this.__DIRECTORY_SEPARATOR__);
		aFilePath = aFilePath.split('\\').join('/').split('/').join(this.__DIRECTORY_SEPARATOR__).split(this.__DIRECTORY_SEPARATOR__ + this.__DIRECTORY_SEPARATOR__).join(this.__DIRECTORY_SEPARATOR__);
		//ODPExtension.dump(aFilePath);
		return aFilePath;
	}

	return null;

}).apply(ODPExtension);
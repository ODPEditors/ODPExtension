/* 
	Parse in a background thread the ODP RDF files and builds a SQLite database with the data.
	GNU GPL Version 3 - tito (ed:development) <extensiondevelopment@gmail.com>
*/

const nsIODPParser = Components.interfaces.nsIODPParser;
const nsISupports = Components.interfaces.nsISupports;
const nsIObserver = Components.interfaces.nsIObserver;

const CLASS_ID = Components.ID("{4505e350-9cbd-11df-981c-0800200c9a66}");
const CLASS_NAME = "Parse in a background thread the ODP RDF files and builds a SQLite database with the data parsed.";
const CONTRACT_ID = "@particle.universe.tito/ODPParser;2";

function ODPParser(){this.wrappedJSObject = this;}

ODPParser.prototype = 
{
	classID : CLASS_ID,
	classDescription : CLASS_NAME,
	contractID : CONTRACT_ID,
	observe: function(aSubject, aTopic, aData)
	{
	},

	trim					:function(aString){return aString.replace(/^\s+/, '').replace(/\s+$/, '');},
	htmlSpecialCharsDecode	:function(aString){return aString.split('&lt;').join('<').split('&gt;').join('>').split('&quot;').join('"').split('&apos;').join("'").split('&amp;').join('&');},
	stripTags				:function(aString){return aString.replace(/<[^>]*>/g, '')},
	categorySanitize		:function(aCategory){return this.htmlSpecialCharsDecode(aCategory.replace(/^[^\:]+\:/, '').replace(/^Top\//, '').replace(/\/+$/, ''))+'/';},
	categoriesIDs 			: [],
	categoryCount 			: 0,
	categoryID 				:
							function(aCategory) //resolves the category ID
							{
								if(!this.categoriesIDs[aCategory])
								{
									var id = ++this.categoryCount;
									this.categoriesIDs[aCategory] = id;
									
									var parent 	= aCategory.split('/');
										parent.pop();
									var name 	= parent.pop();
										parent 	= this.categoryID(parent.join('/')+'/');

									this.insertCategory.params['categories_id'] = id;
									this.insertCategory.params['categories_id_parent'] = parent;
									this.insertCategory.params['categories_catid'] = 0;
									this.insertCategory.params['categories_path'] = aCategory;
									this.insertCategory.params['categories_path_reversed'] = aCategory.split('').reverse().join('');
									this.insertCategory.params['categories_category'] = name;
									this.insertCategory.params['categories_last_update'] = '0000-00-00 00:00:00';
									this.insertCategory.params['categories_description'] = '';

									this.insertCategory.execute();//execute
									
									return id;
								}
								else
								{
									return this.categoriesIDs[aCategory];
								}
							},
	fileOpen:function(aFilePath)
	{
		this.file =  Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);  
		this.file.initWithPath(aFilePath);

		if(!this.file.exists())
			return false;

		this.istream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);  
		this.istream.init(this.file, 0x01, 0444, 0);  
		this.istream.QueryInterface(Components.interfaces.nsILineInputStream);  
		
		this.is  = Components.classes["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);
		
		this.is.init(this.istream, "UTF-8", 1024, 0xFFFD);
		this.is.QueryInterface(Components.interfaces.nsIUnicharLineInputStream);
		
		return true;
	},
	fileClose:function()
	{
		this.istream.close();
		this.is.close();
	},
	//output to the console messages
	dump : function(something)
	{/*
		var mainThreadTask = {};
			mainThreadTask.aMsg = JSON.stringify(something);
			mainThreadTask.run = function() 
			{*/
				Components.classes["@mozilla.org/consoleservice;1"]
					.getService(Components.interfaces.nsIConsoleService)
					.logStringMessage(something);
			/*}
		var mainThread = Components.classes["@mozilla.org/thread-manager;1"].getService(Components.interfaces.nsIThreadManager).mainThread;
			mainThread.dispatch(mainThreadTask, mainThread.DISPATCH_NORMAL);*/
	},
	parse: function(aRDFFolderPath, aRDFSqliteDatabasePath)
	{
		this.aRDFFolderPath = aRDFFolderPath;
		this.aRDFSqliteDatabasePath = aRDFSqliteDatabasePath;
		/*
		this.threadTask = {};
		this.threadTask.run = function() 
		{
		*/
		Components.classes["@mozilla.org/consoleservice;1"]
					.getService(Components.interfaces.nsIConsoleService)
					.logStringMessage('parseStart');
		this.parseStart();	/*
		}
		this.thread = Components.classes["@mozilla.org/thread-manager;1"].getService(Components.interfaces.nsIThreadManager).newThread(0);
		this.thread.dispatch(this.threadTask, this.thread.DISPATCH_NORMAL);*/
	},
	parseStart:function()
	{
		this.dump('Starting parsing...'+(new Date().toLocaleString()));

		//tasking
			//sets the id of this data parsed
			this.parseSetTable(this.aRDFFolderPath+'ad-structure.rdf.u8');
			this.parseSetTable(this.aRDFFolderPath+'kt-structure.rdf.u8');
			this.parseSetTable(this.aRDFFolderPath+'structure.rdf.u8');
			
			this.parseSetTable(this.aRDFFolderPath+'ad-content.rdf.u8');
			this.parseSetTable(this.aRDFFolderPath+'kt-content.rdf.u8');
			this.parseSetTable(this.aRDFFolderPath+'content.rdf.u8');

			//gets create the working database
			this.databaseOpen();
			this.databaseClean();
			this.databaseCreate();
			
			//hold on memory the categories ids
			this.parseStructureTXT();
			
			//parse structure u8
			this.parseStructureU8('ad-structure.rdf.u8');
			this.parseStructureU8('kt-structure.rdf.u8');
			this.parseStructureU8('structure.rdf.u8');
			
			//parse content u8
			this.parseContentU8('ad-content.rdf.u8');
			this.parseContentU8('kt-content.rdf.u8');
			this.parseContentU8('content.rdf.u8');
			//creating index
			this.databaseIndex();
			//closing database
			this.databaseClose();
			
			//free memory
			delete this.categoriesIDs;
			this.categoriesIDs = [];
			this.categoryCount = 0;
			
			this.dump('Parsing complete!! '+(new Date().toLocaleString()));
			/*
			var mainThreadTask = {};
				mainThreadTask.run = function() 
				{*/
					Components.classes['@particle.universe.tito/TheExtension;3']
												.getService().wrappedJSObject.code('ODPExtension').rdfParserComplete();/*
				}
			var mainThread = Components.classes["@mozilla.org/thread-manager;1"].getService(Components.interfaces.nsIThreadManager).mainThread;
				mainThread.dispatch(mainThreadTask, mainThread.DISPATCH_NORMAL);*/
	},
	databaseOpen:function()
	{
		this.dump('Opening database...');
		//opening or creating the database file
		this.aDatabaseFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);	
		this.aDatabaseFile.initWithPath(this.aRDFSqliteDatabasePath);
		this.storageService = Components.classes["@mozilla.org/storage/service;1"].getService(Components.interfaces.mozIStorageService);  
		this.aConnection = this.storageService.openDatabase(this.aDatabaseFile);
		//this.aConnection = this.storageService.openSpecialDatabase('memory');//for tests, faster
		this.aConnection.executeSimpleSQL('PRAGMA temp_store = 2');
		this.aConnection.executeSimpleSQL('PRAGMA journal_mode = memory');
		
		this.dump('Database opened...');
	},
	databaseClose:function()
	{
		this.insertCategory.finalize();
		this.insertEditor.finalize();
		this.insertRelated.finalize();
		this.insertAltlang.finalize();
		this.insertLink.finalize();
		this.insertNewsgroup.finalize();
		
		this.aConnection.close();
	},
	databaseClean:function()
	{
		this.dump('Cleaning database tables...');
		//tables
		this.aConnection.executeSimpleSQL('drop table if exists `'+this.table+'_categories`');
		this.aConnection.executeSimpleSQL('drop table if exists `'+this.table+'_editor`');
		this.aConnection.executeSimpleSQL('drop table if exists `'+this.table+'_related`');
		this.aConnection.executeSimpleSQL('drop table if exists `'+this.table+'_altlang`');
		this.aConnection.executeSimpleSQL('drop table if exists `'+this.table+'_link`');
		this.aConnection.executeSimpleSQL('drop table if exists `'+this.table+'_newsgroup`');
		
		this.dump('Database tables cleaned...');
	},
	databaseCreate:function()
	{
		this.dump('Creating database tables...');
		
		this.aConnection.executeSimpleSQL('	CREATE TABLE IF NOT EXISTS `'+this.table+'_categories` ( `categories_id` INTEGER PRIMARY KEY ASC  NOT NULL, `categories_id_parent` INTEGER  NOT NULL, `categories_catid` INTEGER NOT NULL, `categories_path` TEXT NOT NULL, `categories_path_reversed` TEXT NOT NULL, `categories_category` TEXT  NOT NULL, `categories_last_update` DATETIME  NOT NULL, `categories_description` TEXT NOT NULL)');
		this.aConnection.executeSimpleSQL('	CREATE TABLE IF NOT EXISTS `'+this.table+'_editor` ( `editor_id` INTEGER PRIMARY KEY ASC NOT NULL , `editor_editor` VARCHAR  NOT NULL, `editor_id_category` INTEGER  NOT NULL)');
		this.aConnection.executeSimpleSQL('	CREATE TABLE IF NOT EXISTS `'+this.table+'_related` ( `related_id_to` INTEGER  NOT NULL, `related_id_from` INTEGER  NOT NULL)');
		this.aConnection.executeSimpleSQL('	CREATE TABLE IF NOT EXISTS `'+this.table+'_altlang` ( `altlang_id_to` INTEGER  NOT NULL, `altlang_id_from` INTEGER  NOT NULL, `altlang_position` INTEGER  NOT NULL)');
		this.aConnection.executeSimpleSQL('	CREATE TABLE IF NOT EXISTS `'+this.table+'_link`    ( `link_id_to` INTEGER  NOT NULL, `link_id_from` INTEGER  NOT NULL, `link_name` TEXT NOT NULL, `link_position` INTEGER  NOT NULL)');
		this.aConnection.executeSimpleSQL('	CREATE TABLE IF NOT EXISTS `'+this.table+'_newsgroup`    ( `newsgroup_group` TEXT  NOT NULL, `newsgroup_id_category` INTEGER  NOT NULL )');
		
		//inserts
		this.insertCategory = 	this.aConnection.createStatement('INSERT INTO `'+this.table+'_categories` ( `categories_id`, `categories_id_parent`, `categories_catid`, `categories_path`,`categories_path_reversed`,  `categories_category` , `categories_last_update` , `categories_description` ) VALUES (  :categories_id, :categories_id_parent ,   :categories_catid,  :categories_path,  :categories_path_reversed,   :categories_category, :categories_last_update ,   :categories_description )')
		this.insertEditor = 	this.aConnection.createStatement('INSERT INTO `'+this.table+'_editor` ( `editor_editor`, `editor_id_category` ) VALUES (  :editor_editor, :editor_id_category )')
		this.insertRelated = 	this.aConnection.createStatement('INSERT INTO `'+this.table+'_related` ( `related_id_to`, `related_id_from` ) VALUES (  :related_id_to, :related_id_from )')
		this.insertAltlang = 	this.aConnection.createStatement('INSERT INTO `'+this.table+'_altlang` ( `altlang_id_to`, `altlang_id_from`, `altlang_position` ) VALUES (  :altlang_id_to, :altlang_id_from, :altlang_position )')
		this.insertLink = 		this.aConnection.createStatement('INSERT INTO `'+this.table+'_link` ( `link_id_to`, `link_id_from` , `link_name`, `link_position`  ) VALUES (  :link_id_to, :link_id_from, :link_name, :link_position )')
		this.insertNewsgroup = 	this.aConnection.createStatement('INSERT INTO `'+this.table+'_newsgroup` ( `newsgroup_group`, `newsgroup_id_category`) VALUES (  :newsgroup_group, :newsgroup_id_category )')
		//updates
		
		this.dump('Database tables created...');
	},
	databaseIndex:function()
	{
		this.dump('Creating database index...');
		
		this.aConnection.executeSimpleSQL('	CREATE UNIQUE INDEX IF NOT EXISTS `categories_path` ON `'+this.table+'_categories` (`categories_path` ASC) ');
		this.aConnection.executeSimpleSQL('	CREATE UNIQUE INDEX IF NOT EXISTS `categories_path_reversed` ON `'+this.table+'_categories` (`categories_path_reversed` ASC) ');
		this.aConnection.executeSimpleSQL('	CREATE INDEX IF NOT EXISTS `categories_id_parent` ON `'+this.table+'_categories` (`categories_id_parent` ASC) ');
		this.aConnection.executeSimpleSQL('	CREATE INDEX IF NOT EXISTS `editor_editor` ON `'+this.table+'_editor` (`editor_editor` ASC) ');
		this.aConnection.executeSimpleSQL('	CREATE INDEX IF NOT EXISTS `editor_id_category` ON `'+this.table+'_editor` (`editor_id_category` ASC) ');
		this.aConnection.executeSimpleSQL('	CREATE INDEX IF NOT EXISTS `related_id_to` ON `'+this.table+'_related` (`related_id_to` ASC) ');
		this.aConnection.executeSimpleSQL('	CREATE INDEX IF NOT EXISTS `related_id_from` ON `'+this.table+'_related` (`related_id_from` ASC) ');
		this.aConnection.executeSimpleSQL('	CREATE INDEX IF NOT EXISTS `altlang_id_to` ON `'+this.table+'_altlang` (`altlang_id_to` ASC) ');
		this.aConnection.executeSimpleSQL('	CREATE INDEX IF NOT EXISTS `altlang_id_from` ON `'+this.table+'_altlang` (`altlang_id_from` ASC) ');
		this.aConnection.executeSimpleSQL('	CREATE INDEX IF NOT EXISTS `link_id_to` ON `'+this.table+'_link` (`link_id_to` ASC) ');
		this.aConnection.executeSimpleSQL('	CREATE INDEX IF NOT EXISTS `link_id_from` ON `'+this.table+'_link` (`link_id_from` ASC) ');
		this.aConnection.executeSimpleSQL('	CREATE INDEX IF NOT EXISTS `newsgroup_id_category` ON `'+this.table+'_newsgroup` (`newsgroup_id_category` ASC) ');
		
		this.dump('Database index created...');
	},
	parseSetTable:function(aFile)//finding generated at
	{
		if(!this.fileOpen(aFile))
		{
			this.fileClose()
			this.dump('File no exists:'+aFile);
			return false;
		}

		this.rdfHeader = '';
		this.rdfFooter = '</RDF>';
		
			var cont = true;
			var line = {};
			var value = '';
			
			for(;cont = this.is.readLine(line);)
			{
				value = this.trim(line.value);
	
				if(value.indexOf('<!-- Generated at ') === 0)
				{
					this.table = value.replace(/<!-- Generated at ([0-9]{4}-[0-9]{2}-[0-9]{2}).*/, '$1').split('-').join('');
				}
				if(value.indexOf('<Topic') === 0)
				{
					break;
				}
				this.rdfHeader += value;
			}
			
		this.fileClose();
		this.dump('Table id set...');
		return true;
	},
	parseStructureTXT:function()//sets an id for each category found on the categories.txt
	{
		this.dump('Setting categories ids...');
		if(!this.fileOpen(this.aRDFFolderPath+'categories.txt'))
		{
			this.fileClose()
			this.dump('File no exists:'+this.aRDFFolderPath+'categories.txt');
			return;
		}

			var cont = true;
			var line = {};
				
			this.categoriesIDs['/'] = 1;//don't remove this
			this.categoriesIDs['Top/'] = 2;//don't remove this
			for(var i=3;cont = this.is.readLine(line);i++)
				this.categoriesIDs[this.categorySanitize(line.value)] = i;
			this.categoriesIDs[this.categorySanitize(line.value)] = ++i;
			this.categoryCount = i;
		
		this.fileClose();
		this.dump('Category ids set...');
	},
	find: function(aFile, aQuery)
	{	
			this.parseSetTable(aFile);

			if(!this.fileOpen(aFile))
			{
				this.fileClose()
				this.dump('File no exists:'+aFile);
				return;
			}

		//initializing parsing
		
			var cont = true;
			var line = {};
			var value = '';
			var aTopic = '';
			var result = {};
				result.count = 0;
				result.data = this.rdfHeader;
		//parsing

			for(;cont = this.is.readLine(line);)
			{
				value = this.trim(line.value);
				
				if(value.indexOf('<Topic') === 0)
				{
					aTopic = value;
					aTopic += '\n';

					for(;cont = this.is.readLine(line);)
					{
						value = this.trim(line.value);
						
						aTopic += value;
						aTopic += '\n';

						if(value.indexOf('</Topic') === 0)
						{
							if(aTopic.indexOf(aQuery) != -1)
							{
								result.data += aTopic;
								result.count++;
							}
							break;
						}
					}
				}
			}
			
			this.fileClose();
			
			result.data +=  this.rdfFooter;
			
			return result;
			
	},
	parseStructureU8: function(aFile)
	{	
			this.dump('Parsing '+aFile+'...');

		//opening for reading the structure.rdf.u8 by lines
			
			if(!this.fileOpen(this.aRDFFolderPath+aFile))
			{
				this.fileClose()
				this.dump('File no exists:'+this.aRDFFolderPath+aFile);
				return;
			}

		//initializing parsing
		
			var cont = true;
			var line = {};
			var value = '';
			var aCategory = {};
			var count = 0;
			var aTopic = '';
			var categoryRegExp = /.+r\:resource="([^"]*)".+/;
			
		//parsing

			this.aConnection.beginTransaction();
			
			for(;cont = this.is.readLine(line);)
			{
				value = this.trim(line.value);
				
				if(value.indexOf('<Topic') === 0)
				{
					//this.dump(value);
					//return;
				var aTopic = value;
					aTopic += '\n';
					count++;

				var aCategory = {};
					aCategory.path = this.categorySanitize(value.replace(/.+r\:id="([^"]*)".+/, '$1'));
					aCategory.id = this.categoryID(aCategory.path);
					aCategory.id_parent 	= aCategory.path.split('/');
					aCategory.id_parent.pop();
					aCategory.category 	= aCategory.id_parent.pop();
					aCategory.id_parent 	= this.categoryID(aCategory.id_parent.join('/')+'/');
					
					aCategory.catid = '';
					aCategory.lastUpdate = '';
					aCategory.description = '';
					
					aCategory.editors = []
					aCategory.related = []
					aCategory.altlang = []
					aCategory.link = []
					aCategory.newsgroup = []
						
					for(;cont = this.is.readLine(line);)
					{
						value = this.trim(line.value);
						
						aTopic += value;
						aTopic += '\n';

						if(value.indexOf('</Topic') === 0)
						{
								try
								{
									//saving
									this.insertCategory.params['categories_id'] = aCategory.id;
									this.insertCategory.params['categories_id_parent'] = aCategory.id_parent;
									this.insertCategory.params['categories_catid'] = aCategory.catid;
									this.insertCategory.params['categories_path'] = aCategory.path;
									this.insertCategory.params['categories_path_reversed'] = aCategory.path.split('').reverse().join('');
									this.insertCategory.params['categories_category'] = aCategory.category;
									this.insertCategory.params['categories_last_update'] = aCategory.lastUpdate;
									this.insertCategory.params['categories_description'] = aCategory.description;
									this.insertCategory.execute();//execute
								}
								catch(e)
								{
									this.dump(e);
									this.dump(aCategory);
									this.dump(this.aConnection.lastErrorString);
									this.dump(aTopic);
									this.dump('---------');
								}
	
								for(var i=0;i<aCategory.editors.length;i++)
								{
									this.insertEditor.params['editor_editor'] = aCategory.editors[i];
									this.insertEditor.params['editor_id_category'] = aCategory.id;
									this.insertEditor.execute();//executeAsync
								}
								for(var i=0;i<aCategory.related.length;i++)
								{
									this.insertRelated.params['related_id_to'] = aCategory.related[i];
									this.insertRelated.params['related_id_from'] = aCategory.id;
									this.insertRelated.execute();//executeAsync
								}
								for(var i=0;i<aCategory.altlang.length;i++)
								{
									this.insertAltlang.params['altlang_id_to'] = aCategory.altlang[i].link;
									this.insertAltlang.params['altlang_id_from'] = aCategory.id;
									this.insertAltlang.params['altlang_position'] = aCategory.altlang[i].position;
									this.insertAltlang.execute();//execute
								}
								for(var i=0;i<aCategory.link.length;i++)
								{
									this.insertLink.params['link_id_to'] = aCategory.link[i].link;
									this.insertLink.params['link_id_from'] = aCategory.id;
									this.insertLink.params['link_name'] = aCategory.link[i].name;
									this.insertLink.params['link_position'] = aCategory.link[i].position;
									this.insertLink.execute();//executeAsync
								}
								for(var i=0;i<aCategory.newsgroup.length;i++)
								{
									this.insertNewsgroup.params['newsgroup_group'] = aCategory.newsgroup[i];
									this.insertNewsgroup.params['newsgroup_id_category'] = aCategory.id;
									this.insertNewsgroup.execute();//executeAsync
								}
							aCategory = {};
							aTopic = '';
							break;
						}
						else if(value.indexOf('<catid') === 0)
							aCategory.catid = this.stripTags(value);
						else if(value.indexOf('<lastUpdate') === 0)
							aCategory.lastUpdate = this.stripTags(value);
						else if(value.indexOf('<d:Description') === 0)
							aCategory.description = this.htmlSpecialCharsDecode(this.stripTags(value));
						else if(value.indexOf('<editor') === 0)
							aCategory.editors[aCategory.editors.length] = value.replace(categoryRegExp, '$1');
						else if(value.indexOf('<newsgroup') === 0)
							aCategory.newsgroup[aCategory.newsgroup.length] = value.replace(categoryRegExp, '$1');
						else if(value.indexOf('<related') === 0)
							aCategory.related[aCategory.related.length] = this.categoryID(this.categorySanitize(value.replace(categoryRegExp, '$1')));
						else if(value.indexOf('<altlang') === 0)
						{
							var tmp = {};
								tmp.link =  this.categoryID(this.categorySanitize(value.replace(categoryRegExp, '$1')));

							if(value.indexOf('<altlang ') === 0)
								tmp.position =  0;
							else if(value.indexOf('<altlang1') === 0)
								tmp.position =  1;
							else
								tmp.position =  2;

							aCategory.altlang[aCategory.altlang.length] = tmp;			
						}
						else if(value.indexOf('<symbolic') === 0)
						{
							var tmp = {};
								tmp.name = this.htmlSpecialCharsDecode(value.replace(/.+r\:resource="([^\:]*)\:([^"]*)".+/, '$1'));
								tmp.link =  this.categoryID(this.categorySanitize(value.replace(categoryRegExp, '$1')));

							if(value.indexOf('<symbolic ') === 0)
								tmp.position = 0;
							else if(value.indexOf('<symbolic1') === 0)
								tmp.position =  1;
							else
								tmp.position = 2;

							aCategory.link[aCategory.link.length] = tmp;
						}
					}
				}
			}
			
		this.aConnection.commitTransaction();

		this.fileClose();
		this.dump('Parsing '+aFile+' done...');
	},
	parseContentU8: function(aFile)
	{	
			this.dump('Parsing '+aFile+'...');

		//opening for reading the structure.rdf.u8 by lines
			
			if(!this.fileOpen(this.aRDFFolderPath+aFile))
			{
				this.fileClose()
				this.dump('File no exists:'+this.aRDFFolderPath+aFile);
				return;
			}
			
			this.dump('Parsing '+aFile+' done...');
	},

   QueryInterface: function(aIID)
  {
    if (
		!aIID.equals(nsIODPParser)
		&& !aIID.equals(nsISupports)
		&& !aIID.equals(nsIObserver)
		)
      throw Components.results.NS_ERROR_NO_INTERFACE;
    return this;
  }
};

var ODPParserFactory = {
  createInstance: function (aOuter, aIID)
  {
    if (aOuter != null)
      throw Components.results.NS_ERROR_NO_AGGREGATION;
    return (new ODPParser()).QueryInterface(aIID);
  }
};

/***********************************************************
module definition (xpcom registration)
***********************************************************/
var ODPParserModule = {
  registerSelf: function(aCompMgr, aFileSpec, aLocation, aType)
  {
    aCompMgr = aCompMgr.
        QueryInterface(Components.interfaces.nsIComponentRegistrar);
    aCompMgr.registerFactoryLocation(CLASS_ID, CLASS_NAME, 
        CONTRACT_ID, aFileSpec, aLocation, aType);
  },

  unregisterSelf: function(aCompMgr, aLocation, aType)
  {
    aCompMgr = aCompMgr.
        QueryInterface(Components.interfaces.nsIComponentRegistrar);
    aCompMgr.unregisterFactoryLocation(CLASS_ID, aLocation);        
  },
  
  getClassObject: function(aCompMgr, aCID, aIID)
  {
    if (!aIID.equals(Components.interfaces.nsIFactory))
      throw Components.results.NS_ERROR_NOT_IMPLEMENTED;

    if (aCID.equals(CLASS_ID))
      return ODPParserFactory;

    throw Components.results.NS_ERROR_NO_INTERFACE;
  },

  canUnload: function(aCompMgr) { return true; }
};

/***********************************************************
module initialization

When the application registers the component, this function
is called.
***********************************************************/
//http://forums.mozillazine.org/viewtopic.php?f=19&t=1957409
try
{
  Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
}
catch(e) { }

/**
* XPCOMUtils.generateNSGetFactory was introduced in Mozilla 2 (Firefox 4).
* XPCOMUtils.generateNSGetModule is for Mozilla 1.9.1 (Firefox 3.5).
*/

if ("undefined" == typeof XPCOMUtils) // Firefox <= 2.0
{
  function NSGetModule(aComMgr, aFileSpec)
  {
    return ODPParser;
  }
}
else if (XPCOMUtils.generateNSGetFactory)
  var NSGetFactory = XPCOMUtils.generateNSGetFactory([ODPParser]);
else
  var NSGetModule = XPCOMUtils.generateNSGetModule([ODPParser]);
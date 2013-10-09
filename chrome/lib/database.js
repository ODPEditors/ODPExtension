(function() {
	//gets/creates a database and put the connection in a shared object, also define all the custom functions needed to work with the database
	this.databaseGet = function(aDatabase, aPath) {
		if (!aPath)
			var aDatabaseConn = aDatabase + '.sqlite.connection';
		else
			var aDatabaseConn = aDatabase + '.' + this.sha256(aPath) + '.sqlite.connection';

		if (this.sharedObjectExists(aDatabaseConn)) {
			var db = this.sharedObjectGet(aDatabaseConn);
			if (!db.aConnection)
				db.open();
			return db;
		} else {
			// our custom database handler
			var object = {};
			//reference to extension code
			object.theExtension = Components.classes['@particle.universe.tito/TheExtension;3']
				.getService().wrappedJSObject;
			//init the connection
			object.aDatabase = aDatabase;
			object.aPath = aPath;
			object.exists = false;
			//inits the connection
			object.initConnection = function() {
				//gets the working directory
				if (!this.aPath)
					this.file = this.theExtension.code('ODPExtension').fileDame(this.theExtension.code('ODPExtension').extensionDirectory().path + '/' + this.aDatabase + '.sqlite');
				else
					this.file = this.theExtension.code('ODPExtension').fileDame(this.aPath);

				this.name = aDatabase;
				this.path = this.file.path;
				this.storageService = Components.classes["@mozilla.org/storage/service;1"]
					.getService(Components.interfaces.mozIStorageService);
				this.aConnection = this.storageService.openDatabase(this.file);
			}
			//holds references to the queries with some custom propierties
			object.queriesReferences = [];
			//object mapping
			//transactions
			object.begin = function() {
				this.aConnection.beginTransaction();
			}
			object.commit = function() {
				this.aConnection.commitTransaction();
			}
			//init the database
			object.init = function() {
				var g_ODPExtensionRegExpString = null;
				var g_ODPExtensionRegExp = null;
				//first define the custom functions
				this.aConnection.createFunction(
					'REGEXP',
					2, function(val) {
					if (val.getString(0) != g_ODPExtensionRegExpString)
						g_ODPExtensionRegExp = new RegExp(g_ODPExtensionRegExpString = val.getString(0));
					return g_ODPExtensionRegExp.test(val.getString(1)) ? 1 : 0;
				});
				//vacuum query
				this._vacuum = this.query('VACUUM');
				//retreiving the tables names, this is useful to check when a database is imported if all the tables are there.
				this._tables = this.query('SELECT name FROM sqlite_master WHERE type = "table"');

				for (var id in this.queriesReferences) {
					try {
						this.reset(this.queriesReferences[id]);
						this.queriesReferences[id].query.finalize();
						this.queriesReferences[id].query = this.aConnection.createStatement(this.queriesReferences[id].sql)
						//this.theExtension.code('ODPExtension').dump('state'+this.queriesReferences[id].query.state);
					} catch (e) { /*probably bad wrote of a query*/
						this.theExtension.code('ODPExtension').error('init:re-createStatement FAILED:\nQUERY:\n\t' + this.queriesReferences[id].sql + '\nSQLITE SAYS:\n\t' + this.aConnection.lastErrorString);
					};
				}

			}
			object.vacuum = function() {
				this.execute(this._vacuum);
			}
			//opens the connection to the database
			object.open = function() {
				try {
					this.aConnection = this.storageService.openDatabase(this.file);
					this.init();
				} catch (e) {
					this.theExtension.code('ODPExtension').dump('Can\'t connect to the database \nSQLITE SAYS:\n\t' + this.aConnection.lastErrorString);
				}
			}
			//finalizes all the statements and close the connection to the database
			object.close = function() {
				for (var id in this.queriesReferences) {
					try {
						this.reset(this.queriesReferences[id]);
						this.queriesReferences[id].query.finalize();
					} catch (e) {
						this.theExtension.code('ODPExtension').dump('Can\'t finalize :' + this.queriesReferences[id].sql);
					}
				}
				try {
					this.aConnection.close();
				} catch (e) {
					try {
						this.aConnection.asyncClose()
					} catch (e) {
						this.theExtension.code('ODPExtension').dump('Connection to the database can\'t be closed');
					}
				}

				this.aConnection = false;
			}
			//exports a database to a user prompted directory
			object.export = function() {
				var aFolder = this.theExtension.code('ODPExtension').fileAskUserFileSave(this.name, 'sqlite');
				if (aFolder) {
					this.vacuum();
					this.close();
					this.theExtension.code('ODPExtension').fileCopy(this.path, aFolder.file.path);
					this.open();
				}
			}
			//returns an arrray with the tables names
			object.tablesGet = function() {
				var current_tables = [];
				var row;
				while (row = this.fetchObjects(this._tables))
					current_tables[current_tables.length] = row.name;

				return current_tables;
			}
			object.tableExists = function(aTable) {
				return this.tablesGet().indexOf(aTable) != -1;
			}
			//import a database
			//this should be rewrited, I need to put some field in the datbase that tell me the database version
			//then I will able to manage database updates like importing a database 1.0 in a 4.0 extension
			//all the alter tables and changes, from version to version
			object.import = function() {
				var aFile = this.theExtension.code('ODPExtension').fileAskUserFileOpen(this.name, 'sqlite');
				if (aFile) {
					if (this.theExtension.code('ODPExtension').confirm(this.theExtension.code('ODPExtension').getString('are.you.sure'))) {
						//getting tables names to compare with the new
						var current_tables = [];
						var row;
						while (row = this.fetchObjects(this._tables))
							current_tables[current_tables.length] = row.name;

						//backup current first
						this.backup();
						//close database
						this.close();
						//importing
						this.theExtension.code('ODPExtension').fileCopy(aFile.file.path, this.path);
						//open database
						this.open();

						//checking if the database contains all the tables
						var imported_tables = [];
						var row;
						while (row = this.fetchObjects(this._tables))
							imported_tables[imported_tables.length] = row.name;

						for (var id in current_tables) {
							if (!this.theExtension.code('ODPExtension').inArray(imported_tables, current_tables[id])) {
								this.theExtension.code('ODPExtension').dump('There was an attempt to import a database that is not appropriated for this add-on! Reverting the importing…');
								//reverting backup..
								//close database
								this.close();
								//importing
								this.theExtension.code('ODPExtension').fileCopy(this.last_backup_path, this.path);
								//open database
								this.open();
								break;
							}
						}

					}
				}
			}
			//empty the tables
			object.empty = function() {
				//getting tables
				var row;
				while (row = this.fetchObjects(this._tables)) {
					var query = [];
					query = 'delete from "' + row.name + '"';
					this.deleteAsync(this.query(query));
				}
				this.vacuum();
			}
			//backups the database
			object.backup = function() {
				this.close();
				this.last_backup_path = this.path + '.backup.' + (this.theExtension.code('ODPExtension').now().replace(/\:/g, '.')) + '.sqlite';
				this.theExtension.code('ODPExtension').fileCopy(this.path, this.last_backup_path);
				this.open();
			}
			//prepare a sql query, get the colum names, save te SQL, define our "params" functino and puts in the object queriesReferences
			object.query = function(query) {
				var id = this.queriesReferences.length;
				var queryReference = this.queriesReferences[id] = {};
				queryReference.id = id;
				queryReference.aConnection = this.aConnection;

				try {
					queryReference.query = this.aConnection.createStatement(query)
				} catch (e) { /*probably bad wrote of a query*/
					this.theExtension.code('ODPExtension').error('createStatement FAILED:\nSQLITE SAYS:\n\t' + this.aConnection.lastErrorString + 'QUERY:\n\t' + query + '\n');
				};
				queryReference.sql = String(query);
				queryReference.columnNames = {};
				queryReference.paramsValues = {};
				queryReference.theExtension = this.theExtension;

				//retreiveing columns names
				var columnNames = [];
				var length = queryReference.query.columnCount;
				for (var a = 0; a < length; a++)
					columnNames[columnNames.length] = queryReference.query.getColumnName(a);
				queryReference.columnNames = columnNames;

				//fill parameters
				queryReference.params = function(aParam, aValue) {
					aValue = (!aValue || aValue == '*') ? '' : aValue.toString();

					try {

						queryReference.query.params[aParam] = aValue;
						queryReference.paramsValues[aParam] = aValue;

					} catch (e) {
						//this failed because the query is filled again with parameters but was not "reset"
						//(this happend when you get just one row with fetchObject)
						queryReference.query.reset();
						try {
							queryReference.query.params[aParam] = aValue;
							queryReference.paramsValues[aParam] = aValue;

						} catch (e) {
							this.theExtension.code('ODPExtension').dump('FILL PARAMS FAILED:\n\tCan\'t fill params:aParam:' + aParam + ':aValue:' + aValue + '\nQUERY:\n\t' + this.sql + '\nQUERY VALUES:\n\t' + queryReference.paramsValues.toSource() + '\nSQLITE SAYS:\n\t' + queryReference.aConnection.lastErrorString);
						}

						queryReference.paramsValues = {};
						queryReference.paramsValues[aParam] = aValue;
					}
				}
				queryReference.execute = function(aFunction) {
					if (!aFunction)
						object.execute(queryReference);
					else
						object.executeCallback(queryReference, aFunction);
				}
				queryReference.finalize = function() {
					queryReference.query.finalize();
				}

				return queryReference;
			};
			//'create' statements should use this function
			object.create = object.executeSimple = function(query, canFail) {
				try {
					this.aConnection.executeSimpleSQL(query)
				} catch (e) { /*probably bad wrote of a query*/
					if (!canFail) {
						this.theExtension.code('ODPExtension').error('executeSimpleSQL FAILED:\nQUERY:\n\t' + query + '\nSQLITE SAYS:\n\t' + this.aConnection.lastErrorString);
					}
				}
			};

			//executes a query Async, canFail is for queries that is spected to fail, like inserting two indentical values in a unique column
			object.updateAsync = object.insertAsync = object.deleteAsync = object.executeAsync = function(q, canFail) {
				var query = this.queriesReferences[q.id].query;
				if (!canFail) {
					try {
						query.executeAsync();
					} catch (e) {
						//if can't fails and fails: output to the console that this query failed
						this.theExtension.code('ODPExtension').dump('QUERY Failed:\n\t' + this.queriesReferences[q.id].sql + '\nQUERY VALUES:\n\t' + this.queriesReferences[q.id].paramsValues.toSource() + '\nSQLITE SAYS:\n\t' + this.aConnection.lastErrorString);
					}
				} else {
					//this query can fail, fail silenty
					try {
						query.executeAsync();
					} catch (e) { /*this query can fail (like inserting two indentical values in a unique column), fail silenty*/ }
				}
				//there is no need to reset the query
			}
			//executes a query Async takes the values to a callback
			object.executeCallback = function(q, aFunction, canFail) {
				var query = this.queriesReferences[q.id].query;
				var columnNames = this.queriesReferences[q.id].columnNames;
				var aData = [];
				if (!canFail) {
					try {
						query.executeAsync({
							handleResult: function(aResultSet) {
								for (let row = aResultSet.getNextRow(); row; row = aResultSet.getNextRow()) {
									var aRow = {}
									for (var id in columnNames) {
										aRow[columnNames[id]] = row.getResultByName(columnNames[id]);
									}
									aData[aData.length] = aRow;
								}
							},
							handleError: function(aError) {
								ODPExtension.dump("Error: " + aError.message);
							},
							handleCompletion: function(aReason) {
								aFunction(aData);
							}
						});
					} catch (e) {
						//if can't fails and fails: output to the console that this query failed
						this.theExtension.code('ODPExtension').dump('QUERY Failed:\n\t' + this.queriesReferences[q.id].sql + '\nQUERY VALUES:\n\t' + this.queriesReferences[q.id].paramsValues.toSource() + '\nSQLITE SAYS:\n\t' + this.aConnection.lastErrorString);
					}
				} else {
					//this query can fail, fail silenty
					try {
						query.executeAsync({
							handleResult: function(aResultSet) {
								for (let row = aResultSet.getNextRow(); row; row = aResultSet.getNextRow()) {
									var aRow = {}
									for (var id in columnNames) {
										aRow[columnNames[id]] = row.getResultByName(columnNames[id]);
									}
									aData[aData.length] = aRow;
								}
							},
							handleError: function(aError) {
								ODPExtension.dump("Error: " + aError.message);
							},
							handleCompletion: function(aReason) {
								aFunction(aData);
							}
						});
					} catch (e) { /*this query can fail (like inserting two indentical values in a unique column), fail silenty*/ }
				}
				//there is no need to reset the query
			}
			object.delete = object.insert = object.update = object.execute = object.executeStep = function(q, canFail) {
				var query = this.queriesReferences[q.id].query;
				if (!canFail) {
					try {
						query.executeStep();
					} catch (e) {
						//if fails: output to the console that this query failed
						this.theExtension.code('ODPExtension').dump('QUERY Failed:\n\t' + this.queriesReferences[q.id].sql + '\nQUERY VALUES:\n\t' + this.queriesReferences[q.id].paramsValues.toSource() + '\nSQLITE SAYS:\n\t' + this.aConnection.lastErrorString);
					}
				} else {
					try {
						query.executeStep();
					} catch (e) { /*this query can fail (like inserting two indentical values in a unique column), fail silenty if we selected canFail to true*/ }
				}
				this.queriesReferences[q.id].paramsValues = {};
				query.reset();
			}
			//return row of a query and reset the statement
			object.fetchObject = function(q) {
				return this.fetchObjects(q, true);
			}
			object.reset = function(q) {
				this.queriesReferences[q.id].paramsValues = {};
				try {
					this.queriesReferences[q.id].query.reset();
				} catch (e) {}
			}
			//return rows of a query -while(row = fetch()) do something with row
			object.fetchObjects = function(q, resetQuery) {
				//gettin query reference

				var query = this.queriesReferences[q.id].query;

				var columnNames = this.queriesReferences[q.id].columnNames;
				//getting result values
				query.executeStep();
				//build the row, reset the consult if needed and return it
				var row = {};
				for (var id in columnNames) {
					try {
						row[columnNames[id]] = query.row[columnNames[id]];
					} catch (e) {
						//there is no more results
						this.queriesReferences[q.id].paramsValues = {};
						query.reset();
						return false;
					}
				}
				if (!resetQuery) {} else {
					this.queriesReferences[q.id].paramsValues = {};
					query.reset();
				}

				//return the row
				return row;
			};
			object.initConnection();
			object.init();
			return this.sharedObjectGet(aDatabaseConn, object);
		}
	}

	return null;

}).apply(ODPExtension);
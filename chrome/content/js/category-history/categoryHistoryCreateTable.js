(function()
{
		var debugingThisFile = false;//sets debuging on/off for this JavaScript file

		//holds the history of unique categories visited
		//counts the hits and add points to these categories to try to get something similar but very far from to the Frecency algorithm
		this.categoryHistoryCreateTable = function()
		{
			//create tables
				this.db.create(
							<sql>
								CREATE TABLE IF NOT EXISTS
									`categories_history`
								(
									`categories_history_id` INTEGER PRIMARY KEY ASC NOT NULL , 
									`categories_history_category` VARCHAR UNIQUE  NOT NULL , 
									`categories_history_date` DATETIME NOT NULL DEFAULT CURRENT_DATE,
									`categories_history_hits` INTEGER NOT NULL  DEFAULT 0,
									`categories_history_radiation` INTEGER NOT NULL  DEFAULT 0,
									`categories_history_deleted` INTEGER NOT NULL  DEFAULT 0
								)
							</sql>
						);
		}
	return null;

}).apply(ODPExtension);

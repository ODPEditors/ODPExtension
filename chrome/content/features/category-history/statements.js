(function()
{
		var debugingThisFile = false;//sets debuging on/off for this JavaScript file

		this.categoryHistoryStatements = function()
		{
			this.insertCategoryHistory = this.db.query('INSERT INTO `categories_history` ( `categories_history_category` ) VALUES (:categories_history_category) ');
			this.deleteCategoryHistory = this.db.query('DELETE FROM `categories_history` WHERE `categories_history_category` = :categories_history_category');
			this.updateCategoryHistory = this.db.query(' \
															UPDATE \
																`categories_history` \
															SET \
																`categories_history_hits`=`categories_history_hits`+1, \
																`categories_history_date`=:categories_history_date, \
																`categories_history_radiation`=`categories_history_radiation`+:categories_history_radiation \
															WHERE \
																`categories_history_category`= :categories_history_category \
														');
			this.categoryHistoryGetMostVisitedLimit = this.db.query(' \
																		SELECT \
																			`categories_history_category` \
																		FROM \
																			`categories_history` \
																		ORDER BY \
																			`categories_history_radiation` DESC, \
																			`categories_history_category` DESC LIMIT 50 \
																	');
			this.categoryHistoryGetHistory =   this.db.query(' \
																 		SELECT \
																			`categories_history_category` \
																		FROM \
																			`categories_history` \
																		ORDER BY \
																			LENGTH(`categories_history_category`) asc \
																');
		}
	return null;

}).apply(ODPExtension);

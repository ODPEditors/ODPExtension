(function() {
	var debugingThisFile = false; //sets debuging on/off for this JavaScript file

	this.addListener('onIdle', function() {
		ODPExtension.categoriesHistoryDatabaseOpen().vacuum();
	});

	this.addListener('databaseReady', function() {
		ODPExtension.categoryHistoryStatements();
	});

	this.categoryHistoryStatements = function() {
		var db = this.categoriesHistoryDatabaseOpen();
		this.insertCategoryHistory = db.query('INSERT INTO `categories_history` ( `categories_history_category` ) VALUES (:categories_history_category) ');
		this.deleteCategoryHistory = db.query('DELETE FROM `categories_history` WHERE `categories_history_category` = :categories_history_category');
		this.updateCategoryHistory = db.query(' \
															UPDATE \
																`categories_history` \
															SET \
																`categories_history_hits`=`categories_history_hits`+1, \
																`categories_history_date`=:categories_history_date, \
																`categories_history_radiation`=`categories_history_radiation`+:categories_history_radiation \
															WHERE \
																`categories_history_category`= :categories_history_category \
														');
		this.categoryHistoryGetMostVisitedLimit = db.query('select categories_history_radiation/((cast(strftime("%s", DATE("now")) - strftime("%s", categories_history_date) as real) /60/60)+1) as radiation, `categories_history_category` from categories_history order by radiation desc LIMIT 300');

		this.categoryHistoryGetHistory = db.query(' \
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
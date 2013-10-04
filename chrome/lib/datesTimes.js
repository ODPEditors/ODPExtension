(function() {
	// returns current date, format: 2009-12-31
	this.date = function(aDate) {
		if (!aDate)
			var date = new Date();
		else
			var date = new Date(aDate);
		return date.getFullYear() + '-' +
			(date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1) + '-' +
			(date.getDate() < 10 ? '0' : '') + date.getDate();
	}
	// returns current date, format: 2009-12-31 00:00:00
	this.now = function() {
		var date = new Date();
		return date.getFullYear() + '-' +
			(date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1) + '-' +
			(date.getDate() < 10 ? '0' : '') + date.getDate() + ' ' +
			(date.getHours() < 10 ? '0' : '') + date.getHours() + ':' +
			(date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':' +
			(date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
	}
	//measures time
	this.timer = function() {
		var aConnection = 'timer.connection';

		if (this.sharedObjectExists(aConnection)) {
			var shared = this.sharedObjectGet(aConnection);
			shared.resetAll();
			return shared;
		} else {
			var object = {};
			//reference to extension code
			object.theExtension = Components.classes['@particle.universe.tito/TheExtension;3']
				.getService().wrappedJSObject;
			object.timers = [];
			object.start = function(anID) {
				if (!this.timers[anID])
					this.timers[anID] = [];
				this.timers[anID]['start'] = new Date();
			};
			object.resetAll = function(anID) {
				this.timers = [];
			}
			object.reset = function(anID) {
				if (!this.timers[anID])
					this.timers[anID] = [];
				this.timers[anID]['total'] = 0;
			};
			object.stop = function(anID) {
				var now = new Date();
				var diffMs = (now - this.timers[anID]['start']);
				//this.theExtension.code('myExt').dump(anID+' takes '+diffMs+' ms');
				if (!this.timers[anID]['total'])
					this.timers[anID]['total'] = 0;
				this.timers[anID]['total'] += diffMs;
				//this.theExtension.code('myExt').dump(anID+' total time '+this.timers[anID]['total']+' ms');
			};
			object.progress = function(anID) {
				var now = new Date();
				var diffMs = (now - this.timers[anID]['start']);
				this.theExtension.code('ODPExtension').dump(anID + ' takes ' + (diffMs / 1000) + ' segs');
			};
			object.display = function() {
				this.theExtension.code('ODPExtension').dump('----------------------------------------');
				for (var anID in this.timers) {
					this.theExtension.code('ODPExtension').dump(anID + ' total time ' + this.timers[anID]['total'] + ' ms');
				}
			}

			return this.sharedObjectGet(aConnection, object);
		}
	}
	// returns sql date as javascript object
	this.sqlDate = function(aDate) {
		//function parses mysql datetime string and returns javascript Date object
		//input has to be in this format: 2007-06-05 15:26:02
		if (aDate.length == 10)
			aDate = aDate + ' 00:00:00';

		var parts = aDate.replace(/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/, "$1 $2 $3 $4 $5 $6").split(' ');
		return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
	}
	// returns sql date as javascript string localized
	this.sqlDateLocale = function(aDate) {
		return this.sqlDate(aDate).toLocaleString();
	}
	this.serverDate = function(aDate) {
		return new Date(Date.parse(aDate.replace(/-/g, ' ')));
	}
	this.serverDateLocale = function(aDate) {
		return this.serverDate(aDate).toLocaleString();
	}
	return null;

}).apply(ODPExtension);
(function() {
	//shows a notification until the user select "don't show this message again",
	//automatically creates a boolean preference of true to know if the user was alerted for this message in the past
	this.notifyOnce = function(aString, anID) {
		if (!anID)
			var aName = 'notifyOnceMessages.msgHash.' + this.sha256(aString);
		else
			var aName = 'notifyOnceMessages.msgHash.' + this.sha256(anID);

		if (!this.preferenceExists(aName, 'bool')) {
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
				.getService(Components.interfaces.nsIPromptService);
			var check = {
				value: false
			}; // default value
			prompts.alertCheck(window, "ODP Extension", aString, this.getString('dont.show.this.message.again'), check);
			// do something with check.value;
			if (check.value === true) {
				this.preferenceCreate(aName, true, 'bool');
			}
		}
	}
	//shows a notification in the status bar if the status bar is there
	var notifyStatusBarTimeout = false;
	var notifyStatusBarElement = false;
	this.notifyStatusBar = function(aString) {
		clearTimeout(notifyStatusBarTimeout);
		if(!notifyStatusBarElement)
			notifyStatusBarElement = this.getBrowserElement('statusbar-display');

		if (notifyStatusBarElement && aString != '')
			notifyStatusBarElement.label = 'ODP Extension : ' + aString;
		else {
			notifyStatusBarTimeout = setTimeout(function() {
				if (notifyStatusBarElement)
					notifyStatusBarElement.label = '';
			}, 8000);
		}
	}
	//shows a notification in the current tab, if aTime is passed the notification will be hidden before the time
	this.notifyTab = function(aString, aTime) {
		var notificationBox = gBrowser.getNotificationBox();
		var notification = notificationBox
			.appendNotification(
			"ODP Extension   :   " + aString,
			'ODPExtension-notifyTab-' + this.sha256(aString),
			'chrome://ODPExtension/content/icon/icon16.png',
			gBrowser.getNotificationBox().PRIORITY_INFO_LOW,
			null);
		if (aTime)
			setTimeout(function() {
				try {
					notificationBox.removeNotification(notification);
				} catch (e) { /*if the notification is removed manually this throw an exception*/ }
			}, aTime * 1000);
	}
	var progressesShared = []
	//shows a progress of anID in the status-bar
	this.progress = function(anID, aFunction) {
		var aConnection = 'progress.' + anID;

		if (!!progressesShared[aConnection]) {
			return progressesShared[aConnection];
		} else {
			var object = {};
			object.message = '';
			object.running = 0;
			object.done = 0;
			object.last = '';
			if (!aFunction) {} else
				object.onComplete = aFunction;

			object.add = function() {
				this.running++;
			}
			object.remove = function() {
				this.done++;
				if (this.done == this.running && !! this.onComplete)
					this.onComplete();
			}
			object.reset = function() {
				this.running = 0;
				this.done = 0;
				this.progress();
			}
			object.progress = function() {
				if (this.message != '')
					var progressMsg = this.message + ' : ' + this.done + ' / ' + this.running;
				else
					var progressMsg = this.done + ' / ' + this.running;
				if (progressMsg != this.last) {
					this.last = progressMsg;
					ODPExtension.notifyStatusBar(progressMsg);
				}
				object.ok();
			}
			object.ok = function() {
				ODPExtension.notifyStatusBar('');
			}

			progressesShared[aConnection] = object;
			return progressesShared[aConnection];
		}
	}

	return null;

}).apply(ODPExtension);
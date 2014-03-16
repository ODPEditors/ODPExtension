(function () {

	const mThreads = Components
		.classes["@mozilla.org/thread-manager;1"]
		.getService();

	const mMainThread = mThreads.mainThread;

	this.newThread = function () {
		return mThreads.newThread(0);
	}
	//returns the current thread
	this.currentThread = function () {
		return mThreads.currentThread;
	}
	//run a aFunction into the main thread
	this.runMain = function (aFunction) {
		this.runThread(aFunction, mMainThread);
	}
	//run a aFunction into the main thread and wait for return
	this.runMainAndWait = function (aFunction) {
		this.runThreadAndWait(aFunction, mMainThread);
	}

	//executes aFunction into the selected thread
	this.runThread = function (aFunction, aThread) {
		aThread.dispatch({
				run: function () {
					aFunction();
				},
				QueryInterface: function (iid) {
					if (iid.equals(Components.interfaces.nsIRunnable) ||
						iid.equals(Components.interfaces.nsISupports)) {
						return this;
					}
					throw Components.results.NS_ERROR_NO_INTERFACE;
				}
			},
			Components.interfaces.nsIThread.DISPATCH_NORMAL
		);
	}

	//executes aFunction into the selected thread and wait for return
	this.runThreadAndWait = function (aFunction, aThread) {
		aThread.dispatch({
				run: function () {
					aFunction();
				},
				QueryInterface: function (iid) {
					if (iid.equals(Components.interfaces.nsIRunnable) ||
						iid.equals(Components.interfaces.nsISupports)) {
						return this;
					}
					throw Components.results.NS_ERROR_NO_INTERFACE;
				}
			},
			Components.interfaces.nsIThread.DISPATCH_SYNC
		);
	}

	return null;

}).apply(ODPExtension);
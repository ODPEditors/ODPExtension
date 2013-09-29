(function() {

	//adds elements to a queue with an ID
	this.queueAdd = function(anID, anObject) {
		var shared = this.sharedObjectGet(anID + '.queue', []);
		shared[shared.length] = anObject;
	}

	//gets and shifts elements from a queue with an ID
	this.queueGet = function(anID) {
		var shared = this.sharedObjectGet(anID + '.queue');
		if (shared.length > 0)
			return shared.shift();
		else
			return false;
	}

	this.runThreaded = function(anID, aMaxNumberOfThreads, aFunction) {
		//add to queue
		this.queueAdd(anID + '.runThreaded', aFunction);

		var currentRunningThreads = this.sharedObjectGet(anID + '.runThreaded.aMaxNumberOfThreads', {
			running: 0
		});

		//this.dump('currentRunningThreads:'+currentRunningThreads.running);
		if (currentRunningThreads.running < aMaxNumberOfThreads)
			this.runThreadedRun(anID, aMaxNumberOfThreads);
	}
	this.runThreadedRun = function(anID, aMaxNumberOfThreads) {
		var currentRunningThreads = this.sharedObjectGet(anID + '.runThreaded.aMaxNumberOfThreads', {
			running: 0
		});
		currentRunningThreads.running += 1;

		var aFunction = this.queueGet(anID + '.runThreaded');
		if (typeof(aFunction) == 'function') // else all threads completed execution, no more in queue
			aFunction(function() {
				ODPExtension.runThreadedDone(anID, aMaxNumberOfThreads);
			})
		else {
			var currentRunningThreads = this.sharedObjectGet(anID + '.runThreaded.aMaxNumberOfThreads', {
				running: 0
			});
			currentRunningThreads.running -= 1;
		}
	}
	this.runThreadedDone = function(anID, aMaxNumberOfThreads) {
		var currentRunningThreads = this.sharedObjectGet(anID + '.runThreaded.aMaxNumberOfThreads', {
			running: 0
		});
		currentRunningThreads.running -= 1;
		if (currentRunningThreads.running < aMaxNumberOfThreads)
			this.runThreadedRun(anID, aMaxNumberOfThreads);
	}

	return null;

}).apply(ODPExtension);
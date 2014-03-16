(function() {

	var workers = []
	var listeners = []
	var thread = -1
	var workerOnMessage = function (aEvent) {
		if (listeners[aEvent.data.id])
			listeners[aEvent.data.id](aEvent.data.aData);
		delete listeners[aEvent.data.id];
		workers[aEvent.data.idWorker].terminate();
		delete workers[aEvent.data.idWorker];
	};

	this.worker = function(aURL, aMessage, aCallback){
		//move of thread
		thread++
		var _thread = String(thread)
		//save the listener
		listeners.push(aCallback)
		var id = listeners.length - 1;
		aMessage.idWorker = _thread
		aMessage.id = id
		//spawn the worker
		workers[_thread] = new Worker(aURL);
		workers[_thread].onmessage = workerOnMessage
		workers[_thread].postMessage(aMessage)
	}

	return null;

}).apply(ODPExtension);
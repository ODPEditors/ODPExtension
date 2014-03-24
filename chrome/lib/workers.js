(function() {

	var workers = []
	var listeners = []
	var thread = -1
	var workerOnMessage = function (aEvent) {
		if (listeners[aEvent.data.id])
			listeners[aEvent.data.id](aEvent.data.aData);
		listeners[aEvent.data.id] = null
		//workers[aEvent.data.idWorker].terminate();
		workers[aEvent.data.idWorker] = null
	}

	this.worker = function(aURL, aMessage, aFunction) {
		//move of thread
		thread++
		var idWorker = String(thread)
		//save the listener
		listeners.push(aFunction)
		var id = listeners.length - 1;
		aMessage.idWorker = idWorker
		aMessage.id = id
		//spawn the worker
		workers[idWorker] = new ChromeWorker(aURL);
		workers[idWorker].onmessage = workerOnMessage
		workers[idWorker].onerror = function(aError){
			listeners[id] = null
			workers[idWorker].terminate();
			workers[idWorker] = null
		}
		workers[idWorker].postMessage(aMessage)
	}

	return null;

}).apply(ODPExtension);
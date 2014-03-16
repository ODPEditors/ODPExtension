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
	};

	this.worker = function(aURL, aMessage, aFunction){
		//move of thread
		thread++
		var _thread = String(thread)
		//save the listener
		listeners.push(aFunction)
		var id = listeners.length - 1;
		aMessage.idWorker = _thread
		aMessage.id = id
		//spawn the worker
		workers[_thread] = new ChromeWorker(aURL);
		workers[_thread].onmessage = workerOnMessage
		workers[_thread].postMessage(aMessage)
	}

	return null;

}).apply(ODPExtension);
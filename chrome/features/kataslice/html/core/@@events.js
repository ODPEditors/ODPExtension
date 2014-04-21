/* LISTENERS */

var listeners = [];

this.add = function (aListenerName, aFunction) {
	if (!listeners[aListenerName])
		listeners[aListenerName] = [];
	listeners[aListenerName][listeners[aListenerName].length] = aFunction;
}

this.remove = function (aListenerName, aFunction) {
	for (var id in listeners[aListenerName]) {
		if (listeners[aListenerName][id].toSource() == aFunction.toSource()) {
			delete(listeners[aListenerName][id]);
		}
	}
}

this.dispatch = function () {
	var aListeners = listeners[arguments[0]];
	if (aListeners && aListeners.length) {
		aListeners.forEach(function (listener) {
			try {
				listener(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5],
					arguments[6], arguments[7], arguments[8], arguments[9], arguments[10]);
			} catch (e) {
				ODP.error(e)
			}
		})
	}
}
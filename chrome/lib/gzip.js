(function() {

	this.gzip = function(aString, aFunction) {

		function Accumulator() {}
		Accumulator.prototype = {
			buffer: null,
			onStartRequest:function(request, context) {},
			onStopRequest:function(request, context, statusCode) {
				aFunction(this.buffer);
			},
			onDataAvailable:function(request, context, inputStream, offset, count) {
				let binInputStream = Components.classes["@mozilla.org/binaryinputstream;1"].createInstance(Components.interfaces.nsIBinaryInputStream);
				binInputStream.setInputStream(inputStream);
				this.buffer = binInputStream.readBytes(binInputStream.available());
				binInputStream.close();
			}
		};

		let converterService = Components.classes["@mozilla.org/streamconv;1?from=uncompressed&to=gzip"].createInstance(Components.interfaces.nsIStreamConverter);
		converterService.asyncConvertData("uncompressed", "gzip", new Accumulator(), null);
		let inputStream = Components.classes["@mozilla.org/io/string-input-stream;1"].createInstance(Components.interfaces.nsIStringInputStream);
		inputStream.data = encodeURIComponent(aString);
		converterService.onStartRequest(null, null);
		converterService.onDataAvailable(null, null, inputStream, 0, inputStream.data.length);
		converterService.onStopRequest(null, null, 201);
	}

	this.gunzip = function(aString, aFunction) {

		function Accumulator() {}
		Accumulator.prototype = {
			buffer: null,
			onStartRequest:function(request, context) {},
			onStopRequest:function(request, context, statusCode) {
				aFunction(decodeURIComponent(this.buffer));
			},
			onDataAvailable:function(request, context, inputStream, offset, count) {
				let binInputStream = Components.classes["@mozilla.org/binaryinputstream;1"].createInstance(Components.interfaces.nsIBinaryInputStream);
				binInputStream.setInputStream(inputStream);
				this.buffer = binInputStream.readBytes(binInputStream.available());
				binInputStream.close();
			}
		};

		let converterService = Components.classes["@mozilla.org/streamconv;1?from=gzip&to=uncompressed"].createInstance(Components.interfaces.nsIStreamConverter);
		converterService.asyncConvertData("gzip", "uncompressed", new Accumulator(), null);
		let inputStream = Components.classes["@mozilla.org/io/string-input-stream;1"].createInstance(Components.interfaces.nsIStringInputStream);
		inputStream.data = aString;
		converterService.onStartRequest(null, null);
		converterService.onDataAvailable(null, null, inputStream, 0, aString.length);
		converterService.onStopRequest(null, null, 201);
	}

	return null;

}).apply(ODPExtension);
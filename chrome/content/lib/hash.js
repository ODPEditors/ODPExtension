(function() {
	this.sha256 = function(aString) {
		var converter =
			Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].
		createInstance(Components.interfaces.nsIScriptableUnicodeConverter);

		// we use UTF-8 here, you can choose other encodings.
		converter.charset = "UTF-8";
		// result is an out parameter,
		// result.value will contain the array length
		var result = {};
		// data is an array of bytes
		var data = converter.convertToByteArray(aString, result);
		var ch = Components.classes["@mozilla.org/security/hash;1"]
			.createInstance(Components.interfaces.nsICryptoHash);
		ch.init(ch.SHA256);
		ch.update(data, data.length);
		var hash = ch.finish(false);

		// return the two-digit hexadecimal code for a byte

		function toHexString(charCode) {
			return ("0" + charCode.toString(16)).slice(-2);
		}

		// convert the binary hash data to a hex string.
		var s = [toHexString(hash.charCodeAt(i)) for (i in hash)].join("");
		// s now contains your hash in hex: should be
		// 5eb63bbbe01eeed093cb22bb8f5acdc3
		return s;
	}
	this.md5 = function(aString) {
		var md5Converter = Components
			.classes["@mozilla.org/intl/scriptableunicodeconverter"]
			.createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
		md5Converter.charset = "UTF-8";

		var result = {};
		var data = md5Converter.convertToByteArray(aString, result);
		var chmd5 = Components.classes["@mozilla.org/security/hash;1"]
			.createInstance(Components.interfaces.nsICryptoHash);
		chmd5.init(chmd5.MD5);
		chmd5.update(data, data.length);
		var hash = chmd5.finish(false);
		var s = [this.toHexString(hash.charCodeAt(i)) for (i in hash)].join("");

		return s;
	}
	this.toHexString = function(charCode) {
		return ("0" + charCode.toString(16)).slice(-2);
	}
	this.sha1 = function(aString) {
		var converter =
			Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].
		createInstance(Components.interfaces.nsIScriptableUnicodeConverter);

		// we use UTF-8 here, you can choose other encodings.
		converter.charset = "UTF-8";
		// result is an out parameter,
		// result.value will contain the array length
		var result = {};
		// data is an array of bytes
		var data = converter.convertToByteArray(aString, result);
		var ch = Components.classes["@mozilla.org/security/hash;1"]
			.createInstance(Components.interfaces.nsICryptoHash);
		ch.init(ch.SHA1);
		ch.update(data, data.length);
		var hash = ch.finish(false);

		// convert the binary hash data to a hex string.
		var s = [this.toHexString(hash.charCodeAt(i)) for (i in hash)].join("");
		// s now contains your hash in hex: should be
		// 5eb63bbbe01eeed093cb22bb8f5acdc3
		return s;
	}

	return null;

}).apply(ODPExtension);
const util = require("util");

// Required for the jest runtime
TextDecoder = util.TextDecoder;

// browser mocks
const setLang = (lang: string) => {
	const localStorageMock = (function() {
		let store = {
			isTesting: true,
			lang: lang
		};
		return {
			getItem: function(key: "isTesting" | "lang") {
				return store[key] || null;
			},
			setItem: function(key: "isTesting" | "lang", value: any) {
				// @ts-ignore
				store[key] = value.toString();
			},
			removeItem: function(key: "isTesting" | "lang") {
				delete store[key];
			},
			clear: function() {
				store = {
					isTesting: true,
					lang: lang
				};
			}
		};
	})();
	Object.defineProperty(window, "localStorage", {
		value: localStorageMock
	});
};

localStorage.setItem("isTesting", "true");
setLang("da");

export default setLang;
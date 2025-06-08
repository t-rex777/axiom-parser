// Background script for Chrome extension
console.log("Background script loaded");

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
	console.log("Extension installed");
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
	console.log("Message received in background:", request);
	sendResponse({ status: "received" });
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	if (tabs[0]?.id) {
		chrome.scripting.insertCSS({
			target: { tabId: tabs[0].id },
			files: ["css/pretty-print-json.dark-mode.css"],
		});
	}
});

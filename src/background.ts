// Function to send automatic parse message to a tab
async function triggerAutomaticParse(tabId: number) {
  try {
    await chrome.tabs.sendMessage(tabId, { type: "AUTOMATIC_PARSE" });
  } catch (error) {
    console.log("Could not trigger automatic parse - content script may not be ready yet:", error);
  }
}

// Listen for extension installation
chrome.runtime.onInstalled.addListener(async () => {
  // Find all tabs matching the Axiom domain
  const tabs = await chrome.tabs.query({ url: "https://app.axiom.co/*" });

  // Trigger automatic parse on each matching tab
  for (const tab of tabs) {
    if (tab.id) {
      // Add a small delay to ensure content script is loaded
      const tabId = tab.id;
      setTimeout(() => triggerAutomaticParse(tabId), 1000);
    }
  }
});

// Listen for tab updates to trigger automatic parse on new Axiom pages
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only trigger when the page has finished loading and it's an Axiom page
  if (changeInfo.status === "complete" && tab.url && tab.url.includes("app.axiom.co")) {
    // Add a small delay to ensure content script is fully loaded
    setTimeout(() => triggerAutomaticParse(tabId), 2000);
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((_request, _sender, sendResponse) => {
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

import { AxiomParser } from "../utils/parser";

function parseAndStore(): boolean {
  try {
    // console.log("AxiomParser: Starting parse and store operation");
    const parser = new AxiomParser(document);
    parser.store();
    // console.log("AxiomParser: Content successfully parsed and stored");
    return true;
  } catch (error) {
    console.error("AxiomParser: Error parsing and storing content:", error);
    return false;
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
  try {
    switch (message.type) {
      case "MANUAL_PARSE": {
        const success = parseAndStore();
        sendResponse({ success });
        break;
      }

      case "AUTOMATIC_PARSE": {
        // const wait = await waitForElement(AxiomParser.TABLE_SELECTOR);
        const success = parseAndStore();
        sendResponse({ success });
        break;
      }

      default:
        console.warn("AxiomParser: Unknown message type:", message.type);
        sendResponse({ success: false, error: "Unknown message type" });
    }
  } catch (error) {
    console.error("AxiomParser: Error processing message:", error);
    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }

  return true; // Keep message channel open for async response
});

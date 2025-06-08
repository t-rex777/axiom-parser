import { AxiomParser } from '../utils/parser';

console.log('AxiomParser content script loaded on:', window.location.href);

function parseAndStore(): boolean {
    try {
        console.log('AxiomParser: Starting parse and store operation');
        const parser = new AxiomParser(document);
        parser.store();
        console.log('AxiomParser: Content successfully parsed and stored');
        return true;
    } catch (error) {
        console.error('AxiomParser: Error parsing and storing content:', error);
        return false;
    }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("AxiomParser: Message received", message, "from sender:", sender);
    
    try {
        switch (message.type) {
            case "MANUAL_PARSE": {
                console.log("AxiomParser: Processing MANUAL_PARSE request");
                const success = parseAndStore();
                console.log("AxiomParser: Parse result:", success);
                sendResponse({ success });
                break;
            }
                
            default:
                console.warn("AxiomParser: Unknown message type:", message.type);
                sendResponse({ success: false, error: 'Unknown message type' });
        }
    } catch (error) {
        console.error("AxiomParser: Error processing message:", error);
        sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
    
    return true; // Keep message channel open for async response
});
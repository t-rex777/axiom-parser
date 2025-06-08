import { useState } from 'react';
import './App.css';

function App() {
  const [status, setStatus] = useState('');

  const handleManualParse = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log("Active tabs:", tabs);

      if (tabs[0]?.id) {
        console.log("Sending message to tab:", tabs[0].id, "URL:", tabs[0].url);

        chrome.tabs.sendMessage(tabs[0].id, {
          type: "MANUAL_PARSE"
        }, (response) => {
          console.log("Response", response);

          // Check for chrome runtime errors
          if (chrome.runtime.lastError) {
            console.error("Chrome runtime error:", chrome.runtime.lastError);
            setStatus(`Error: ${chrome.runtime.lastError.message}`);
            return;
          }

          if (response?.success) {
            setStatus('Content parsed and stored successfully!');
          } else {
            setStatus('Failed to parse content. Make sure you\'re on app.axiom.co');
          }
        });
      } else {
        console.error("No active tab found");
        setStatus('No active tab found');
      }
    });
  };

  return (
    <div className="popup-container">
      <h2>Axiom Parser</h2>

      <button
        className="parse-button"
        onClick={handleManualParse}
      >
        Parse Now
      </button>

      {status && (
        <div className={`status ${status.includes('success') ? 'success' : ''}`}>
          {status}
        </div>
      )}
    </div>
  );
}

export default App;

// popup.js
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("submit");
  button.addEventListener("click", () => {

      const value = document.querySelector('#start-time').value;
      // Query the active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];
          // Send a message to the content script
          chrome.tabs.sendMessage(activeTab.id, { action: "getData" , startTime: value}, (response) => {
              if (response) {
                  alert(response.message); // Log the response from content script
              }
          });
      });
  });
});
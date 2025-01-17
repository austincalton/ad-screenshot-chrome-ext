document.getElementById('execute-script-button').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content-script.js']
    });
  });
});

// chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//   chrome.tabs.sendMessage(tabs[0].id, { action: 'updateAdSource', value: inputValue });
// });
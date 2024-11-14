chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.replacements) {
      chrome.scripting.executeScript({
        target: { allFrames: true },
        files: ["content.js"]
      });
    }
  });
  
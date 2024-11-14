// Function to replace words in the page content
function replaceText(replacements) {
  const elements = document.querySelectorAll("*:not(script):not(style):not(noscript)");

  elements.forEach((element) => {
    element.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        let text = node.nodeValue;
        for (const [original, replacement] of Object.entries(replacements)) {
          const regex = new RegExp(`\\b${original}\\b`, "gi");
          text = text.replace(regex, replacement);
        }
        node.nodeValue = text;
      }
    });
  });
}

// Fetch replacements and apply them
chrome.storage.sync.get("replacements", (data) => {
  if (data.replacements) {
    replaceText(data.replacements);
  }
});

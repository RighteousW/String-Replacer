document.addEventListener("DOMContentLoaded", () => {
  const addForm = document.getElementById("addForm");
  const replacementList = document.getElementById("replacementList");

  // Load and display all existing replacements
  loadReplacements();
  // Handle adding a new replacement
  addForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const original = document.getElementById("original").value.trim();
    const replacement = document.getElementById("replacement").value.trim();

    if (original) {
      chrome.storage.sync.get("replacements", (data) => {
        const replacements = data.replacements || {};
        replacements[original] = replacement;

        chrome.storage.sync.set({ replacements }, () => {
          addReplacementToList(original, replacement);
          addForm.reset();
          window.location.reload();
        });
      });
    }
  });

  // Function to load all replacements from storage and display them
  function loadReplacements() {
    replacementList.innerHTML = ''; // Clear existing items
    chrome.storage.sync.get("replacements", (data) => {
      const replacements = data.replacements || {};
      for (const [original, replacement] of Object.entries(replacements)) {
        addReplacementToList(original, replacement);
      }
    });
  }

  // Function to add a replacement item to the list
  function addReplacementToList(original, replacement) {
    const li = document.createElement("li");
    li.textContent = `"${original}" → "${replacement}"`;
    li.style.marginBottom = "5px";

    // Create Edit and Delete buttons
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.style.marginLeft = "10px";
    editButton.addEventListener("click", () => editReplacement(original, replacement, li));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.style.marginLeft = "5px";
    deleteButton.addEventListener("click", () => deleteReplacement(original, li));

    li.appendChild(editButton);
    li.appendChild(deleteButton);
    replacementList.appendChild(li);
  }

  // Function to handle editing a replacement
  function editReplacement(original, oldReplacement, listItem) {
    const newReplacement = prompt(`Edit replacement for "${original}":`, oldReplacement);
    if (newReplacement !== null && newReplacement !== oldReplacement) {
      chrome.storage.sync.get("replacements", (data) => {
        const replacements = data.replacements;
        replacements[original] = newReplacement;
        chrome.storage.sync.set({ replacements }, () => {
          listItem.childNodes[0].nodeValue = `"${original}" → "${newReplacement}"`;
        });
      });
    }
  }

  // Function to handle deleting a replacement
  function deleteReplacement(original, listItem) {
    chrome.storage.sync.get("replacements", (data) => {
      const replacements = data.replacements;
      delete replacements[original];
      chrome.storage.sync.set({ replacements }, () => {
        listItem.remove();
      });
    });
  }
});

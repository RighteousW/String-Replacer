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
    const list = document.getElementById("replacementList");

    // Create the surrounding container for each set of strings
    const replacementContainer = document.createElement("div");
    replacementContainer.className = "replacement-container";

    // Top div: Original and Replacement strings
    const topDiv = document.createElement("div");
    topDiv.className = "replacement-top";
    topDiv.innerHTML = `<strong>Original:</strong> ${original}<br><strong>Replacement:</strong> ${replacement}`;

    // Bottom div: Action buttons
    const bottomDiv = document.createElement("div");
    bottomDiv.className = "replacement-bottom";

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-btn";
    editButton.addEventListener("click", () => editReplacement(original, replacement, list));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";
    deleteButton.addEventListener("click", () => deleteReplacement(original, list));

    // Append buttons to bottom div
    bottomDiv.appendChild(editButton);
    bottomDiv.appendChild(deleteButton);

    // Append top and bottom divs to the replacement container
    replacementContainer.appendChild(topDiv);
    replacementContainer.appendChild(bottomDiv);

    // Append the replacement container to the list
    list.appendChild(replacementContainer);
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
    chrome.location.reload();
  }
});

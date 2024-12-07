const textInput = document.getElementById("text-input");
const addButton = document.getElementById("add-button");
const clearButton = document.getElementById("clear-button");
const dictionaryRows = document.getElementById("dictionary-rows");

let rowCounter = 1;

function createTooltip(cell, text) {
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.textContent = text;
  cell.appendChild(tooltip);

  cell.addEventListener("mouseenter", () => {
    tooltip.style.display = "block";
    const rect = cell.getBoundingClientRect();
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight}px`;
  });

  cell.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
  });
}

function transliterate(text) {
  const mapping = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "kh",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ы: "y",
    э: "e",
    ю: "yu",
    я: "ya",
  };

  return text
    .toLowerCase()
    .split("")
    .map((char) => mapping[char] || char)
    .join("");
}

function truncateText(text, maxLength = 7) {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

function addRow() {
  const russianText = textInput.value.trim();
  if (!russianText) return;

  const transliteratedText = transliterate(russianText);

  const row = document.createElement("tr");

  const numberCell = document.createElement("td");
  numberCell.textContent = rowCounter++;

  const russianCell = document.createElement("td");
  const russianTextSpan = document.createElement("span");
  russianTextSpan.className = "item-text";
  russianTextSpan.textContent = truncateText(russianText);
  russianCell.appendChild(russianTextSpan);

  createTooltip(russianCell, russianText);

  const transliterationCell = document.createElement("td");
  const transliterationTextSpan = document.createElement("span");
  transliterationTextSpan.className = "item-text";
  transliterationTextSpan.textContent = truncateText(transliteratedText);
  transliterationCell.appendChild(transliterationTextSpan);

  createTooltip(transliterationCell, transliteratedText);

  const actionCell = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.addEventListener("click", deleteRow);

  actionCell.appendChild(deleteButton);

  row.appendChild(numberCell);
  row.appendChild(russianCell);
  row.appendChild(transliterationCell);
  row.appendChild(actionCell);

  dictionaryRows.appendChild(row);

  textInput.value = "";

  russianTextSpan.addEventListener("click", () => {
    showModal(russianText);
  });
  transliterationTextSpan.addEventListener("click", () => {
    showModal(transliteratedText);
  });
}

addButton.addEventListener("click", addRow);

textInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addRow();
  }
});

function showModal(text) {
  modalContent.textContent = text;
  modal.style.display = "block";
}

function deleteRow(event) {
  const row = event.target.closest("tr");
  row.remove();

  updateRowNumbers();
}

function updateRowNumbers() {
  rowCounter = 1;
  const rows = document.querySelectorAll("#dictionary-rows tr");
  rows.forEach((row) => {
    row.cells[0].textContent = rowCounter++;
  });
}

clearButton.addEventListener("click", () => {
  dictionaryRows.innerHTML = "";
  rowCounter = 1;
});

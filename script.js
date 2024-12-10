const textInput = document.getElementById("text-input");
const addButton = document.getElementById("add-button");
const clearButton = document.getElementById("clear-button");
const dictionaryRows = document.getElementById("dictionary-rows");

let rowCounter = 2;

function createTooltip(cell, text) {
  const truncatedText = truncateText(text);
  if (truncatedText === text) return;

  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.textContent = text;
  cell.appendChild(tooltip);

  cell.addEventListener("mouseenter", () => {
    tooltip.style.display = "block";

    const rect = cell.getBoundingClientRect();
    const cellWidth = rect.width;
    const cellLeft = rect.left + window.scrollX;
    const cellTop = rect.top + window.scrollY;

    if (cell.cellIndex === 0) {
      tooltip.style.left = `${cellLeft + cellWidth / 2}px`;
      tooltip.style.transform = "translateX(0%))";
    } else if (cell.cellIndex === 1) {
      tooltip.style.left = `${cellLeft + cellWidth / 2 - 108}px`;
      tooltip.style.transform = "translateX(0%)";
    } else if (cell.cellIndex === 2) {
      tooltip.style.left = `${cellLeft + cellWidth / 2 - 48}px`;
      tooltip.style.transform = "translateX(0%)";
    } else {
      tooltip.style.left = `${cellLeft + cellWidth / 2 - tooltip.offsetWidth / 2}px`;
    }

    tooltip.style.top = `${cellTop - tooltip.offsetHeight + 4}px`;
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

  const transliterationCell = document.createElement("td");
  const transliterationTextSpan = document.createElement("span");
  transliterationTextSpan.className = "item-text";
  transliterationTextSpan.textContent = truncateText(transliteratedText);
  transliterationCell.appendChild(transliterationTextSpan);

  const actionCell = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.textContent = "";
  deleteButton.addEventListener("click", deleteRow);
  actionCell.appendChild(deleteButton);

  row.appendChild(numberCell);
  row.appendChild(russianCell);
  row.appendChild(transliterationCell);
  row.appendChild(actionCell);

  dictionaryRows.appendChild(row);

  textInput.value = "";

  createTooltip(numberCell, `Row: ${rowCounter - 1}`);
  createTooltip(russianCell, russianText);
  createTooltip(transliterationCell, transliteratedText);

  numberCell.addEventListener("mouseenter", () => {
    createTooltip(numberCell, russianText);
  });
}

function deleteRow(event) {
  const row = event.target.closest("tr");
  row.remove();
  updateRowNumbers();
}

function updateRowNumbers() {
  rowCounter = 2;
  const rows = document.querySelectorAll("#dictionary-rows tr");
  rows.forEach((row, index) => {
    if (index === 0) return;
    row.cells[0].textContent = rowCounter++;
  });
}

clearButton.addEventListener("click", () => {
  const rows = document.querySelectorAll("#dictionary-rows tr");
  rows.forEach((row, index) => {
    if (index !== 0) row.remove();
  });
  rowCounter = 2;
});

addButton.addEventListener("click", addRow);

textInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addRow();
  }
});

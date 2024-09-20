const inputTextarea = document.getElementById("input");
const outputTextarea = document.getElementById("output");
const replaceAllButton = document.getElementById("replaceAll");
const replaceNextButton = document.getElementById("replaceNext");
const refreshOutputButton = document.getElementById("refreshOutput");

const termToReplaceInput = document.getElementById("term");
const caseSensitiveCheckbox = document.getElementById("caseSensitive");

let lastIndex = 0;

replaceAllButton.addEventListener("click", function() {
  const term = termToReplaceInput.value;
  const caseSensitive = caseSensitiveCheckbox.checked;
  outputTextarea.value = inputTextarea.value.replace(new RegExp(term, caseSensitive ? "g" : "gi"), "");
  lastIndex = 0;
  termToReplaceInput.value = "";
});

replaceNextButton.addEventListener("click", function() {
  const term = termToReplaceInput.value;
  const caseSensitive = caseSensitiveCheckbox.checked;
  const index = outputTextarea.value.indexOf(term, lastIndex, caseSensitive ? undefined : "i");
  if (index !== -1) {
    const before = outputTextarea.value.substring(0, index);
    const after = outputTextarea.value.substring(index + term.length);
    outputTextarea.value = before + after;
    lastIndex = index;
    termToReplaceInput.value = "";
  }
});

inputTextarea.addEventListener("input", function() {
  outputTextarea.value = inputTextarea.value;
  lastIndex = 0;
});

outputTextarea.setAttribute("readonly", true);

document.getElementById("setInputToOutput").addEventListener("click", function() {
  inputTextarea.value = outputTextarea.value;
  lastIndex = 0;
  termToReplaceInput.value = "";
});

document.getElementById("copyToClipboard").addEventListener("click", function() {
  outputTextarea.select();
  document.execCommand("copy");
});

refreshOutputButton.addEventListener("click", function() {
  const term = termToReplaceInput.value;
  const caseSensitive = caseSensitiveCheckbox.checked;
  outputTextarea.value = inputTextarea.value.replace(new RegExp(term, caseSensitive ? "g" : "gi"), "");
  lastIndex = 0;
  termToReplaceInput.value = "";
});
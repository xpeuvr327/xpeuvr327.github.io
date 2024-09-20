const asciiChars = [
  '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', '{', ']', '}', '\\', '|', ';', ':', '\'', '\"', ',', '.', '<', '>', '?', '/',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
];


document.getElementById('crackPassword').addEventListener('click', function() {
  const inputHash = document.getElementById('inputHash').value;
  const length = parseInt(document.getElementById('length').value);
  if (!inputHash || !length || length > 7 || length < 1) {
    document.getElementById('errorMessage').textContent = 'Please enter a valid hash and length.';
    return;
  }
  const startTime = performance.now();
  const password = bruteForce(length, inputHash);
  const endTime = performance.now();
  const hash = sha256(password);
  const combinationsTested = asciiChars.length ** length;
  const combinationsPerSecond = combinationsTested / ((endTime - startTime) / 1000);
  document.getElementById('eta').textContent = `ETA: ${(combinationsTested - combinationsPerSecond * (performance.now() - endTime)) / 1000} seconds`;
  document.getElementById('combinations').textContent = `Combinations tested: ${combinationsTested} / Combinations to test: ${combinationsTested}`;
  document.getElementById('hashPerSec').textContent = `Hash/sec: ${combinationsPerSecond}`;
  if (hash === inputHash) {
    document.getElementById('output').value = password;
  } else {
    document.getElementById('output').value = 'Password not found.';
  }
});

document.getElementById('copyToClipboard').addEventListener('click', function() {
  const textarea = document.getElementById('output');
  textarea.select();
  document.execCommand("copy");
  document.getElementById('copyMessage').textContent = 'Copied to clipboard!';
});

function bruteForce(length) {
  const result = [];
  const recursiveBruteForce = (currentPassword, index) => {
    if (currentPassword.length === length) {
      const hash = sha256(currentPassword);
      if (hash === inputHash) {
        result.push(currentPassword);
      }
      return;
    }
    for (let i = 0; i < asciiChars.length; i++) {
      recursiveBruteForce(currentPassword + asciiChars[i], i);
    }
  };
  recursiveBruteForce('', 0);
  return result;
}



// You can use the CryptoJS library for SHA-256 hashing
// Make sure to include the library in your HTML file
function sha256(input) {
  return CryptoJS.SHA256(input).toString();
}
 
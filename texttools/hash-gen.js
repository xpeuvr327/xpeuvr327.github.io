document.getElementById('calculateHash').addEventListener('click', function() {
  const input = document.getElementById('input').value;
  const algorithm = document.getElementById('algorithm').value;
  let output;

  if (algorithm === 'SHA-256') {
    output = CryptoJS.SHA256(input).toString();
  } else if (algorithm === 'MD5') {
    output = CryptoJS.MD5(input).toString();
  }

  document.getElementById('output').value = output;
});

document.getElementById('copyToClipboard').addEventListener('click', function() {
  const output = document.getElementById('output');
  output.select();
  document.execCommand('copy');
  document.getElementById('copyMessage').innerText = 'Copié dans le presse-papiers !';
});

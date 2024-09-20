document.addEventListener('DOMContentLoaded', function() {
  const generateButton = document.getElementById('generate');
  const copyButton = document.getElementById('copy');
  const passwordField = document.getElementById('password');
  const lengthField = document.getElementById('length');
  const uppercaseCheckbox = document.getElementById('uppercase');
  const numbersCheckbox = document.getElementById('numbers');
  const specialsCheckbox = document.getElementById('specials');

  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()-_=+';

  generateButton.addEventListener('click', function() {
    const length = parseInt(lengthField.value);
    const includeUppercase = uppercaseCheckbox.checked;
    const includeNumbers = numbersCheckbox.checked;
    const includeSpecials = specialsCheckbox.checked;

    let chars = lowercaseChars;
    if (includeUppercase) chars += uppercaseChars;
    if (includeNumbers) chars += numberChars;
    if (includeSpecials) chars += specialChars;

    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }

    passwordField.value = password;
  });

  copyButton.addEventListener('click', function() {
    passwordField.select();
    document.execCommand('copy');
    document.getElementById('copyDisplay').textContent = 'Mot de passe "' + passwordField.value + '" copié!';
  });
});

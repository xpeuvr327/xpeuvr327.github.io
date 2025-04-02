efined// Get the full language tag from the browser
const fullLanguageTag = navigator.language || navigator.userLanguage;

// Split the language tag to remove the region part
const languageCode = fullLanguageTag.split('-')[0];

// Log the language code to the console
console.log(languageCode);
document.getElementById("searchButton").addEventListener("click", function() {
  var searchString = document.getElementById("searchInput").value.trim();
  var text = document.getElementById("textInput").value.trim();
  var caseSensitive = document.getElementById("caseSensitive").checked;

  if (searchString === '' || text === '') {
    document.getElementById("result").textContent = "Veuillez entrer une chaîne de recherche et un texte.";
    return;
  }

  var count = 0;
  var regex = caseSensitive ? new RegExp(searchString, 'g') : new RegExp(searchString, 'gi');
  var match;
  while ((match = regex.exec(text)) !== null) {
    count++;
  }

  if (count === 0) {
    document.getElementById("result").textContent = "La chaîne ne contient pas le texte spécifié.";
  } else {
    document.getElementById("result").textContent = "Le texte spécifié est présent " + count + " fois dans la chaîne.";
  }
});

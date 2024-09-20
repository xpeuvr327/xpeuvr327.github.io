// Définir une fonction qui transforme le texte en fonction du deuxième argument
function transformText(text, style) {
  // Utiliser un objet pour mapper les styles aux balises HTML
  let styles = {"bold": "<b>", "italic": "<i>", "underline": "<u>", "strike": "<s>"};
  // Vérifier si le style est valide
  if (style in styles) {
    // Ajouter les balises HTML au début et à la fin du texte
    return styles[style] + text + styles[style].replace("<", "</");
  } else {
    // Retourner le texte sans modification
    return text;
  }
}

// Définir une fonction qui change la couleur du texte en fonction des valeurs RGB
function changeRGB(text, red, green, blue) {
  // Convertir les valeurs RGB en une chaîne de caractères
  let rgb = "rgb(" + red + "," + green + "," + blue + ")";
  // Ajouter la balise <font> avec l'attribut color au début du texte
  return '<font color="' + rgb + '">' + text;
}

// Définir une fonction qui ferme la balise <font> à la fin du texte
function closeFont(text) {
  // Ajouter la balise </font> à la fin du texte
  return text + "</font>";
}

// Définir une fonction qui change la famille de police du texte en fonction du menu déroulant
function changeFont(text, fontFamily) {
  // Ajouter la balise <span> avec l'attribut style au début du texte
  return '<span style="font-family:' + fontFamily + ';">' + text;
}

// Définir une fonction qui ferme la balise <span> à la fin du texte
function closeSpan(text) {
  // Ajouter la balise </span> à la fin du texte
  return text + "</span>";
}

// Définir une fonction qui applique les styles au texte en fonction des cases à cocher
function applyStyles() {
  // Récupérer l'élément input qui contient le texte à transformer
  let input = document.getElementById("input");
  // Récupérer l'élément output qui affiche le texte transformé
  let output = document.getElementById("output");
  // Récupérer les éléments checkbox qui correspondent aux styles
  let bold = document.getElementById("bold");
  let italic = document.getElementById("italic");
  let underline = document.getElementById("underline");
  let strike = document.getElementById("strike");
  let font = document.getElementById("font");
  let color = document.getElementById("color");
  // Récupérer l'élément select qui contient la famille de police
  let fontFamily = document.getElementById("fontFamily");
  // Récupérer les éléments red, green et blue qui contiennent les valeurs des curseurs RGB
  let red = document.getElementById("red");
  let green = document.getElementById("green");
  let blue = document.getElementById("blue");
  // Initialiser le texte transformé avec le texte d'entrée
  let transformedText = input.value;
  // Appliquer les styles au texte en fonction des cases cochées
  if (bold.checked) {
    transformedText = transformText(transformedText, "bold");
  }
  if (italic.checked) {
    transformedText = transformText(transformedText, "italic");
  }
  if (underline.checked) {
    transformedText = transformText(transformedText, "underline");
  }
  if (strike.checked) {
    transformedText = transformText(transformedText, "strike");
  }
  if (font.checked) {
    transformedText = changeFont(transformedText, fontFamily.value);
  }
  if (color.checked) {
    transformedText = changeRGB(transformedText, red.value, green.value, blue.value);
  }
  // Fermer les balises <font> et <span> à la fin du texte si les cases correspondantes sont cochées
  if (color.checked) {
    transformedText = closeFont(transformedText);
  }
  if (font.checked) {
    transformedText = closeSpan(transformedText);
  }
  // Afficher le texte transformé dans l'élément output
  output.value = transformedText;
}


// Définir une fonction qui change la couleur du texte en fonction des curseurs RGB
function applyRGB() {
  // Récupérer l'élément input qui contient le texte à transformer
  let input = document.getElementById("input");
  // Récupérer l'élément output qui affiche le texte transformé
  let output = document.getElementById("output");
  // Récupérer les éléments red, green et blue qui contiennent les valeurs des curseurs RGB
  let red = document.getElementById("red");
  let green = document.getElementById("green");
  let blue = document.getElementById("blue");
  // Récupérer les éléments redValue, greenValue et blueValue qui contiennent les valeurs des boîtes de saisie RGB
  let redValue = document.getElementById("redValue");
  let greenValue = document.getElementById("greenValue");
  let blueValue = document.getElementById("blueValue");
  // Synchroniser les valeurs des curseurs et des boîtes de saisie
  redValue.value = red.value;
  greenValue.value = green.value;
  blueValue.value = blue.value;
  // Changer la couleur du texte en fonction des valeurs RGB
  let coloredText = changeRGB(input.value, red.value, green.value, blue.value);
  // Fermer la balise <font> à la fin du texte
  let coloredTextClosed = closeFont(coloredText);
  // Afficher le texte coloré dans l'élément output
  output.value = coloredTextClosed;
  // Récupérer l'élément preview qui affiche la couleur choisie
  let preview = document.getElementById("preview");
  // Changer la couleur de fond de l'élément preview
  preview.style.backgroundColor = "rgb(" + red.value + "," + green.value + "," + blue.value + ")";
}

// Définir une fonction qui copie le texte transformé dans le presse-papier
function copyText() {
  // Récupérer l'élément output qui contient le texte transformé
  let output = document.getElementById("output");
  // Sélectionner le texte transformé
  output.select();
  // Copier le texte transformé dans le presse-papier
  document.execCommand("copy");
  // Afficher une boîte d'information pour confirmer la copie
  alert("Texte copié: " + output.value);
}

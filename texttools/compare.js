const text1 = document.getElementById("text1");
const text2 = document.getElementById("text2");
const result = document.querySelector(".result");
const compareButton = document.getElementById("compare");
const caseSensitive = document.getElementById("caseSensitive");
const accentSensitive = document.getElementById("accentSensitive");

function compareStrings() {
  const length1 = text1.value.length;
  const length2 = text2.value.length;
  const sameLength = length1 === length2;
  const sameContent = sameLength && compareStringsWithOptions(text1.value, text2.value);
  const lengthDifference = Math.abs(length1 - length2);

  if (sameLength && sameContent) {
    result.textContent = "Les deux chaînes ont la même longueur et le même contenu.";
    result.style.color = "green";
  } else if (sameLength) {
    result.textContent = "Les deux chaînes ont la même longueur mais un contenu différent.";
    result.style.color = "orange";
  } else {
    if (lengthDifference === 1) {
      result.textContent = "Les deux chaînes ont une longueur différente de 1 caractère.";
    } else {
      result.textContent = `Les deux chaînes ont une longueur différente de ${lengthDifference} caractères.`;
    }
    result.style.color = "red";
  }
}

function compareStringsWithOptions(str1, str2) {
  if (caseSensitive.checked && accentSensitive.checked) {
    return str1 === str2;
  } else if (caseSensitive.checked) {
    return removeAccents(str1) === removeAccents(str2);
  } else if (accentSensitive.checked) {
    return str1.toLowerCase() === str2.toLowerCase();
  } else {
    return removeAccents(str1).toLowerCase() === removeAccents(str2).toLowerCase();
  }
}

function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

compareButton.addEventListener("click", compareStrings);

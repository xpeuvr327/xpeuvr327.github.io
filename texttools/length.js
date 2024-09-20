document.addEventListener("DOMContentLoaded", function() {
  const text = document.getElementById("text");
  const calculateLengthButton = document.getElementById("calculateLength");
  const result = document.getElementById("result");

  calculateLengthButton.addEventListener("click", function() {
    const length = text.value.length;
    result.textContent = `La longueur de la chaîne est de ${length} caractères.`;
  });
});

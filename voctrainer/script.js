$(document).ready(function() {
    const vocabulary = [
        { english: "blue-eyed", french: "aux yeux bleus" },
        { english: "broad-shouldered", french: "large d’épaules" },
        { english: "pale-skinned", french: "à peau claire" },
        { english: "sun-tanned", french: "bronzé" },
        { english: "fair-haired", french: "blond" },
        { english: "elegant", french: "élégant" },
        { english: "goal", french: "objectif" },
        { english: "overweight", french: "en surpoids" },
        { english: "shy", french: "timide" },
        { english: "shyness", french: "timidité" },
        { english: "slim", french: "mince" },
        { english: "strategy", french: "stratégie" },
        { english: "stunning", french: "magnifique, superbe, éblouissant" },
        { english: "stylish", french: "élégant" },
        { english: "ugly", french: "laid" },
        { english: "plain", french: "banal, quelconque" },
        { english: "face (a problem)", french: "affronter (un problème)" },
        { english: "on the right / left", french: "à droite / gauche" },
        { english: "arrogant", french: "arrogant" },
        { english: "arrogance", french: "arrogance" },
        { english: "assertive", french: "sûr de soi" },
        { english: "assertiveness", french: "assurance" },
        { english: "easy-going", french: "facile à vivre" },
        { english: "emotional", french: "émotif, sensible" },
        { english: "impression", french: "impression" },
        { english: "lazy", french: "fainéant" },
        { english: "laziness", french: "fainéantise" },
        { english: "modest", french: "modeste" },
        { english: "modesty", french: "modestie" },
        { english: "sensitive", french: "sensible" },
        { english: "stubborn", french: "têtu" },
        { english: "stubbornness", french: "obstination, entêtement" },
        { english: "determined", french: "déterminé" },
        { english: "chic", french: "chic" },
        { english: "designer", french: "de marque" },
        { english: "innovative", french: "innovant" },
        { english: "original", french: "original" },
        { english: "retro", french: "rétro" },
        { english: "vintage", french: "vintage" },
        { english: "second-hand", french: "d'occasion" },
        { english: "at the back (of)", french: "au fond de" },
        { english: "in front (of sth)", french: "devant" },
        { english: "at the front (of)", french: "au fond de" },
        { english: "behind", french: "derrière" },
        { english: "in the (top / bottom / right-hand / left-hand) corner", french: "dans le coin (supérieur / inférieur / droit / gauche)" },
        { english: "in the foreground / background (of)", french: "au premier plan / à l’arrière-plan" },
        { english: "in the middle (of)", french: "au milieu" },
        { english: "to the right / left (of sth)", french: "à droite / gauche (de quelque chose)" },
        { english: "curly / ≠ straight (hair)", french: "cheveux bouclés / lisses, raides" },
        { english: "ponytail", french: "queue de cheval" },
        { english: "bun", french: "chignon" },
        { english: "cardigan", french: "cardigan, gilet en laine" },
        { english: "hoody", french: "sweat à capuche" }
    ];

    let wordsLearned = 0;
    let currentWord = null;
    let quizQuestions = [];
    let quizAnswers = [];

    function getRandomWord() {
        const randomIndex = Math.floor(Math.random() * vocabulary.length);
        currentWord = vocabulary[randomIndex];
        $('#random-word-display').text(`Guess the word: ${currentWord.french}`);
    }

    function revealWord() {
        $('#random-word-display').text(`The word is: ${currentWord.english} (${currentWord.french})`);
    }

    function startQuiz() {
        quizQuestions = [];
        quizAnswers = [];
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * vocabulary.length);
            const question = vocabulary[randomIndex];
            quizQuestions.push(question);
        }
        displayQuizQuestions();
    }

    function displayQuizQuestions() {
        let quizHTML = '';
        quizQuestions.forEach((question, index) => {
            quizHTML += `<p>${index + 1}. What is the English translation of "${question.french}"?</p>`;
            quizHTML += `<input type="text" id="quiz-answer-${index}" placeholder="Your answer">`;
        });
        $('#quiz-questions').html(quizHTML);
        $('#submit-quiz-btn').show();
    }

    function submitQuiz() {
        let correctAnswers = 0;
        quizQuestions.forEach((question, index) => {
            const userAnswer = $(`#quiz-answer-${index}`).val().trim().toLowerCase();
            if (userAnswer === question.english.toLowerCase()) {
                correctAnswers++;
            }
        });
        wordsLearned += correctAnswers;
        $('#words-learned').text(wordsLearned);
        $('#quiz-results').html(`You got ${correctAnswers} out of 10 correct!`).show();
        $('#submit-quiz-btn').hide();
    }

    $('#random-word-btn').click(getRandomWord);
    $('#reveal-word-btn').click(revealWord);
    $('#start-quiz-btn').click(startQuiz);
    $('#submit-quiz-btn').click(submitQuiz);
});

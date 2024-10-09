$(document).ready(function() {
    let vocabulary = [];
    let wordsLearned = 0;
    let currentWord = null;
    let quizQuestions = [];
    let quizAnswers = [];
    let learnedWords = new Set();

    // Load vocabulary from JSON file
    $.getJSON('words.json', function(data) {
        vocabulary = data;
    });

    function getRandomWord() {
        if (vocabulary.length === 0) {
            $('#random-word-display').text('Chargement du vocabulaire...');
            return;
        }
        const randomIndex = Math.floor(Math.random() * vocabulary.length);
        currentWord = vocabulary[randomIndex];
        $('#random-word-display').text(`Deviner le mot: ${currentWord.french}`);
    }

    function revealWord() {
        $('#random-word-display').text(`La traduction de "${currentWord.english}" est "${currentWord.french}"`);
    }

    function startQuiz() {
        quizQuestions = [];
        quizAnswers = [];
        let usedIndices = new Set();
        while (quizQuestions.length < 10) {
            const randomIndex = Math.floor(Math.random() * vocabulary.length);
            if (!usedIndices.has(randomIndex)) {
                usedIndices.add(randomIndex);
                const question = vocabulary[randomIndex];
                quizQuestions.push(question);
            }
        }
        displayQuizQuestions();
    }

    function displayQuizQuestions() {
        let quizHTML = '';
        quizQuestions.forEach((question, index) => {
            quizHTML += `<p>${index + 1}. Quelle est la traduction en anglais de "${question.french}"?</p>`;
            quizHTML += `<input type="text" id="quiz-answer-${index}" placeholder="Votre réponse">`;
        });
        $('#quiz-questions').html(quizHTML);
        $('#submit-quiz-btn').show();
        $('#clear-quiz-btn').show();
        $('#retry-quiz-btn').hide();
        $('#quiz-results').hide();
    }

    function submitQuiz() {
        let correctAnswers = 0;
        let resultsHTML = '<h3>Résultats du Quiz</h3>';
        quizQuestions.forEach((question, index) => {
            const userAnswer = $(`#quiz-answer-${index}`).val().trim().toLowerCase();
            if (userAnswer === question.english.toLowerCase()) {
                correctAnswers++;
                resultsHTML += `<p>${index + 1}. Correct: La traduction de "${question.english}" est "${question.french}"</p>`;
                learnedWords.add(question.english);
            } else {
                resultsHTML += `<p>${index + 1}. Faux: La traduction de "${question.english}" est "${question.french}"</p>`;
            }
        });
        wordsLearned += correctAnswers;
        $('#words-learned').text(wordsLearned);
        $('#quiz-results').html(resultsHTML).show();
        $('#submit-quiz-btn').hide();
        $('#clear-quiz-btn').hide();
        $('#retry-quiz-btn').show();
        updateLearnedWordsList();
    }

    function clearQuiz() {
        $('#quiz-questions').empty();
        $('#quiz-results').hide();
        $('#submit-quiz-btn').hide();
        $('#clear-quiz-btn').hide();
        $('#retry-quiz-btn').hide();
    }

    function retryQuiz() {
        startQuiz();
    }

    function updateLearnedWordsList() {
        let learnedWordsHTML = '';
        learnedWords.forEach(word => {
            learnedWordsHTML += `<li>${word}</li>`;
        });
        $('#learned-words-list').html(learnedWordsHTML);
    }

    $('#random-word-btn').click(getRandomWord);
    $('#reveal-word-btn').click(revealWord);
    $('#start-quiz-btn').click(startQuiz);
    $('#submit-quiz-btn').click(submitQuiz);
    $('#clear-quiz-btn').click(clearQuiz);
    $('#retry-quiz-btn').click(retryQuiz);
});

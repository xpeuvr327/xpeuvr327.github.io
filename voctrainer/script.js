$(document).ready(function() {
    let vocabulary = [];
    let wordsLearned = 0;
    let currentWord = null;
    let quizQuestions = [];
    let quizAnswers = [];

    // Load vocabulary from JSON file
    $.getJSON('words.json', function(data) {
        vocabulary = data;
    });

    function getRandomWord() {
        if (vocabulary.length === 0) {
            $('#random-word-display').text('Loading vocabulary...');
            return;
        }
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

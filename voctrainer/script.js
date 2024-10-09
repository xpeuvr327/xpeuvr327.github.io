$(document).ready(function() {
    let vocabulary = [];
    let wordsLearned = 0;
    let currentWord = null;
    let quizQuestions = [];
    let quizAnswers = [];
    let learnedWords = new Set();
    let omitSymbols = true;

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
        const randomLanguage = Math.random() < 0.5 ? 'english' : 'french';
        $('#random-word-display').text(`Deviner le mot: ${currentWord[randomLanguage]}`);
    }

    function revealWord() {
        const randomLanguage = currentWord.english === $('#random-word-display').text().split(': ')[1] ? 'french' : 'english';
        learnedWords.add(currentWord[randomLanguage]);
        $('#random-word-display').text(`La traduction de "${currentWord[randomLanguage]}" est "${currentWord[randomLanguage === 'english' ? 'french' : 'english']}"`);
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
                const randomLanguage = Math.random() < 0.5 ? 'english' : 'french';
                quizQuestions.push({ ...question, randomLanguage });
            }
        }
        displayQuizQuestions();
    }

    function displayQuizQuestions() {
        let quizHTML = '';
        quizQuestions.forEach((question, index) => {
            const language = question.randomLanguage === 'english' ? 'français' : 'anglais';
            quizHTML += `<p>${index + 1}. Quelle est la traduction en ${language} de "${question[question.randomLanguage]}"?</p>`;
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
            const cleanedUserAnswer = omitSymbols ? userAnswer.replace(/[^\w\s]|_/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '') : userAnswer;
            const cleanedQuestion = omitSymbols ? question[question.randomLanguage].replace(/[^\w\s]|_/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '') : question[question.randomLanguage];
            if (cleanedUserAnswer === cleanedQuestion.toLowerCase()) {
                correctAnswers++;
                resultsHTML += `<p>${index + 1}. Correct: La traduction de "${question[question.randomLanguage]}" est "${question[question.randomLanguage === 'english' ? 'french' : 'english']}"</p>`;
                learnedWords.add(question[question.randomLanguage]);
            } else {
                resultsHTML += `<p>${index + 1}. Faux: La traduction de "${question[question.randomLanguage]}" est "${question[question.randomLanguage === 'english' ? 'french' : 'english']}"</p>`;
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

    $('#random-word-btn').text('Obtenir un Mot Aléatoire');
    $('#reveal-word-btn').text('Révéler le Mot');
    $('#start-quiz-btn').text('Commencer le Quiz');
    $('#submit-quiz-btn').text('Soumettre le Quiz');
    $('#clear-quiz-btn').text('Effacer Tout');
    $('#retry-quiz-btn').text('Réessayer');
    $('#omit-symbols').change(function() {
        omitSymbols = $(this).is(':checked');
    });
});

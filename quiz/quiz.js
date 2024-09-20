document.addEventListener("DOMContentLoaded", function() {
    const fileInput = document.getElementById('file-input');
    const importButton = document.getElementById('import-btn');
    const submitButton = document.getElementById('submit-btn');

    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    function loadQuizFromFile(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const quizData = JSON.parse(e.target.result);
            displayQuiz(quizData);
        };
        reader.readAsText(file);
    }

    function loadDefaultQuiz() {
        const quizId = getParameterByName('quiz');
        let quizFile = 'files/quiz.json';

        if (quizId) {
            quizFile = `files/quiz${quizId}.json`;
        }

        fetch(quizFile)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Quiz not found');
                }
                return response.json();
            })
            .then(data => {
                displayQuiz(data);
            })
            .catch(error => {
                document.body.innerHTML = `
                    <div class="container">
                        <h1>Ce quiz n'a pas été trouvé, ou il y a une erreur dans le fichier de quiz.</h1>
                        <p>Essaie de retourner à l'<a href="${window.location.origin + window.location.pathname}">acceuil</a>.</p>
                    </div>
                `;
            });
    }

    function displayQuiz(data) {
        const quizName = data.name;
        const description = data.description;
        const questions = data.questions;

        document.getElementById('quiz-name').textContent = quizName;
        document.getElementById('description').textContent = description;

        const quizContainer = document.getElementById('quiz-container');
        quizContainer.innerHTML = '';

        questions.forEach((question, index) => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question');
            questionElement.innerHTML = `
                <p>${question.question}</p>
                ${generateAnswers(question, index)}
                <div id="explanation-${index}" class="explanation" style="display: none;"></div>
            `;
            quizContainer.appendChild(questionElement);
        });

        submitButton.style.display = 'block';
        submitButton.onclick = () => {
            let score = 0;
            questions.forEach((question, index) => {
                const selectedAnswer = document.querySelector(`input[name="question${index}"]:checked`);
                const explanationElement = document.getElementById(`explanation-${index}`);
                if (selectedAnswer) {
                    if (parseInt(selectedAnswer.value) === question.correctAnswer) {
                        score++;
                        selectedAnswer.parentElement.classList.add('correct');
                    } else {
                        selectedAnswer.parentElement.classList.add('incorrect');
                        explanationElement.style.display = 'block';
                        explanationElement.textContent = question.explanation;
                    }
                    document.querySelector(`label[for="question${index}_answer${question.correctAnswer}"]`).classList.add('correct');
                }
            });
            document.getElementById('result').textContent = `Your score: ${score}/${questions.length}`;
        };
    }

    function generateAnswers(question, index) {
        return question.answers.map((answer, i) => `
            <div class="answer">
                <input type="radio" name="question${index}" id="question${index}_answer${i}" value="${i}">
                <label for="question${index}_answer${i}">${answer}</label>
            </div>
        `).join('');
    }

    importButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            loadQuizFromFile(file);
        }
    });

    // Load default quiz on page load
    loadDefaultQuiz();
});

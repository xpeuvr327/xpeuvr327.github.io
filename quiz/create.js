document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('quiz-form');
    const addQuestionBtn = document.getElementById('add-question-btn');
    const questionsContainer = document.getElementById('questions-container');
    let questionIndex = 1;

    addQuestionBtn.addEventListener('click', () => {
        const questionBlock = document.createElement('div');
        questionBlock.classList.add('question-block');
        questionBlock.innerHTML = `
            <label for="question-${questionIndex}">Question:</label>
            <input type="text" id="question-${questionIndex}" name="question-${questionIndex}" required>
            <div class="answers-container">
                <label for="answer-${questionIndex}-0">Réponse 1:</label>
                <input type="text" id="answer-${questionIndex}-0" name="answer-${questionIndex}-0" required>
                <label for="answer-${questionIndex}-1">Réponse 2:</label>
                <input type="text" id="answer-${questionIndex}-1" name="answer-${questionIndex}-1" required>
                <label for="answer-${questionIndex}-2">Réponse 3:</label>
                <input type="text" id="answer-${questionIndex}-2" name="answer-${questionIndex}-2">
                <label for="answer-${questionIndex}-3">Réponse 4:</label>
                <input type="text" id="answer-${questionIndex}-3" name="answer-${questionIndex}-3">
            </div>
            <label for="correct-answer-${questionIndex}">Réponse correcte:</label>
            <input type="number" min="0" max="3" id="correct-answer-${questionIndex}" name="correct-answer-${questionIndex}" required>
            <label for="explanation-${questionIndex}">Explication:</label>
            <textarea id="explanation-${questionIndex}" name="explanation-${questionIndex}" required></textarea>
        `;
        questionsContainer.appendChild(questionBlock);
        questionIndex++;
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const quizTitle = document.getElementById('quiz-title').value;
        const quizDescription = document.getElementById('quiz-description').value;
        const questions = [];

        for (let i = 0; i < questionIndex; i++) {
            const questionElement = document.getElementById(`question-${i}`);
            if (!questionElement) continue; // Skip if the question block was removed

            const question = questionElement.value;
            const answers = [];
            for (let j = 0; j < 4; j++) {
                const answerElement = document.getElementById(`answer-${i}-${j}`);
                if (answerElement && answerElement.value) {
                    answers.push(answerElement.value);
                }
            }
            const correctAnswer = parseInt(document.getElementById(`correct-answer-${i}`).value);
            const explanation = document.getElementById(`explanation-${i}`).value;

            questions.push({
                question: question,
                answers: answers,
                correctAnswer: correctAnswer,
                explanation: explanation
            });
        }

        const quizData = {
            name: quizTitle,
            description: quizDescription,
            questions: questions
        };

        const blob = new Blob([JSON.stringify(quizData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.getElementById('download-link');
        downloadLink.href = url;
        downloadLink.download = 'quiz.json';
        downloadLink.style.display = 'block';
        downloadLink.textContent = 'Download Quiz JSON';
    });
});

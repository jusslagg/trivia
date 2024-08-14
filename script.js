import { startTimer, stopTimer, getTotalTime, resetTimer } from './timer.js';

document.addEventListener('DOMContentLoaded', () => {
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options-container');
    const nextButton = document.getElementById('next-button');
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result-text');
    const timeTakenElement = document.getElementById('time-taken');
    const currentTimeElement = document.getElementById('current-time');
    const feedbackElement = document.createElement('div');

    let currentQuestionIndex = 0;
    let score = 0;
    let timerInterval = null;
    const totalQuestions = 10; // Total de preguntas en el cuestionario
    let questions = []; // Array para almacenar las preguntas
    let selectedQuestions = []; // Array para las preguntas seleccionadas

    // Función para actualizar el temporizador en minutos y segundos
    function updateTimer() {
        const elapsed = getTotalTime(); // Tiempo total acumulado en milisegundos
        const minutes = Math.floor(elapsed / 60000); // Convertir a minutos
        const seconds = Math.floor((elapsed % 60000) / 1000); // Convertir a segundos

        currentTimeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Función para mezclar un array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Función para mostrar una pregunta
    function showQuestion() {
        if (currentQuestionIndex >= selectedQuestions.length) {
            // Finalizar el cuestionario
            resultText.textContent = `Tu puntaje final es ${score}/${totalQuestions}.`;
            timeTakenElement.textContent = `Tiempo total tomado: ${Math.floor(getTotalTime() / 60000)}:${Math.floor((getTotalTime() % 60000) / 1000)} minutos.`;
            resultContainer.style.display = 'block';
            nextButton.style.display = 'none';
            clearInterval(timerInterval); // Detener el intervalo del temporizador
            return;
        }

        const question = selectedQuestions[currentQuestionIndex];
        questionElement.textContent = question.pregunta;
        optionsContainer.innerHTML = '';
        feedbackElement.textContent = '';

        const shuffledOptions = shuffleArray([...question.opciones]);
        const optionLetters = ['A', 'B', 'C', 'D'];

        shuffledOptions.forEach((opcion, index) => {
            const optionButton = document.createElement('button');
            optionButton.textContent = `${optionLetters[index]}. ${opcion}`;
            optionButton.classList.add('option');
            optionButton.addEventListener('click', () => {
                stopTimer(); // Detener el temporizador y obtener el tiempo tomado
                if (opcion === question.respuesta_correcta) {
                    score++;
                    feedbackElement.textContent = '¡Respuesta Correcta!';
                    feedbackElement.style.color = 'green';
                } else {
                    feedbackElement.textContent = `Respuesta Incorrecta. La respuesta correcta es: ${question.respuesta_correcta}`;
                    feedbackElement.style.color = 'red';
                }
                optionsContainer.appendChild(feedbackElement);
                setTimeout(() => {
                    currentQuestionIndex++;
                    showQuestion();
                    startTimer(); // Reiniciar el temporizador para la siguiente pregunta
                }, 1500);
            });
            optionsContainer.appendChild(optionButton);
        });

        // Iniciar el temporizador solo si no está en marcha
        if (!timerInterval) {
            startTimer();
            timerInterval = setInterval(updateTimer, 1000); // Actualizar cada segundo
        }
    }

    // Función para cargar preguntas desde data.json
    function loadQuestions() {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                questions = data;
                selectedQuestions = shuffleArray(questions).slice(0, totalQuestions);
                showQuestion();
            })
            .catch(error => console.error('Error al cargar las preguntas:', error));
    }

    nextButton.addEventListener('click', () => {
        showQuestion();
    });

    // Inicializar el cuestionario
    loadQuestions();
});
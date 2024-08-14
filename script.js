import { startTimer, stopTimer } from './timer.js';

document.addEventListener('DOMContentLoaded', () => {
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options-container');
    const nextButton = document.getElementById('next-button');
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result-text');
    const timeTakenElement = document.getElementById('time-taken');
    const currentTimeElement = document.getElementById('current-time');
    const feedbackElement = document.createElement('div'); // Elemento para el feedback

    let currentQuestionIndex = 0;
    let score = 0;
    let timeTaken = 0; // Tiempo total tomado para responder
    let startTime = null; // Hora de inicio para el temporizador
    const totalQuestions = 10; // Total de preguntas en el juego
    let questions = []; // Array para almacenar las preguntas
    let selectedQuestions = []; // Array para las preguntas seleccionadas

    // Función para actualizar el temporizador en la interfaz
    function updateTimer() {
        if (startTime) {
            const currentTime = ((new Date() - startTime) / 1000).toFixed(2);
            currentTimeElement.textContent = currentTime;
        }
    }

    // Función para obtener un número aleatorio entre min y max
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Función para obtener una muestra aleatoria de preguntas
    function getRandomQuestions(num) {
        const shuffled = [...questions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
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
            resultText.textContent = `Tu puntaje final es ${score}/${totalQuestions}.`;
            timeTakenElement.textContent = `Tiempo total tomado: ${timeTaken.toFixed(2)} segundos.`;
            resultContainer.style.display = 'block';
            nextButton.style.display = 'none';
            return;
        }

        const question = selectedQuestions[currentQuestionIndex];
        questionElement.textContent = question.pregunta;
        optionsContainer.innerHTML = '';
        feedbackElement.textContent = ''; // Limpiar el feedback anterior

        // Mezclar opciones antes de mostrarlas
        const shuffledOptions = shuffleArray([...question.opciones]);

        // Letras para las opciones
        const optionLetters = ['A', 'B', 'C', 'D'];

        shuffledOptions.forEach((opcion, index) => {
            const optionButton = document.createElement('button');
            optionButton.textContent = `${optionLetters[index]}. ${opcion}`;
            optionButton.classList.add('option');
            optionButton.addEventListener('click', () => {
                const elapsed = stopTimer(); // Detener el temporizador y obtener el tiempo tomado
                timeTaken += elapsed; // Acumulando el tiempo total tomado
                if (opcion === question.respuesta_correcta) {
                    score++;
                    feedbackElement.textContent = '¡Respuesta Correcta!';
                    feedbackElement.style.color = 'green';
                } else {
                    feedbackElement.textContent = `Respuesta Incorrecta. La respuesta correcta es: ${question.respuesta_correcta}`;
                    feedbackElement.style.color = 'red';
                }
                optionsContainer.appendChild(feedbackElement); // Agregar el feedback después de las opciones
                setTimeout(() => {
                    currentQuestionIndex++;
                    showQuestion();
                    startTimer(); // Reiniciar el temporizador para la siguiente pregunta
                }, 2000); // Mostrar feedback por 2 segundos antes de pasar a la siguiente pregunta
            });
            optionsContainer.appendChild(optionButton);
        });

        startTime = new Date(); // Guardar el momento actual para el temporizador
        startTimer(); // Iniciar el temporizador cuando se muestra la pregunta

        // Actualizar el temporizador cada 100ms
        const timerInterval = setInterval(() => {
            updateTimer();
        }, 100);

        // Detener el intervalo cuando se cambia la pregunta
        function stopUpdatingTimer() {
            clearInterval(timerInterval);
        }

        // Interrumpir el temporizador actual cuando cambie de pregunta
        nextButton.addEventListener('click', stopUpdatingTimer);
    }

    // Función para cargar preguntas desde data.json
    function loadQuestions() {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                questions = data; // Guardar las preguntas en el array
                selectedQuestions = getRandomQuestions(totalQuestions); // Obtener preguntas aleatorias
                showQuestion(); // Mostrar la primera pregunta
            })
            .catch(error => {
                console.error('Error al cargar las preguntas:', error);
            });
    }

    nextButton.addEventListener('click', () => {
        showQuestion();
    });

    // Inicializar
    loadQuestions();
});
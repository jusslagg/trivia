// timer.js

let startTime = null;
let endTime = null;

// Inicia el temporizador
function startTimer() {
    startTime = new Date();
}

// Detiene el temporizador y devuelve el tiempo transcurrido en segundos
function stopTimer() {
    endTime = new Date();
    if (startTime) {
        const elapsed = (endTime - startTime) / 1000; // Tiempo en segundos
        startTime = null; // Reiniciar el temporizador
        return elapsed;
    }
    return 0;
}

export { startTimer, stopTimer };
let startTime = null;
let accumulatedTime = 0;

// Inicia el temporizador
function startTimer() {
    if (startTime === null) {
        startTime = new Date();
    }
}

// Detiene el temporizador y devuelve el tiempo transcurrido en milisegundos
function stopTimer() {
    if (startTime !== null) {
        accumulatedTime += new Date() - startTime; // Acumular tiempo
        startTime = null;
    }
}

// Obtiene el tiempo total acumulado en milisegundos
function getTotalTime() {
    if (startTime !== null) {
        return accumulatedTime + (new Date() - startTime);
    }
    return accumulatedTime;
}

// Reinicia el temporizador
function resetTimer() {
    startTime = null;
    accumulatedTime = 0;
}

export { startTimer, stopTimer, getTotalTime, resetTimer };
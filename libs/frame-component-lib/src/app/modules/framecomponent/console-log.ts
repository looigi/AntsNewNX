// console.log della libreria: disattivato di default per non rallentare l'app e non trattenere in memoria
// gli oggetti stampati (la console li conserva finché è aperta).
// Per riattivarlo: localStorage.setItem('FrameConsoleLog', 'S') e ricaricare la pagina.
let consoleLogAttivo = false;
try {
  consoleLogAttivo = localStorage.getItem('FrameConsoleLog') === 'S';
} catch (e) {
  consoleLogAttivo = false;
}

export function logConsole(...args: any[]) {
  if (consoleLogAttivo) {
    console.log(...args);
  }
}

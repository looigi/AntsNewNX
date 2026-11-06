// console.log dell'applicazione: disattivato di default per non rallentare l'app e non trattenere in memoria
// gli oggetti stampati (la console li conserva finché è aperta).
// Per riattivarlo: localStorage.setItem('UserManagerConsoleLog', 'S') e ricaricare la pagina.
let consoleLogAttivo = false;
try {
  consoleLogAttivo = localStorage.getItem('UserManagerConsoleLog') === 'S';
} catch (e) {
  consoleLogAttivo = false;
}

export function logConsole(...args: any[]) {
  if (consoleLogAttivo) {
    console.log(...args);
  }
}

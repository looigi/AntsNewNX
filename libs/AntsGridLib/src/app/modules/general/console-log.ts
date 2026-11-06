// console.log della griglia: disattivato di default per non rallentare l'app e non trattenere in memoria
// gli oggetti stampati (la console li conserva finché è aperta; qui spesso sono interi dati di griglia).
// Per riattivarlo: localStorage.setItem('GridConsoleLog', 'S') e ricaricare la pagina.
// Il log di debug della griglia (scriveLog con debug attivo) non passa di qui e resta invariato.
let consoleLogAttivo = false;
try {
  consoleLogAttivo = localStorage.getItem('GridConsoleLog') === 'S';
} catch (e) {
  consoleLogAttivo = false;
}

export function logConsole(...args: any[]) {
  if (consoleLogAttivo) {
    console.log(...args);
  }
}

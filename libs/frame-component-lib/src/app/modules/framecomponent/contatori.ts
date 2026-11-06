// Contatori diagnostici di caricamenti e ridisegni, disattivati di default (costo nullo quando spenti).
// Attivazione: localStorage.setItem('ContaRidisegni', 'S') e ricaricare la pagina.
// Dalla console del browser:
//   mostraContatori()   tabella ordinata per numero di volte
//   scaricaContatori()  salva i contatori in un file JSON
//   azzeraContatori()   riparte da zero (es. subito prima di caricare una dashboard)
// Lo stesso file esiste in AntsGridLib: il registro su window è condiviso, quindi la tabella contiene frame e griglie.
const w = window as any;

let attivo = false;
try {
  attivo = localStorage.getItem('ContaRidisegni') === 'S';
} catch (e) {
  attivo = false;
}

export function conta(categoria: string, dettaglio: string) {
  if (!attivo) {
    return;
  }
  const reg = w.__contatoriGeoAnts = w.__contatoriGeoAnts || { inizio: Date.now(), voci: {} };
  const chiave = categoria + ' | ' + dettaglio;
  const ora = Date.now() - reg.inizio;
  const voce = reg.voci[chiave] = reg.voci[chiave] || { categoria, dettaglio, volte: 0, primo: ora, ultimo: ora };
  voce.volte++;
  voce.ultimo = ora;
}

if (attivo && !w.mostraContatori) {
  const righe = () => {
    const reg = w.__contatoriGeoAnts;
    if (!reg) {
      return [];
    }
    return Object.values(reg.voci)
      .sort((a: any, b: any) => b.volte - a.volte)
      .map((v: any) => ({ categoria: v.categoria, dettaglio: v.dettaglio, volte: v.volte,
        'primo (s)': +(v.primo / 1000).toFixed(1), 'ultimo (s)': +(v.ultimo / 1000).toFixed(1) }));
  };
  w.mostraContatori = () => {
    const r = righe();
    console.table(r);
    return r.length + ' voci';
  };
  w.scaricaContatori = () => {
    const blob = new Blob([JSON.stringify(righe(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'contatori-ridisegni.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };
  w.azzeraContatori = () => {
    w.__contatoriGeoAnts = { inizio: Date.now(), voci: {} };
    return 'contatori azzerati';
  };
}

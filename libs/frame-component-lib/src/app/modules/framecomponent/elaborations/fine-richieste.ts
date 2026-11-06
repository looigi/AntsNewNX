import { Observable, Subject } from 'rxjs';

// Annullamento delle chiamate al server separato per frame.
// I componenti di elaborazione sono provider unici del modulo e vengono condivisi da tutti i frame: con un solo Subject
// la pulizia di un frame annullerebbe le chiamate in corso degli altri frame e, una volta completato, il Subject non
// annullerebbe più nulla (le risposte arrivate dopo il cambio vista riscriverebbero i dati sul frame).
export class FineRichieste {
  private static readonly senzaFrame = {};
  private soggetti = new WeakMap<object, Subject<void>>();

  // Notificatore da usare in takeUntil per le chiamate del frame t
  per(t): Observable<void> {
    const chiave = t || FineRichieste.senzaFrame;
    let soggetto = this.soggetti.get(chiave);
    if (!soggetto) {
      soggetto = new Subject<void>();
      this.soggetti.set(chiave, soggetto);
    }
    return soggetto;
  }

  // Annulla le chiamate in corso del solo frame t; le chiamate successive useranno un nuovo notificatore
  ferma(t) {
    const chiave = t || FineRichieste.senzaFrame;
    const soggetto = this.soggetti.get(chiave);
    if (soggetto) {
      this.soggetti.delete(chiave);
      soggetto.next();
      soggetto.complete();
    }
  }
}

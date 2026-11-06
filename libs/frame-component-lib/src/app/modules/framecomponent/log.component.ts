import { Injectable, NgZone } from "@angular/core";

@Injectable()
export class LogComponentInterno {
    lista = new Array();
    timer;

    constructor(private ngZone: NgZone) {}

    scriveLog(t, debug, NomeFunzione, Errore, Cosa, P1?, P2?, P3?, P4?, P5?) {
        if (!debug) {
            return true;
        }
        
        const struttura = {
            t: t,
            debug: debug,
            Errore: Errore,
            NomeFunzione: NomeFunzione,
            Cosa: Cosa,
            P1: P1,
            P2: P2,
            P3: P3,
            P4: P4,
            P5: P5,
        }
        this.lista.push(struttura);

        // Svuota tutta la coda in un unico passaggio, fuori dalla zona Angular:
        // scrivere in console non richiede change detection
        if (!this.timer) {
            this.ngZone.runOutsideAngular(() => {
                this.timer = setTimeout(() => {
                    const daScrivere = this.lista;
                    this.lista = new Array();
                    this.timer = undefined;
                    daScrivere.forEach(struttura => this.smista(struttura));
                }, 10);
            });
        }
    }

    smista(struttura) {
        let numeroFrame = '';
        if (struttura.t && struttura.t.NumeroFrame2) {
            numeroFrame = 'Frame' + struttura.t.NumeroFrame2;
        } else {
            if (struttura.t && struttura.t.NumeroFrame) {
                numeroFrame = 'Frame' + struttura.t.NumeroFrame;
            }
        }
        let Funzione;
        if (struttura.NomeFunzione.indexOf(';') > -1)  {
            Funzione = struttura.NomeFunzione.split(';');
        } else {
            Funzione = [struttura.NomeFunzione, ''];
        }
        let Classe = Funzione[0];
        while (Classe.indexOf('.') > -1) {
            Classe = Classe.replace('.', ';');
        }
        const stringona = Classe + ';' + numeroFrame + ';' + Funzione[1];

        if (struttura.P1 !== undefined && struttura.P2 !== undefined && struttura.P3 !== undefined && struttura.P4 !== undefined && struttura.P5 !== undefined) {
            if (struttura.Errore) {
                console.error(stringona, struttura.Cosa, struttura.P1, struttura.P2, struttura.P3, struttura.P4, struttura.P5);
            } else {
                console.log(stringona, struttura.Cosa, struttura.P1, struttura.P2, struttura.P3, struttura.P4, struttura.P5);
            }
        } else {
            if (struttura.P1 !== undefined && struttura.P2 !== undefined && struttura.P3 !== undefined && struttura.P4 !== undefined && struttura.P5 === undefined) {
                if (struttura.Errore) {
                    console.error(stringona, struttura.Cosa, struttura.P1, struttura.P2, struttura.P3, struttura.P4);
                } else {
                    console.log(stringona, struttura.Cosa, struttura.P1, struttura.P2, struttura.P3, struttura.P4);
                }
            } else {
                if (struttura.P1 !== undefined && struttura.P2 !== undefined && struttura.P3 !== undefined && struttura.P4 === undefined && struttura.P5 === undefined) {
                    if (struttura.Errore) {
                        console.error(stringona, struttura.Cosa, struttura.P1, struttura.P2, struttura.P3);
                    } else {
                        console.log(stringona, struttura.Cosa, struttura.P1, struttura.P2, struttura.P3);
                    }
                } else {
                    if (struttura.P1 !== undefined && struttura.P2 !== undefined && struttura.P3 === undefined && struttura.P4 === undefined && struttura.P5 === undefined) {
                        if (struttura.Errore) {
                            console.error(stringona, struttura.Cosa, struttura.P1, struttura.P2);
                        } else {
                            console.log(stringona, struttura.Cosa, struttura.P1, struttura.P2);
                        }
                    } else {
                        if (struttura.P1 !== undefined && struttura.P2 === undefined && struttura.P3 === undefined && struttura.P4 === undefined && struttura.P5 === undefined) {
                            if (struttura.Errore) {
                                console.error(stringona, struttura.Cosa, struttura.P1);
                            } else {
                                console.log(stringona, struttura.Cosa, struttura.P1);
                            }
                        }  else {
                            if (struttura.Errore) {
                                console.error(stringona, struttura.Cosa);
                            } else {
                                console.log(stringona, struttura.Cosa);
                            }
                        }
                    }
                }
            }
        }

        return true;
    }

    getMethodName() {
        try {
            throw new Error();
        } catch (e) {
            try {
                let nome = e['stack'].split('at ')[2].split(' ')[0];
                if (nome.indexOf('scriveLog') > -1) {
                    nome = e['stack'].split('at ')[3].split(' ')[0];
                }
                const tutto = e['stack'];
                // // console.log('Tutto: ', e['stack'], tutto);
                let riga = tutto.substring(tutto.indexOf(nome) + nome.length, tutto.length);
                riga = riga.substring(0, riga.indexOf('at'));
                riga = riga.replace('(', '').replace(')', '').trim();
                // alert(nome + ';' + riga);
                return nome + ';' + riga;
            } catch (e) {
                return '';
            }
        }
    }       
}
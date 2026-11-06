import { Injectable } from "@angular/core";
import { ExternalApiService } from "../services/externalapi.service";

@Injectable()
export class GestioneGraficiAE {
    nomeClasse = 'GestioneGraficiAE: ';

    constructor(
        private apiService: ExternalApiService,
    ) {
    }

    disegnaGraficiAE(t, dati) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.nomeClasse + 'Inizio gestione grafici AE', dati);
    }
}
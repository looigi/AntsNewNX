import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import ExternalUtilities from "../ExternalUtilities.component";

@Injectable()
export class DisegnoMappe {
  constructor(
  ) {
  }

  /* disegnoMappe(t) {
    t.caricamentoMappaInCorso = true;

    t.staDisegnandoPath[t.NumeroFrame2] = true;
    t.staDisegnandoOverlay[t.NumeroFrame2] = true;
    t.staDisegnandoLegenda[t.NumeroFrame2] = true;
    t.staDisegnandoPathClickato[t.NumeroFrame2] = true;
    t.staDisegnandoServingCell[t.NumeroFrame2] = true;
    t.staDisegnandoPuntoSelezionato[t.NumeroFrame2] = true;
    t.staCaricandoPiantina = true;
    t.staDisegnandoSartPosition[t.NumeroFrame2] = true;
    t.staDisegnandoLayerGeometry[t.NumeroFrame2] = true;

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Accentratore: Scrive valori misure');
    }
    t.scriveValoriMisure();
    t.contaScala();

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ridisegno mappa frame', t.NumeroFrame);

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Accentratore: Disegna path');
    }
    t.pathComponent.disegnaPath(t);

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Accentratore: Disegna overlay');
    }
    t.pathComponent.disegnaOverlay(t);

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Accentratore: Disegna add layers');
    }
    t.additional_Layer.disegnaAddLayers(t);

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Accentratore: Disegna all layers');
    }
    t.showRaysAllLayerC.disegnaAllLayers(t, t.coordinateSREL, false);

    if (ExternalUtilities.isArray(t.Measure)) {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.Measure);
      t.legendaComponent.disegnaLegenda(t, t.Measure, false);
    } else {
      t.staDisegnandoLegenda[t.NumeroFrame2] = false;
    }

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Accentratore. Parametri aggiorna mappa', t.NumeroFrame2, t.Utils.tmsSelezionato,
        t.tmsSelezionato, t.strutturaClick);
    }
    if (t.Utils.tmsSelezionato || t.eseguitoInProgetto22 === true) {
      const tms = t.Utils.tmsSelezionato; //  t.strutturaClick.tms;
      // if (!tms) {
      //   tms = t.strutturaClick.tms_min;
      // }

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.isSyncTms, t.Utils.mappaClickata, t.NumeroFrame);
      // if ((t.isSyncTms === true && t.Utils.mappaClickata !== t.NumeroFrame)) {
      t.pathComponent.disegnaPathClickato(t, tms);

      t.puntoSelezionatoComponent.disegnaPuntoSelezionato(t, tms);

      if (t.Utils.tmsSelezionato) {
        t.pathComponent.disegnaServingCell(t, tms);

        t.pathComponent.disegnaShowRays(t, tms);
     }
        // }
    } else {
      t.staDisegnandoPathClickato[t.NumeroFrame2] = false;
      t.staDisegnandoServingCell[t.NumeroFrame2] = false;
      t.staDisegnandoPuntoSelezionato[t.NumeroFrame2] = false;
      t.staDisegnandoSartPosition[t.NumeroFrame2] = false;
    }
    t.pathComponent.disegnaAgentPosition(t, t.agnGroup2);

    t.pathComponent.disegnaSchedSel(t, t.agnGroup2);

    t.mosaicGrid.caricamentoLayerGeometry(t);

    t.clusterGrid.caricamentoLayerGeometry(t);

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Imposto zoom:', t.currZoom);

    // Carica piantina e features per modifica
    t.planimetry.caricaPiantina(t);
    // t.planimetry.creaFeature(t);
    // Carica piantina e features per modifica

    // t.additional_Layer.disegnaAddLayers(t);

    if (t.subscribeAttesaMappa[t.NumeroFrame2]) {
      // t.subscribeAttesaMappa.unsubscribe();
      clearInterval(t.subscribeAttesaMappa[t.NumeroFrame2]);
    }

    let q = 0;
    t.subscribeAttesaMappa[t.NumeroFrame2] = setInterval(() => {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame,
          t.staDisegnandoPath[t.NumeroFrame2],
          t.staDisegnandoOverlay[t.NumeroFrame2],
          t.staDisegnandoLegenda[t.NumeroFrame2],
          t.staDisegnandoPathClickato[t.NumeroFrame2],
          t.staDisegnandoServingCell[t.NumeroFrame2],
          t.staDisegnandoPuntoSelezionato[t.NumeroFrame2],
          t.staDisegnandoSartPosition[t.NumeroFrame2],
          t.staDisegnandoLayerGeometry[t.NumeroFrame2]
        );
      }
      let pendings = '';
      if (t.staDisegnandoPath[t.NumeroFrame2]) {
        pendings += 'Path<br />';
      }
      if (t.staDisegnandoOverlay[t.NumeroFrame2]) {
        pendings += 'Overlay<br />';
      }
      if (t.staDisegnandoLegenda[t.NumeroFrame2]) {
        pendings += 'Legenda<br />';
      }
      if (t.staDisegnandoPathClickato[t.NumeroFrame2]) {
        pendings += 'Selected Path<br />';
      }
      if (t.staDisegnandoServingCell[t.NumeroFrame2]) {
        pendings += 'Serving Cell<br />';
      }
      if (t.staDisegnandoPuntoSelezionato[t.NumeroFrame2]) {
        pendings += 'Selected Point<br />';
      }
      if (t.staCaricandoPiantina[t.NumeroFrame2]) {
        pendings += 'Planimetry<br />';
      }
      if (t.staDisegnandoSartPosition[t.NumeroFrame2]) {
        pendings += 'Sart position<br />';
      }
      if (t.staDisegnandoLayerGeometry[t.NumeroFrame2]) {
        pendings += 'Layer Geometry<br />';
      }

      t.pendings = pendings;

      if (t.staDisegnandoPath[t.NumeroFrame2] === false &&
        t.staDisegnandoOverlay[t.NumeroFrame2] === false &&
        t.staDisegnandoLegenda[t.NumeroFrame2] === false &&
        t.staDisegnandoPathClickato[t.NumeroFrame2] === false &&
        t.staDisegnandoServingCell[t.NumeroFrame2] === false &&
        t.staDisegnandoPuntoSelezionato[t.NumeroFrame2] === false &&
        t.staDisegnandoSartPosition[t.NumeroFrame2] === false &&
        t.staDisegnandoLayerGeometry[t.NumeroFrame2] === false) {

        this.esceDallaFunzione(t);
      } else {
        q++;
        if (q >= 10) {
          this.esceDallaFunzione(t);
        }
      }
    }, 1000);
  }

  esceDallaFunzione(t) {
    clearInterval(t.subscribeAttesaMappa[t.NumeroFrame2]);
    // const tm = setTimeout(() => {
          clearTimeout(tm);
      if (t.map1[t.NumeroFrame2]) {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ATTIVO MoveEND', t.NumeroFrame2);
        t.map1[t.NumeroFrame2].un('moveend', t.moveEnd);
        t.map1[t.NumeroFrame2].on('moveend', t.inZonaAngular(t.moveEnd.bind(null, this)));

        t.map1[t.NumeroFrame2].un('precompose', t.preCompose);
        t.map1[t.NumeroFrame2].on('precompose', t.preCompose.bind(null, this));

        // t.map1[t.NumeroFrame2].addEventListener('mousemove', t.mouseMove);
        const container = document.getElementById('frameM_' + t.NumeroFrame + '_' + t.frameAttivo2);
        container.addEventListener('mousemove', t.mouseMove.bind(null, this));
        container.addEventListener('mouseout', t.mouseOut.bind(null, this));
        // container.addEventListener('postrender', t.postrender.bind(null, this));
      }

      t.caricamentoMappaInCorso = false;

      t.creaLayerBBOX();
    // }, 2000);
    // t.subscribeAttesaMappa.unsubscribe();
  }

  esegueFunzione(t, qualeFunzione, variabileDiControllo) {
    return new Promise(async (Ritorno) => {
      let q = 0;
      switch (qualeFunzione) {
        case 1:
          t.pathComponent.disegnaPath(t);
          break;
        case 2:
          t.pathComponent.disegnaOverlay(t);
          break;
      }

      const timerAttesa = setInterval(() => {
        if (variabileDiControllo === false) {
          clearInterval(timerAttesa);

          Ritorno('OK');
        } else {
          q++;
          if (q > 10) {
            clearInterval(timerAttesa);

            Ritorno('KO');
          }
        }
      }, 100)
    });
  }*/
}


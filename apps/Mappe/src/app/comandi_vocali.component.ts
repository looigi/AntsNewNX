import { Injectable } from "@angular/core";

@Injectable()
export class ComandiVocaliComponent {
  ultimoComandoVocale = -1;

  constructor(
  ) {

  }

  esegueComandoVocale(t, cmd) {
    if (!cmd) {
      return;
    }

    const diff = new Date().getTime() - this.ultimoComandoVocale;
    if (diff < 1000) {
      return;
    }
    this.ultimoComandoVocale = new Date().getTime();

    const comando = cmd.v_cmd;
    const parametro = cmd.v_parameter;

    if (t.modalitaDebug === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ComandiVocali. Comando da eseguire:', cmd);
    }

    switch (comando) {
      case 'set_global_time_range':
        t.valoreTimeSpan = +parametro;
        t.selectActivityTimeSpan(parametro);
        break;
      case 'open_workspace':
        t.caricaDashboard(parametro);
        break;
      case 'TcRun':
        const actSet = parametro.v_dataset;
        const start = parametro.v_start_time_stamp;
        const fine = parametro.v_end_time_stamp;

        t.Utilities.tmsInizio = start;
        t.Utilities.tmsFine = fine;
        t.Utilities.tmsAttuale = start;
        const t1 = t.datePipe.transform(start , 'yyyy-MM-dd HH:mm:ss', 'UTC');
        // alert(t1);
        t.Utilities.tmsSelezionatoStringa = t1;
        // t.impostaTimeSelezionato(start, 'COMANDI_VOCALI');
    
        t.impostaActSet(actSet, start, fine);
        break;
      case 'navigation':
        switch (parametro) {
          case 'context_menu':
            t.apriDrawer2();
            break;
          case 'navigation_menu':
            t.apriDrawer();
            break;
        }
        break;
      default:
        break;
    }
  }
}

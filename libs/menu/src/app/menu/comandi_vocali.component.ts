import { Injectable } from "@angular/core";
import UtilsInterna from "./utilities.component";

@Injectable()
export class ComandiVocaliComponent {
  constructor(
  ) {

  }

  esegueComandoVocale(t, cmd) {
    if (!cmd || cmd === '') {
      return;
    }

    UtilsInterna.scriveLog('ComandiVocali. Comando da eseguire:', cmd);

    const comando = cmd.v_cmd;
    const parametro = cmd.v_parameter;

    UtilsInterna.scriveLog(comando, parametro);

    switch (comando) {
      case 'navigation':
        switch (parametro) {
          case 'navigation_new_tab':
            t.clickContextMenu(0);
            break;
          case 'logout':
            t.logout();
            break;
          case 'about':
            t.changeAbout.nativeElement.click();
            break;
          case 'change_password':
            t.changePsw.nativeElement.click();
            break;
        }
        break;
      default:
        break;
    }
  }
}

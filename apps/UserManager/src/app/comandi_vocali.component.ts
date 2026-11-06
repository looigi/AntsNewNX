import { logConsole } from './console-log';
import { Injectable } from "@angular/core";

@Injectable()
export class ComandiVocaliComponent {
  constructor(
  ) {

  }

  esegueComandoVocale(t, cmd) {
    if (!cmd || cmd === '') {
      return;
    }

    if (t.debug === true) {
      // logConsole('ComandiVocali. Comando da eseguire:', cmd);
    }

    const comando = cmd.v_cmd;
    const parametro = cmd.v_parameter;

    switch (comando) {
      default:
        break;
    }
  }
}

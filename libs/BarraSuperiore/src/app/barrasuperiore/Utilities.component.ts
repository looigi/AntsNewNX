import { logConsole } from '../console-log';


export default class Utilities {
  static urlRoot = '';
  static userRedirect = '';

  static checkRitornoChiamata(u, d) {
    if (d) {
      if (d.err_code) {
        if (d.err_code === 1) {
          if (d.failure_reason) {
            if (d.failure_reason === 'cntx invalid') {
              // Torna al login
              if (this.userRedirect === 'default') {
                localStorage.setItem('ERROR', 'CNTX_INVALID');
                window.location.href = this.urlRoot + 'login/?err=cntx_invalid';
              } else {
                location.assign(this.userRedirect);
              }
            } else {
              // logConsole(d.failure_reason);
              // alert (d.failure_reason);
            }
          }
        }
      }
    }
    if (d.v_err_code && d.v_err_code === 2) {
      if (d.v_failure_reason) {
        // logConsole(d.v_failure_reason);
        // alert(d.v_failure_reason);
      } else {
        // logConsole('V_ERR_CODE = 2 without failure reason');
        // alert('V_ERR_CODE = 2 without failure reason');
      }
    }
  }

  static cripta(s) {
    const x = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    // // logConsole('Stringa:', s);
    // // logConsole('Codice random:', x);
    let rit = x + ';';
    // // logConsole('Rit 1:', rit);
    for (let i = 0; i < s.length; i++) {
      let a = s.charCodeAt(i);
      a += (x + i);
      rit += a +';';
      // // logConsole('Rit ' + i + ':', rit);
    }
    for (let i = 0; i <= 5; i++) {
      const x = Math.floor(Math.random() * (255 - 1 + 1)) + 1;
      rit += x +';';
      // // logConsole('Rit ' + (i + 100) + ':', rit);
    }
    rit += s.length + ';';

    return rit;
  }
}

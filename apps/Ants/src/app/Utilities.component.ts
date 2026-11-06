import { logConsole } from './console-log';
import Swal from "sweetalert2";

export class Utils {
    static urlRoot = '';
    static linkIcone = '';
    static serverPostRest = '';
    static serverPostRestOracle = '';
    static serverGEOServer = '';
    static indirizzoGEOServer = '';
    static limitPerVirtual = 60;
    static sessione = '';
    static userRedirect = 'default';

    static checkRitornoChiamata(Utils: any, d: any) {
        if (d) {
            if (d.err_code) {
                if (d.err_code === 1) {
                    if (d.failure_reason) {
                        // return;
                        if (d.failure_reason === 'cntx invalid') {
                            // Torna al login
                            if (Utils.userRedirect === 'default') {
                                localStorage.setItem('ERROR', 'CNTX_INVALID');
                                window.location.href = Utils.urlRoot + 'login/?err=cntx_invalid';
                            } else {
                                location.assign(Utils.userRedirect);
                            }
                        } else {
                            this.visualizzaAlert (d.failure_reason);
                        }
                    }
                }
            }
            if (d.v_err_code && d.v_err_code === 2) {
                if (d.v_failure_reason) {
                    this.visualizzaAlert(d.v_failure_reason);
                } else {
                    this.visualizzaAlert('V_ERR_CODE = 2 without failure reason');
                }
            }
            if (d[0] && d[0].v_err_code && d[0].v_err_code === 2) {
                if (d[0].v_failure_reason) {
                    this.visualizzaAlert(d[0].v_failure_reason);
                } else {
                    this.visualizzaAlert('V_ERR_CODE = 2 without failure reason');
                }
            }
        }
    }

    static decripta(s: string) {
        let rit = '';
        if (s && s !== '') {
            const c = s.split(';');
            // logConsole(c, +c[c.length - 2], c.length - 2);
            const differenza = +c[0];
            const lunghezza = +c[c.length - 2];
            // logConsole('Differenza: ', differenza);
            // logConsole('Lunghezza: ', lunghezza);

            for (let i = 1; i < lunghezza + 1; i ++) {
            // logConsole('Carattere ' + i + ': ', c[i]);
            let v = +c[i] - (i - 1);
            // logConsole('Valore Carattere ' + i + ': ', v);
            v -= differenza;
            // logConsole('Carattere ' + i + '. Differenza: ', v);
            const car = String.fromCharCode(v);
            // logConsole('Carattere ' + i + ': ', car);
            rit += car;
            }
        }

        return rit;
    }

    static visualizzaAlert(messaggio: string) {
        Swal.fire({
            title: '',
            text: messaggio,
            icon: 'question',
            showClass: {
            backdrop: 'swal2-noanimation', // disable backdrop animation
            popup: '',                     // disable popup animation
            // icon: ''                       // disable icon animation
            },
        });
    }
}
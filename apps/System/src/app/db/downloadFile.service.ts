import { logConsole } from '../console-log';
import { Injectable } from '@angular/core';
import Utils from '../Utilities.component';
import { ExternalHttpClient } from './httpclient.service';

@Injectable()

export class DownloadFileService {

  constructor (
    private httpclient: ExternalHttpClient
  ) {

  }

  public async downloadCSV(layer, act_set, env, campo, sla, prop_name,
    format, params, downloadByBrowser, stampaUrl, nomeChiamata) {
    const csv = await this.loadCsv(layer, act_set, env, campo, sla, prop_name, format, params, downloadByBrowser, stampaUrl, nomeChiamata);
    // // logConsole('Csv letto da GeoServer: ', csv);
    return csv;
  }

  public converteCSVToJSON(c) {
    let ret = '';
    const campi = new Array();
    const valori = new Array();

    if (c && c !== null && c.length > 0) {
      // // logConsole('CSV Arrivato da decodificare:', c);
      let index = 0;
      c[0].forEach(element => {
        campi.push(Utils.ritornaCampoCSVSistemato(element));
      });

      if (campi.length > 0) {
        c.forEach(element => {
          if (index > 0) {
            const val = new Array();
            element.forEach(element2 => {
              const valore = element2;
              val.push(Utils.ritornaCampoCSVSistemato(valore));
            });
            if (val.length > 0) {
              valori.push(val);
            }
          }
          index++;
        });
      }

      valori.forEach(element => {
        let r = '';
        index = 0;
        element.forEach(element2 => {
          if (index > 0) {
            // Questo controllo lo metto per non salvare il FID che ritorna il csv
            r += '"' + campi[index] + '": "' + element2 + '",';
          }
          index++;
        });
        if (r.length > 0) {
          r = r.substring(0, r.length - 1);
          r = '{' + r + '},';
          ret += r;
        }
      });

      if (ret.length > 0) {
        ret = ret.substring(0, ret.length - 1);
        ret = '[' + ret + ']';
      }
    }

    // // logConsole('CSV convertito:', ret);

    return ret;
  }

  public converteTextPlainToJSON(t) {
    let ret = '';
    const tt = JSON.parse(JSON.stringify(t));

    if (tt.length > 0) {
      const ttt = tt.split(/[\r\n]+/gm);
      const campi = new Array();
      const valori = new Array();
      let index = 0;
      ttt.forEach(element => {
        if (index > 1 && element.indexOf('=') > - 1) {
          const riga = element.split('=');
          const nomeCampo = riga[0].trim();
          const valore = riga[1].trim();
          campi.push(nomeCampo);
          valori.push(valore);
        }
        index++;
      });

      for (let i = 0; i < campi.length; i++) {
        ret += '"' + campi[i] + '": "' + valori[i] + '",';
      };
      if (ret.length > 0) {
        ret = ret.substring(0, ret.length - 1);
        ret = '{' + ret + '}';
      }
    }

    return ret;
  }

  public converteTextHtmlToJSON(t) {
    // // logConsole(t);
    const campi = new Array();
    const valori = new Array();
    let ret = '';

    let tt = JSON.parse(JSON.stringify(t));
    let a1 = -1;
    a1 = tt.indexOf('<th>');
    if (a1 > -1) {
      tt = tt.substring(a1, tt.length);
      a1 = tt.indexOf('</table>');
      if (a1 > -1) {
        tt = tt.substring(0, a1 - 1);
        const ttt = tt.tt.split('<tr>');
        ttt.forEach(element => {
          element = element.replace('</tr>', '');
          if (element.indexOf('<th >') > - 1) {
            const tttt = element.split('<th >');
            tttt.forEach(element2 => {
              element2 = element2.replace('</th>', '');
              campi.push(Utils.ritornaCampoCSVSistemato(element2));
            });
          } else {
            if (element.indexOf('<td>') > - 1) {
              const ttttt = element.split('<td>');
              ttttt.forEach(element2 => {
                element2 = element2.replace('</td>', '');
                valori.push(Utils.ritornaCampoCSVSistemato(element2))
              });
            }
          }
        });

        let index = 0;

        campi.forEach(element => {
          const valore = valori[index];
          ret += '{"' + element + '": "' + valore + '"},';
          index++;
        });

        if (ret.length > 0) {
          ret = ret.substring(0, ret.length - 1);
          ret = '[' + ret + ']';
        }
      }
    }

    // // logConsole(ret);

    return ret;
  }

  private async loadCsv(layer, act_set, env, campo, sla, prop_name2, format, params, downloadByBrowser, stampaUrl, nomeChiamata) {
  }

  public downloadJSON(url) {
    return this.httpclient.downloadBlob(url);
  }

  private downloadFile(url) {
    return this.httpclient.downloadFile(url);
  }
}

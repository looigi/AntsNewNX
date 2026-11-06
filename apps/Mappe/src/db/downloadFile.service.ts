import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { ExternalHttpClient } from './httpclient.service';
// import Utils from '../app/components/Utilities.component';

@Injectable()
export class DownloadFileService {
  constructor (
    private httpclient: ExternalHttpClient
  ) {

  }

  public async downloadCSV(t, layer, act_set, env, campo, sla, prop_name,
    format, params, downloadByBrowser, stampaUrl, nomeChiamata) {
    const csv = await this.loadCsv(t, layer, act_set, env, campo, sla, prop_name, format, params,
      downloadByBrowser, stampaUrl, nomeChiamata);
    // console.log('Csv letto da GeoServer: ', csv);
    return csv;
  }

  public converteCSVToJSON(t, c) {
    let ret = '';
    const campi = new Array();
    const valori = new Array();

    if (c && c !== null && c.length > 0) {
      // console.log('CSV Arrivato da decodificare:', c);
      let index = 0;
      c[0].forEach(element => {
        campi.push(t.Utils.ritornaCampoCSVSistemato(element));
      });

      if (campi.length > 0) {
        c.forEach(element => {
          if (index > 0) {
            const val = new Array();
            element.forEach(element2 => {
              const valore = element2;
              val.push(t.Utils.ritornaCampoCSVSistemato(valore));
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

    // console.log('CSV convertito:', ret);

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
    // console.log(t);
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
              campi.push(t.ritornaCampoCSVSistemato(element2));
            });
          } else {
            if (element.indexOf('<td>') > - 1) {
              const ttttt = element.split('<td>');
              ttttt.forEach(element2 => {
                element2 = element2.replace('</td>', '');
                valori.push(t.ritornaCampoCSVSistemato(element2))
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

    // console.log(ret);

    return ret;
  }

  private async loadCsv(t, layer, act_set, env, campo, sla, prop_name2, format, params, downloadByBrowser, stampaUrl, nomeChiamata) {
    let prop_name = prop_name2;
    let filtro = '';
    // console.log('Filtro 1:', filtro);
    if (act_set && act_set !== null && act_set.trim() !== '' && act_set.indexOf(',') === -1) {
      if (act_set.indexOf('(geo_act_set_name = ') > -1) {
        filtro = '&CQL_FILTER= ' + act_set;
      } else {
        filtro = '&CQL_FILTER=geo_act_set_name=\'' + act_set + '\' ';
      }
    } else {
      if (act_set && act_set !== null && act_set.trim() !== '' && act_set.indexOf(',') > -1) {
        filtro = '&CQL_FILTER=geo_act_set_name IN ' + act_set + ' ';
      }
    }
    // console.log('Filtro 2:', filtro);
    if (campo && campo !== null && campo !== '') {
      if (filtro === '') {
        filtro = '&CQL_FILTER=';
      } else {
        filtro += ' and ';
      }
      filtro += 'measr_code=\'' + campo + '\'';
    }
    // console.log('Filtro 3:', filtro, sla);
    if (sla && sla !== null && sla !== '') {
      if (filtro === '') {
        filtro = '&CQL_FILTER=';
      } else {
        if (sla !== '') {
          if (sla.toUpperCase().indexOf('AND') === -1) {
            filtro += ' and ';
          }
        }
      }
      if (sla !== '') {
        // console.log(sla);
        if (sla.substring(0, 4) === ' and ') {
          sla = sla.substring(5, sla.length);
        }
        filtro += sla;
        // console.log(filtro);
      }
    }
    // console.log('filtro 4:', filtro);
    if (prop_name && prop_name !== null && prop_name !== '') {
      if (prop_name.indexOf('&') === -1) {
        prop_name = '&' + prop_name;
      }
    } else {
      prop_name = '';
    }
    // console.log('propname:', prop_name);
    if (env !== '' && env.indexOf('&') === -1) {
      env = '&' + env;
    }
    // console.log('env:', env);
    if (params !== '' && params.indexOf('&') === -1) {
      params = '&' + params;
    }
    // console.log('params:', params);
    if (format !== '') {
      format = '&outputFormat=' + format;
    }
    // maxFeatures=50&

    /* if (layer === 'Geo_ANTS:l_geo_event') {
      while (filtro.indexOf('geo_act_set_name') > - 1) {
        filtro = filtro.replace('geo_act_set_name', 'geo_act_name');
      }
    } */

    let url = t.Utils.indirizzoGEOServer + environment.urlBaseGS + '/ows?service=WFS&version=1.0.0&request=GetFeature&' +
                'typeName=' + layer + format +
                params + env + prop_name + filtro;
    while (url.indexOf('  ') > -1) {
      url = url.replace('  ', ' ');
    }
    while (url.indexOf(' and and ') > -1) {
      url = url.replace(' and and ', ' and ');
    }
    while (url.indexOf(' ') > -1) {
      url = url.replace(' ', '%20');
    }

    if (stampaUrl === true) {
      // console.log('**' + nomeChiamata + '**');
      // console.log('Url download: ', downloadByBrowser, act_set, url);
    }
    if (url.indexOf('<Global') > -1) {
      // console.log('ATTENZIONE!! Url contiene GLOBAL: ', url);
      return null;
    } else {
      switch (downloadByBrowser) {
        case 'EXECUTE':
          const valori: any = await this.downloadFile(url);
          const c = valori._body.split('\n');
          const csv = new Array();
          c.forEach(element => {
            if (element && element !== '') {
              const cc = element.split(',');
              csv.push(cc);
            }
          });

          // if (stampaUrl === true) {
          //   console.log('Download file csv:', csv);
          // }
          return csv;
          break;
        case 'DOWNLOAD':
          window.open(url, '_blank');

          return null;
          break;
        case 'RETURN URL':
          const u = new Array();
          u.push(url);
          return u;
          break;
      }
    }
  }

  public downloadJSON(url) {
    return this.httpclient.downloadBlob(url);
  }

  private downloadFile(url) {
    return this.httpclient.downloadFile(url);
  }
}

import { logConsole } from '../console-log';
import { Injectable, OnInit } from '@angular/core';

@Injectable()
export class ExportGridComponent implements OnInit {
  constructor(
  ) {

  }

  ngOnInit() {

  }

  creaGriglia(t, dati, titolo, daIstogramma) {
    /* const campi = new Array();

    let header = JSON.stringify(dati.DataTable[0]);
    header = header.replace('{', '');
    header = header.replace('}', '');
    const campiHeader = header.split(',');
    campiHeader.forEach(element => {
      const strutt = element.split(':');
      const nomeCampo = strutt[0].replace('"', '').replace('"', '').trim();
      campi.push(nomeCampo);
    });

    const columnProperty = new Array();
    let q = 0;
    let qq = '00';
    const r = {
      dataType: "numeric",
      headerText: "ROW_ID",
      hide: "true",
      key: "ROW_ID",
      place: qq
    };
    columnProperty.push(r);

    campi.forEach(element => {
      q++;
      if (q < 10) { qq = '0' + q; } else { qq = q.toString(); }
      let tipoCampo = "string";
      const r = {
        dataType: tipoCampo,
        headerText: element,
        hide: "false",
        key: element,
        place: qq
      };
      columnProperty.push(r);
    });

    const gridProperty = new Array();
    const g = {
      GridName: titolo,
      IsFilterDisplayed: "N",
      ItemsPerPage: "30",
      ShowColumnSelector: "true",
      pageable: "true",
      reportType: "Rep"
    };
    gridProperty.push(g);

    const datiFinali = new Array();
    q = 0;
    dati.DataTable.forEach(element => {
      let rr = '"ROW_ID": ' + q + ',';
      campi.forEach(element2 => {
        rr += '"' + element2 + '": "' + element[element2] + '",';
      });
      rr = rr.substring(0, rr.length - 1);
      rr = '{' + rr + '}';
      datiFinali.push(JSON.parse(rr));
      q++;
    }); */

    if (!dati) { return; }

    const datiGriglia = {
      ColumnProperty: dati.v_column_property,
      DataTable: dati.DataTable,
      GridProperty: dati.v_grid_property
    };
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, datiGriglia);
    // logConsole('Dati griglia export', datiGriglia);

    // t.frameName = datiGriglia.GridProperty.GridName1;
    // t.nomiFrames[t.frameAttivo2] = datiGriglia.GridProperty.GridName1;
    t.effettuaAutoFitCSV = !t.effettuaAutoFitCSV;
    if (daIstogramma === true) {
      t.datiGrigliaExportH = JSON.parse(JSON.stringify(datiGriglia));
      t.visualizzaGrigliaExportH = true;
    } else {
      t.datiGrigliaExport = JSON.parse(JSON.stringify(datiGriglia));
      t.visualizzaGrigliaExport = true;
    }
  }
}

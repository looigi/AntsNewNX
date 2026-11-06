import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import { Injectable } from '@angular/core';

@Injectable()
export class LayersComponent {
  disegnaAntenne(t, nomeAntenna) {
    let nomeStyle = 's_antenna';
    let nomeLayer = 'l_antenne';

    t.UtilityPassata.scriveLog('Disegno antenne con stile interno', t.isCheckedAntenne2, nomeLayer, nomeStyle, nomeAntenna);
    let tmsMin = 'null';
    let tmsMax = 'null';
    // alert (nomeAntenna);

    if (nomeAntenna === undefined || nomeAntenna === null || nomeAntenna === 'null' || nomeAntenna === '\'null\'' || nomeAntenna === '"null"'
      || nomeAntenna === '' || nomeAntenna === 'undefined') {
      t.UtilityPassata.scriveLog('Disegno antenne. Esco per nome antenna nullo interno', nomeAntenna);

      return;
    }

    let vParams = 'cntx_id:\'' + t.sessioneID + '\';' +
      'v_antenna_set_name_list: \'' + nomeAntenna + '\';' +
      'v_xcgi_list:null;' +
      'v_net_tech_list:null;' +
      'v_band_list:null;' +
      'v_tms_min:' + tmsMin + ';' +
      'v_tms_max:' + tmsMax + ';' +
      'v_view_mode:null' + ';'  + 
      'v_chiamante: \'DataDictionaries\'';

    const bbox = t.Utils.prendeBBOX(t.map1);
    vParams += ';' + bbox;

    const par = {
      LAYERS: 'Geo_ANTS:' + nomeLayer,
      TILED: false,
      STYLES: nomeStyle,
      // CQL_FILTER: 'antenna_set_name=\'' + nomeAntenna + '\'',
      VIEWPARAMS: vParams
    };

    if (t.antennaLayer1) {
      t.removeLayerFromMap(t.antennaLayer1);
    }

    const wmsSource1 = new ImageWMS({
      projection: 'EPSG:4326',
      url: t.Utilities.indirizzoGEOServer + t.urlWms,
      params: par,
      serverType: 'geoserver',
      /* tileLoadFunction: function (image, src) {
        const img = image.getImage();
        img.src = src;
      } */
    });

    t.antennaLayer1 = new ImageLayer({
      source: wmsSource1
    });

    t.addLayerToMap(t.antennaLayer1, 15);
  }

  prendeBBOX(map1) {
    if (map1) {
      let rit = '';
      const bbox = map1.getView().calculateExtent(map1.getSize());
      // const bboxFin = transform(bbox, 'EPSG:3857', 'EPSG:4326');
      const bboxFin = [ -180, -90, 180, 90 ];
      // t.UtilityPassata.scriveLog('BBox:', map1.getView(), map1.getSize(), bbox, bboxFin);
      rit = 'geoants_bbox_min_x:' + bboxFin[0] + ';geoants_bbox_min_y:' + bboxFin[1] + ';';
      rit += 'geoants_bbox_max_x:' + bboxFin[2] + ';geoants_bbox_max_y:' + bboxFin[3];

      return rit;
    } else {
      return '';
    }
  }

  disegnaCluster(t, nomeCluster) {
    const nomeStyle = 's_cluster_rec_color';
    const nomeLayer = 'l_cluster_rec';

    // t.UtilityPassata.scriveLog('Disegno cluster con stile', nomeLayer, nomeStyle);

    const bbox = this.prendeBBOX(t.map1);

    let vParamsC = 'cntx_id:\'' + t.sessioneID + '\';' +
      'v_cluster_set_code_list:\'' + nomeCluster + '\';' +
      'v_tms_min:null;' +
      'v_tms_max:null;' +
      'v_view_mode:null';
    vParamsC += ';' + bbox;

    const par = {
      LAYERS: 'Geo_ANTS:' + nomeLayer,
      TILED: false,
      // VERSION: '1.1.1',
      STYLES: nomeStyle,
      // CQL_FILTER: 'cluster_set_name = \'' + nomeCluster + '\''
      VIEWPARAMS: vParamsC
    };

    if (t.clusterLayer1) {
      t.removeLayerFromMap(t.clusterLayer1);
    }

    const wmsSource1 = new ImageWMS({
      projection: 'EPSG:4326',
      url: t.Utilities.indirizzoGEOServer + t.urlWms,
      params: par,
      serverType: 'geoserver',
      /* tileLoadFunction: function (image, src) {
        const img = image.getImage();
        img.src = src;
      } */
    });

    t.clusterLayer1 = new ImageLayer({
      source: wmsSource1
    });

    t.addLayerToMap(t.clusterLayer1, 15);
  }
}

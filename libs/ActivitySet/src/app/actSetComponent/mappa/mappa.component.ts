import { logConsole } from '../../console-log';
import { Component, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import OlMap from 'ol/Map';
import {defaults as defaultControls, ScaleLine} from 'ol/control';
import {defaults as defaultInteractions, DragRotateAndZoom, Draw} from 'ol/interaction';
import OlView from 'ol/View';
import {transform} from 'ol/proj';
import OlXYZ from 'ol/source/XYZ';
import OlTileLayer from 'ol/layer/Tile';
import { Subject } from "rxjs";
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import { environment } from "../../environments/environment";
import {transformExtent} from 'ol/proj';
import { HttpClient } from "@angular/common/http";
import { DatePipe } from "@angular/common";
// import { isNumericLiteral } from "typescript"; // rimosso: è una funzione AST del compilatore TS (su un valore runtime restituiva sempre false)

@Component({
  templateUrl: 'mappa.component.html',
  selector: 'mappa-component',
  styleUrls: ['./mappa.component.css']
})

export class MappaComponent implements OnInit, OnChanges, OnDestroy {
    @Input() Session;
    @Input() quale;
    @Input() Utils;
    @Input() activity;
    @Input() tmsInizio;
    @Input() tmsFine;
    @Input() pulisce = false;

    debug2 = false;
    caricamentoMappaInCorso = false;
    map1;
    destroy$ = new Subject<void>();
    maxLayers = 50;
    pathLayer;
    layerAttivo8;
    pathEvents;
    layerAttivo;
    
    constructor(
        private http: HttpClient,
        private datePipe: DatePipe,
        private ngZone: NgZone
    ) {

    }
    
    ngOnInit(): void {
    }

    vecchioPulisce = false;
    tmsInizio2;
    tmsFine2;
    activity2;

    ngOnChanges(changes: SimpleChanges): void {
        let ok = false;

        if (changes['quale'] && changes['quale'].currentValue) {
            this.disegnaMappa();
        }
        if (changes['activity'] && changes['activity'].currentValue) {
            this.activity2 = changes['activity'].currentValue;
            if (this.activity2.endsWith('|')) {
                this.activity2 = this.activity2.slice(0, -1);
            }
            ok = true;
        }
        if (changes['tmsInizio'] && changes['tmsInizio'].currentValue) {
            const t = changes['tmsInizio'].currentValue.split(';');
            const d = new Array();
            t.forEach(element => {
                if (element) {
                    d.push(new Date(element));
                }
            });
            const timestamps = d.map(d => d.getTime());
            const minDate = new Date(Math.min(...timestamps));
            this.tmsInizio2 = this.datePipe.transform(minDate, 'yyyy-MM-dd HH:mm:ss');

            ok = true;
        }
        if (changes['tmsFine'] && changes['tmsFine'].currentValue) {
            const t = changes['tmsFine'].currentValue.split(';');
            const d = new Array();
            t.forEach(element => {
                if (element) {
                    d.push(new Date(element));
                }
            });
            const timestamps = d.map(d => d.getTime());
            const maxDate = new Date(Math.max(...timestamps));
            this.tmsFine2 = this.datePipe.transform(maxDate, 'yyyy-MM-dd HH:mm:ss');

            ok = true;
        }
        if (changes['pulisce'] && changes['pulisce'].currentValue !== undefined) {
            if (this.vecchioPulisce !== changes['pulisce'].currentValue) {
                this.vecchioPulisce = changes['pulisce'].currentValue;

                this.pulisceLayer();

                ok = false;
            }
        }
            
        if (ok) {
            this.disegnaTutto();
        }
    }

    ngOnDestroy(): void {
        this.liberaMappa();
        this.destroy$.next();
        this.destroy$.complete();
    }

    // Distrugge la mappa OpenLayers (listener, canvas, ResizeObserver) per non lasciarla in memoria
    liberaMappa() {
        if (this.map1) {
            this.map1.getLayers().clear();
            this.map1.dispose();
            this.map1 = undefined;
        }
    }

    coordinateFatte = false;
    pathFatto = false;
    eventiFatti = false;

    disegnaTutto() {        
        /* const a = this.activity;
        
        let act;
        if (a.indexOf(';') > -1) {
            act = a.split(';');
        } else {
            act = [a];
        }
        logConsole('Activity passate', a, act);
        this.maxPosizioni = act.length - 1;
        this.extents = this.creaVettore(this.maxPosizioni - 1, undefined);
        this.quantePosizioni = 0; */

        this.caricamentoMappaInCorso = true;
        this.coordinateFatte = false;
        this.pathFatto = false;
        this.eventiFatti = false;

        logConsole('Activity passate', this.activity, this.tmsInizio2, this.tmsFine2);
        this.prendeCoordinate();

        this.prendePath();
        this.prendeEventi();

        let q = 0;
        const t = setInterval(() => {
            if (this.coordinateFatte && this.pathFatto && this.eventiFatti) {
                clearInterval(t);

                this.caricamentoMappaInCorso = false;
            } else {
                q++;
                if (q > 50) {
                    clearInterval(t);
                }
            }
        }, 100);
    }

    getCoordClick(e) {

    }

    entraMappa() {

    }

    esceMappa() {

    }

    disegnaMappa() {
        const t = setInterval(() => {
            const dest = document.getElementById('frameMappa_' + this.quale);

            if (dest !== null) {
                clearInterval(t);

                const centroIniziale = transform([12.4090874, 41.8223068], 'EPSG:4326', 'EPSG:3857');
                const view = new OlView({
                    projection: 'EPSG:3857',
                    center: centroIniziale,
                    zoom: 11
                });

                const layer = new OlTileLayer({
                    // title: 'CartoDB',
                    // type: 'base',
                    preload: Infinity,
                    visible: true,
                    source: new OlXYZ({
                        urls: ['https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_3s28_1_57213781ea6594ea79eec43d'],
                        // crossOrigin: 'anonymous'
                    })
                });


                this.liberaMappa();

                // Creata fuori dalla zona Angular: gli eventi interni della mappa (mouse, rendering)
                // non devono lanciare la change detection dell'app
                this.map1 = this.ngZone.runOutsideAngular(() => new OlMap({
                    controls: defaultControls().extend([
                        // this.controllaScala(this);
                        new ScaleLine({
                            units: 'metric'
                        })
                    ]),
                    interactions: defaultInteractions().extend([
                        new DragRotateAndZoom()
                    ]),
                    target: 'frameMappa_' + this.quale,
                    layers: [layer],
                    pixelRatio: 1,
                    view: view
                }));
            }
        }, 100);
    }

    impostaPosizione(extent) {
        if (extent[0] === extent[2] && extent[1] === extent[3]) {
            this.map1.getView().fit(extent, {
                size: this.map1.getSize(),
                padding: [5, 5, 5, 5],
                maxZoom: 14,
                // duration: 1000
            });
        } else {
            this.map1.getView().fit(extent, {
                size: this.map1.getSize(),
                padding: [5, 5, 5, 5],
                // maxZoom: 18,
                // duration: 1000
            });
        }
    }

    prendePath() {
        this.caricamentoMappaInCorso = true;

        const urlWms = environment.urlBaseGS + '/wms';
        const layerName = 'l_act_path_point';

        let vParams = 'cntx_id:\'' + this.Session + '\';' +
            'v_act_set_name_list: \'[ACT ID] ' + this.activity2 + '\';' +
            'v_tms_min: \'' + this.tmsInizio2 + '\';' +
            'v_tms_max: \'' + this.tmsFine2 + '\';' +
            'v_filter_measr_code_1: null;' +
            'v_filter_measr_value_1: null;' +
            'v_filter_measr_code_2: null;' +
            'v_filter_measr_value_2: null;';

        // recupera la view della mappa
        const view = this.map1.getView();

        // ottieni l'estensione visibile della mappa (extent)
        const extent = view.calculateExtent(this.map1.getSize());
        const coord = transform(extent, 'EPSG:3857', 'EPSG:4326');

        let bb = 'geoants_bbox_min_x: ' + coord[0] + ';geoants_bbox_min_y: ' + coord[1] + ';';
        bb += 'geoants_bbox_max_x: ' + coord[2] + ';geoants_bbox_max_y: ' + coord[3] + ';';

        vParams += ';' + bb;

        const parameters = {
            LAYERS: layerName,
            TILED: false,
            STYLES: 's_act_path_selected',
            // CQL_FILTER: act_set + ' and act_id in (' + act_id + ')',
            NUMEROFRAME: 1,
            // BBOX: '14.713221,15.393568,14.779739,15.423938',
            VIEWPARAMS: vParams,
            UPDATER: '' // this.cambioDataPerShowPath
        };

        if (this.pathLayer) {
            this.removeLayerFromMap(this.pathLayer);
            this.pathLayer = undefined;
        }

        const wms = new ImageWMS({
            url: this.Utils.indirizzoGEOServer + urlWms,
            projection: 'EPSG:4326',
            // renderer: 'antialias: true;',
            params: parameters,
            serverType: 'geoserver',

            // Sovrascrivere l'URL per evitare la cache
            imageLoadFunction: (image, src) => {
                if (!this.layerAttivo8) { return; }

                const timestamp = new Date().getTime();
                const noCacheUrl = src + (src.includes('?') ? '&' : '?') + 'nocache=' + timestamp;
                const noCacheUrl2 = this.converteBBoxDentroChiamataWMS(noCacheUrl);
                image.getImage()['src'] = noCacheUrl2;
            }
        });

        const newWms = new ImageLayer({
            source: wms
        });

        this.addLayerToMap(newWms, 7);
        this.pathLayer = newWms;
        this.layerAttivo8 = true;

        this.pathFatto = true;
    }

    prendeEventi() {
        this.caricamentoMappaInCorso = true;

        const filtro = 'MobiantsTcRun.End';

        let viewParams = 'cntx_id:\'' + this.Session + '\';' +
            'v_act_set_name_list:\'[ACT ID] ' + this.activity2 + '\';' +
            'v_event_type_list:\'' + filtro + '\';' +
            'v_tms_min:\'' + this.tmsInizio2 + '\';' +
            'v_tms_max:\'' + this.tmsFine2 + '\';';

        viewParams += 'v_filter_measr_code_1: null;v_filter_measr_code_2: null;v_filter_measr_value_1: null;v_filter_measr_value_2: null;';
        // recupera la view della mappa
        const view = this.map1.getView();

        // ottieni l'estensione visibile della mappa (extent)
        const extent = view.calculateExtent(this.map1.getSize());
        const coord = transform(extent, 'EPSG:3857', 'EPSG:4326');
        // logConsole('Coordinate bbox', coord);

        let bb = 'geoants_bbox_min_x: ' + coord[0] + ';geoants_bbox_min_y: ' + coord[1] + ';';
        bb += 'geoants_bbox_max_x: ' + coord[2] + ';geoants_bbox_max_y: ' + coord[3] + ';';

        const parameters = {
            LAYERS: 'Geo_ANTS:l_geo_event',
            projection: 'EPSG:4326',
            TILED: false,
            /* 'TILED': true,
            CQL_FILTER: filtro + act_set + tmsFilter */
            NUMEROFRAME: 0,
            VIEWPARAMS: viewParams + bb
        };

        if (this.pathEvents) {
            this.removeLayerFromMap( this.pathEvents);
            this.pathEvents = undefined;
        }

        const urlWms = environment.urlBaseGS + '/wms';

        const wms = new ImageWMS({
            url: this.Utils.indirizzoGEOServer + urlWms,
            projection: 'EPSG:900913',
            params: parameters,
            // renderer: 'antialias: true;',
            serverType: 'geoserver',
            /* tileLoadFunction: function (image, src) {
                const img = image.getImage();
                const query = src.replace(this.url + '?', '');
                // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, src);
                img.src = src;
            } */

            // Sovrascrivere l'URL per evitare la cache
            imageLoadFunction: (image, src) => {
                if (!this.layerAttivo) { return; }

                const timestamp = new Date().getTime();
                const noCacheUrl = src + (src.includes('?') ? '&' : '?') + 'nocache=' + timestamp;
                let noCacheUrl2;
                noCacheUrl2 = this.converteBBoxDentroChiamataWMS(noCacheUrl);
                // logConsole('Sposto geo_event', noCacheUrl, noCacheUrl2);
                image.getImage()['src'] = noCacheUrl2;

                // logConsole('Event su mappa 8-2. RIDISEGNO LAYER', t.NumeroFrame2, daDove);
            }
        });
        // logConsole('WMS Events', parameters);

        const newWms = new ImageLayer({
            source: wms // t.wmsEvents[t.NumeroFrame2]
        });
        
        this.addLayerToMap(newWms, 25);
        this.layerAttivo = true;
        this.pathEvents = newWms;

        this.eventiFatti = true;
    }

    prendeCoordinate() {
        const urlWfs = this.Utils.indirizzoGEOServer + environment.urlBaseGS + '/wfs';
        const typeName = 'workspace:l_act_path_point';

        let vParams = 'cntx_id:\'' + this.Session + '\';' +
            'v_act_set_name_list: \'[ACT ID] ' + this.activity2 + '\';' +
            'v_tms_min: \'' + this.tmsInizio2 + '\';' +
            'v_tms_max: \'' + this.tmsFine2 + '\';' +
            'v_filter_measr_code_1: null;' +
            'v_filter_measr_value_1: null;' +
            'v_filter_measr_code_2: null;' +
            'v_filter_measr_value_2: null;';

        // recupera la view della mappa
        const view = this.map1.getView();

        // ottieni l'estensione visibile della mappa (extent)
        const extent = view.calculateExtent(this.map1.getSize());
        const coord = transform(extent, 'EPSG:3857', 'EPSG:4326');

        let bb = 'geoants_bbox_min_x: ' + coord[0] + ';geoants_bbox_min_y: ' + coord[1] + ';';
        bb += 'geoants_bbox_max_x: ' + coord[2] + ';geoants_bbox_max_y: ' + coord[3] + ';';

        vParams += ';' + bb;

        const wfsUrl = urlWfs + 
            '?service=WFS&version=1.1.0&request=GetFeature' +
            '&typeName=' + typeName +
            '&outputFormat=application/json&srsName=EPSG:4326' +
            '&VIEWPARAMS=' + encodeURIComponent(vParams);

        // logConsole(wfsUrl);
        this.http.get(wfsUrl).subscribe((geojson: any) => {
            // logConsole("Tutte le feature:", geojson.features);

            let minX = 999999;
            let minY = 999999;
            let maxX = 0;
            let maxY = 0;

            geojson.features.forEach((f: any) => {
                // logConsole("Coordinate:", f.geometry.coordinates);
                if (!f.geometry || f.geometry === null || !f.geometry.coordinates || f.geometry.coordinates === null) {
                } else {
                    const coord = f.geometry.coordinates;
                    if (+coord[0] < +minX) {
                        minX = coord[0];
                    }
                    if (+coord[1] < +minY) {
                        minY = coord[1];
                    }
                    if (+coord[0] > +maxX) {
                        maxX = coord[0];
                    }
                    if (+coord[1] > +maxY) {
                        maxY = coord[1];
                    }
                }
            });
            logConsole('Coordinate finali:', minX, minY, maxX, maxY);
            if (minX !== 999999 && minY !== 999999 && maxX !== 0 && maxY !== 0) {
                const extents = this.sistemaCoordinate([minX, minY, maxX, maxY], '3827');
                
                this.impostaPosizione(extents);
            }

            this.coordinateFatte = true;
        });
    }

    addLayerToMap(l, zIndex) {
        l.setZIndex(zIndex);
        this.map1.addLayer(l);
    }

    pulisceLayer() {
        if (this.pathLayer) {
            this.map1.removeLayer(this.pathLayer);
            this.pathLayer = undefined;
        }
        if (this.pathEvents) {
            this.map1.removeLayer(this.pathEvents);
            this.pathEvents = undefined;
        }
    }

    removeLayerFromMap( l) {
        this.map1.removeLayer(l);
    }

    converteBBoxDentroChiamataWMS(noCacheUrl) {
        let bboxFine = '';
        let modalita = '';
        let inizio = -1;

        if (noCacheUrl.indexOf('v_bbox%3A\'BOX') > -1) {
            modalita = 'v_bbox';
            inizio = noCacheUrl.indexOf('v_bbox%3A\'BOX');
            // v_bbox:'BOX(12.217513303320313|41.752677851557905|12.600661496679688|41.89186011516787)'
            // logConsole('No Cache Url con v_bbox', noCacheUrl);

            // return noCacheUrl;
        } else {
            if (noCacheUrl.indexOf('geoants_bbox_m') === -1) {
                return noCacheUrl;
            } else {
                modalita = 'bbox_m';
                // logConsole('URL Layer prima', noCacheUrl);

                inizio = noCacheUrl.indexOf('geoants_bbox_min_x');
            }
        }
        const bbox = noCacheUrl.substring(inizio, noCacheUrl.length);
        const fine = bbox.indexOf('&WIDTH');
        bboxFine = bbox.substring(0, fine);

        const inizioBBoxReale = noCacheUrl.indexOf('&BBOX=');
        if (inizioBBoxReale > -1) {
            let bboxReale = noCacheUrl.substring(inizioBBoxReale + 6, noCacheUrl.length);
            const bboxPassataOriginale = bboxReale;
            if (bboxReale.indexOf('&') > -1) {
                bboxReale = bboxReale.substring(0, bboxReale.indexOf('&'));
            }

            while (bboxReale.indexOf('%2C') > -1) {
                bboxReale = bboxReale.replace('%2C', ';');
            }

            let bboxMappa;
            if (bboxReale.indexOf(';') > -1) {
                bboxMappa = bboxReale.split(';');
            } else {
            if (bboxReale.indexOf(',') > -1) {
                bboxMappa = bboxReale.split(',');
            } else {
                logConsole('Nessun carattere di split per la bbox passata', bboxReale);
            }
            }
            let bboxMappa2 = this.sistemaCoordinate(bboxMappa, '4326');
            if (bboxMappa2[0].toString().indexOf('Infinity') > -1 || bboxMappa2[1].toString().indexOf('Infinity') > -1 ||
                bboxMappa2[2].toString().indexOf('Infinity') > -1 || bboxMappa2[3].toString().indexOf('Infinity') > -1) {
                logConsole('BBox infinity', bboxMappa);
            } else {
                if (+bboxMappa2[0] > +bboxMappa2[1]) {
                    // Tentativo goffo di sistemare le coordinate se arrivano invertite
                    const appo = [bboxMappa2[1], bboxMappa2[0], bboxMappa2[3], bboxMappa2[2]];
                    bboxMappa2 = appo;
                }

                let bboxDaImpostare = '';

                if (modalita === 'bbox_m') {
                    bboxDaImpostare = 'geoants_bbox_min_x:' + bboxMappa2[0] + ';geoants_bbox_min_y:' + bboxMappa2[1] + ';' +
                    'geoants_bbox_max_x:' + bboxMappa2[2] + ';geoants_bbox_max_y:' + bboxMappa2[3];
                } else {
                    bboxDaImpostare = 'v_bbox%3A\'BOX(' + bboxMappa2[0] + '%7C' + bboxMappa2[1] + '%7C' + bboxMappa2[2] + '%7C' + bboxMappa2[3]+ ')\'';
                }
                // const bbox2 = bboxMappa2[0] + '%2C' + bboxMappa2[1] + '%2C' + bboxMappa2[2] + '%2C' + bboxMappa2[3];
                // noCacheUrl = noCacheUrl.replace(bboxPassataOriginale, bbox2);
                if (noCacheUrl.indexOf('nocache=') === -1) {
                    const timestamp = new Date().getTime();
                    noCacheUrl = noCacheUrl + '&nocache=' + timestamp;
                }

                noCacheUrl = noCacheUrl.replace(bboxFine, bboxDaImpostare);
                // logConsole('BBOX convertita', bboxFine, bboxDaImpostare);
                // if (modalita === 'v_bbox') {
                //   logConsole('URL Layer', noCacheUrl.substring(10, noCacheUrl.length), bboxMappa2);
                // }
            }
        } else {
            logConsole('Non esiste la scritta &BBOX= nella cache url', noCacheUrl.toString());
        }

        return noCacheUrl;
    }

    guessProjection(input) {
        let minX: number, minY: number, maxX: number, maxY: number;

        if (input.length === 2) {
            // Coordinate singole
            [minX, minY] = input;
            maxX = minX;
            maxY = minY;
        } else if (input.length === 4) {
            // Extent
            [minX, minY, maxX, maxY] = input;
        } else {
            // throw new Error('Input non valido. Deve essere una coppia di coordinate o un extent.');
        }

        const isWithin4326 =
            minX >= -180 && maxX <= 180 &&
            minY >= -90 && maxY <= 90;

        const isWithin3857 =
            minX >= -20037508.34 && maxX <= 20037508.34 &&
            minY >= -20037508.34 && maxY <= 20037508.34;

        const isWithin32632 =
            minX >= 100000 && maxX <= 1000000 &&
            minY >= 4000000 && maxY <= 6000000;

        if (isWithin4326) {
            return 'EPSG:4326';
        }

        if (isWithin3857) {
            return 'EPSG:3857';
        }

        if (isWithin32632) {
            return 'EPSG:32632';
        }

        return 'unknown';
    }

    sistemaCoordinate(extent, come) {
        const proiezione = this.guessProjection(extent);

        if (extent.length > 2) {
            // logConsole('Extent lunghezza 4 prima', this.NumeroFrame2, extent, come, proiezione);
            if (come === '4326') {
                if (proiezione !== 'EPSG:4326') {
                    if (proiezione !== 'unknown') {     
                        extent = transformExtent(extent, proiezione, 'EPSG:4326');
                    }
                }
            } else {
                if (proiezione !== 'EPSG:3857') {
                    if (proiezione !== 'unknown') {
                        extent = transformExtent(extent, proiezione, 'EPSG:3857');
                    }
                }
            }
            // logConsole('Extent lunghezza 4 dopo', this.NumeroFrame2, extent);
        } else {
            // logConsole('Extent lunghezza 2 prima', this.NumeroFrame2, extent, come, proiezione);
            if (come === '4326') {
                if (proiezione !== 'EPSG:4326') {
                    if (proiezione !== 'unknown') {
                        extent = transform(extent, proiezione, 'EPSG:4326');
                    }
                }
            } else {
                if (proiezione !== 'EPSG:3857') {
                    if (proiezione !== 'unknown') {
                        extent = transform(extent, proiezione, 'EPSG:3857');
                    }
                }
            }
            // logConsole('Extent lunghezza 2 dopo', this.NumeroFrame2, extent);
        }

        return extent;
    }

    creaVettore(x, valore) {
        const m = new Array();
        for (let j = 0; j <= x; j++) {
            // // logConsole(valore);
            if (valore && valore !== true && valore !== false && valore !== null && !this.isArray(valore)) {
                const v = valore.replace('***CONT***', j);
                m.push(v);
            } else {
                m.push(valore);
            }
        }
        // this.scriveLog(m);
        return m;
    }

    isArray(obj: any ) {
        return Array.isArray(obj);
    }
}
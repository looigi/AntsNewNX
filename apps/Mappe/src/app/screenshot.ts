import { logConsole } from './console-log';
import { Injectable } from "@angular/core";
// import { FileSaverService } from "ngx-filesaver";
import html2canvas from 'html2canvas';
// import Swal from 'sweetalert2/dist/sweetalert2.js';
import download from 'downloadjs';  // Importa downloadjs
import Swal from "sweetalert2";
import { Utils } from "./components/Utilities.component";
import ExternalUtilities from './components/ExternalUtilities.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from "rxjs";
import { ApiService } from "../db/api.service";

@Injectable()
export class ScreenShotComponent {
    vecchioPS = 0;
    tempoAttesa = 5000;

    daRefreshare;
    refresh = false;
    pagineDaStampare = new Array();
    qualePagina = -1;
    datiOriginale;
    conta = 0;

    tempoTotale;
    tempoParziale;
  
    // imageWidth = 1268 * 135 / 100;
    // imageHeight = 768 * 135 / 100;

    vecchiaDimX;
    vecchiaDimY;
    captureElement: HTMLElement;
    destroy$ = new Subject<void>();

    constructor(
        public Utilities: Utils,
        private apiService: ApiService,
        // private captureService: NgxCaptureService,
        // private fileSaver: FileSaverService,
    ) {
    }

    LeggeSimbolici(t, soloAttuale) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo simbolici');
        const params = '{' +
            '"cntx_id": "' + ExternalUtilities.sessione + '"' +
        '}';
        this.apiService.chiamataPost(this.Utilities, 'geo_symbolic__sel', params)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data2 => {
            if (data2 && data2 !== null) {
            ExternalUtilities.checkRitornoChiamata(Utils, data2);

            data2.forEach(element => {
                let name = '';

                if (element.NAME) {
                    name = element.NAME;
                } else {
                    if (element.name) {
                        name = element.name;
                    }
                }
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element);
                switch (name) {
                    case 'PRINT_PIXEL_X':
                        this.Utilities.imageWidthPerScreenShot = +(element.value ? element.value : element.VALUE ? element.VALUE : 1920);
                        break;
                    case 'PRINT_PIXEL_Y':
                        this.Utilities.imageHeightPerScreenShot = +(element.value ? element.value : element.VALUE ? element.VALUE : 945);
                        break;
                }

                const messaggio = 'Please remove all previous png and xlm files from the download dir, before proceeding';
                Swal.fire({
                    title: '',
                    text: messaggio,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Ok',
                    cancelButtonText: 'Cancel',
                    showClass: {
                    backdrop: 'swal2-noanimation', // disable backdrop animation
                    popup: '',                     // disable popup animation
                    // icon: ''                       // disable icon animation
                    },
                }).then((result) => {
                    if (result.value) {
                        t.stampaPagine = true;
                        t.leave2();
                        const tm = setTimeout(() => {
                            clearTimeout(tm);

                            this.esegueScreenShot(t, soloAttuale);
                        }, 500);
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                    }
                });                

            });
            } else {
                ExternalUtilities.messaggioDiErroreEsterno(this, 'Read symbolic null');
            }
        }, error => {
            ExternalUtilities.messaggioDiErroreEsterno(this, 'Read symbolic: ' + error);
        });
    }

    startPrint(t, soloAttuale) {
        this.tempoTotale = new Date().getTime();
        this.tempoParziale = new Date().getTime();
        this.pagineDaStampare = new Array();

        if (soloAttuale) {

        } else {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Impostati', t.listToPrint.impostaSelezioneLTP);
            if (t.listToPrint.impostaSelezioneLTP && t.listToPrint.impostaSelezioneLTP.length > 0) {
            t.listToPrint.DataTable.forEach(element => {
                let ok = false;
                t.listToPrint.impostaSelezioneLTP.forEach(element2 => {
                    if (!ok && element2 === element.ROW_ID) {
                        this.pagineDaStampare.push(element);
                        ok = true;
                    }
                });      
            });
            }
        }
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Righe da stampare', this.pagineDaStampare);
    
        if (this.pagineDaStampare.length === 0 && !soloAttuale) {
            return;
        }        

        this.LeggeSimbolici(t, soloAttuale);
    }
    
    esegueScreenShot(t, soloAttuale) {
        this.cambiaStatoStringa(t, soloAttuale, 'Setting page size');

        const dimeContX = +t.divContStampa.nativeElement.offsetWidth;
        const dimeContY = +t.divContStampa.nativeElement.offsetHeight;

        this.captureElement = document.querySelector("#divStampa");
        this.vecchiaDimX = this.captureElement.style.width;
        this.vecchiaDimY = this.captureElement.style.height;
        this.captureElement.style.width = this.Utilities.imageWidthPerScreenShot + 'px';
        this.captureElement.style.height = this.Utilities.imageHeightPerScreenShot + 'px';

        const inizioX = 0 - ((this.Utilities.imageWidthPerScreenShot - dimeContX) / 2);
        const inizioY = 0 - ((this.Utilities.imageHeightPerScreenShot - dimeContY) / 2);

        this.captureElement.style.position = 'absolute';
        this.captureElement.style.left = inizioX + 'px';
        this.captureElement.style.top = inizioY + 'px';

        const tm = setTimeout(() => {
            clearTimeout(tm);

            t.ridisegnaGrafici = new Date().toString();
        }, 750);

        // logConsole('Dove', this.captureElement.style.left, this.captureElement.style.top);
        
        /* if (!t.datiPageSelectorFiltrati || !t.datiPageSelectorFiltrati.DataTable ||
            t.datiPageSelectorFiltrati.DataTable.length === 0) {
            return;
        } */

        this.vecchioPS = t.pageSelector;
        this.qualePagina = 0;

        this.cambiaStatoStringa(t, soloAttuale, 'Capturing and saving image to disk');

        if (!soloAttuale) {
            this.datiOriginale = {
                selezioneAntenne: t.selezioneAntenne,
                additionalLayer2: t.additionalLayer2,
                setNetTech: t.setNetTech,
                netTech22: t.netTech22,
                bandwidth22: t.bandwidth22,
                ch2: t.ch2,
                bsic2: t.bsic2,
                scr2: t.scr2,
                pci2: t.pci2,
                territory2: t.territory2,
                freeText2: t.freeText2,
                impostaSelezioneMeasureDFN: t.impostaSelezioneMeasureDFN,
                impostaSelezioneES: t.impostaSelezioneES,
                mapTypeG: t.mapTypeG,
                mapTypeS: t.mapTypeS,
                styleSizeG: t.styleSizeG,
                slaValueGlobale: t.slaValueGlobale,
                overlayClusterG: t.overlayClusterG,
                zoomMap: t.zoomMap,
                comboSelArea: t.comboSelArea,
                showLegendaHistogram: t.showLegendaHistogram,
                tipoLegendaIstogrammi: t.tipoLegendaIstogrammi,
                misureGlobaliImpostate: t.impostazioni.misureGlobaliImpostate,
                misureComboLTP: t.misureComboLTP,
                ridisegnaMappa: t.ridisegnaMappa
            }
        }

        this.azionaCiclo(t, soloAttuale);
    }

    azionaCiclo(t, soloAttuale) {    
        if (t.bloccaStampa) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Blocco stampa 1');
            this.rimetteAPostoTutto(t);
            return;
        }

        if (soloAttuale) {
            this.daRefreshare = new Array();
            this.refresh = false;
            let i = 0;
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Pagina: ', t.pageSelector);
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Tipi mappe: ', t.impostazioni.mapType[t.pageSelector]);
            if (t.MappaOGraficoTutti) {
                t.MappaOGraficoTutti.forEach(element => {
                    const tipoFrame = element[t.pageSelector];
                    i++;
                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Tipo frame ' + i + ': ' + tipoFrame);
                    // if (tipoFrame === 'M') {
                        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Mappa Rilevata: Tipo ' + t.impostazioni.mapType[t.pageSelector][i - 1]);
                        this.daRefreshare.push({
                            frame: i,
                            tipoMappa: t.impostazioni.mapType[t.pageSelector][i]
                        });
                        this.refresh = true;
                    // }
                });
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Eseguo refresh: ' + this.refresh);
            
                if (this.refresh) {
                    t.mapTypeG = 2;
                    t.mapTypeS = 2;
                    this.daRefreshare.forEach(element => {
                        if (t.mapTypePerStampa[element.frame] !== -1) {
                            t.mapTypePerStampa[element.frame] = -1;
                        }
                    });
                    // logConsole('Esco 1', this.daRefreshare, t.mapTypePerStampa);
                    // return;
        
                    const tm1 = setTimeout(() => {
                        clearTimeout(tm1);

                        if (t.bloccaStampa) {
                            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Blocco stampa 2');
                            this.rimetteAPostoTutto(t);
                            return;
                        }

                        this.daRefreshare.forEach(element => {
                            t.refreshDaTasto[element.frame - 1] = !t.refreshDaTasto[element.frame - 1];
                        });
                
                        this.tempoParziale = 0;
                        this.cambiaStatoStringa(t, soloAttuale, 'Loading next image');
                        const tm = setTimeout(() => {
                            clearTimeout(tm);

                            this.faiClick(t, soloAttuale);
                        }, 10000);
                    }, 1000);
                } else {
                    const tm = setTimeout(() => {
                        clearTimeout(tm);

                        this.faiClick(t, soloAttuale);
                    }, 1000);
                }
            }
        } else {
            const dati = this.pagineDaStampare[this.qualePagina];
            const pagina = dati.pagina;

            t.selezioneAntenne = dati.selezioneAntenne;
            t.additionalLayer2 = dati.additionalLayer2;
            t.setNetTech = dati.setNetTech;
            t.netTech22 = dati.netTech22;
            t.bandwidth22 = dati.bandwidth22;
            t.ch2 = dati.ch2;
            t.bsic2 = dati.bsic2;
            t.scr2 = dati.scr2;
            t.pci2 = dati.pci2;
            t.territory2 = dati.territory2;
            t.freeText2 = dati.freeText2;
            t.impostaSelezioneMeasureDFN = dati.impostaSelezioneMeasureDFN;
            t.impostaSelezioneES = dati.impostaSelezioneES;
            // t.mapTypeG = dati.mapTypeG;
            // t.mapTypeS = dati.mapTypeS;
            t.styleSizeG = dati.styleSizeG;
            t.slaValueGlobale = dati.slaValueGlobale;
            t.overlayClusterG = dati.overlayClusterG;
            t.zoomMap = dati.zoomMap;
            t.comboSelArea = dati.comboSelArea;
            t.showLegendaHistogram = dati.showLegendaHistogram;
            t.tipoLegendaIstogrammi = dati.tipoLegendaIstogrammi;

            if (dati.misureGlobaliImpostate) {
                t.impostazioni.misureGlobaliImpostate = JSON.parse(JSON.stringify(dati.misureGlobaliImpostate));
                t.misureComboLTP = JSON.parse(JSON.stringify(dati.misureGlobaliImpostate));
                t.ridisegnaMappa = JSON.parse(JSON.stringify(dati.misureGlobaliImpostate));
                // logConsole('Misure impostate LPT', this.misureComboLPT);
              }
          
            t.Utilities.globalMeasure = dati.impostaSelezioneMeasureDFN
            t.cambioGlobalMeasure(t.Utilities.globalMeasure);
        
            // this.impostaSelezioneES = dati.impostaSelezioneES;
            const ee = { dati: dati.impostaSelezioneES, selezionato: dati.impostaSelezioneES, deselezionato: dati.impostaSelezioneES };
            t.gestisceClickSummary(ee);        
        
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Cambio pagina', pagina);

            const tm = setTimeout(() => {
                clearTimeout(tm);

                t.impostazioni.datiPageSelector.DataTable.forEach(element => {
                    if (+element.id === +pagina) {
                      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pagina selezionata per nome', element);
                      let nome = element.value;
                      nome = nome.replace(element.id + ': ', '');
                      t.nomePaginaSelezionata = nome;
                      t.selectPageSelector([element]);
                      // logConsole('Cambio pagina', new Date().toString());

                      if (t.bbox) {
                        const tm = setTimeout(() => {
                            clearTimeout(tm);

                            t.bbox = JSON.parse(JSON.stringify(t.bbox));
                        }, 1000);
                      }
                    }
                });

                // t.stampaPagine = false;
                // return;

                if (t.bloccaStampa) {
                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Blocco stampa 3');
                    this.rimetteAPostoTutto(t);
                    return;
                }

                this.daRefreshare = new Array();
                this.refresh = false;
                let i = 0;
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Pagina: ', pagina);
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Tipi mappe: ', t.impostazioni.mapType[pagina]);
                t.MappaOGraficoTutti.forEach(element => {
                    const tipoFrame = element[pagina];
                    i++;
                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Tipo frame ' + i + ': ' + tipoFrame);
                    // if (tipoFrame === 'M') {
                        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Mappa Rilevata: Tipo ' + t.impostazioni.mapType[pagina][i - 1]);
                        this.daRefreshare.push({
                            frame: i,
                            tipoMappa: t.impostazioni.mapType[pagina][i]
                        });
                        this.refresh = true;
                    // }
                });
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Eseguo refresh: ' + this.refresh);
            
                if (this.refresh) {
                    t.mapTypeG = 2;
                    t.mapTypeS = 2;
                    this.daRefreshare.forEach(element => {
                        if (t.mapTypePerStampa[element.frame] !== -1) {
                            t.mapTypePerStampa[element.frame] = -1;
                        }
                    });
                    // logConsole('Esco 2', this.daRefreshare);
                    // return;
        
                    const tm = setTimeout(() => {
                        clearTimeout(tm);
                        if (t.bloccaStampa) {
                            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Blocco stampa 4');
                            this.rimetteAPostoTutto(t);
                            return;
                        }
    
                        this.daRefreshare.forEach(element => {
                            t.refreshDaTasto[element.frame - 1] = !t.refreshDaTasto[element.frame - 1];
                        });
                
                        this.conta = 0;

                        // const tm = setTimeout(() => {
                            // logConsole('Cambio pagina -> Avvio query mappe', new Date().toString());

                            this.attesaEChiamataPerFineCaricamentoPagina(t, soloAttuale);
                        // }, 10000);
                    }, 4000);
                } else {
                    const tm = setTimeout(() => {
                        clearTimeout(tm);
                        // logConsole('Cambio pagina -> Avvio query', new Date().toString());

                        this.attesaEChiamataPerFineCaricamentoPagina(t, soloAttuale);
                    }, 4000);
                }                
            }, 2000);
        }
    }

    attesaEChiamataPerFineCaricamentoPagina(t, soloAttuale) {
        if (t.bloccaStampa) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Blocco stampa 5');
            this.rimetteAPostoTutto(t);
            return;
        }

        let pagine;
        if (soloAttuale) {
            pagine = 1;
        } else {
            pagine = this.pagineDaStampare.length;
        }
        
        this.cambiaStatoStringa(t, soloAttuale, 'Waiting data: query calling');

        const params = {
            v_cntx: t.sessioneID,
        };

        t.apiService.chiamataPost(t.Utilities, 'system_query_status__grid', params)
            // .map(response => response)
            .subscribe(data => {
                if (data) {
                    if (+data.v_count === 0) {
                        if (t.bloccaStampa) {
                            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Blocco stampa 6');
                            this.rimetteAPostoTutto(t);
                            return;
                        }
    
                        t.screenShot = new Date().toString();

                        const tm = setTimeout(() => {
                            clearTimeout(tm);
                            this.faiClick(t, soloAttuale);
                        }, this.tempoAttesa);  
                    } else {
                        if (t.bloccaStampa) {
                            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Blocco stampa 7');
                            this.rimetteAPostoTutto(t);
                            return;
                        }
    
                        this.cambiaStatoStringa(t, soloAttuale, 'Waiting data: ' + data.v_count + ' query running');

                        this.conta++;
                        if (this.conta > 120) {
                            // Gestire se si sta aspettando troppo ?
                        } else {
                            const tm = setTimeout(() => {
                                clearTimeout(tm);
                                this.cambiaStatoStringa(t, soloAttuale, 'Waiting 5 sec for page rendering');

                                this.attesaEChiamataPerFineCaricamentoPagina(t, soloAttuale);
                            }, 5000);
                        }
                    }
                }
            }, error => {
                console.error('POST ERROR Obj Sync My Upd: ', error, error.message);

                this.rimetteAPostoTutto(t);
            }
        );
    }

    scaleDataURL(dataURL: string, maxWidth: number, maxHeight: number) {
        return new Promise((done) => {
           var img = new Image()
           img.onload = () => {
              /* var scale, newWidth, newHeight, canvas, ctx
              if (img.width > maxWidth) {
                 scale = maxWidth / img.width
              } else if (img.height > maxHeight) {
                 scale = maxHeight / img.height
              } else {
                 scale = 1
              }
              newWidth = img.width * scale
              newHeight = img.height * scale
              canvas = document.createElement('canvas')
              canvas.height = newHeight
              canvas.width = newWidth */
              const canvas = document.createElement('canvas')
              canvas.height = maxHeight;
              canvas.width = maxWidth;
              const ctx = canvas.getContext('2d')
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: img', 'scale', scale, 0, 0, img.width, img.height, 0, 0, newWidth, newHeight)
              ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, maxWidth, maxHeight)
              done(canvas.toDataURL())
           }
           img.src = dataURL
        })
    }

    faiClick(t, soloAttuale) {
        if (t.bloccaStampa) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Blocco stampa 7');
            this.rimetteAPostoTutto(t);
            return;
        }

        let pagine;
        if (soloAttuale) {
            pagine = 1;
        } else {
            pagine = this.pagineDaStampare.length;
        }

        this.cambiaStatoStringa(t, soloAttuale, 'Capturing and saving image to disk');
        // t.dettaglioScreenShot = 'Page acquisition';

        // const tm = setTimeout(() => {
            this.cambiaStatoStringa(t, soloAttuale, 'Printing page');

            /* const arrayCanvas = Array.from(captureElement.getElementsByClassName('img-magnifier-container'));
            arrayCanvas.forEach(element => {
                const contCanvas = Array.from(element.getElementsByClassName('ol-layer'));
                if (contCanvas !== null && contCanvas[0]) {
                    const canvas = contCanvas[0].children[0] as HTMLCanvasElement;
                    canvas

                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Screenshot:', canvas);
                }
            }); */

            html2canvas(this.captureElement, {
                // width: 1024,
                // height: 768,
                scale: 1
                // proxy: "http://localhost:8000",
                // useCORS: true,
                // allowTaint: true,
                // foreignObjectRendering: true
                // onrendered: function (canvas) {                 }
            }).then((canvas) => {
                if (t.bloccaStampa) {
                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Blocco stampa 8');
                    this.rimetteAPostoTutto(t);
                    return;
                }

                // document.body.appendChild(canvas);
                /* const data = new Date();

                const sData = data.getUTCFullYear().toString() + 
                    ((data.getUTCMonth() + 1).toString().trim().length === 1 ? '0' + (data.getUTCMonth() + 1).toString().trim() : (data.getUTCMonth() + 1).toString().trim()) + 
                    (data.getUTCDate().toString().trim().length === 1 ? '0' + data.getUTCDate().toString().trim() : data.getUTCDate().toString().trim()) + '_' +
                    (data.getUTCHours().toString().trim().length === 1 ? '0' + data.getUTCHours().toString().trim() : data.getUTCHours().toString().trim()) +
                    (data.getUTCMinutes().toString().trim().length === 1 ? '0' + data.getUTCMinutes().toString().trim() : data.getUTCMinutes().toString().trim()) +
                    (data.getUTCSeconds().toString().trim().length === 1 ? '0' + data.getUTCSeconds().toString().trim() : data.getUTCSeconds().toString().trim()); 
                const nomeFile = t.dashboardName + '_page_' + t.pageSelector + '-' + t.nomePaginaSelezionata + '_' + sData + '.png'; */
                let nomeFile;
                if (soloAttuale) {
                    nomeFile = this.converteNome('ActualPage') + '.png';
                } else {
                    nomeFile = this.converteNome(this.pagineDaStampare[this.qualePagina].imageName) + '.png';
                }

                // Get the image data as a base64-encoded string

                // var ctx = canvas.getContext('2d');
                // ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 1024, 768);

                const imageData = canvas.toDataURL("image/png", 1.0);

                this.scaleDataURL(imageData, this.Utilities.imageWidthPerScreenShot, this.Utilities.imageHeightPerScreenShot)
                .then((newBase64data) => {
                    if (t.bloccaStampa) {
                        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Blocco stampa 9');
                        this.rimetteAPostoTutto(t);
                        return;
                    }

                    const link = document.createElement("a");
                    link.setAttribute("download", nomeFile);
                    link.setAttribute("href", newBase64data.toString());
                    link.click();

                    if (soloAttuale) {
                        this.rimetteAPostoTutto(t);
                    } else{
                        this.cambiaStatoStringa(t, soloAttuale, 'Loading next image');
                        // t.dettaglioScreenShot ='Next page';

                        this.qualePagina++;
                        if (this.qualePagina < pagine) {
                            const tm = setTimeout(() => {
                                clearTimeout(tm);
                                this.tempoParziale = new Date().getTime();
                                this.azionaCiclo(t, soloAttuale);
                            }, 1000);
                        } else {
                            this.rimetteAPostoTutto(t);
                        }
                    }
                })
                .catch((err) => {
                        console.error(err);

                        this.rimetteAPostoTutto(t);
                    }
                )
            }
        );

        /* logConsole(t.schermoDaStampare.nativeElement);
        this.captureService.getImage(t.schermoDaStampare.nativeElement, true
        )
        .pipe(
            tap(img => {
                const nomeFile = t.dashboardName + '_page_' + t.pageSelector + '-' + t.nomePaginaSelezionata + '.png';
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Immagine: ', img);
                const img2 = this.dataURItoBlob(img);
                const data3 = new Blob([img2], {type: 'application/png'});
                this.fileSaver.save(data3, nomeFile);
            
                if (soloAttuale) {
                    const tm = setTimeout(() => {
                        t.stampaPagine = false;
                        // alert('Screenshot eseguito');
                    }, this.tempoAttesa);
                } else {
                    t.paginaPerStampa++;
                    if (t.paginaPerStampa < t.datiPageSelectorFiltrati.DataTable.length) {
                        const tm = setTimeout(() => {
                            this.azionaCiclo(t, false);
                        }, 1000);
                    } else {
                        t.selectPageSelector([t.datiPageSelectorFiltrati.DataTable[this.vecchioPS]]);
                        const tm = setTimeout(() => {
                            t.stampaPagine = false;
                            // alert('Screenshot eseguiti');
                        }, this.tempoAttesa);
                    }
                }
            })
        ).subscribe(); */
        // }, 5000);
    }

    rimetteAPostoTutto(t) {
        if (!t.bloccaStampa) {
            this.generaXML(t);
        }

        this.captureElement.style.width = this.vecchiaDimX;
        this.captureElement.style.height = this.vecchiaDimY;
        this.captureElement.style.left = '0px';
        this.captureElement.style.top = '0px';
        this.captureElement.style.position = undefined;

        t.ridisegnaGrafici = new Date().toString();

        t.bloccaStampa = false;
        this.qualePagina = this.pagineDaStampare.length;
        t.titoloScreenShot = '';
        t.dettaglioScreenShot = '';
        t.descrizioneScreenShot = '';

        this.reimpostaMappe(t);
    
        if (this.datiOriginale) {
            t.selezioneAntenne = this.datiOriginale.selezioneAntenne;
            t.additionalLayer2 = this.datiOriginale.additionalLayer2;
            t.setNetTech = this.datiOriginale.setNetTech;
            t.netTech22 = this.datiOriginale.netTech22;
            t.bandwidth22 = this.datiOriginale.bandwidth22;
            t.ch2 = this.datiOriginale.ch2;
            t.bsic2 = this.datiOriginale.bsic2;
            t.scr2 = this.datiOriginale.scr2;
            t.pci2 = this.datiOriginale.pci2;
            t.territory2 = this.datiOriginale.territory2;
            t.freeText2 = this.datiOriginale.freeText2;
            
            t.impostazioni.misureGlobaliImpostate = this.datiOriginale.misureGlobaliImpostate;
            t.misureComboLTP = this.datiOriginale.misureComboLTP;
            t.ridisegnaMappa = this.datiOriginale.ridisegnaMappa;

            // t.impostaSelezioneMeasureDFN = this.datiOriginale.impostaSelezioneMeasureDFN;
            t.Utilities.globalMeasure = this.datiOriginale.impostaSelezioneMeasureDFN
            t.cambioGlobalMeasure(t.Utilities.globalMeasure);

            // this.impostaSelezioneES = dati.impostaSelezioneES;
            const ee = { 
                dati: this.datiOriginale.impostaSelezioneES, 
                selezionato: this.datiOriginale.impostaSelezioneES, 
                deselezionato: this.datiOriginale.impostaSelezioneES 
            };
            t.gestisceClickSummary(ee);

            // t.impostaSelezioneES = this.datiOriginale.impostaSelezioneES;
            t.mapTypeG = this.datiOriginale.mapTypeG;
            t.mapTypeS = this.datiOriginale.mapTypeS;
            t.styleSizeG = this.datiOriginale.styleSizeG;
            t.slaValueGlobale = this.datiOriginale.slaValueGlobale;
            t.overlayClusterG = this.datiOriginale.overlayClusterG;
            t.zoomMap = this.datiOriginale.zoomMap;
            t.comboSelArea = this.datiOriginale.comboSelArea;
            t.showLegendaHistogram = this.datiOriginale.showLegendaHistogram;
            t.tipoLegendaIstogrammi = this.datiOriginale.tipoLegendaIstogrammi;
        }
        
        t.impostazioni.datiPageSelector.DataTable.forEach(element => {
            if (+element.id === +this.vecchioPS) {
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pagina selezionata per nome', element);
              let nome = element.value;
              nome = nome.replace(element.id + ': ', '');
              t.nomePaginaSelezionata = nome;
              t.selectPageSelector([element]);

              const tt = setTimeout(() => {
                clearTimeout(tt);
                
                for (let i = 1; i < 10; i++) {
                    t.refreshMap[i] = !t.refreshMap[i];
                }
              }, 1500);
            }
        });

        // const tm = setTimeout(() => {
            t.stampaPagine = false;
        // }, this.tempoAttesa);
    }

    reimpostaMappe(t) {
        this.daRefreshare.forEach(element => {
            t.mapTypePerStampa[element.frame] = element.tipoMappa;
            // t.impostazioni.mapType[t.pageSelector][element.frame - 1] = element.tipoMappa;
            t.refreshDaTasto[element.frame - 1] = !t.refreshDaTasto[element.frame - 1];
        });

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ScreenShot: Mappe reimpostate');
    }

    dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        let byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        const ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:mimeString});
    }

  generaXML(t) {
    const dash = t.dashboardSelected;
    // logConsole('Dashboard: ', dash, t.activitySetName);

    let filone = '<?xml version="1.0" encoding="UTF-8"?>\n';
    filone += '<root xmlns="GeoAnts">\n';
    filone += '    <GeneralInfo>\n';
    filone += '        <DashboardName>' + dash.NAME + '</DashboardName>\n';
    filone += '        <DashboardDescription>' + dash.DESCRIPTION + '</DashboardDescription>\n';
    filone += '        <DataSetName>' + t.activitySetName[1].NAME + '</DataSetName>\n';
    filone += '        <DataSetStartTms>' + t.timeRangeDSFStart + '</DataSetStartTms>\n';
    filone += '        <DataSetEndTms>' + t.timeRangeDSFStop + '</DataSetEndTms>\n';
    filone += '    </GeneralInfo>\n';
    filone += '    <PrintList>\n';
    let index = 1;
    this.pagineDaStampare.forEach(element => {
        let quale = index.toString().trim();
        if (quale.length === 1) { quale = '0' + quale; }

        const pageName = this.converteNome(element.pagename);
        filone += '        <' + pageName + '>\n';
        filone += '             <DashboardPageTitle>' + element.pagename + '</DashboardPageTitle>\n';
        filone += '             <ImageDescription>' + element.description + '</ImageDescription>\n';
        filone += '             <ImageName>' + element.imageName + '</ImageName>\n';
        filone += '        </' + pageName + '>\n';
    });
    filone += '    </PrintList>\n';
    filone += '</root>\n';

    var data = new Blob([filone], { type: 'application/xml' });
    // this.fileSaver.save(data, 'GeoAntsReport.xml');    
    download(data, 'GeoAntsReport.xml', 'application/xml');
  }

  converteNome(e) {
    let tt = e;
    const array = ['>', '<', '?', '#', '|', '\\', '/', '*', '%', ' ', ','];
    array.forEach(element => {
      while(tt.indexOf(element) > -1) {
        tt = tt.replace(element, '');
      }
    });

    return tt;
  }

  cambiaStatoStringa(t, soloAttuale, status) {
    let pagine;
    if (soloAttuale) {
        pagine = 1;
    } else {
        pagine = this.pagineDaStampare.length;
    }
    
    const qualePaginaPerVisua = (this.qualePagina + 1);
    const paginePerVisua = pagine;

    const tempoTotale = Math.round((new Date(). getTime() - this.tempoTotale) / 1000);
    const tempoParziale = Math.round((new Date(). getTime() - this.tempoParziale) / 1000);

    t.titoloScreenShot = 'Capturing Images: ' + tempoTotale + ' sec';
    t.descrizioneScreenShot = 'Capturing image ' + qualePaginaPerVisua + '/' + paginePerVisua + ', ' + tempoParziale + ' sec';
    t.dettaglioScreenShot = status;
  }
}
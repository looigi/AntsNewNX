import { logConsole } from '../console-log';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { FineRichieste } from './fine-richieste';
@Injectable()
export class SynopticComponent {
    destroy$ = new FineRichieste();

    constructor (

    ) {

    }

    private ctx!: CanvasRenderingContext2D;
    private devicePixelRatio = window.devicePixelRatio || 1;
    oggetti: Array<{ 
        id: number; 
        x: number; 
        y: number;
        dimensione: number; 
        colore: string, 
        coloreBordo: string;
        label: string; 
        type: string; 
        x2: number; 
        y2: number;
        r: number;   
    }> = [];
    private lastId = 0;
    private pathIcone;
    private listaOggetti;
    private dimeDivX;
    private dimeDivY;
    private dimeDivInizioX = -1;
    private dimeDivInizioY = -1;

    DisegnaSynoptic(t, lista) {
        this.listaOggetti = lista;
        this.pathIcone = t.Utils.linkIcone;

        let q = 0;
        const nome = "synoptic_" + t.frameAttivo2 + "_" + t.NumeroFrame2;
        const t2 = setInterval(() => {
            const canvas = document.getElementById(nome) as HTMLCanvasElement;
            // logConsole('CaNVAS:', canvas);

            if (canvas) {
                clearInterval(t2);

                this.dimeDivX = canvas.clientWidth;
                this.dimeDivY = canvas.clientHeight;
            
                if (this.dimeDivInizioX === -1 || this.dimeDivInizioY === -1)  {
                    this.dimeDivInizioX = this.dimeDivX;
                    this.dimeDivInizioY = this.dimeDivY;
                }
                
                const ctx = canvas.getContext('2d');
                if (!ctx) throw new Error('Canvas 2D not supported');
                this.ctx = ctx;

                this.reset(canvas);
                this.setupCanvasSize(canvas);
            } else {
                q++;
                if (q > 10) {
                    clearInterval(t2);
                }
            }
        }, 100);
    }

    reset(canvas) {
        const ctx = this.ctx;
        const w = canvas.width / this.devicePixelRatio;
        const h = canvas.height / this.devicePixelRatio;

        this.oggetti = [];
        this.lastId = 0;

        ctx.clearRect(0, 0, w, h);
    }

    private setupCanvasSize(canvas) {
        const parent = canvas.parentElement;
        if (!parent) return;

        const rect = parent.getBoundingClientRect();
        const dpr = this.devicePixelRatio;
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        this.redraw();
    }

    private redraw() {
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#444';

        this.listaOggetti.forEach(element => {
            this.addObject(
                element.Type, 
                element.X, 
                element.Y, 
                element.Dime, 
                element.BorderColor, 
                element.Color, 
                element.Label, 
                element.X2, 
                element.Y2);
        });

        this.DisegnaOggetti();
    }

    DisegnaOggetti() {
        const scaleX = this.dimeDivX / this.dimeDivInizioX;
        const scaleY = this.dimeDivY / this.dimeDivInizioY;

        logConsole('Dimensione canvas', this.dimeDivX, this.dimeDivY, this.dimeDivInizioX, this.dimeDivInizioY, scaleX, scaleY);

        for (const n of this.oggetti) {
            // logConsole('Oggetto:', n);
            switch (n.type) {
                case 'round':
                    const scale = Math.sqrt(scaleX * scaleY);

                    this.ctx.beginPath();
                    this.ctx.arc(n.x * scaleX, n.y * scaleY, (n.dimensione * scale), 0, Math.PI * 2); // raggio 10px
                    this.ctx.fillStyle = n.colore; // colore pieno
                    this.ctx.fill();
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeStyle = n.coloreBordo; // bordo
                    this.ctx.stroke();
                    break;
                case 'line':
                    // Disegna una linea retta da (x, y) a (x2, y2)
                    // Assumendo che n contenga: x, y, x2, y2
                    this.ctx.beginPath();
                    this.ctx.moveTo(n.x * scaleX, n.y * scaleY);
                    this.ctx.lineTo(n.x2 * scaleX, n.y2 * scaleY);
                    this.ctx.lineWidth = n.dimensione;
                    this.ctx.strokeStyle = n.colore;
                    this.ctx.stroke();
                    break;
                case 'label':
                    this.ctx.font = n.dimensione + 'px sans-serif';
                    this.ctx.fillStyle = n.colore;
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText(n.label, n.x * scaleX, n.y * scaleY);
                    break;
                case 'image':
                    const img = new Image();
                    img.src = n.label; // qui label contiene l'URL dell'immagine
                    if (img.complete) { // verifica che l'immagine sia caricata
                        // logConsole('Immagine', img.src, n.x2, n.y2);
                        this.ctx.drawImage(img, n.x * scaleX, n.y * scaleY, n.x2! * scaleX, n.y2! * scaleY);
                    }
                    break;            
                }
        }        
    }

    addObject(tipo: string, x: number, y: number, dimensione: number, bordercolor: string, colore: string, label: string, x2?: number, y2?: number) {
        this.lastId++;
        const n = { 
            id: this.lastId, 
            x: x, 
            y: y, 
            dimensione: dimensione, 
            colore: colore, 
            coloreBordo: bordercolor,
            label: label, 
            type: tipo, 
            x2: x2 ?? 0, 
            y2: y2 ?? 0,
            r: 25
        };
        this.oggetti.push(n);
        return n;
    }    

    public pointerDown(t, evt: PointerEvent) {
        const scaleX = this.dimeDivX / this.dimeDivInizioX;
        const scaleY = this.dimeDivY / this.dimeDivInizioY;

        const p = this.getCanvasPoint(t, evt);
        const hit = this.hitTestNode(p.x, p.y, scaleX, scaleY);
        if (hit) {
            // this.draggingNodeId = hit.id;
            // this.dragOffset.x = p.x - hit.x;
            // this.dragOffset.y = p.y - hit.y;
            (evt.target as Element).setPointerCapture(evt.pointerId);

            const nome = "txtCanvas_" + t.frameAttivo2 + "_" + t.NumeroFrame2;
            const txt = document.getElementById(nome)  as HTMLInputElement;

            if (txt) {
                txt.value = "Premuto id " + hit.id + " Tipo " + hit.type;
            } else {
                console.warn(`Input con id '${nome}' non trovato.`);
            }
        }
    }

    private getCanvasPoint(t, evt: PointerEvent) {
        const nome = "synoptic_" + t.frameAttivo2 + "_" + t.NumeroFrame2;
        const canvas = document.getElementById(nome) as HTMLCanvasElement;

        const scaleX = this.dimeDivX / this.dimeDivInizioX;
        const scaleY = this.dimeDivY / this.dimeDivInizioY;

        const rect = canvas.getBoundingClientRect();
        const x = (evt.clientX - rect.left);
        const y = (evt.clientY - rect.top);

        return { x, y };
    }


    private hitTestNode(x: number, y: number, scaleX, scaleY) {
        for (let i = this.oggetti.length - 1; i >= 0; i--) {
            const n = this.oggetti[i];
            const dx = x - (n.x * scaleX);
            const dy = y - (n.y * scaleY);
            if (dx * dx + dy * dy <= n.r * n.r) return n;
        }
        return null;
    }    
}
import { environment } from './../environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'jsonComponent';

  Utils = {
    linkIcone: 'https://geoants.ants-aubay.it/geoantsweb_pre/geoantsweb/assets/img'
  };
  platformName = 'Scritta di Test';

  NumeroFrame2 = 1;
  frameAttivo2 = 1;

  jsonDiEsempio = {
    preRoot: 'qqq',
    root: {
      primo: 'pippo baudo è andato in treno a caltanissetta perchÃ© ne aveva voglia',
      primoEspanso: {
        secondo: 'secondo',
        secondiEspanso: {
          terzo: 'pippuzzo',
          terzo2: {
            quarto: 'primo',
            quarto2: {
              quinto: 'primo',
              quinto2: 'secondo',
              quinto3: {
                quinto40: 'qqq',
                quinto4: {
                  quinto5: 'quintone'
                },
                quinto41: 'ppp'
              }
            }
          }
        }
      },
      primoAncora: 'pippo2'
    },
    preRoot2: '',
    root2: {
      root21: 'lll',
      root22: 'ooo'
    },
    root3: {
      primo: 'primo',
      secondo: 'secondo',
      terzo: {
        terzo1: 'terzo1'
      }
    },
    root4: {
      primo: 'primo',
      secondo: 'secondo',
      terzo: {
        terzo12: 'terzo12'
      }
    }
  };

  constructor(
  ) {
  }

  ngOnInit() {
  }

  rigaPremuta(e) {
    // console.log('Premuta riga', e);
  }
}

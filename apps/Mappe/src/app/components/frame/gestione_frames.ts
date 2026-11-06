import { logConsole } from '../../console-log';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { codeSnippetIcon } from '@progress/kendo-svg-icons';
// import Utils from '../Utilities.component';


@Injectable()
export class GestioneFinestreComponent {
  appoSize;
  appoSizeHor;

  aggiungeFrame(t, numPass) {
    let tt = 0;
    let numeroDisponibile = -1;
    let conta = 0;

    if (numPass === -1) {
      t.impostazioni.maskSize[t.pageSelector].forEach(element => {
        if (conta > 0) {
          if (element > 0) {
            tt++;
          } else {
            if (numeroDisponibile === -1) {
              numeroDisponibile = conta;
            }
          }
        }
        conta++;
      });
    } else {
      numeroDisponibile = numPass;
    }

    // logConsole(tt, numeroDisponibile, t.impostazioni.maskSize, t.impostazioni.maskSizeHor, t.impostazioni.maskVisible);

    if (tt < 10) {
      t.impostazioni.maskSize[t.pageSelector][numeroDisponibile] > 0;
      // logConsole(t.impostazioni.maskVisible);

      if (numeroDisponibile === 1 || numeroDisponibile === 2 || numeroDisponibile === 3) {
        this.sistemaFrames(t, 1);
      } else {
        if (numeroDisponibile === 4 || numeroDisponibile === 5 || numeroDisponibile === 6) {
          this.sistemaFrames(t, 4);
        } else {
          this.sistemaFrames(t, 7);
        }
      }

      // this.controlloAperturaAltri(t, numeroDisponibile);

      // this.controllaPerRighe(t);

      t.rinfrescaTuttiIframes();

      t.checkDifferenceFromStartJSON();

      // logConsole(tt, numeroDisponibile, t.impostazioni.maskSize, t.impostazioni.maskVisible);
    } else {
      alert('Max number of frames');
    }
  }

  sistemaFramesHor(t) {
    logConsole('SFH', t.impostazioni.maskSize[t.pageSelector]);
    if (t.impostazioni.maskSize[t.pageSelector][1] > 0 ||
        t.impostazioni.maskSize[t.pageSelector][2] > 0 ||
        t.impostazioni.maskSize[t.pageSelector][3] > 0) {

          if (t.impostazioni.maskSize[t.pageSelector][4] > 0 ||
          t.impostazioni.maskSize[t.pageSelector][5] > 0 ||
          t.impostazioni.maskSize[t.pageSelector][6] > 0) {

        if (t.impostazioni.maskSize[t.pageSelector][7] > 0 ||
            t.impostazioni.maskSize[t.pageSelector][8] > 0 ||
            t.impostazioni.maskSize[t.pageSelector][9] > 0) {

          // logConsole('GF: SFH 1');
          // 1-1-1
          t.impostazioni.maskSizeHor[t.pageSelector][1] = 33;
          t.impostazioni.maskSizeHor[t.pageSelector][2] = 34;
          t.impostazioni.maskSizeHor[t.pageSelector][3] = 33;
        } else {
          // logConsole('GF: SFH 2');
          // 1-1-0
          t.impostazioni.maskSizeHor[t.pageSelector][1] = 50;
          t.impostazioni.maskSizeHor[t.pageSelector][2] = 50;
          t.impostazioni.maskSizeHor[t.pageSelector][3] = 0;
        }
      } else {
        if (t.impostazioni.maskSize[t.pageSelector][7] > 0 ||
            t.impostazioni.maskSize[t.pageSelector][8] > 0 ||
            t.impostazioni.maskSize[t.pageSelector][9] > 0) {

          // logConsole('GF: SFH 3');
          // 1-0-1
          t.impostazioni.maskSizeHor[t.pageSelector][1] = 50;
          t.impostazioni.maskSizeHor[t.pageSelector][2] = 0;
          t.impostazioni.maskSizeHor[t.pageSelector][3] = 50;
        } else {
          // logConsole('GF: SFH 4');
          // 1-0-0
          t.impostazioni.maskSizeHor[t.pageSelector][1] = 100;
          t.impostazioni.maskSizeHor[t.pageSelector][2] = 0;
          t.impostazioni.maskSizeHor[t.pageSelector][3] = 0;
        }
      }
    } else {
      if (t.impostazioni.maskSize[t.pageSelector][4] > 0 ||
          t.impostazioni.maskSize[t.pageSelector][5] > 0 ||
          t.impostazioni.maskSize[t.pageSelector][6] > 0) {

        // logConsole('GF: SFH 5');
        // 0-1-0
        t.impostazioni.maskSizeHor[t.pageSelector][1] = 0;
        t.impostazioni.maskSizeHor[t.pageSelector][2] = 100;
        t.impostazioni.maskSizeHor[t.pageSelector][3] = 0;
      } else {
        if (t.impostazioni.maskSize[t.pageSelector][7] > 0 ||
            t.impostazioni.maskSize[t.pageSelector][8] > 0 ||
            t.impostazioni.maskSize[t.pageSelector][9] > 0) {

          // logConsole('GF: SFH 6');
          // 0-0-1
          t.impostazioni.maskSizeHor[t.pageSelector][1] = 0;
          t.impostazioni.maskSizeHor[t.pageSelector][2] = 0;
          t.impostazioni.maskSizeHor[t.pageSelector][3] = 100;
        } else {
          // logConsole('GF: SFH 7');
          // 0-0-0
          t.impostazioni.maskSizeHor[t.pageSelector][1] = 0;
          t.impostazioni.maskSizeHor[t.pageSelector][2] = 0;
          t.impostazioni.maskSizeHor[t.pageSelector][3] = 0;
        }
      }
    }
  }

  sistemaFrames(t, n) {
    // logConsole('Sistemo frame', n);

    if (t.impostazioni.maskSize[t.pageSelector][n] === 0 &&
        t.impostazioni.maskSize[t.pageSelector][n + 1] === 0 &&
        t.impostazioni.maskSize[t.pageSelector][n + 2] === 0) {
      // 0-0-0
      t.impostazioni.maskSize[t.pageSelector][n] = 0;
      t.impostazioni.maskSize[t.pageSelector][n + 1] = 0;
      t.impostazioni.maskSize[t.pageSelector][n + 2] = 0;
    } else {
      if (t.impostazioni.maskSize[t.pageSelector][n] === 0 &&
          t.impostazioni.maskSize[t.pageSelector][n + 1] > 0 &&
          t.impostazioni.maskSize[t.pageSelector][n + 2] === 0) {
        // 0-1-0
        t.impostazioni.maskSize[t.pageSelector][n] = 0;
        t.impostazioni.maskSize[t.pageSelector][n + 1] = 100;
        t.impostazioni.maskSize[t.pageSelector][n + 2] = 0;
      } else {
        if (t.impostazioni.maskSize[t.pageSelector][n] === 0 &&
            t.impostazioni.maskSize[t.pageSelector][n + 1] === 0 &&
            t.impostazioni.maskSize[t.pageSelector][n + 2] > 0) {
          // 0-0-1
          t.impostazioni.maskSize[t.pageSelector][n] = 0;
          t.impostazioni.maskSize[t.pageSelector][n + 1] = 0;
          t.impostazioni.maskSize[t.pageSelector][n + 2] = 100;
        } else {
          if (t.impostazioni.maskSize[t.pageSelector][n] > 0 &&
              t.impostazioni.maskSize[t.pageSelector][n + 1] === 0 &&
              t.impostazioni.maskSize[t.pageSelector][n + 2] === 0) {
            // 1-0-0
            t.impostazioni.maskSize[t.pageSelector][n] = 100;
            t.impostazioni.maskSize[t.pageSelector][n + 1] = 0;
            t.impostazioni.maskSize[t.pageSelector][n + 2] = 0;
          } else {
            if (t.impostazioni.maskSize[t.pageSelector][n] > 0 &&
                t.impostazioni.maskSize[t.pageSelector][n + 1] > 0 &&
                t.impostazioni.maskSize[t.pageSelector][n + 2] === 0) {
              // 1-1-0
              t.impostazioni.maskSize[t.pageSelector][n] = 50;
              t.impostazioni.maskSize[t.pageSelector][n + 1] = 50;
              t.impostazioni.maskSize[t.pageSelector][n + 2] = 0;
            } else {
              if (t.impostazioni.maskSize[t.pageSelector][n] === 0 &&
                  t.impostazioni.maskSize[t.pageSelector][n + 1] > 0 &&
                  t.impostazioni.maskSize[t.pageSelector][n + 2] > 0) {
                // 0-1-1
                t.impostazioni.maskSize[t.pageSelector][n] = 0;
                t.impostazioni.maskSize[t.pageSelector][n + 1] = 50;
                t.impostazioni.maskSize[t.pageSelector][n + 2] = 50;
              } else {
                if (t.impostazioni.maskSize[t.pageSelector][n] > 0 &&
                    t.impostazioni.maskSize[t.pageSelector][n + 1] === 0 &&
                    t.impostazioni.maskSize[t.pageSelector][n + 2] > 0) {
                  // 1-0-1
                  t.impostazioni.maskSize[t.pageSelector][n] = 50;
                  t.impostazioni.maskSize[t.pageSelector][n + 1] = 0;
                  t.impostazioni.maskSize[t.pageSelector][n + 2] = 50;
                } else {
                  if (t.impostazioni.maskSize[t.pageSelector][n] > 0 &&
                      t.impostazioni.maskSize[t.pageSelector][n + 1] > 0 &&
                      t.impostazioni.maskSize[t.pageSelector][n + 2] > 0) {
                    // 1-1-1
                    t.impostazioni.maskSize[t.pageSelector][n] = 33;
                    t.impostazioni.maskSize[t.pageSelector][n + 1] = 34;
                    t.impostazioni.maskSize[t.pageSelector][n + 2] = 33;
                  }
                }
              }
            }
          }
        }
      }
    }

    // logConsole('Sistema frame 2', t.impostazioni.maskSize[t.pageSelector]);

    this.sistemaFramesHor(t);
  }

  massimizzaFinestra(t, n) {
    if (n !== -1) {
      this.appoSize = JSON.parse(JSON.stringify(t.impostazioni.maskSize[t.pageSelector]));
      this.appoSizeHor = JSON.parse(JSON.stringify(t.impostazioni.maskSizeHor[t.pageSelector]));

      // Massimizzata finestra n
      const size = new Array();
      const sizeHor = new Array();
      sizeHor.push(0);
      for (let i = 0; i <= 9; i++) {
        if (i === n) {
          size.push(100);
        } else {
          size.push(0);
        }
      }
      if (n === 1 || n === 2 || n === 3) {
        sizeHor.push(100);
        sizeHor.push(0);
        sizeHor.push(0);
      } else {
        if (n === 4 || n === 5 || n === 6) {
          sizeHor.push(0);
          sizeHor.push(100);
          sizeHor.push(0);
        } else {
          sizeHor.push(0);
          sizeHor.push(0);
          sizeHor.push(100);
        }
      }
      t.impostazioni.maskSize[t.pageSelector] = JSON.parse(JSON.stringify(size));
      t.impostazioni.maskSizeHor[t.pageSelector] = JSON.parse(JSON.stringify(sizeHor));

      t.refreshMap[n] = !t.refreshMap[n];
      // logConsole(t.impostazioni.maskSize, t.impostazioni.maskSizeHor)
    } else {
      // Tolta massimizzazione a finestra n
      if (!this.appoSize) {
        this.appoSize = [[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34], [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
          [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
          [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
          [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
          [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
          [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34], [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
          [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
          [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
          [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
          [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
          [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34], [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
          [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
          [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
          [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
          [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
          [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34]];
        this.appoSizeHor = [[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],
          [33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],
          [33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],
          [33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34]];
        t.impostazioni.maskVisible = [[true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
          [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
          [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
          [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
          [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
          [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
          [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
          [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
          [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
          [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
          [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
          [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
          [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true]];
      }
      t.impostazioni.maskSize[t.pageSelector] = JSON.parse(JSON.stringify(this.appoSize));
      t.impostazioni.maskSizeHor[t.pageSelector] = JSON.parse(JSON.stringify(this.appoSizeHor));

      t.refreshMap[1] = !t.refreshMap[1];
      t.refreshMap[2] = !t.refreshMap[2];
      t.refreshMap[3] = !t.refreshMap[3];
      t.refreshMap[4] = !t.refreshMap[4];
      t.refreshMap[5] = !t.refreshMap[5];
      t.refreshMap[6] = !t.refreshMap[6];
      t.refreshMap[7] = !t.refreshMap[7];
      t.refreshMap[8] = !t.refreshMap[8];
      t.refreshMap[9] = !t.refreshMap[9];
    }
  }

  riposizionaMaschere(t) {
    // logConsole('GF: Riposiziona maschere');

    /* t.impostazioni.maskVisible = [[true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true]]; */
    t.impostazioni.maskSize[t.pageSelector] = [33, 33, 34, 33, 33, 34, 33, 33, 34, 33];
    /* [[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34], [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34], [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34], [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34]]; */
    t.impostazioni.maskSizeHor[t.pageSelector] = [33, 33, 33, 34];
    /* [[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],
      [33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],
      [33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],
      [33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],
      [33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],
      [33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34]]; */

    t.impostazioni.dimensioni[t.pageSelector].PrimaRiga =  [33, 34, 33, 34];
    t.impostazioni.dimensioni[t.pageSelector].SecondaRiga =  [33, 34, 33, 34];
    t.impostazioni.dimensioni[t.pageSelector].TerzaRiga =  [33, 34, 33, 34];
    t.impostazioni.dimensioni[t.pageSelector].Orizzontale =  [33, 33, 34, 34];

    t.refreshMap[1] = !t.refreshMap[1];
    t.refreshMap[2] = !t.refreshMap[2];
    t.refreshMap[3] = !t.refreshMap[3];
    t.refreshMap[4] = !t.refreshMap[4];
    t.refreshMap[5] = !t.refreshMap[5];
    t.refreshMap[6] = !t.refreshMap[6];
    t.refreshMap[7] = !t.refreshMap[7];
    t.refreshMap[8] = !t.refreshMap[8];
    t.refreshMap[9] = !t.refreshMap[9];

    t.impostazioni.frameMassimizzato = false;
  }

  tornaVecchieDimensioni(t, quale) {
    // logConsole('GF: Torna vecchie dimensioni', quale);

    if(t.impostazioni.dimensioni[t.pageSelector]) {
      if (quale < 4) {
        // logConsole('Check frame: Vecchie dimensioni prima riga', t.impostazioni.dimensioni[t.pageSelector].PrimaRiga);
        return t.impostazioni.dimensioni[t.pageSelector].PrimaRiga;
      } else {
        if (quale > 3 && quale < 7) {
          // logConsole('Check frame: Vecchie dimensioni seconda riga', t.impostazioni.dimensioni[t.pageSelector].SecondaRiga);
          return t.impostazioni.dimensioni[t.pageSelector].SecondaRiga;
        } else {
          // logConsole('Check frame: Vecchie dimensioni terza riga', t.impostazioni.dimensioni[t.pageSelector].TerzaRiga);
          return t.impostazioni.dimensioni[t.pageSelector].TerzaRiga;
        }
      }
    } else {
      return [50, 50, 50, 50];
    }
  }

  checkRiga(t, quale, primo, secondo) {
    // logConsole('GF: Check riga', quale, primo, secondo);

    // logConsole('Check frame: Chiudo frame', quale);
    // logConsole('Check frame: Controllo con frame', primo, t.impostazioni.maskVisible[t.pageSelector][primo]);
    // logConsole('Check frame: Controllo con frame', secondo, t.impostazioni.maskVisible[t.pageSelector][secondo]);

    t.impostazioni.maskSize[t.pageSelector][quale] = 0;

    if (t.impostazioni.maskVisible[t.pageSelector][primo] === true && t.impostazioni.maskVisible[t.pageSelector][secondo] === true) {
      // logConsole('Check frame: Chiudo solo il primo');
      const vecchie = this.tornaVecchieDimensioni(t, quale);
      t.impostazioni.maskSize[t.pageSelector][primo] = vecchie[primo + 1];
      t.impostazioni.maskSize[t.pageSelector][secondo] = vecchie[secondo + 1];
    } else {
      if (t.impostazioni.maskVisible[t.pageSelector][primo] === true && t.impostazioni.maskVisible[t.pageSelector][secondo] === false) {
        // logConsole('Check frame: lascio aperto solo il primo');
        t.impostazioni.maskSize[t.pageSelector][primo] = 100;
        t.impostazioni.maskSize[t.pageSelector][secondo] = 0;
      } else {
        if (t.impostazioni.maskVisible[t.pageSelector][primo] === false && t.impostazioni.maskVisible[t.pageSelector][secondo] === true) {
          // logConsole('Check frame: lascio aperto solo il secondo');
          t.impostazioni.maskSize[t.pageSelector][primo] = 0;
          t.impostazioni.maskSize[t.pageSelector][secondo] = 100;
        } else {
          if (t.impostazioni.maskVisible[t.pageSelector][primo] === false && t.impostazioni.maskVisible[t.pageSelector][secondo] === false) {
            // logConsole('Check frame: chiudo tutto');
            t.impostazioni.maskSize[t.pageSelector][primo] = 0;
            t.impostazioni.maskSize[t.pageSelector][secondo] = 0;
          }
        }
      }
    }

    try {
      if (quale < 4) {
        t.impostazioni.dimensioni[t.pageSelector].PrimaRiga[0] = t.impostazioni.maskSize[t.pageSelector][1];
        t.impostazioni.dimensioni[t.pageSelector].PrimaRiga[1] = t.impostazioni.maskSize[t.pageSelector][2];
        t.impostazioni.dimensioni[t.pageSelector].PrimaRiga[2] = t.impostazioni.maskSize[t.pageSelector][3];
      } else {
        if (quale > 3 && quale < 7) {
          t.impostazioni.dimensioni[t.pageSelector].SecondaRiga[0] = t.impostazioni.maskSize[t.pageSelector][4];
          t.impostazioni.dimensioni[t.pageSelector].SecondaRiga[1] = t.impostazioni.maskSize[t.pageSelector][5];
          t.impostazioni.dimensioni[t.pageSelector].SecondaRiga[2] = t.impostazioni.maskSize[t.pageSelector][6];
        } else {
          t.impostazioni.dimensioni[t.pageSelector].TerzaRiga[0] = t.impostazioni.maskSize[t.pageSelector][7];
          t.impostazioni.dimensioni[t.pageSelector].TerzaRiga[1] = t.impostazioni.maskSize[t.pageSelector][8];
          t.impostazioni.dimensioni[t.pageSelector].TerzaRiga[2] = t.impostazioni.maskSize[t.pageSelector][9];
        }
      }
    } catch(e) {

    }

  }

  chiudiFramesSuCambioPagina(t) {
    // logConsole('GF: Chiudi frame su cambio pagina');

    let i = 0;
    let riga1Chiuso = false;
    let riga2Chiuso = false;
    let riga3Chiuso = false;
    // logConsole('Check frame: Tutti gli elementi prima', t.pageSelector, t.impostazioni.maskVisible, t.impostazioni.maskVisible[t.pageSelector]);
    t.impostazioni.maskVisible[t.pageSelector].forEach(element => {
      // logConsole('Check frame: Controllo apertura frame ' + i, element);
      if (element === false) {
        if (i > 0 && i < 4 && riga1Chiuso === false) {
          if (i === 1) {
            this.checkRiga(t, 1, 2, 3);
            riga1Chiuso = true;
          } else {
            if (i === 2) {
              this.checkRiga(t, 2, 1, 3);
              riga1Chiuso = true;
            } else {
              this.checkRiga(t, 3, 1, 2);
              riga1Chiuso = true;
            }
          }
        } else {
          if (i > 3 && i < 7 && riga2Chiuso === false) {
            if (i === 4) {
              this.checkRiga(t, 4, 5, 6);
              riga2Chiuso = true;
            } else {
              if (i === 5) {
                this.checkRiga(t, 5, 4, 6);
                riga2Chiuso = true;
              } else {
                this.checkRiga(t, 6, 4, 5);
                riga2Chiuso = true;
              }
            }
          } else {
            if (riga3Chiuso === false) {
              if (i === 7) {
                this.checkRiga(t, 7, 8, 9);
                riga3Chiuso = true;
              } else {
                if (i === 8) {
                  this.checkRiga(t, 8, 7, 9);
                  riga3Chiuso = true;
                } else {
                  this.checkRiga(t, 9, 7, 8);
                  riga3Chiuso = true;
                }
              }
            }
          }
        }
      }
      i++;
    });
    // logConsole('Check frame: Tutti gli elementi dopo', t.pageSelector, t.impostazioni.maskVisible, t.impostazioni.maskVisible[t.pageSelector]);

    this.controllaHor(t);
  }

  controllaDimensioniFrames(t, primo, secondo) {
    // logConsole('GF: Controlla dimensioni frame', primo, secondo);

    // logConsole('Prima', t.impostazioni.maskSize, t.impostazioni.maskVisible);

    let q = 0;

    if (t.impostazioni.maskVisible[t.pageSelector][primo] === true) { q++; }
    if (t.impostazioni.maskVisible[t.pageSelector][secondo] === true) { q++; }
    if (q === 1) {
      if (t.impostazioni.maskVisible[t.pageSelector][primo] === true) {
        t.impostazioni.maskSize[t.pageSelector][primo] = 100;
      } else {
        t.impostazioni.maskSize[t.pageSelector][secondo] = 100;
      }
    } else {
      if (q === 2) {
        t.impostazioni.maskSize[t.pageSelector][primo] = 66;
        t.impostazioni.maskSize[t.pageSelector][secondo] = 34;
      } else {
        t.impostazioni.maskSize[t.pageSelector][primo] = 0;
        t.impostazioni.maskSize[t.pageSelector][secondo] = 0;
      }
    }

    // logConsole('Dopo', t.impostazioni.maskSize, t.impostazioni.maskVisible);

    this.controllaHor(t);
  }

  controllaHor(t) {
    // logConsole('GF: Controlla hor');

    // logConsole('Prima', t.impostazioni.maskSizeHor);
    const vecchio = JSON.parse(JSON.stringify(t.impostazioni.maskSizeHor[t.pageSelector]));

    let riga1 = 0;
    let riga2 = 0;
    let riga3 = 0;

    if (t.impostazioni.maskVisible[t.pageSelector][1] === true) { riga1++; }
    if (t.impostazioni.maskVisible[t.pageSelector][2] === true) { riga1++; }
    if (t.impostazioni.maskVisible[t.pageSelector][3] === true) { riga1++; }

    if (t.impostazioni.maskVisible[t.pageSelector][4] === true) { riga2++; }
    if (t.impostazioni.maskVisible[t.pageSelector][5] === true) { riga2++; }
    if (t.impostazioni.maskVisible[t.pageSelector][6] === true) { riga2++; }

    if (t.impostazioni.maskVisible[t.pageSelector][7] === true) { riga3++; }
    if (t.impostazioni.maskVisible[t.pageSelector][8] === true) { riga3++; }
    if (t.impostazioni.maskVisible[t.pageSelector][9] === true) { riga3++; }


    // logConsole('GF: SFH Controlla Hor', riga1, riga2, riga3);
    // logConsole(riga1, riga2, riga3);
    if (riga1 > 0) {
      if (riga2 > 0) {
        if (riga3 > 0) {
          // qualcosa riga1, riga2, riga3
          // logConsole('qui 1');
          // logConsole('GF: SFH Controlla Hor 1');
          t.impostazioni.maskSizeHor[t.pageSelector][1] = 33;
          t.impostazioni.maskSizeHor[t.pageSelector][2] = 34;
          t.impostazioni.maskSizeHor[t.pageSelector][3] = 33;
        } else {
          // logConsole('GF: SFH Controlla Hor 2');
          // qualcosa riga1, riga2
          // logConsole('qui 2');
          t.impostazioni.maskSizeHor[t.pageSelector][1] = 50;
          t.impostazioni.maskSizeHor[t.pageSelector][2] = 50;
          t.impostazioni.maskSizeHor[t.pageSelector][3] = 0;
        }
      } else {
        if (riga3 > 0) {
          // logConsole('GF: SFH Controlla Hor 3');
          // qualcosa riga1, riga3
          // logConsole('qui 3');
          t.impostazioni.maskSizeHor[t.pageSelector][1] = 50;
          t.impostazioni.maskSizeHor[t.pageSelector][2] = 0;
          t.impostazioni.maskSizeHor[t.pageSelector][3] = 50;
        } else {
          // logConsole('GF: SFH Controlla Hor 4');
          // qualcosa riga1
          // logConsole('qui 4');
          t.impostazioni.maskSizeHor[t.pageSelector][1] = 100;
          t.impostazioni.maskSizeHor[t.pageSelector][2] = 0;
          t.impostazioni.maskSizeHor[t.pageSelector][3] = 0;
        }
      }
    } else {
      if (riga2 > 0) {
        if (riga3 > 0) {
          logConsole('SFH Controlla Hor 5');
          // qualcosa riga2, riga3
          // logConsole('qui 5');
          t.impostazioni.maskSizeHor[t.pageSelector][1] = 0;
          t.impostazioni.maskSizeHor[t.pageSelector][2] = 50;
          t.impostazioni.maskSizeHor[t.pageSelector][3] = 50;
        } else {
          // logConsole('GF: SFH Controlla Hor 6');
          // qualcosa riga2
          // logConsole('qui 6');
          t.impostazioni.maskSizeHor[t.pageSelector][1] = 0;
          t.impostazioni.maskSizeHor[t.pageSelector][2] = 100;
          t.impostazioni.maskSizeHor[t.pageSelector][3] = 0;
        }
      } else {
        if (riga3 > 0) {
          // logConsole('GF: SFH Controlla Hor 7');
          // qualcosa riga3
          // logConsole('qui 7');
          t.impostazioni.maskSizeHor[t.pageSelector][1] = 0;
          t.impostazioni.maskSizeHor[t.pageSelector][2] = 0;
          t.impostazioni.maskSizeHor[t.pageSelector][3] = 100;
        } else {
          // logConsole('GF: SFH Controlla Hor 8');
          // niente
          // logConsole('qui 8');
          t.impostazioni.maskSizeHor[t.pageSelector][1] = 0;
          t.impostazioni.maskSizeHor[t.pageSelector][2] = 0;
          t.impostazioni.maskSizeHor[t.pageSelector][3] = 0;
        }
      }
    }

    // this.refreshMaschere(t, vecchio[1], vecchio[2], vecchio[3]);
    t.refreshMap[1] = !t.refreshMap[1];
    t.refreshMap[2] = !t.refreshMap[2];
    t.refreshMap[3] = !t.refreshMap[3];
    t.refreshMap[4] = !t.refreshMap[4];
    t.refreshMap[5] = !t.refreshMap[5];
    t.refreshMap[6] = !t.refreshMap[6];
    t.refreshMap[7] = !t.refreshMap[7];
    t.refreshMap[8] = !t.refreshMap[8];
    t.refreshMap[9] = !t.refreshMap[9];

    // logConsole('Dopo', t.impostazioni.maskSizeHor);
  }

  refreshMaschere(t, e1, e2, e3) {
    // logConsole('GF: Refresh maschere', e1, e2, e3);

    const primo = Math.round(e1);
    const secondo = Math.round(e2);
    const terzo = Math.round(e3);

    // logConsole(primo, secondo, terzo, this.impostazioni.maskSizeHor);

    if (t.impostazioni.maskSizeHor[t.pageSelector][1] !== primo) {
      // logConsole('cambiato 1');
      // t.impostazioni.maskSizeHor[t.pageSelector][1] = primo;

      t.refreshMap[1] = !t.refreshMap[1];
      t.refreshMap[2] = !t.refreshMap[2];
      t.refreshMap[3] = !t.refreshMap[3];
    }
    if (t.impostazioni.maskSizeHor[t.pageSelector][2] !== secondo) {
      // logConsole('cambiato 2');
      // t.impostazioni.maskSizeHor[t.pageSelector][2] = secondo;

      t.refreshMap[4] = !t.refreshMap[4];
      t.refreshMap[5] = !t.refreshMap[5];
      t.refreshMap[6] = !t.refreshMap[6];
    }
    if (t.impostazioni.maskSizeHor[t.pageSelector][3] !== terzo) {
      // logConsole('cambiato 3');
      // t.impostazioni.maskSizeHor[t.pageSelector][3] = terzo;

      t.refreshMap[7] = !t.refreshMap[7];
      t.refreshMap[8] = !t.refreshMap[8];
      t.refreshMap[9] = !t.refreshMap[9];
    }

    // logConsole(primo, secondo, terzo, this.impostazioni.maskSizeHor);

    if (!t.differenzeDiImpostazioni) { t.differenzeDiImpostazioni = true; }
    // this.rinfrescaTuttiIframes();
  // }
  }
  /* maskSizeApp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  maskSizeHorApp = [0, 0, 0, 0];
  maskDisabled12App;
  maskDisabled34App;
  maskDisabled56App;
  maskDisabledH1App;
  maskVisibleApp;
  maskVisibleHorApp;
  maximizedFrameApp;
  maximizedApp;

  memorizzaSizeApp(t, n, x) {
    // logConsole('Spostato split ', n, x);

    // this.maskSizeApp[n] = x;
  }

  memorizzaSizeHorApp(t, x) {
    // this.maskSizeHor1App[1] = +x.sizes[0];
    // this.maskSizeHor1App[2] = +x.sizes[1];
    // this.maskSizeHor1App[3] = +x.sizes[2];
  }

  memorizzaValori(t) {
    this.maskSizeApp = JSON.parse(JSON.stringify(t.impostazioni.maskSize));
    this.maskSizeHorApp = JSON.parse(JSON.stringify(t.impostazioni.maskSizeHor));

    this.maskDisabled12App = JSON.parse(JSON.stringify(t.impostazioni.maskDisabled12));
    this.maskDisabled34App = JSON.parse(JSON.stringify(t.impostazioni.maskDisabled34));
    this.maskDisabled56App = JSON.parse(JSON.stringify(t.impostazioni.maskDisabled56));
    this.maskDisabledH1App = JSON.parse(JSON.stringify(t.impostazioni.maskDisabledH1));

    this.maskVisibleHorApp = JSON.parse(JSON.stringify(t.impostazioni.maskVisibleHor));

    this.maskVisibleApp = JSON.parse(JSON.stringify(t.impostazioni.maskVisible));

    this.maximizedFrameApp = JSON.parse(JSON.stringify(t.impostazioni.Maximized));

    this.maximizedApp = JSON.parse(JSON.stringify(t.impostazioni.maximized));

    // logConsole('Memorizzazione valori', t.impostazioni.maskSize, t.impostazioni.maskVisible, t.impostazioni.maximized,
    //   t.impostazioni.maskDisabled12, t.impostazioni.maskDisabled34, t.impostazioni.maskDisabled56, t.impostazioni.maskDisabledH1,
    //   t.impostazioni.maskVisible, t.impostazioni.Maximized, t.impostazioni.maximized, t.impostazioni.maskVisibleHor);
  }

  riposizionaMaschere(t) {
    let ok = false;
    this.maskSizeApp.forEach(element => {
      if (element > 0) {
        ok = true;
      }
    });
    if (ok === false) {
      t.impostazioni.maskSize = Utils.creaVettore(environment.quantiFrames, 33);
    } else {
      t.impostazioni.maskSize = JSON.parse(JSON.stringify(this.maskSizeApp));
    }
    // logConsole(t.impostazioni.maskSize);
    t.impostazioni.maskSizeHor = JSON.parse(JSON.stringify(this.maskSizeHorApp));

    if (this.maskDisabled12App !== undefined) {
      t.impostazioni.maskDisabled12 = JSON.parse(JSON.stringify(this.maskDisabled12App));
    } else {
      t.impostazioni.maskDisabled12 = false;
    }
    if (this.maskDisabled34App !== undefined) {
      t.impostazioni.maskDisabled34 = JSON.parse(JSON.stringify(this.maskDisabled34App));
    } else {
      t.impostazioni.maskDisabled34 = false;
    }
    if (this.maskDisabled56App !== undefined) {
      t.impostazioni.maskDisabled56 = JSON.parse(JSON.stringify(this.maskDisabled56App));
    } else {
      t.impostazioni.maskDisabled56 = false;
    }
    if (this.maskDisabledH1App !== undefined) {
      t.impostazioni.maskDisabledH1 = JSON.parse(JSON.stringify(this.maskDisabledH1App));
    } else {
      t.impostazioni.maskDisabledH1 = false;
    }
    if (this.maskVisibleApp !== undefined) {
      t.impostazioni.maskVisible = JSON.parse(JSON.stringify(this.maskVisibleApp));
    } else {
      t.impostazioni.maskVisible = [null, true, true, true, true, true, true, true, true, true, true];
    }
    if (this.maskVisibleHorApp !== undefined) {
      t.impostazioni.maskVisibleHor = JSON.parse(JSON.stringify(this.maskVisibleHorApp));
    } else {
      t.impostazioni.maskVisibleHor = [null, true, true, true];
    }

    t.impostazioni.Maximized = -1;

    if (this.maximizedApp !== undefined) {
      t.impostazioni.maximized = JSON.parse(JSON.stringify(this.maximizedApp));
    } else {
      t.impostazioni.maximized = [false, false, false, false, false, false, false, false, false];
    }

    // logConsole('Impostazione valori', t.impostazioni.maskSize, t.impostazioni.maskVisible, t.impostazioni.maximized,
    //   t.impostazioni.maskDisabled12, t.impostazioni.maskDisabled34, t.impostazioni.maskDisabled56, t.impostazioni.maskDisabledH1,
    //   t.impostazioni.maskVisible, t.impostazioni.Maximized, t.impostazioni.maximized, t.impostazioni.maskVisibleHor);
  }

  controlloAperturaAltri(t, numero) {
    let numero1 = -1;
    let numero2 = -1;

    switch (numero) {
      case 1:
        numero1 = 2;
        numero2 = 3;
        break;
      case 2:
        numero1 = 1;
        numero2 = 3;
        break;
      case 3:
        numero1 = 1;
        numero2 = 2;
        break;
      case 4:
        numero1 = 5;
        numero2 = 6;
        break;
      case 5:
        numero1 = 4;
        numero2 = 6;
        break;
      case 6:
        numero1 = 4;
        numero2 = 5;
        break;
      case 7:
        numero1 = 8;
        numero2 = 9;
        break;
      case 8:
        numero1 = 7;
        numero2 = 9;
        break;
      case 9:
        numero1 = 7;
        numero2 = 8;
        break;
    }

    let q = 100;
    if (t.impostazioni.maskVisible[t.pageSelector][numero1] === true && t.impostazioni.maskVisible[t.pageSelector][numero2] === true) {
      q = 33;
      t.impostazioni.maskSize[t.pageSelector][numero1] = 33;
      t.impostazioni.maskSize[t.pageSelector][numero2] = 33;
    } else {
      if (t.impostazioni.maskVisible[t.pageSelector][numero1] === true || t.impostazioni.maskVisible[t.pageSelector][numero2] === true) {
        q = 50;
        if (t.impostazioni.maskVisible[t.pageSelector][numero1] === true) {
          t.impostazioni.maskSize[t.pageSelector][numero1] = 50;
          t.impostazioni.maskSize[t.pageSelector][numero2] = 0;
        } else {
          t.impostazioni.maskSize[t.pageSelector][numero1] = 0;
          t.impostazioni.maskSize[t.pageSelector][numero2] = 50;
        }
      } else {
        t.impostazioni.maskSize[t.pageSelector][numero1] = 0;
        t.impostazioni.maskSize[t.pageSelector][numero2] = 0;
      }
    }

    t.impostazioni.maskSize[t.pageSelector][numero] = q;
    t.impostazioni.maskVisible[t.pageSelector][numero] = true;
  }

  controlloChiusuraAltri(t, numero, numero1, numero2) {
    // logConsole('Chiusura frame ', numero);
    // logConsole('Controllo adiacenti ', numero1, numero2);

    t.impostazioni.maskVisible[t.pageSelector][numero] = !t.impostazioni.maskVisible[t.pageSelector][numero];
    // logConsole('Visibilità frame dopo ', numero, t.impostazioni.maskVisible[t.pageSelector][numero]);

    if (t.impostazioni.maskVisible[t.pageSelector][numero1] === true && t.impostazioni.maskVisible[t.pageSelector][numero2] === true) {
      if (t.impostazioni.maskVisible[t.pageSelector][numero] === true) {
        // logConsole('Metodo 1');
        t.impostazioni.maskSize[t.pageSelector][numero] = 33;
        t.impostazioni.maskSize[t.pageSelector][numero1] = 33;
        t.impostazioni.maskSize[t.pageSelector][numero2] = 34;

        t.impostazioni.maskVisible[t.pageSelector][numero] = true;
        t.impostazioni.maskVisible[t.pageSelector][numero1] = true;
        t.impostazioni.maskVisible[t.pageSelector][numero2] = true;
      } else {
        // logConsole('Metodo 2');
        t.impostazioni.maskSize[t.pageSelector][numero] = 0;
        t.impostazioni.maskSize[t.pageSelector][numero1] = 50;
        t.impostazioni.maskSize[t.pageSelector][numero2] = 50;

        t.impostazioni.maskVisible[t.pageSelector][numero] = false;
        t.impostazioni.maskVisible[t.pageSelector][numero1] = true;
        t.impostazioni.maskVisible[t.pageSelector][numero2] = true;
      }
    } else {
      if (t.impostazioni.maskVisible[t.pageSelector][numero1] === true && t.impostazioni.maskVisible[t.pageSelector][numero2] === false) {
        if (t.impostazioni.maskVisible[t.pageSelector][numero] === true) {
          // logConsole('Metodo 3');
          t.impostazioni.maskSize[t.pageSelector][numero] = 50;
          t.impostazioni.maskSize[t.pageSelector][numero1] = 50;
          t.impostazioni.maskSize[t.pageSelector][numero2] = 0;

          t.impostazioni.maskVisible[t.pageSelector][numero] = true;
          t.impostazioni.maskVisible[t.pageSelector][numero1] = true;
          t.impostazioni.maskVisible[t.pageSelector][numero2] = false;
        } else {
          // logConsole('Metodo 4');
          t.impostazioni.maskSize[t.pageSelector][numero] = 0;
          t.impostazioni.maskSize[t.pageSelector][numero1] = 100;
          t.impostazioni.maskSize[t.pageSelector][numero2] = 0;

          t.impostazioni.maskVisible[t.pageSelector][numero] = false;
          t.impostazioni.maskVisible[t.pageSelector][numero1] = true;
          t.impostazioni.maskVisible[t.pageSelector][numero2] = false;
        }
      } else {
        if (t.impostazioni.maskVisible[t.pageSelector][numero1] === false && t.impostazioni.maskVisible[t.pageSelector][numero2] === true) {
          if (t.impostazioni.maskVisible[t.pageSelector][numero] === true) {
            // logConsole('Metodo 5');
            t.impostazioni.maskSize[t.pageSelector][numero] = 50;
            t.impostazioni.maskSize[t.pageSelector][numero1] = 0;
            t.impostazioni.maskSize[t.pageSelector][numero2] = 50;

            t.impostazioni.maskVisible[t.pageSelector][numero] = true;
            t.impostazioni.maskVisible[t.pageSelector][numero1] = false;
            t.impostazioni.maskVisible[t.pageSelector][numero2] = true;
          } else {
            // logConsole('Metodo 6');
            t.impostazioni.maskSize[t.pageSelector][numero] = 0;
            t.impostazioni.maskSize[t.pageSelector][numero1] = 0;
            t.impostazioni.maskSize[t.pageSelector][numero2] = 100;

            t.impostazioni.maskVisible[t.pageSelector][numero] = false;
            t.impostazioni.maskVisible[t.pageSelector][numero1] = false;
            t.impostazioni.maskVisible[t.pageSelector][numero2] = true;
          }
        } else {
          if (t.impostazioni.maskVisible[t.pageSelector][numero1] === false && t.impostazioni.maskVisible[t.pageSelector][numero2] === false) {
            if (t.impostazioni.maskVisible[t.pageSelector][numero] === true) {
              // logConsole('Metodo 7');
              t.impostazioni.maskSize[t.pageSelector][numero] = 100;
              t.impostazioni.maskSize[t.pageSelector][numero1] = 0;
              t.impostazioni.maskSize[t.pageSelector][numero2] = 0;

              t.impostazioni.maskVisible[t.pageSelector][numero] = true;
              t.impostazioni.maskVisible[t.pageSelector][numero1] = false;
              t.impostazioni.maskVisible[t.pageSelector][numero2] = false;
            } else {
              // logConsole('Metodo 8');
              t.impostazioni.maskSize[t.pageSelector][numero] = 0;
              t.impostazioni.maskSize[t.pageSelector][numero1] = 0;
              t.impostazioni.maskSize[t.pageSelector][numero2] = 0;

              t.impostazioni.maskVisible[t.pageSelector][numero] = false;
              t.impostazioni.maskVisible[t.pageSelector][numero1] = false;
              t.impostazioni.maskVisible[t.pageSelector][numero2] = false;
            }
          }
        }
      }
    }

    // logConsole('Risultato Size ', t.impostazioni.maskSize[t.pageSelector][numero], t.impostazioni.maskSize[t.pageSelector][numero1], t.impostazioni.maskSize[t.pageSelector][numero2]);
    // logConsole('Risultato Visible', t.impostazioni.maskVisible[t.pageSelector][numero], t.impostazioni.maskVisible[t.pageSelector][numero1],
    //                                  t.impostazioni.maskVisible[t.pageSelector][numero2]);
  }

  controllaPerRighe(t) {
    let riga1 = false;
    let riga2 = false;
    let riga3 = false;

    if (t.impostazioni.maskVisible[t.pageSelector][1] === true || t.impostazioni.maskVisible[t.pageSelector][2] === true || t.impostazioni.maskVisible[t.pageSelector][3] === true) {
      riga1 = true;
    }
    if (t.impostazioni.maskVisible[t.pageSelector][4] === true || t.impostazioni.maskVisible[t.pageSelector][5] === true || t.impostazioni.maskVisible[t.pageSelector][6] === true) {
      riga2 = true;
    }
    if (t.impostazioni.maskVisible[t.pageSelector][7] === true || t.impostazioni.maskVisible[t.pageSelector][8] === true || t.impostazioni.maskVisible[t.pageSelector][9] === true) {
      riga3 = true;
    }

    if (riga1 === true && riga2 === true && riga3 === true) {
      t.impostazioni.maskSizeHor[t.pageSelector][1] = 33;
      t.impostazioni.maskSizeHor[t.pageSelector][2] = 33;
      t.impostazioni.maskSizeHor[t.pageSelector][3] = 34;
    } else {
      if (riga1 === true && riga2 === true && riga3 === false) {
        t.impostazioni.maskSizeHor[t.pageSelector][1] = 50;
        t.impostazioni.maskSizeHor[t.pageSelector][2] = 50;
        t.impostazioni.maskSizeHor[t.pageSelector][3] = 0;
      } else {
        if (riga1 === true && riga2 === false && riga3 === true) {
          t.impostazioni.maskSizeHor[t.pageSelector][1] = 50;
          t.impostazioni.maskSizeHor[t.pageSelector][2] = 0;
          t.impostazioni.maskSizeHor[t.pageSelector][3] = 50;
        } else {
          if (riga1 === false && riga2 === true && riga3 === true) {
            t.impostazioni.maskSizeHor[t.pageSelector][1] = 0;
            t.impostazioni.maskSizeHor[t.pageSelector][2] = 50;
            t.impostazioni.maskSizeHor[t.pageSelector][3] = 50;
          } else {
            if (riga1 === true && riga2 === false && riga3 === false) {
              t.impostazioni.maskSizeHor[t.pageSelector][1] = 100;
              t.impostazioni.maskSizeHor[t.pageSelector][2] = 0;
              t.impostazioni.maskSizeHor[t.pageSelector][3] = 0;
            } else {
              if (riga1 === false && riga2 === true && riga3 === false) {
                t.impostazioni.maskSizeHor[t.pageSelector][1] = 0;
                t.impostazioni.maskSizeHor[t.pageSelector][2] = 100;
                t.impostazioni.maskSizeHor[t.pageSelector][3] = 0;
              } else {
                if (riga1 === false && riga2 === false && riga3 === true) {
                  t.impostazioni.maskSizeHor[t.pageSelector][1] = 0;
                  t.impostazioni.maskSizeHor[t.pageSelector][2] = 0;
                  t.impostazioni.maskSizeHor[t.pageSelector][3] = 100;
                } else {
                  t.impostazioni.maskSizeHor[t.pageSelector][1] = 0;
                  t.impostazioni.maskSizeHor[t.pageSelector][2] = 0;
                  t.impostazioni.maskSizeHor[t.pageSelector][3] = 0;
                }
              }
            }
          }
        }
      }
    }

    // logConsole(riga1, riga2, riga3, t.impostazioni.maskSizeHor);

    if (t.impostazioni.maskSizeHor[t.pageSelector][1] === 0) {
      t.impostazioni.maskVisibleHor[1] = false;
    } else {
      t.impostazioni.maskVisibleHor[1] = true;
    }

    if (t.impostazioni.maskSizeHor[t.pageSelector][2] === 0) {
      t.impostazioni.maskVisibleHor[2] = false;
    } else {
      t.impostazioni.maskVisibleHor[2] = true;
    }

    if (t.impostazioni.maskSizeHor[t.pageSelector][3] === 0) {
      t.impostazioni.maskVisibleHor[3] = false;
    } else {
      t.impostazioni.maskVisibleHor[3] = true;
    }

    if (t.impostazioni.maskVisible[t.pageSelector][1] === true || t.impostazioni.maskVisible[t.pageSelector][2] === true || t.impostazioni.maskVisible[t.pageSelector][3] === true) {
      t.impostazioni.maskDisabled12 = false;
    } else {
      t.impostazioni.maskDisabled12 = true;
    }

    if (t.impostazioni.maskVisible[t.pageSelector][4] === true || t.impostazioni.maskVisible[t.pageSelector][5] === true || t.impostazioni.maskVisible[t.pageSelector][6] === true) {
      t.impostazioni.maskDisabled34 = false;
    } else {
      t.impostazioni.maskDisabled34 = true;
    }

    if (t.impostazioni.maskVisible[t.pageSelector][7] === true || t.impostazioni.maskVisible[t.pageSelector][8] === true || t.impostazioni.maskVisible[t.pageSelector][9] === true) {
      t.impostazioni.maskDisabled56 = false;
    } else {
      t.impostazioni.maskDisabled56 = true;
    }

    // logConsole(t.impostazioni.maskSize, t.impostazioni.maskVisible);
  }

  public chiudeFrame(t, n) {
    switch (n) {
      case 1:
        this.controlloChiusuraAltri(t, n, 2, 3);
        break;
      case 2:
        this.controlloChiusuraAltri(t, n, 1, 3);
        break;
      case 3:
        this.controlloChiusuraAltri(t, n, 1, 2);
        break;

      case 4:
        this.controlloChiusuraAltri(t, n, 5, 6);
        break;
      case 5:
        this.controlloChiusuraAltri(t, n, 4, 6);
        break;
      case 6:
        this.controlloChiusuraAltri(t, n, 4, 5);
        break;

      case 7:
        this.controlloChiusuraAltri(t, n, 8, 9);
        break;
      case 8:
        this.controlloChiusuraAltri(t, n, 7, 9);
        break;
      case 9:
        this.controlloChiusuraAltri(t, n, 7, 8);
        break;
    }

    this.controllaPerRighe(t);

    t.rinfrescaTuttiIframes();

    t.checkDifferenceFromStartJSON();
  }


  visualizzaMaschere(t, q) {
  }

  massimizzaFinestre(t, frame: number) {
    // logConsole('Massimizzo frame *' + frame + '*');

    if (frame !== 0) {
      this.memorizzaValori(t);

      t.impostazioni.Maximized = frame;

      for (let index = 1; index <= 9; index++) {
        if (index !== frame) {
          // this.chiudeFrame(t, index);
          t.impostazioni.maskVisible[t.pageSelector][index] = false;
          t.impostazioni.maskSize[t.pageSelector][index] = 0;
        }
      }

      t.impostazioni.maskDisabled12 = true;
      t.impostazioni.maskDisabled34 = true;
      t.impostazioni.maskDisabled56 = true;

      t.impostazioni.maskVisibleHor[1] = false;
      t.impostazioni.maskVisibleHor[2] = false;
      t.impostazioni.maskVisibleHor[3] = false;

      if (frame === 1 || frame === 2 || frame === 3) {
        // t.impostazioni.maskVisibleHor[1] = true;
        // t.impostazioni.maskVisibleHor[2] = false;
        // t.impostazioni.maskVisibleHor[3] = false;
        t.impostazioni.maskSizeHor[t.pageSelector][1] = 100;
        t.impostazioni.maskSizeHor[t.pageSelector][2] = 0;
        t.impostazioni.maskSizeHor[t.pageSelector][3] = 0;
      } else {
        if (frame === 4 || frame === 5 || frame === 6) {
          // t.impostazioni.maskVisibleHor[1] = false;
          // t.impostazioni.maskVisibleHor[2] = true;
          // t.impostazioni.maskVisibleHor[3] = false;
          t.impostazioni.maskSizeHor[t.pageSelector][1] = 0;
          t.impostazioni.maskSizeHor[t.pageSelector][2] = 100;
          t.impostazioni.maskSizeHor[t.pageSelector][3] = 0;
        } else {
          if (frame === 7 || frame === 8 || frame === 9) {
            // t.impostazioni.maskVisibleHor[1] = false;
            // t.impostazioni.maskVisibleHor[2] = false;
            // t.impostazioni.maskVisibleHor[3] = true;
            t.impostazioni.maskSizeHor[t.pageSelector][1] = 0;
            t.impostazioni.maskSizeHor[t.pageSelector][2] = 0;
            t.impostazioni.maskSizeHor[t.pageSelector][3] = 100;
          }
        }
      }

      t.impostazioni.maskSize[t.pageSelector][frame] = 100;
    } else {
      this.riposizionaMaschere(t);

      // t.impostazioni.maskSizeHor[t.pageSelector][1] = 33;
      // t.impostazioni.maskSizeHor[t.pageSelector][2] = 33;
      // t.impostazioni.maskSizeHor[t.pageSelector][3] = 33;
      for (let i = 0; i < 10; i++) {
        if (t.impostazioni.maskSize[t.pageSelector][i] === 0) {
          t.impostazioni.maskSize[t.pageSelector][i] = 33;
        }
        t.impostazioni.maskVisible[t.pageSelector][i] = true;
      }
      // logConsole(t.impostazioni.maskSize);

      // this.controllaPerRighe(t);

    }

    t.rinfrescaTuttiIframes();

    t.checkDifferenceFromStartJSON();
  } */

  sistemaHor(t, quale) {
    /* if (t.impostazioni.maskSize[t.pageSelector][1] === 0 && t.impostazioni.maskSize[t.pageSelector][2] === 0 &&
      t.impostazioni.maskSize[t.pageSelector][3] === 0) {

      t.impostazioni.maskSizeHor[t.pageSelector][1] = 0;
      t.impostazioni.maskSizeHor[t.pageSelector][2] = 50;
      t.impostazioni.maskSizeHor[t.pageSelector][3] = 50;
      t.impostazioni.dimensioni[t.pageSelector].Orizzontale[0] = 0;
      t.impostazioni.dimensioni[t.pageSelector].Orizzontale[1] = 50;
      t.impostazioni.dimensioni[t.pageSelector].Orizzontale[2] = 50;

    } */
    let qualeRiga;
    if (quale < 4) {
      qualeRiga = 1;
    } else {
      if (quale > 3 && quale < 7) {
        qualeRiga = 2;
      } else {
        qualeRiga = 3;
      }
    }
    this.sistemaHor2(t, qualeRiga);
  }

  sistemaHor2(t, qualeRiga) {
    // logConsole('GF: Sistema hor2', t.impostazioni.maskSize[t.pageSelector], t.pageSelector);

    let primoFrame;
    let secondoFrame;
    let terzoFrame;
    let altro1;
    let altro2;

    if (qualeRiga === 1) {
      primoFrame = 1; secondoFrame = 2; terzoFrame = 3;
      altro1 = 2; altro2 = 3;
    } else {
      if (qualeRiga === 2) {
        primoFrame = 4; secondoFrame = 5; terzoFrame = 6;
        altro1 = 1; altro2 = 3;
      } else {
        primoFrame = 7; secondoFrame = 8; terzoFrame = 9;
        altro1 = 1; altro2 = 2;
      }
    }

    if (t.impostazioni.maskSize[t.pageSelector][primoFrame] === 0 && t.impostazioni.maskSize[t.pageSelector][secondoFrame] === 0 &&
      t.impostazioni.maskSize[t.pageSelector][terzoFrame] === 0) {

      t.impostazioni.maskSizeHor[t.pageSelector][qualeRiga] = 0;

      t.impostazioni.dimensioni[t.pageSelector].Orizzontale[qualeRiga - 1] = 0;

      logConsole('Chiusura completa riga', qualeRiga);

      if (t.impostazioni.dimensioni[t.pageSelector].Orizzontale[altro1 - 1] > 0 &&
        t.impostazioni.dimensioni[t.pageSelector].Orizzontale[altro2 - 1] > 0) {

        t.impostazioni.maskSizeHor[t.pageSelector][altro1] = 50;
        t.impostazioni.maskSizeHor[t.pageSelector][altro2] = 50;
        t.impostazioni.dimensioni[t.pageSelector].Orizzontale[altro1 - 1] = 50;
        t.impostazioni.dimensioni[t.pageSelector].Orizzontale[altro2 - 1] = 50;

        logConsole('Sistemate righe 1', altro1, altro2);
      } else  {
        if (t.impostazioni.dimensioni[t.pageSelector].Orizzontale[altro1 - 1] > 0 &&
          t.impostazioni.dimensioni[t.pageSelector].Orizzontale[altro2 - 1] === 0) {

          t.impostazioni.maskSizeHor[t.pageSelector][altro1] = 100;
          t.impostazioni.maskSizeHor[t.pageSelector][altro2] = 0;
          t.impostazioni.dimensioni[t.pageSelector].Orizzontale[altro1 - 1] = 100;
          t.impostazioni.dimensioni[t.pageSelector].Orizzontale[altro2 - 1] = 0;

          logConsole('Sistemate righe 2', altro1);
        } else {
          if (t.impostazioni.dimensioni[t.pageSelector].Orizzontale[altro1 - 1] === 0 &&
            t.impostazioni.dimensioni[t.pageSelector].Orizzontale[altro2 - 1] > 0) {

            t.impostazioni.maskSizeHor[t.pageSelector][altro1] = 0;
            t.impostazioni.maskSizeHor[t.pageSelector][altro2] = 100;
            t.impostazioni.dimensioni[t.pageSelector].Orizzontale[altro1 - 1] = 0;
            t.impostazioni.dimensioni[t.pageSelector].Orizzontale[altro2 - 1] = 100;

            logConsole('Sistemate righe 3', altro2);
          } else {
            t.impostazioni.maskSizeHor[t.pageSelector][altro1] = 0;
            t.impostazioni.maskSizeHor[t.pageSelector][altro2] = 0;
            t.impostazioni.dimensioni[t.pageSelector].Orizzontale[altro1 - 1] = 0;
            t.impostazioni.dimensioni[t.pageSelector].Orizzontale[altro2 - 1] = 0;

            logConsole('Sistemate righe 4');
          }
        }

      }
    }

    /* if (t.impostazioni.maskSize[t.pageSelector][7] === 0 && t.impostazioni.maskSize[t.pageSelector][8] === 0 &&
      t.impostazioni.maskSize[t.pageSelector][9] === 0) {

      t.impostazioni.maskSizeHor[t.pageSelector][3] = 0;
      t.impostazioni.dimensioni[t.pageSelector].Orizzontale[2] = 0;

      if (t.impostazioni.dimensioni[t.pageSelector].Orizzontale[0] > 0 &&
        t.impostazioni.dimensioni[t.pageSelector].Orizzontale[1] > 0) {

        t.impostazioni.maskSizeHor[t.pageSelector][1] = 50;
        t.impostazioni.maskSizeHor[t.pageSelector][2] = 50;
        t.impostazioni.dimensioni[t.pageSelector].Orizzontale[0] = 50;
        t.impostazioni.dimensioni[t.pageSelector].Orizzontale[2] = 50;

      } else  {
        if (t.impostazioni.dimensioni[t.pageSelector].Orizzontale[0] > 0 &&
          t.impostazioni.dimensioni[t.pageSelector].Orizzontale[1] === 0) {

          t.impostazioni.maskSizeHor[t.pageSelector][1] = 100;
          t.impostazioni.maskSizeHor[t.pageSelector][2] = 0;
          t.impostazioni.dimensioni[t.pageSelector].Orizzontale[0] = 100;
          t.impostazioni.dimensioni[t.pageSelector].Orizzontale[1] = 0;

        } else {
          if (t.impostazioni.dimensioni[t.pageSelector].Orizzontale[0] === 0 &&
            t.impostazioni.dimensioni[t.pageSelector].Orizzontale[1] > 0) {

            t.impostazioni.maskSizeHor[t.pageSelector][1] = 0;
            t.impostazioni.maskSizeHor[t.pageSelector][2] = 100;
            t.impostazioni.dimensioni[t.pageSelector].Orizzontale[0] = 0;
            t.impostazioni.dimensioni[t.pageSelector].Orizzontale[1] = 100;

          } else {

            t.impostazioni.maskSizeHor[t.pageSelector][1] = 0;
            t.impostazioni.maskSizeHor[t.pageSelector][2] = 0;
            t.impostazioni.dimensioni[t.pageSelector].Orizzontale[0] = 0;
            t.impostazioni.dimensioni[t.pageSelector].Orizzontale[1] = 0;

          }
        }
      }
    } */
  }
}

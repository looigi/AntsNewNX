import { logConsole } from '../console-log';
import { Injectable } from '@angular/core';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {
  static debug = true;
  static tempWords = '';
  static text = '';
  static formOrigine;

  recognition =  new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  timer1: any;
  contatore = 0;

  constructor() { }

  init(t: any, debug: boolean) {
    VoiceRecognitionService.formOrigine = t;
    VoiceRecognitionService.debug = debug;
    if (VoiceRecognitionService.debug === true) {
      // logConsole('Debug speak:', VoiceRecognitionService.debug);
    }

    this.recognition.interimResults = true;
    this.recognition.lang = 'it';

    /* this.recognition.addEventListener('result', (e) => {
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      this.tempWords = transcript;

      // this.contatore = 0;
      // // logConsole(transcript);
    }); */

    this.recognition.continuous = true;

    this.recognition.onstart = function() {
      if (VoiceRecognitionService.debug === true) {
        // logConsole('Partito speak');
      }
    };

    this.recognition.onerror = function(event: any) {
      if (VoiceRecognitionService.debug === true) {
        // logConsole(event);
      }
    };

    this.recognition.onend = function() {
      if (VoiceRecognitionService.debug === true) {
        // logConsole('Fermato speak');
      }
    };

    this.recognition.onresult = function(event: any) {
      var interim_transcript = '';

      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          VoiceRecognitionService.tempWords += event.results[i][0].transcript;
          if (VoiceRecognitionService.debug === true) {
            // logConsole('Arrivato Speak', this.tempWords);
          }
          VoiceRecognitionService.wordConcat();
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
    };;
  }

  start() {
    this.recognition.start();
  }

  stop() {
    this.recognition.stop();
  }

  start2() {
    /* if (this.timer1 !== undefined) { clearInterval(this.timer1); this.timer1 = undefined; }
    this.timer1 = setInterval(() => {
      if (this.debug === true) {
        // logConsole("Speech. Contatore attesa testo", this.contatore);
      }
      this.contatore++;
      if (this.contatore > 3) {
        if (this.debug === true) {
          // logConsole("Speech. Contatore attesa testo. Passati 3 secondi");
        }
        clearInterval(this.timer1);

        this.stop();

        this.formOrigine.esegueFunzioneVocale(this.text);
      }
    }, 1000); */

    this.isStoppedSpeechRecog = false;

    // this.recognition.onstart = ()=> {
    //  console.warn("Voice recognition started. Try speaking into the microphone.");
    // };
    // if(!this.recognition){
    this.recognition.start();
    if (VoiceRecognitionService.debug === true) {
      // logConsole("Speech recognition started")
    }
    // }

    // this.recognition.start();
    this.recognition.addEventListener('end', async (condition: any) => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
      } else {
        VoiceRecognitionService.wordConcat();

        // this.recognition.onstart = ()=> {
        //   console.warn("Voice recognition started. Try speaking into the microphone.");
        // };
        // if(!this.recognition){
          this.recognition.start();
          if (VoiceRecognitionService.debug === true) {
            // logConsole("Speech recognition started")
          }
        // }
        // this.recognition.start();
      }
    });
  }

  stop2() {
    this.isStoppedSpeechRecog = true;
    VoiceRecognitionService.wordConcat()

    if (this.recognition !== undefined) {
      this.recognition.abort();
      this.recognition.stop();
      // this.recognition = new webkitSpeechRecognition();
    }

    // this.recognition.stop();
    if (VoiceRecognitionService.debug === true) {
      // logConsole("End speech recognition")
    }
  }

  static wordConcat() {
    if (this.debug === true) {
      // logConsole("Speech. Testo pronunciato: ", this.tempWords);
    }

    this.text = this.tempWords;
    // this.formOrigine.testoVocale = this.tempWords;
    this.tempWords = '';

    VoiceRecognitionService.formOrigine.esegueFunzioneVocale(this.text);

    /* if (this.text.substr(this.text.length - 3).toUpperCase().trim() === ' GO') {
      if (this.debug === true) {
        // logConsole("Speech. Trovata stringa GO. Esco e chiamo la funzione: ", this.tempWords);
      }
      this.stop();
      this.formOrigine.esegueFunzioneVocale(this.text);
    } */
  }
}

import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

interface Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

declare var window: Window;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'speech-to-text';
  speechRecognition: any;

  @ViewChild('selectdialect') select_dialect!: ElementRef;
  @ViewChild('selectlanguage') select_language!: ElementRef;
  @ViewChild('status') status!: ElementRef;
  @ViewChild('final') final!: ElementRef;
  @ViewChild('interim') interim!: ElementRef;
  constructor() {
  }

  ngAfterViewInit(): void{
      this.loadDialects();
      this.init();
  }

  start() {
    this.speechRecognition.start();
  }

  stop() {
    this.speechRecognition.stop();
  }

  init() {
    if ('webkitSpeechRecognition' in window) {
      this.speechRecognition = new window.webkitSpeechRecognition();
      this.speechRecognition.continuous = true;
      this.speechRecognition.interimResults = true;
      this.speechRecognition.lang = this.select_dialect.nativeElement.value;

      this.speechRecognition.onstart = () => {
        this.status.nativeElement.style.display = "block";
      };

      this.speechRecognition.onend = () => {
        this.status.nativeElement.style.display = "none";
      };

      this.speechRecognition.onError = () => {
        this.status.nativeElement.style.display = "none";
      };

      let final_transcript = "";

      this.speechRecognition.onresult = (event: any) => {
        // Create the interim transcript string locally because we don't want it to persist like final transcript
        let interim_transcript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          // If the result item is Final, add it to Final Transcript, Else add it to Interim transcript
          if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }

        this.final.nativeElement.innerHTML = final_transcript;
        this.interim.nativeElement.innerHTML = interim_transcript;
      };
    } else {
      console.log('Speech Recognition Not Available');
    }
  }

  loadDialects() {
    let langs: Array<any> = this.getAllLanguages();
    for (var i = 0; i < langs.length; i++) {
      this.select_language.nativeElement.options[i] = new Option(langs[i][0], i.toString());
    }
    this.select_language.nativeElement.selectedIndex = 6;
    this.updateCountry(langs);
    this.select_dialect.nativeElement.selectedIndex = 6;
  }

  updateCountry(langs: any) {
    for (var i = this.select_dialect.nativeElement.options.length - 1; i >= 0; i--) {
      this.select_dialect.nativeElement.remove(i);
    }
    var list = langs[this.select_language.nativeElement.selectedIndex];
    for (var i = 1; i < list.length; i++) {
      this.select_dialect.nativeElement.options.add(new Option(list[i][1], list[i][0]));
    }
    this.select_dialect.nativeElement.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
  }

  getAllLanguages() {
    return [
      ['Afrikaans', ['af-ZA']],
      ['Bahasa Indonesia', ['id-ID']],
      ['Bahasa Melayu', ['ms-MY']],
      ['Catal??', ['ca-ES']],
      ['??e??tina', ['cs-CZ']],
      ['Deutsch', ['de-DE']],
      [
        'English',
        ['en-AU', 'Australia'],
        ['en-CA', 'Canada'],
        ['en-IN', 'India'],
        ['en-NZ', 'New Zealand'],
        ['en-ZA', 'South Africa'],
        ['en-GB', 'United Kingdom'],
        ['en-US', 'United States'],
      ],
      [
        'Espa??ol',
        ['es-AR', 'Argentina'],
        ['es-BO', 'Bolivia'],
        ['es-CL', 'Chile'],
        ['es-CO', 'Colombia'],
        ['es-CR', 'Costa Rica'],
        ['es-EC', 'Ecuador'],
        ['es-SV', 'El Salvador'],
        ['es-ES', 'Espa??a'],
        ['es-US', 'Estados Unidos'],
        ['es-GT', 'Guatemala'],
        ['es-HN', 'Honduras'],
        ['es-MX', 'M??xico'],
        ['es-NI', 'Nicaragua'],
        ['es-PA', 'Panam??'],
        ['es-PY', 'Paraguay'],
        ['es-PE', 'Per??'],
        ['es-PR', 'Puerto Rico'],
        ['es-DO', 'Rep??blica Dominicana'],
        ['es-UY', 'Uruguay'],
        ['es-VE', 'Venezuela'],
      ],
      ['Euskara', ['eu-ES']],
      ['Fran??ais', ['fr-FR']],
      ['Galego', ['gl-ES']],
      ['Hrvatski', ['hr_HR']],
      ['IsiZulu', ['zu-ZA']],
      ['??slenska', ['is-IS']],
      ['Italiano', ['it-IT', 'Italia'], ['it-CH', 'Svizzera']],
      ['Magyar', ['hu-HU']],
      ['Nederlands', ['nl-NL']],
      ['Norsk bokm??l', ['nb-NO']],
      ['Polski', ['pl-PL']],
      ['Portugu??s', ['pt-BR', 'Brasil'], ['pt-PT', 'Portugal']],
      ['Rom??n??', ['ro-RO']],
      ['Sloven??ina', ['sk-SK']],
      ['Suomi', ['fi-FI']],
      ['Svenska', ['sv-SE']],
      ['T??rk??e', ['tr-TR']],
      ['??????????????????', ['bg-BG']],
      ['P????????????', ['ru-RU']],
      ['????????????', ['sr-RS']],
      ['?????????', ['ko-KR']],
      [
        '??????',
        ['cmn-Hans-CN', '????????? (????????????)'],
        ['cmn-Hans-HK', '????????? (??????)'],
        ['cmn-Hant-TW', '?????? (??????)'],
        ['yue-Hant-HK', '?????? (??????)'],
      ],
      ['?????????', ['ja-JP']],
      ['Lingua lat??na', ['la']],
    ];
  }
}

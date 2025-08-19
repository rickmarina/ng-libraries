import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ToastyService, ToastType, ToastyPromise } from '../../../../ng-toast-notify/src/public-api';

declare var Prism: any;

@Component({
  selector: 'app-code',
  standalone: true,
  imports: [],
  templateUrl: './code.component.html',
  styleUrl: './code.component.css'
})
export class CodeComponent {

  @Input() title: string = '';
  @Input() innerCode: string = "";
  @Input() run: boolean = true;

  @ViewChild('codeElement', { static: false }) codeElement!: ElementRef;
  
  constructor(private _toastyService: ToastyService) {
  }

  ngAfterViewInit() {
    this.highlightCode();
  }

  highlightCode() {
    if (this.codeElement && typeof Prism !== 'undefined') {
      Prism.highlightElement(this.codeElement.nativeElement);
    }
  }
  copy() {
    this._toastyService.showToast('Copied', '', { type: ToastType.Info});
  }

  executeCode() {
    try {
      // Creamos una función que recibe el cuerpo del código tal cual
      const func = new Function('_toastyService', 'ToastType', `
        ${this.innerCode.replace(/this\._toastyService/g, '_toastyService')};
      `);

      // Llamamos a la función con el contexto del componente
      func(this._toastyService, ToastType);

      // console.log('Código ejecutado correctamente');
    } catch (error) {
      console.error('Error executing code:', error);
    }
  }

}

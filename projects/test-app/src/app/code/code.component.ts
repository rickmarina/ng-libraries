import { Component, Input } from '@angular/core';
import { ToastyService, ToastType, ToastyPromise } from 'ng-toast-notify';

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

  constructor(private _toastyService: ToastyService) {
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

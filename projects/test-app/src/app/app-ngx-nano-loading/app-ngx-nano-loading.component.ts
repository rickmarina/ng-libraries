import { Component } from '@angular/core';
import { NgxNanoLoadingComponent, NgxNanoLoadingService } from '../../../../ngx-nano-loading/src/public-api';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-app-ngx-nano-loading',
  standalone: true,
  imports: [NgxNanoLoadingComponent, FormsModule],
  templateUrl: './app-ngx-nano-loading.component.html',
  styleUrl: './app-ngx-nano-loading.component.css'
})
export class AppNgxNanoLoadingComponent {

  public loadingValue: number = 0;

  constructor(private _nanoLoadingService: NgxNanoLoadingService) { }

  public start() {
    this._nanoLoadingService.start();
  }

  public finish() { 
    this._nanoLoadingService.finish();
  }

  public updateLoadingValue(event: number) {
    this._nanoLoadingService.setProgress(event);
  }
}

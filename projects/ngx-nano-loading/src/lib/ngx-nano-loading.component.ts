import { Component, ViewEncapsulation } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, Event } from '@angular/router';
import { NgxNanoLoadingService } from './ngx-nano-loading.service';

type Colors = 'red' | 'violet' | 'orange';

@Component({
  selector: 'ngx-nano-loading',
  standalone: true,
  imports: [],
  template: `
     @if (this.progress > 0 && this.progress <= 100) {
     <div class="progress-container">
      <div class="progress-bar" [class]="color" [style.width.%]="this.progress"></div>
      </div>
     }
  `,
  styleUrl: './ngx-nano-loading.component.css',
  encapsulation: ViewEncapsulation.None
})
export class NgxNanoLoadingComponent {
  public progress: number = 0;
  public color: Colors = 'red'; // Default color

  constructor(private _nanoloadingService: NgxNanoLoadingService,
    private router: Router) {
    this._nanoloadingService.progress$.subscribe(progress => {
      // console.log(`Current progress: ${progress}%`);
      this.progress = progress;
    });

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this._nanoloadingService.start();
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this._nanoloadingService.finish();
      }
    });
  }
}

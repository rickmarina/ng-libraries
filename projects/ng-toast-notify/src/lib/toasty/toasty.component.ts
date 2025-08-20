import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import { Component, HostListener, Input, SimpleChanges } from '@angular/core';
import { ToastModel, ToastyService } from '../toasty.service';

enum ToastyContainerPosition {
  TOP_LEFT = 'top-left',
  TOP = 'top',
  TOP_RIGHT = 'top-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM = 'bottom',
  BOTTOM_RIGHT = 'bottom-right'
}

@Component({
  selector: 'toasty',
  standalone: true,
  imports: [NgClass, NgStyle, AsyncPipe],
  templateUrl: './toasty.component.html',
  styleUrl: './toasty.component.css'
})
export class ToastyComponent {

  @Input() position: string = ToastyContainerPosition.BOTTOM_RIGHT;
  @Input() duration: number = this._toastService.getDefaultDuration();
  @Input() capacity: number = this._toastService.getCapacity();

  protected toasts$ = this._toastService.newToast$;

  private readonly positionMap: Record<string, string[]> = {
    'top-left': ['top', 'left'],
    'top': ['top', 'center'],
    'top-right': ['top', 'right'],
    'bottom-left': ['bottom', 'left'],
    'bottom': ['bottom', 'center'],
    'bottom-right': ['bottom', 'right'],
  };
  constructor(private _toastService: ToastyService) {

  }

  ngOnInit(): void {
    // Subscribe to the toast service to receive new toasts
    // this._toastService.newToast$.subscribe(t => {
    //   if (t) {
    //     // console.log(t);
    //   }
    // });

    this._toastService.deleteToast$.subscribe(t => {
      if (t) {
        // we dont need to delete toast, because internally in the service the toast has been deleted and in future toasts, only live toasts will be received from the service
        // console.log(t);
      }
    });

    this._toastService.updateToast$.subscribe(t => {
      if (t) {
        // console.log(t);
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['duration']) {
      this._toastService.setDefaultDuration(this.duration);
    }
    if (changes['capacity']) {
      this._toastService.setCapacity(changes['capacity'].currentValue);
    }
  }


  closeToast(id: number): void {
    this._toastService.closeToast(id);
  }

  containerClass(): string[] {
    return this.positionMap[this.position] ?? [ToastyContainerPosition.BOTTOM_RIGHT];
  }

  expires(t: ToastModel): boolean {
    return (t.expires < Date.now());
  }

  // Swipe to close functionality
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    const toastid = this.localizeToastIdFromTouch(event);
    this._toastService.updateTouchStart(toastid, event.changedTouches[0]);
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this._toastService.updateTouchEnd(event.changedTouches[0]);
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    this._toastService.updateTouchMove(event.changedTouches[0]);
  }

  private localizeToastIdFromTouch(event: TouchEvent): number {
    let current = event.target as HTMLElement;
    let maxnesting : number = 4;
    while (!current.classList.contains('toasty') && maxnesting > 0) {
      current = current.parentElement as HTMLElement;
      maxnesting--;
    }

    return parseInt(current.getAttribute('data-toast-id') || '0');
  }

}

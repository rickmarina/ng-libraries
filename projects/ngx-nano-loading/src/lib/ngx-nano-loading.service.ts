import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NgxNanoLoadingService {
  private progressSubject = new BehaviorSubject<number>(0);
  public progress$ = this.progressSubject.asObservable();

  private timer?: Subscription;
  private value = 0;

  constructor() { }

  public start() {
    this.stop();
    this.value = 0;
    this.progressSubject.next(this.value);

    this.timer = interval(200).subscribe(() => {
      if (this.value < 90) {
        this.value += Math.random() * 15;
        this.progressSubject.next(this.value);
      }
    });
  }

  public setProgress(value: number) {
    this.value = value;
    this.progressSubject.next(this.value);
  }

  public finish() {
    this.stop();
    this.value = 100;
    this.progressSubject.next(this.value);

    setTimeout(() => {
      this.value = 0;
      this.progressSubject.next(this.value);
    }, 500);
  }
  private stop() {
    if (this.timer) {
      this.timer.unsubscribe();
      this.timer = undefined;
    }
  }
}

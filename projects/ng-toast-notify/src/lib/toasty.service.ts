import { Injectable, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ToastysoundService } from './toastysound.service';

interface IServiceConfig {
  capacity: number;
  duration: number;
  grouping: boolean;
  messages: Record<string, string>;
  threshold_offsetX: number;
}

interface IToastQueue<T> {
  setCapacity(c: number): void;
  getCapacity(): number;
  enqueue(item: T): void;
  dequeue(): T | undefined;
  size(): number;
  getElements(): T[];
  removeId(id: number): T | undefined;
}

class Queue<T> implements IToastQueue<T> {
  private storage: T[] = [];

  constructor(private capacity: number = Infinity) {
  }

  setCapacity(c: number) {
    this.capacity = c;
  }
  getCapacity() { return this.capacity; }

  enqueue(item: T): void {
    if (this.size() >= this.capacity) {
      throw Error('Toasty queue has reached max capacity, you cannot add more items.');
    }
    this.storage.push(item);
  }
  dequeue(): T | undefined {
    return this.storage.shift();
  }
  size(): number {
    return this.storage.length;
  }
  getElements(): T[] {
    return this.storage;
  }
  removeId(id: number): T | undefined {
    const index = this.storage.findIndex(item => (item as any).id === id);
    if (index !== -1) {
      const [removed] = this.storage.splice(index, 1);
      return removed;
    }
    return undefined;
  }
}
export enum ToastType {
  Basic = 'basic',
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
  Custom = 'custom',
  Promise = 'promise',
  Component = 'component'
}

interface ToastGesture {
  date: number;
  touchStart?: Touch;
  touchEnd?: Touch;
  offsetX?: number;
}

export interface ToastModel {
  id: number;
  hash?: string;
  title: string;
  message: string;
  type: ToastType;
  timestamp: number;
  duration: number;
  expires: number;
  config?: ToastyConfig;
  get icon(): string;

  gesture?: ToastGesture;
  animatePbar?: boolean; // Used to animate the progress bar
  count: number; // Used to count duplicate toasts
}

export interface ToastyConfig {
  type?: ToastType;
  duration?: number;
  sticky?: boolean;
  enableHtml?: boolean;
  customStyle?: Record<string, string>;
  loading?: boolean;
  beep?: boolean;
  progressBar?: boolean;
  component?: Type<any>;
  componentParams?: Record<string, any>;
}

export interface ToastyPromise<T> {
  promise: Promise<T>;
  loading: string;
  success: string | ((result: T) => string);
  error: string | ((err: any) => string);
}


@Injectable({
  providedIn: 'root'
})
export class ToastyService {

  private TOASTY_SERVICE_CONFIG: IServiceConfig = {
    capacity: 10,
    duration: 5000,
    grouping: false,
    messages: {
      now: 'just now',
      seconds: '{0} seconds ago',
      minutes: '{0} minutes ago'
    },
    threshold_offsetX: 170
  };


  private queue: IToastQueue<ToastModel> = new Queue<ToastModel>(this.TOASTY_SERVICE_CONFIG.capacity);
  private counter: number = 0;
  private newToastBehaviorSubject = new BehaviorSubject<ToastModel[]>([]);
  public newToast$ = this.newToastBehaviorSubject.asObservable();
  private deleteToastBehaviorSubject = new BehaviorSubject<ToastModel | undefined>(undefined);
  public deleteToast$ = this.deleteToastBehaviorSubject.asObservable();
  private updateToastBehaviorSubject = new BehaviorSubject<ToastModel | undefined>(undefined);
  public updateToast$ = this.updateToastBehaviorSubject.asObservable();

  constructor(private _toastySoundService: ToastysoundService) {
  }

  setDefaultDuration(d: number): void { this.TOASTY_SERVICE_CONFIG.duration = d; }
  getDefaultDuration(): number { return this.TOASTY_SERVICE_CONFIG.duration; }
  setCapacity(c: number) { this.TOASTY_SERVICE_CONFIG.capacity = c; this.queue.setCapacity(c); }
  getCapacity(): number { return this.queue.getCapacity(); }
  getGrouping(): boolean { return this.TOASTY_SERVICE_CONFIG.grouping; }
  setGrouping(g: boolean) { this.TOASTY_SERVICE_CONFIG.grouping = g; }

  showToast(title: string, message: string, toastConfig?: ToastyConfig | undefined): number {
    const hash = this.hash(title + message + (toastConfig ? JSON.stringify(toastConfig) : ''));

    if (this.TOASTY_SERVICE_CONFIG.grouping) {
      // check if a toast with the same hash already exists
      const existingToast = this.queue.getElements().find(t => t.hash === hash);
      if (existingToast) {
        existingToast.count++;
        //TODO: reset expiration time if not sticky, we have to reset the setTimeout associated to the toast too
        // if (!existingToast.config?.sticky && !isPromise) {
        //   existingToast.expires = Date.now() + existingToast.duration;
        // }
        // this.newToastBehaviorSubject.next([...this.queue.getElements()]); // Trigger re-render to show updated count
        return existingToast.id;
      }
    }

    this.counter++;

    // if sticky is true duration is infinity else use the provided duration or the default one
    // promise toasts duration is setted inifity at the beginning and updated when the promise is resolved or rejected
    const duration = (toastConfig?.sticky || toastConfig?.type == ToastType.Promise) ? Infinity : (toastConfig?.duration ?? this.TOASTY_SERVICE_CONFIG.duration);

    const toast: ToastModel = {
      id: this.counter,
      hash: hash,
      title: title,
      message: message,
      type: toastConfig?.type ?? ToastType.Basic,
      timestamp: Date.now(),
      duration: duration,
      expires: Date.now() + duration,
      config: toastConfig,
      count: 1,
      get icon() {
        if (toastConfig?.type == ToastType.Success)
          return "✅";
        if (toastConfig?.type == ToastType.Info)
          return "ℹ️";
        if (toastConfig?.type == ToastType.Warning)
          return "⚠️";
        if (toastConfig?.type == ToastType.Error)
          return "❌";

        return "";
      }
    };

    this.queue.enqueue(toast);

    this.newToastBehaviorSubject.next([...this.queue.getElements()]);

    if (toast.config?.beep) {
      this._toastySoundService.notify();
    }

    // if sticky progress bar is not animated and toast will not expire
    if (!toast.config?.sticky) {
      if (toast.config?.progressBar) {
        setTimeout(() => {
          this.updateToast(toast.id, { animatePbar: true });
        }, 100);
      }

      if (toastConfig?.type != ToastType.Promise) {
        setTimeout(() => {
          this.removeToast(toast.id);
        }, duration + 5);
      }
    }

    return this.counter;
  }

  showToastPromise<T>(title: string, promise: ToastyPromise<T>, config?: ToastyConfig) {
    const idtoast = this.showToast(title, promise.loading, { ...config, type: ToastType.Promise, loading: true });
    const duration = config?.duration ?? this.TOASTY_SERVICE_CONFIG.duration;

    promise.promise
      .then((result) => {
        const successMessage =
          typeof promise.success === 'function'
            ? promise.success(result)
            : promise.success;

        this.updateToast(idtoast, {
          message: successMessage,
          type: ToastType.Success,
          expires: Date.now() + duration,
          config: { loading: false }
        });
      })
      .catch((err) => {
        const errorMessage =
          typeof promise.error === 'function'
            ? promise.error(err)
            : promise.error;

        this.updateToast(idtoast, {
          message: errorMessage,
          type: ToastType.Error,
          expires: Date.now() + duration,
          config: { loading: false }
        });
      })
      .finally(() => {
        if (!config?.sticky)
          setTimeout(() => this.removeToast(idtoast), duration)
      }
      );

  }

  showToastComponent(component: Type<any>, componentParams: Record<string, any>, config?: ToastyConfig): number {
    const toastId = this.showToast('', '', { ...config, component: component, componentParams: componentParams, type: ToastType.Component });
    return toastId;
  }

  removeToast(id: number): void {
    this.newToastBehaviorSubject.next([...this.queue.getElements()]); // Trigger re-render to start exit animation
    setTimeout(() => { const t = this.queue.removeId(id); this.newToastBehaviorSubject.next([...this.queue.getElements()]); }, 500); // Wait for animation to finish before removing from queue
  }

  closeToast(id: number): void {
    const t = this.queue.removeId(id);
    this.newToastBehaviorSubject.next([...this.queue.getElements()]);
  }

  updateTouchStart(id: number, touch: Touch): void {
    const gesture: ToastGesture = { date: Date.now(), touchStart: touch };
    this.updateToast(id, { gesture: gesture });
  }

  // Loops through the toasts to find which one was touched and updates its touchEnd
  updateTouchEnd(touch: Touch): void {
    const toasts = this.queue.getElements().forEach(
      t => {
        if (t.gesture) {
          const deltaY = Math.abs(touch.clientY - t.gesture.touchStart!.clientY);
          const deltaX = Math.abs(touch.clientX - t.gesture.touchStart!.clientX);
          const deltaTime = Date.now() - t.gesture.date;

          if (deltaTime < 500 && deltaX > this.TOASTY_SERVICE_CONFIG.threshold_offsetX) {
            this.closeToast(t.id);
          }
          else {
            t.gesture = undefined; // Reset gesture if not swiped
          }
        }
      }
    )
  }

  updateTouchMove(touch: Touch): void {
    const toasts = this.queue.getElements();
    toasts.forEach(t => {
      if (t.gesture) {
        const deltaX = touch.clientX - t.gesture.touchStart!.clientX;
        t.gesture.offsetX = deltaX; // Store the offset for potential use in UI updates
      }
    });
  }

  private updateToast(id: number, newData: Partial<ToastModel>): void {
    const toasts = this.queue.getElements();
    const index = toasts.findIndex(t => t.id === id);

    if (index !== -1) {
      toasts[index] = { ...toasts[index], ...newData };
      this.newToastBehaviorSubject.next([...toasts]);
    }
  }

  private hash(str: string): string {
    let hash = 5381;

    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }

    return (hash >>> 0).toString(16);
  }

}

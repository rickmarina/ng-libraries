import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

interface IServiceConfig {
  duration: number,
  messages: Record<string, string>
}

interface IToastQueue<T> {
  setCapacity(c: number) : void;
  enqueue(item: T): void;
  dequeue(): T | undefined;
  size(): number;
  getElements(): T[];
  removeId(id: number): T | undefined;
}

class Queue<T> implements IToastQueue<T> {
  private storage: T[] = [];

  constructor(private capacity : number = Infinity) {
  }

  setCapacity(c: number) {
    this.capacity = c;
  }

  enqueue(item: T): void {
    if (this.size() > this.capacity) {
      console.log('max queue');
      throw Error('Queue has reached max capacity, you cannot add more items');
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
  None = 'none',
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
  Custom = 'custom'
}

export interface ToastModel {
  id: number;
  title: string;
  message: string;
  type: ToastType;
  timestamp: number;
  expires: number;
  config?: ToastyConfig;
  get icon(): string;
}

export interface ToastyConfig {
  type?: ToastType;
  duration?: number;
  enableHtml?: boolean;
  customStyle?: Record<string, string>;
  loading?: boolean;
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
    duration: 10000,
    messages: {
      now: 'just now',
      seconds: '{0} seconds ago',
      minutes: '{0} minutes ago'
    }
  };

  private queue: IToastQueue<ToastModel> = new Queue<ToastModel>();
  private counter: number = 0;
  private newToastBehaviorSubject = new BehaviorSubject<ToastModel[]>([]);
  public newToast$ = this.newToastBehaviorSubject.asObservable();
  private deleteToastBehaviorSubject = new BehaviorSubject<ToastModel | undefined>(undefined);
  public deleteToast$ = this.deleteToastBehaviorSubject.asObservable();
  private updateToastBehaviorSubject = new BehaviorSubject<ToastModel | undefined>(undefined);
  public updateToast$ = this.updateToastBehaviorSubject.asObservable();

  constructor() {
  }

  setDefaultDuration(d: number): void { this.TOASTY_SERVICE_CONFIG.duration = d; }
  getDefaultDuration(): number { return this.TOASTY_SERVICE_CONFIG.duration; }
  setCapacity(c: number) { this.queue.setCapacity(c); }

  showToast(title: string, message: string, toastConfig?: ToastyConfig | undefined, isPromise?: boolean): number {
    this.counter++;

    const duration = toastConfig?.duration ?? this.TOASTY_SERVICE_CONFIG.duration;

    const toast: ToastModel = {
      id: this.counter,
      title: title,
      message: message,
      type: toastConfig?.type ?? ToastType.None,
      timestamp: Date.now(),
      expires: isPromise ? Infinity : Date.now() + duration,
      config: toastConfig,
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

    if (!isPromise) {
      setTimeout(() => {
        this.removeToast(toast.id);
      }, duration);
    }

    return this.counter;
  }

  showToastPromise<T>(title: string, promise: ToastyPromise<T>, config?: ToastyConfig) {
    const idtoast = this.showToast(title, promise.loading, { ...config, loading: true }, true);
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
      .finally(() => setTimeout(() => this.removeToast(idtoast), duration));

  }

  removeToast(id: number): void {
    this.newToastBehaviorSubject.next([...this.queue.getElements()]);
    const t = this.queue.removeId(id);
  }

  closeToast(id: number) : void {
    const t = this.queue.removeId(id);
    this.newToastBehaviorSubject.next([...this.queue.getElements()]);
  }

  private updateToast(id: number, newData: Partial<ToastModel>): void {
    const toasts = this.queue.getElements();
    const index = toasts.findIndex(t => t.id === id);

    if (index !== -1) {
      this.queue.getElements()[index] = { ...toasts[index], ...newData };
      this.newToastBehaviorSubject.next([...this.queue.getElements()]);
    }
  }

}

# Angular libraries 
**Index**
1. [ng-toast-notify](#id1)
2. [ng-nano-loading](#id2)

## NgToastNotify <a name="id1"></a>

Lightweight and flexible toast notifications for Angular simply and effective, perfect to notify the user with short customized messages 

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.0.

[![npm version](https://img.shields.io/npm/v/ng-toast-notify.svg)](https://www.npmjs.com/package/ng-toast-notify)
[Live demo and documentation](https://rickmarina.github.io/ng-libraries/#/ng-toast-notify)

### Installation

#### Install via npm
```bash
npm install ng-toast-notify
```

#### Add component
Add the <toasty> placeholder component in your HTML and ensure you have the required imports in your component.ts.

component.html
```bash
<toasty></toasty>
```

component.ts 
```bash
import { ToastType, ToastyComponent, ToastyPromise, ToastyService } from 'ng-toast-notify'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToastyComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
```

#### Service
Add the ToastyService to your component and use it to display toasts.

Inject the service in your component:

```bash 
constructor(private _toastyService: ToastyService) { }
```

#### Display a basic toast!
Use the service to display toasts:
```bash
this._toastyService.showToast('Title', 'Message body');
```

#### Toast types
1. Simple toast, title and message
2. Info toast
3. Success toast
4. Warning toast
5. Error toast 
6. None toast 
7. Html message toast 
8. Custom css toast 
9. Long message
10. Loading icon
11. Promise toast
12. Emoji

#### Other features 
1. Close on swipe
2. Notify sound (beep)
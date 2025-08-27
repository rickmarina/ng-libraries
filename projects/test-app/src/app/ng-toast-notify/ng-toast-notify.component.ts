import { Component } from '@angular/core';
// import { ToastType, ToastyComponent, ToastyService, ToastyPromise } from 'ng-toast-notify';
import { ToastType, ToastyComponent, ToastyService, ToastyPromise } from '../../../../ng-toast-notify/src/public-api';
import { CodeComponent } from '../code/code.component';
import { FormsModule } from '@angular/forms';
import { ClockComponent } from '../clock/clock.component';

type ToastMessage = {
  title: string,
  message: string
};


@Component({
  selector: 'app-ng-toast-notify',
  standalone: true,
  imports: [ToastyComponent, FormsModule, CodeComponent],
  templateUrl: './ng-toast-notify.component.html',
  styleUrl: './ng-toast-notify.component.css'
})
export class NgToastNotifyComponent {
  public title: string = '';
  public message: string = '';
  public containerDuration: number = 5000;
  public containerPosition: string = 'bottom-right';
  public containerCapacity: number = 10;
  public containerGrouping: boolean = false;
  public durationToast: number = 5;
  public libName: string = "ng-toast-notify";

  public sidebarOpen: boolean = false;

  constructor(private _toastyService: ToastyService) { }
  private toastMessages: ToastMessage[] = [
    {
      title: 'Mission Accomplished!',
      message: 'You pressed a button. NASA is impressed.'
    },
    {
      title: 'Toast Success!',
      message: 'This notification is brought to you by JavaScript and caffeine.'
    },
    {
      title: 'Brain.exe has stopped',
      message: 'Just kidding! Everything’s fine. Probably.'
    },
    {
      title: 'You’ve Got Mail!',
      message: 'Just kidding. It’s 2025. No one sends emails anymore.'
    },
    {
      title: 'Bug? Never Heard of Her',
      message: 'That action definitely didn’t break anything. Maybe.'
    },
    {
      title: 'Toast Delivered',
      message: 'Served fresh and slightly over-engineered.'
    },
    {
      title: 'Cool Move',
      message: 'That click had style. Hollywood is calling.'
    },
    {
      title: 'Clean Slate',
      message: 'We wiped it. Like, really wiped it. Hope that was okay.'
    },
    {
      title: 'Access Granted',
      message: 'You are now officially allowed to feel powerful.'
    },
    {
      title: 'Fancy That!',
      message: 'A toast so elegant, it sips its coffee with its pinky up.'
    },
    {
      title: 'Action Completed',
      message: 'Your changes have been saved successfully.'
    },
    {
      title: 'Data Submitted',
      message: 'The form was sent and processed correctly.'
    },
    {
      title: 'Warning',
      message: 'Please check the required fields before continuing.'
    },
    {
      title: 'Error Occurred',
      message: 'Something went wrong. Try again or contact support.'
    },
    {
      title: 'Changes Updated',
      message: 'Your settings have been updated.'
    },
    {
      title: 'Logged In',
      message: 'Welcome back! You have successfully signed in.'
    },
    {
      title: 'Access Denied',
      message: 'You don’t have permission to perform this action.'
    },
    {
      title: 'Session Expired',
      message: 'Please log in again to continue.'
    },
    {
      title: 'Item Deleted',
      message: 'The selected item has been removed from the list.'
    },
    {
      title: 'Autosaved',
      message: 'Your progress was saved automatically.'
    },
  ];

  public basicToast() {
    this._toastyService.showToast('Title', 'Message body');
  }

  public infosuccessetctoasts: string = `
  this._toastyService.showToast('Info', 'Information body content', { type: ToastType.Info})
  this._toastyService.showToast('Success', 'Success body content', { type: ToastType.Success})
  this._toastyService.showToast('Warning', 'Warning body content', { type: ToastType.Warning})
  this._toastyService.showToast('Error', 'Error body content', { type: ToastType.Error})
  `;
  public componentcode: string = `
  import { ToastType, ToastyComponent, ToastyPromise, ToastyService } from '${this.libName}'; 
  @Component({
    selector: 'app-root',
    standalone: true,
    imports: [ToastyComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
  })
  `;

  public customcode: string = `
  const style = {
      "background-image": "linear-gradient(to right, #e52d27 0%, #b31217  51%, #e52d27  100%)",
      "color": "#fff"
    };
    this._toastyService.showToast('Custom', 'Some body content', { type: ToastType.Custom, customStyle: style });
  `;

  public customcode2: string = `
  const style = {
      "background-image": "linear-gradient(220.55deg, #FFE70B 0%, #27B643 100%)",
      "border": "1px solid rgb(182 214 19)",
      "color": "#fff"
    };
    this._toastyService.showToast('Custom', 'Some body content', { type: ToastType.Custom, customStyle: style });
  `;

  public customcode3: string = `
    const style = { 
      "gap": "12px",
      "padding": "14px 28px",
      "background": "linear-gradient(145deg, #0f0f0f, #1c1c1c)",
      "border": "2px solid rgba(255, 255, 255, 0.2)",
      "border-radius": "100px",
      "color": "#fff",
      "font-size": "16px",
      "font-weight": "600",
      "letter-spacing": "0.5px",
      "cursor": "pointer",
      "overflow": "hidden",
      "box-shadow": "0 0 20px rgba(0, 255, 255, 0.1)",
      "backdrop-filter": "blur(8px)"
    };
    this._toastyService.showToast('Custom', 'Some body content', { type: ToastType.Custom, customStyle: style });
  `;

  public longToast: string = `
  this._toastyService.showToast("Long text", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tincidunt euismod nunc quis suscipit. Curabitur sed semper tortor, at efficitur leo. Sed justo nulla, ullamcorper sed maximus a, vehicula ut nulla. Vivamus lobortis lacinia mi eu ultricies. Suspendisse quis sem ante. Vivamus consectetur lectus eget quam venenatis, sagittis aliquam lectus viverra. Donec nec molestie magna, ut ultricies tellus. Praesent faucibus urna imperdiet vulputate dapibus. Sed sit amet dolor odio. Donec est nulla, cursus sed aliquam at, cursus sit amet turpis. Nulla ut dolor eget dui laoreet hendrerit vel at tellus. Nullam aliquet sem at mauris scelerisque molestie. Nullam imperdiet blandit est et aliquam. Vestibulum euismod, libero id tincidunt rutrum, nulla augue aliquet risus, a rutrum elit orci eget lectus.");
  `;

  public loadingToast: string = `
  this._toastyService.showToast('Wait', 'Process may take a few seconds to complete', { type: ToastType.Custom, loading:true });
  `;

  public promiseToast: string = `
    simulateApiCall(): Promise<{ name: string }> {
      return new Promise((resolve, reject) =>
        setTimeout(
            () => Math.random() < 0.5 ? resolve({ name: 'Toasty resolved' }) : reject(new Error('Toasty rejected'))
        , 2000));
    }

    this._toastyService.showToastPromise('Fetching API', 
                                          {
                                            promise: this.simulateApiCall(),
                                            loading: 'Loading',
                                            success: (data) => \`Ok \${data.name}\`,
                                            error: 'Error'
                                          });  
  `;

  public infoToast() {
    this._toastyService.showToast('Info', 'Information body content', { type: ToastType.Info })
  }
  public successToast() {
    this._toastyService.showToast('Success', 'Success body content', { type: ToastType.Success })
  }
  public WarningToast() {
    this._toastyService.showToast('Warning', 'Warning body content', { type: ToastType.Warning })
  }
  public ErrorToast() {
    this._toastyService.showToast('Error', 'Error body content', { type: ToastType.Error })
  }
  public htmlToast() {
    this._toastyService.showToast('Html', '<b>Details</b><ul><li>item 1</li><li>item 2</li></ul>', { type: ToastType.Basic, enableHtml: true });
  }
  public htmlToast2() {
    this._toastyService.showToast('Html', 'Data successfully saved. <img width=80 src=./assets/img/dancing-spiderman.gif /> ', { type: ToastType.Success, enableHtml: true });
  }
  public htmlToast3() {
    this._toastyService.showToast('Html', 'Achievement unlocked. <img width=100 src=./assets/img/wizard.gif /> ', { type: ToastType.Info, enableHtml: true });
  }
  public customStyleToast() {
    const style = {
      "background-image": "linear-gradient(to right, #e52d27 0%, #b31217  51%, #e52d27  100%)",
      "color": "#fff"
    };
    this._toastyService.showToast('Custom', 'Some body content', { type: ToastType.Custom, customStyle: style });
  }
  public emojiToast() {
    this._toastyService.showToast('Error', '♥️love emoji toast♥️');
  }

  public makeToast() {

    const types = [ToastType.Info, ToastType.Success, ToastType.Warning, ToastType.Basic, ToastType.Error];
    const type = types[Math.floor(Math.random() * types.length)];

    const randomid = Math.floor(Math.random() * this.toastMessages.length);

    const gradients: Record<string, string>[] = [
      {
        "background-image": "linear-gradient(to right, #77A1D3 0%, #79CBCA  51%, #77A1D3  100%)",
        "color": "#fff",
        "font-family": "cursive"
      },
      {
        "background-image": "linear-gradient(to right, #e52d27 0%, #b31217  51%, #e52d27  100%)",
        "color": "#fff"
      },
      {
        "background-image": "linear-gradient(to right, #FF512F 0%, #F09819  51%, #FF512F  100%)",
        "color": "#fff"
      },
      {
        "background-image": "linear-gradient(to right, #3D7EAA 0%, #FFE47A  51%, #3D7EAA  100%)",
        "color": "#fff"
      },
      {
        "background-image": "linear-gradient(to right, #BA8B02 0%, #181818  51%, #BA8B02  100%)",
        "color": "#fff"
      },
      {
        "background-image": "linear-gradient(to right, rgb(59, 59, 59), rgb(34, 34, 34))",
        "color": "#fff"
      }, {
        "background-image": "linear-gradient(97deg, #7918c8, #f900ff)",
        "color": "#fff"
      }, {
        "background-image": "linear-gradient(220.55deg, #FFE70B 0%, #27B643 100%)",
        "border": "1px solid rgb(182 214 19)",
        "color": "#fff"
      }
    ]

    const styleGradient = gradients[Math.floor(Math.random() * gradients.length)];

    this._toastyService.showToast(this.toastMessages[randomid].title, this.toastMessages[randomid].message, { type: ToastType.Custom, enableHtml: true, customStyle: styleGradient });

  }


  public randomToast() {
    /*
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
     13. Beep 
     14. Progress bar
     15. Sticky toast
   */

    const functions = [this.basicToast, this.infoToast, this.successToast, this.WarningToast, this.ErrorToast, this.makeToast,
      this.htmlToast, this.htmlToast2, this.htmlToast3, this.customStyleToast, this.clickLongToast, this.clickLoadingToast, this.clickPromiseToast,
      this.clickEmojiToast, this.clickBeepToast, this.clickProgressBarToast
    ];
    const func = functions[Math.floor(Math.random() * functions.length)];
    func.bind(this)();

  }

  private clickProgressBarToast() {
    this._toastyService.showToast('Progress', 'This toast has a progress bar', { type: ToastType.Info, progressBar: true });
  }
  private clickBeepToast() {
    this._toastyService.showToast('Beep', 'This toast goes beep beep!', { type: ToastType.Info, beep: true });
  }

  private clickLongToast() : void {
    this._toastyService.showToast("Long text", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tincidunt euismod nunc quis suscipit. Curabitur sed semper tortor, at efficitur leo. Sed justo nulla, ullamcorper sed maximus a, vehicula ut nulla. Vivamus lobortis lacinia mi eu ultricies. Suspendisse quis sem ante. Vivamus consectetur lectus eget quam venenatis, sagittis aliquam lectus viverra. Donec nec molestie magna, ut ultricies tellus. Praesent faucibus urna imperdiet vulputate dapibus. Sed sit amet dolor odio. Donec est nulla, cursus sed aliquam at, cursus sit amet turpis. Nulla ut dolor eget dui laoreet hendrerit vel at tellus. Nullam aliquet sem at mauris scelerisque molestie. Nullam imperdiet blandit est et aliquam. Vestibulum euismod, libero id tincidunt rutrum, nulla augue aliquet risus, a rutrum elit orci eget lectus.");
  }

  private clickLoadingToast() {
    this._toastyService.showToast('Wait', 'Process may take a few seconds to complete', { type: ToastType.Custom, loading: true });
  }

  private clickEmojiToast() {
    this._toastyService.showToast('Error', '♥️love emoji toast♥️');
  }

  clickComponentToast() {
    this._toastyService.showToastComponent(ClockComponent, { format: 'HH:mm:ss' }, { sticky: true, customStyle: { "background-color": "#f7f8c5ff" }  }); 
  }

  clickPromiseToast() {
    this._toastyService.showToastPromise('Fetching API', {
      promise: this.simulateApiCall(),
      loading: 'Loading',
      success: (data) => `Ok ${data.name}`,
      error: 'Error'
    });
  }

  simulateApiCall(): Promise<{ name: string }> {
    return new Promise((resolve, reject) =>
      setTimeout(
        () => Math.random() < 0.5 ? resolve({ name: 'Toasty resolved' }) : reject(new Error('Toasty rejected'))
        , 2000)
    );
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }
}

import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
    { path: 'ng-toast-notify', loadComponent: () => import('./ng-toast-notify/ng-toast-notify.component').then(m => m.NgToastNotifyComponent) },

];

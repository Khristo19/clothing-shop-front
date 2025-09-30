// src/app/app.routes.ts
import { Routes } from '@angular/router';
import {LoginComponent} from './auth/login';
import { authGuard, roleGuard } from './core/auth';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', canActivate: [authGuard, roleGuard('admin')], loadComponent: () => import('./dashboard/admin').then(m => m.AdminComponent), children: [
      { path: 'products', loadComponent: () => import('./products/list').then(m => m.ProductsListComponent) },
      { path: 'offers', loadComponent: () => import('./offers/list').then(m => m.OffersListComponent) },
      { path: 'orders', loadComponent: () => import('./orders/list').then(m => m.OrdersListComponent) },
      { path: 'settings', loadComponent: () => import('./settings/settings').then(m => m.SettingsComponent) },
      { path: '', redirectTo: 'products', pathMatch: 'full' },
    ] },
  { path: 'cashier', canActivate: [authGuard, roleGuard('cashier')], loadComponent: () => import('./pos/cashier').then(m => m.CashierComponent) },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

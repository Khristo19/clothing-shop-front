// src/app/app.routes.ts
import { Routes } from '@angular/router';
import {LoginComponent} from './auth/login';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

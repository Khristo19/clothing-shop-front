import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_URL = 'https://clothing-shop-backend.vercel.app';

  // --- SIGNALS ---
  private _token = signal<string | null>(this.getTokenFromStorage());
  readonly token = computed(() => this._token());

  private _role = computed(() => this.decodeRole(this._token()));
  readonly role = computed(() => this._role());

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.API_URL}/login`, { email, password });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
    this._token.set(token);
  }

  getTokenFromStorage(): string | null {
    return localStorage.getItem('token');
  }

  getToken(): string | null {
    return this._token();
  }

  decodeRole(token: string | null): 'admin' | 'cashier' | null {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch {
      return null;
    }
  }

  logout() {
    localStorage.removeItem('token');
    this._token.set(null);
    this.router.navigate(['/login']);
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly BASE = 'https://clothing-shop-backend.vercel.app/api/sales';

  history() { return this.http.get<any[]>(`${this.BASE}/history.js`); }
}



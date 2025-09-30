import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly BASE = 'https://clothing-shop-backend.vercel.app/api/items';

  list() { return this.http.get<any[]>(`${this.BASE}/list.js`); }
  add(payload: { name: string; description?: string; price: number; quantity: number; image_url?: string }) {
    return this.http.post<any>(`${this.BASE}/add.js`, payload);
  }
}



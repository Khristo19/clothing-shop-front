import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class OffersService {
  private readonly http = inject(HttpClient);
  private readonly BASE = 'https://clothing-shop-backend.vercel.app/api/offers';

  list() {
    return this.http.get<any[]>(`${this.BASE}/list.js`);
  }
  create(payload: { from_shop: string; items: any[]; requested_discount: any }) {
    return this.http.post<any>(`${this.BASE}/create.js`, payload);
  }
  updateStatus(payload: { offer_id: number; status: 'approved' | 'rejected' }) {
    return this.http.put<any>(`${this.BASE}/approve.js`, payload);
  }
}




import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly BASE = 'https://clothing-shop-backend.vercel.app/api';

  // Items
  listItems() {
    return this.http.get<any[]>(`${this.BASE}/items/list.js`);
  }
  addItem(payload: { name: string; description?: string; price: number; quantity: number; image_url?: string }) {
    return this.http.post<any>(`${this.BASE}/items/add.js`, payload);
  }

  // Offers
  listOffers() {
    return this.http.get<any[]>(`${this.BASE}/offers/list.js`);
  }
  createOffer(payload: { from_shop: string; items: any[]; requested_discount: any }) {
    return this.http.post<any>(`${this.BASE}/offers/create.js`, payload);
  }
  updateOfferStatus(payload: { offer_id: number; status: 'approved' | 'rejected' }) {
    return this.http.put<any>(`${this.BASE}/offers/approve.js`, payload);
  }

  // Sales / Orders
  submitCart(payload: { items: any[]; total: number; payment_method: 'cash' | 'card-TBC' | 'card-BOG' }) {
    return this.http.post<any>(`${this.BASE}/sales/cart.js`, payload);
  }
  salesHistory() {
    return this.http.get<any[]>(`${this.BASE}/sales/history.js`);
  }
}







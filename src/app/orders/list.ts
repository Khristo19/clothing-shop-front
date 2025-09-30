import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from './orders.service';

type OrderItem = {
  id: number;
  qty: number;
  name?: string | null;
  price?: number | null;
};

type Order = {
  id: number;
  total: number;
  payment_method: string;
  created_at?: string | null;
  cashier_email?: string | null;
  items: OrderItem[];
};

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersListComponent {
  private api = inject(OrdersService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly orders = signal<Order[]>([]);

  constructor() {
    this.load();
  }

  readonly totalRevenue = computed(() =>
    this.orders().reduce((sum, order) => sum + Number(order.total ?? 0), 0)
  );

  readonly latestOrder = computed(() => this.orders()[0]?.created_at ?? null);

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.history().subscribe({
      next: (rows) => {
        const normalized: Order[] = (rows ?? []).map((row: any) => {
          const items: OrderItem[] = Array.isArray(row.items)
            ? row.items.map((item: any) => ({
                id: Number(item.id ?? 0),
                qty: Number(item.qty ?? 0),
                name: item.name ?? null,
                price: item.price != null ? Number(item.price) : null,
              }))
            : [];
          return {
            id: Number(row.id ?? 0),
            total: Number(row.total ?? 0),
            payment_method: row.payment_method ?? 'unknown',
            created_at: row.created_at ?? null,
            cashier_email: row.cashier_email ?? null,
            items,
          };
        });
        this.orders.set(normalized);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Could not load orders');
      },
    });
  }

  readonly trackById = (_: number, order: Order) => order.id;
}

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { OffersService } from './offers.service';

type OfferItem = {
  id: number;
  qty: number;
  name?: string | null;
  price?: number | null;
};

type Offer = {
  id: number;
  from_shop: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string | null;
  updated_at?: string | null;
  requested_discount?: unknown;
  items: OfferItem[];
};

@Component({
  selector: 'app-offers-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './offers-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffersListComponent {
  private offersApi = inject(OffersService);
  private fb = inject(FormBuilder);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly offers = signal<Offer[]>([]);
  readonly showCreate = signal(false);

  readonly form = this.fb.nonNullable.group({
    from_shop: ['', [Validators.required]],
    items: ['[]', [Validators.required]],
    requested_discount: ['{}', [Validators.required]],
  });

  constructor() {
    this.loadOffers();
  }

  readonly totals = computed(() => {
    const all = this.offers();
    return {
      total: all.length,
      pending: all.filter((o) => o.status === 'pending').length,
      approved: all.filter((o) => o.status === 'approved').length,
    };
  });

  loadOffers() {
    this.loading.set(true);
    this.error.set(null);
    this.offersApi.list().subscribe({
      next: (rows) => {
        const normalized: Offer[] = (rows ?? []).map((row: any) => {
          const rawStatus = typeof row.status === 'string' ? row.status.toLowerCase() : '';
          const status: 'pending' | 'approved' | 'rejected' =
            rawStatus === 'approved'
              ? 'approved'
              : rawStatus === 'rejected'
              ? 'rejected'
              : 'pending';
          const items: OfferItem[] = Array.isArray(row.items)
            ? row.items.map((item: any) => ({
                id: Number(item.id ?? 0),
                qty: Number(item.qty ?? 0),
                name: item.name ?? null,
                price: item.price != null ? Number(item.price) : null,
              }))
            : [];
          return {
            id: Number(row.id ?? 0),
            from_shop: row.from_shop ?? 'Unknown shop',
            status,
            created_at: row.created_at ?? null,
            updated_at: row.updated_at ?? null,
            requested_discount: row.requested_discount ?? null,
            items,
          };
        });
        this.offers.set(normalized);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Could not load offers');
      },
    });
  }

  create() {
    if (this.form.invalid) return;
    try {
      const raw = this.form.getRawValue();
      const payload = {
        from_shop: raw.from_shop,
        items: JSON.parse(raw.items),
        requested_discount: JSON.parse(raw.requested_discount),
      };
      this.loading.set(true);
      this.offersApi.create(payload).subscribe({
        next: () => {
          this.showCreate.set(false);
          this.form.reset({ from_shop: '', items: '[]', requested_discount: '{}' });
          this.loadOffers();
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.error?.message || 'Could not create offer');
        },
      });
    } catch (err) {
      this.error.set('Items or discount is not valid JSON');
    }
  }

  updateStatus(id: number, status: 'approved' | 'rejected') {
    this.loading.set(true);
    this.offersApi.updateStatus({ offer_id: id, status }).subscribe({
      next: () => this.loadOffers(),
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Could not update offer');
      },
    });
  }

  readonly trackById = (_: number, o: Offer) => o.id;
}


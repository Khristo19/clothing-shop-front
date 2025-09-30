import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductsService } from './products.service';

type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  quantity: number;
  image_url?: string | null;
  created_at?: string | null;
};

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent {
  private api = inject(ProductsService);
  private fb = inject(FormBuilder);

  readonly items = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly showCreate = signal(false);
  readonly search = signal('');

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    quantity: [0, [Validators.required, Validators.min(0)]],
    image_url: [''],
    description: [''],
  });

  constructor() {
    this.reload();
  }

  readonly filtered = computed(() => {
    const term = (this.search() || '').toLowerCase().trim();
    return this.items().filter((p) => {
      const name = (p.name || '').toLowerCase();
      const description = (p.description || '').toLowerCase();
      return !term || name.includes(term) || description.includes(term);
    });
  });

  readonly totalCount = computed(() => this.items().length);
  readonly lowStockCount = computed(() =>
    this.items().filter((p) => p.quantity < 5).length
  );

  reload() {
    this.loading.set(true);
    this.error.set(null);
    this.api.list().subscribe({
      next: (rows) => {
        const normalized: Product[] = (rows ?? []).map((row: any) => ({
          id: Number(row.id ?? 0),
          name: row.name ?? '',
          description: row.description ?? '',
          price: Number(row.price ?? 0),
          quantity: Number(row.quantity ?? 0),
          image_url: row.image_url ?? null,
          created_at: row.created_at ?? null,
        }));
        this.items.set(normalized);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Could not load products');
      },
    });
  }

  create() {
    if (this.form.invalid) return;
    this.loading.set(true);
    const payload = this.form.getRawValue();
    this.api.add(payload as any).subscribe({
      next: () => {
        this.showCreate.set(false);
        this.form.reset({ name: '', price: 0, quantity: 0, image_url: '', description: '' });
        this.reload();
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Could not create product');
      },
    });
  }

  readonly trackById = (_: number, p: Product) => p.id;
}

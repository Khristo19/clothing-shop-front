import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/auth';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.html',
})
export class AdminComponent {
  private auth = inject(AuthService);
  readonly user = computed(() => this.auth.user());

  logout() {
    this.auth.logout();
  }
}

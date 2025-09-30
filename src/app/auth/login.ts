// src/app/auth/login.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor(private auth: AuthService, private router: Router) {
    // If already logged in, redirect!
    const role = this.auth.role();
    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'cashier') {
      this.router.navigate(['/cashier']);
    }
  }

  onLogin() {
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.email, this.password).subscribe({
      next: (res: { token: string }) => {
        this.auth.saveToken(res.token);
        this.auth.fetchAndSetMe().subscribe(() => {
          const role = this.auth.role();
          if (role === 'admin') this.router.navigate(['/admin']);
          else if (role === 'cashier') this.router.navigate(['/cashier']);
          else this.error.set('Unknown user role');
          this.loading.set(false);
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.message || 'Login failed. Check credentials.'
        );
      },
    });
  }
}

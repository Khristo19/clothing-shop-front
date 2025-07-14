// src/app/auth/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AuthService} from '../core/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        const role = this.auth.decodeRole();
        if (role === 'admin') this.router.navigate(['/admin']);
        else if (role === 'cashier') this.router.navigate(['/cashier']);
        else this.error = 'Unknown user role';
      },
      error: (err) => {
        this.error = 'Login failed. Check credentials.';
        console.error(err);
      }
    });
  }
}

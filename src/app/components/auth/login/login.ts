import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="auth-container">
    <h4>Connexion</h4>
    <form (ngSubmit)="submit()" #f="ngForm">
      <div class="mb-3">
        <input name="email" [(ngModel)]="email" placeholder="Email" class="form-control" required email>
      </div>
      <div class="mb-3">
        <input name="password" [(ngModel)]="password" type="password" placeholder="Mot de passe" class="form-control" required>
      </div>
      <button class="btn btn-primary w-100" [disabled]="loading">Se connecter</button>
    </form>

    <div class="mt-3">
      <a routerLink="/forgot-password">Mot de passe oublié ?</a>
    </div>
  </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router, private toastr: ToastrService) {}

  submit() {
    if (!this.email || !this.password) return;
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          // Sauvegarder le token
          localStorage.setItem('token', res.token);

          this.toastr.success('Connexion réussie');
          // ✅ Redirection vers le dashboard
          this.router.navigate(['/dashboard']);
        } else {
          this.toastr.error(res.message || 'Erreur de connexion');
        }
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err.error?.message || 'Erreur serveur');
      }
    });
  }
}

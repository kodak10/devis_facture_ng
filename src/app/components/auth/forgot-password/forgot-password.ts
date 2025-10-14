// forgot-password.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="auth-container mt-5 mx-auto p-4 card" style="max-width: 400px;">
    <h4 class="text-center mb-4">Mot de passe oublié</h4>

    <form (ngSubmit)="submit()">
      <div class="mb-3">
        <input
          [(ngModel)]="email"
          name="email"
          type="email"
          class="form-control"
          placeholder="Votre email"
          required
        />
      </div>
      <button class="btn btn-primary w-100" [disabled]="loading">
        {{ loading ? 'Envoi...' : 'Envoyer le lien' }}
      </button>
    </form>
  </div>
  `
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  submit() {
    if (!this.email) {
      this.toastr.warning('Veuillez saisir un email.');
      return;
    }

    this.loading = true;
    this.auth.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'Si l’adresse existe, un lien vous a été envoyé.');
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Une erreur est survenue.');
        this.loading = false;
      }
    });
  }
}

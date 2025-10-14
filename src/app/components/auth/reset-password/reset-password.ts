import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="auth-container">
    <h4>Réinitialiser le mot de passe</h4>
    <form (ngSubmit)="submit()">
      <div class="mb-3">
        <input [(ngModel)]="email" name="email" class="form-control" placeholder="Email" required>
      </div>
      <div class="mb-3">
        <input [(ngModel)]="password" name="password" type="password" placeholder="Nouveau mot de passe" class="form-control" required>
      </div>
      <div class="mb-3">
        <input [(ngModel)]="passwordConfirmation" name="passwordConfirmation" type="password" placeholder="Confirmer le mot de passe" class="form-control" required>
      </div>
      <button class="btn btn-primary w-100" [disabled]="loading">Réinitialiser</button>
    </form>
  </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  email = '';
  password = '';
  passwordConfirmation = '';
  loading = false;

  constructor(private route: ActivatedRoute, private auth: AuthService, private toastr: ToastrService, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['token']) this.token = params['token'];
      if (params['email']) this.email = params['email'];
    });
  }

  submit() {
    if (!this.email || !this.token || !this.password) {
      this.toastr.warning('Champs manquants');
      return;
    }
    if (this.password !== this.passwordConfirmation) {
      this.toastr.warning('Les mots de passe ne correspondent pas');
      return;
    }
    this.loading = true;
    this.auth.resetPassword(this.email, this.token, this.password, this.passwordConfirmation).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'Mot de passe réinitialisé');
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Erreur lors de la réinitialisation');
        this.loading = false;
      }
    });
  }
}

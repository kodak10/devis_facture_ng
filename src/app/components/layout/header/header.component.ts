import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngAfterViewInit(): void {
    const toggleBtn = document.getElementById('vertical-menu-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Toggle sidebar
        document.body.classList.toggle('sidebar-enable');
        // Collapse/expand
        document.body.classList.toggle('vertical-collapsed');
      });
    }
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        // Supprime le token local
        localStorage.removeItem('token');
        this.toastr.success('Déconnexion réussie');
        this.router.navigate(['/login']);
      },
      error: () => {
        // Même si erreur côté serveur, on déconnecte localement
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }
}

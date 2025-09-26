import { Component, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'] // corrigé: styleUrls au pluriel
})
export class HeaderComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const toggleBtn = document.getElementById('vertical-menu-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Toggle sidebar
        document.body.classList.toggle('sidebar-enable');
        // Si tu utilises un collapse/expand
        document.body.classList.toggle('vertical-collapsed');
      });
    }
  }
}

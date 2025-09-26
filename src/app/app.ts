import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/layout/header/header.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { SidebarRightComponent } from "./components/layout/sidebarRight/sidebar-right.component";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent, SidebarRightComponent,],
  template: `
    <div id="layout-wrapper">
      <app-header></app-header>
      <app-sidebar></app-sidebar>
      
      <div class="main-content">
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
        <app-footer></app-footer>
      </div>
    </div>

    <app-sidebar-right></app-sidebar-right>
  `
})
export class AppComponent {
  title = 'devis-facture-app';
}
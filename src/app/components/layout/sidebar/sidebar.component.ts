import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import MetisMenu from 'metismenujs';
declare var feather: any; // pour les icônes Feather

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit {

  constructor(private elRef: ElementRef) {}

  ngAfterViewInit(): void {
    // Initialisation de MetisMenu pour les dropdowns
    const menuEl = this.elRef.nativeElement.querySelector('#side-menu');
    if (menuEl) {
      new MetisMenu(menuEl);
    }

    // Remplacement des icônes Feather
    if (feather) {
      feather.replace();
    }
  }
}

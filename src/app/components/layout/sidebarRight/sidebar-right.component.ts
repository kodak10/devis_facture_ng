import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import MetisMenu from 'metismenujs';
declare var feather: any; // pour les icônes Feather

@Component({
  selector: 'app-sidebar-right',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar-right.component.html',
  styleUrls: ['./sidebar-right.component.scss']
})
export class SidebarRightComponent implements AfterViewInit {

  constructor(private elRef: ElementRef) {}

  ngAfterViewInit(): void {
    // Initialisation de MetisMenu
    const menuEl = this.elRef.nativeElement.querySelector('#side-menu');
    if (menuEl) {
      new MetisMenu(menuEl);
    }

    // Remplacer les icônes Feather
    if (feather) {
      feather.replace();
    }
  }
}

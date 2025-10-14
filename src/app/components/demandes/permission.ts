import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { permissionsService, Permissions } from '../../services/permissions.service';

declare var $: any;

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './permission.html',
  styleUrls: ['./permission.scss']
})
export class PermissionsComponent implements OnInit {
  permissions: Permissions[] = [];
  selectedPermission: Permissions = {} as Permissions;
  formPermission: Permissions = {} as Permissions;
  dateRepriseMessage: string = '';
  errors: any = {};
  isPartiel: boolean = false;

  // Exemple de jours fériés (à adapter à ton pays)
  joursFeries: string[] = [
    '2025-01-01',
    '2025-04-21',
    '2025-05-01',
    '2025-05-29',
    '2025-06-09',
    '2025-07-14',
    '2025-08-07',
    '2025-11-01',
    '2025-12-25',
    // 2026
    '2026-01-01',
    '2026-04-21',
    '2026-05-01',
    '2026-05-29',
    '2026-06-09',
    '2026-07-14',
    '2026-08-07',
    '2026-11-01',
    '2026-12-25',
    // 2027
    '2027-01-01',
    '2027-04-21',
    '2027-05-01',
    '2027-05-29',
    '2027-06-09',
    '2027-07-14',
    '2027-08-07',
    '2027-11-01',
    '2027-12-25',
    // 2028
    '2028-01-01',
    '2028-04-21',
    '2028-05-01',
    '2028-05-29',
    '2028-06-09',
    '2028-07-14',
    '2028-08-07',
    '2028-11-01',
    '2028-12-25'
  ];


  constructor(private permissionsService: permissionsService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.permissionsService.getPermissions().subscribe({
      next: (res) => {
        this.permissions = res.data ?? res;
        this.initDataTable();
      }
    });
  }

  initDataTable() {
    setTimeout(() => {
      if ($.fn.DataTable.isDataTable('#datatable')) {
        $('#datatable').DataTable().destroy();
      }
      $('#datatable').DataTable({
        responsive: true
      });
    }, 0);
  }

  openModal(content: any, permission: Permissions | null = null) {
    this.selectedPermission = permission ? { ...permission } : {} as Permissions;
    this.formPermission = { ...this.selectedPermission };
    this.modalService.open(content, { size: 'lg' });
    this.errors = {};
    this.isPartiel = this.formPermission.motif === 'Congés partiel';
  }

  onTypeChange(event: any) {
    const type = event.target.value;
    this.isPartiel = type === 'Congés partiel';

    if (!this.isPartiel) {
      this.formPermission.nombre_de_jours = 30;
      this.updateDateFin();
    } else {
      this.formPermission.nombre_de_jours = undefined; // forcera la saisie manuelle
    }
  }

  updateDateFin() {
    if (!this.formPermission.date_depart || !this.formPermission.motif) return;

    // Détermine le nombre de jours selon le motif choisi
    const selectElement = document.getElementById('motif') as HTMLSelectElement;
    const selectedOption = selectElement?.selectedOptions[0];
    const joursAttribues = selectedOption ? parseInt(selectedOption.getAttribute('data-nombre') || '1', 10) : 1;

    let dateFin = new Date(this.formPermission.date_depart);
    let joursAjoutes = 0;

    // Boucle jusqu’à ce qu’on ait ajouté le bon nombre de jours ouvrés (hors jours fériés)
    while (joursAjoutes < joursAttribues) {
      dateFin.setDate(dateFin.getDate() + 1);
      const jourISO = this.formatDate(dateFin);

      // On ajoute un jour seulement si ce n’est pas un jour férié
      if (!this.joursFeries.includes(jourISO)) {
        joursAjoutes++;
      }
    }

    this.formPermission.date_fin = this.formatDate(dateFin);

    // Calcul de la date de reprise (le jour suivant la fin)
    let dateReprise = new Date(dateFin);
    dateReprise.setDate(dateReprise.getDate() + 1);

    // Sauter les jours fériés pour la reprise
    while (this.joursFeries.includes(this.formatDate(dateReprise))) {
      dateReprise.setDate(dateReprise.getDate() + 1);
    }

    // Message à afficher
  this.dateRepriseMessage = `🗓️ Vous reprenez le service le ${this.formatDate(dateReprise)}.`;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  savePermission(formData: any) {
  const payload = { ...this.selectedPermission, ...formData };

  const request = this.selectedPermission.id
    ? this.permissionsService.updatePermissions(payload)
    : this.permissionsService.createPermissions(payload);

  request.subscribe({
    next: () => {
      // Fermer la modal
      this.modalService.dismissAll();

      // Recharger la liste
      this.loadClients();

      // Réinitialiser les erreurs
      this.errors = {};
    },
    error: (err) => {
      this.errors = err.error.errors;
    }
  });
}


  deletePermission(id?: number) {
    if (!id) return;
    if (!confirm('Voulez-vous supprimer ce client ?')) return;
    this.permissionsService.deletePermissions(id).subscribe(() => this.loadClients());
  }
}

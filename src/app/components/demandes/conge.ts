import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CongerService, Congers } from '../../services/conges.service';

declare var $: any;

@Component({
  selector: 'app-conges',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './conge.html',
  styleUrls: ['./conge.scss']
})
export class CongerComponent implements OnInit {
  conges: any[] = [];
  selectedConger: Congers = {} as Congers;
  formConger: Congers = {} as Congers;
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


  constructor(private congerService: CongerService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.congerService.getCongers().subscribe({
      next: (res) => {
        this.conges = res.data ?? res;
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

  openModal(content: any, conger: Congers | null = null) {
    this.selectedConger = conger ? { ...conger } : {} as Congers;
    this.formConger = { ...this.selectedConger };
    this.modalService.open(content, { size: 'lg' });
    this.errors = {};
    this.isPartiel = this.formConger.motif === 'Congés partiel';
  }

  onTypeChange(event: any) {
    const type = event.target.value;
    this.isPartiel = type === 'Congés partiel';

    if (!this.isPartiel) {
      this.formConger.nombre_de_jours = 30;
      this.updateDateFin();
    } else {
      this.formConger.nombre_de_jours = undefined; // forcera la saisie manuelle
    }
  }

  updateDateFin() {
    if (!this.formConger.date_depart) return;

    let jours = this.formConger.nombre_de_jours;
    if (!jours) {
      jours = this.isPartiel ? 1 : 30; // par défaut 1 jour si partiel, sinon 30
    }

    let dateFin = new Date(this.formConger.date_depart);
    let joursAjoutes = 0;

    while (joursAjoutes < jours) {
      dateFin.setDate(dateFin.getDate() + 1);
      const jourISO = dateFin.toISOString().split('T')[0];
      const jourSemaine = dateFin.getDay();

      // exclure uniquement les jours fériés, pas les week-ends
      if (!this.joursFeries.includes(jourISO)) {
        joursAjoutes++;
      }
    }

    this.formConger.date_fin = this.formatDate(dateFin);

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

  saveConger(formData: any) {
  const payload = { ...this.selectedConger, ...formData };

  const request = this.selectedConger.id
    ? this.congerService.updateCongers(payload)
    : this.congerService.createCongers(payload);

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

  loadConges() {
    this.congerService.getCongers().subscribe((data: any) => {
      this.conges = data;
    });
  }

  updateStatut(congesId: number, statut: number) {
    this.congerService.updateStatutCongers(congesId, statut).subscribe(() => {
      this.loadConges();
    });
  }

  hasPendingRequests(): boolean {
    return this.conges?.some(c => c.statut === 0);
  }

  deleteConger(id?: number) {
    if (!id) return;
    if (!confirm('Voulez-vous supprimer ce client ?')) return;
    this.congerService.deleteCongers(id).subscribe(() => this.loadClients());
  }
}

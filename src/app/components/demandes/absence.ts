import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AbsenceService, Absence } from '../../services/absence.service';

declare var $: any;

@Component({
  selector: 'app-absence',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './absence.html',
  styleUrls: ['./absence.scss']
})
export class AbsenceComponent implements OnInit {
  absences: any[] = [];
  selectedAbsence: Absence = {} as Absence;
  formAbsence: Absence = {} as Absence;
  errors: any = {};

  constructor(private absenceService: AbsenceService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.absenceService.getAbsences().subscribe({
      next: (res) => {
        this.absences = res.data ?? res;
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

  openModal(content: any, absence: Absence | null = null) {
    this.selectedAbsence = absence ? { ...absence } : {} as Absence;
    this.formAbsence = { ...this.selectedAbsence };
    this.modalService.open(content, { size: 'lg' });
    this.errors = {};
  }

  saveAbsence(formData: any) {
  const payload = { ...this.selectedAbsence, ...formData };

  const request = this.selectedAbsence.id
    ? this.absenceService.updateAbsences(payload)
    : this.absenceService.createAbsences(payload);

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

  loadAbscence() {
    this.absenceService.getAbsences().subscribe((data: any) => {
      this.absences = data;
    });
  }

  updateStatut(AbsenceId: number, statut: number) {
    this.absenceService.updateStatutAbsences(AbsenceId, statut).subscribe(() => {
      this.loadAbscence();
    });
  }

  hasPendingRequests(): boolean {
    return this.absences?.some(a => a.statut === 0);
  }

  deleteAbsence(id?: number) {
    if (!id) return;
    if (!confirm('Voulez-vous supprimer ce client ?')) return;
    this.absenceService.deleteAbsences(id).subscribe(() => this.loadClients());
  }
}

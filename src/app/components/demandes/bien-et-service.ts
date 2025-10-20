import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DemandeService, Demande } from '../../services/demande.service';

declare var $: any;

@Component({
  selector: 'app-bien-et-service',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './bien-et-service.html',
  styleUrls: ['./bien-et-service.scss']
})
export class Bien_et_ServiceComponent implements OnInit {
Number(arg0: string|undefined) {
throw new Error('Method not implemented.');
}
  demandes: any[] = [];
  selectedDemande: Demande = {} as Demande;
  formDemande: Demande = {} as Demande;
  errors: any = {};

  constructor(private demandeService: DemandeService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadClients();
    this.loadDemandes();
  }

  loadClients() {
    this.demandeService.getDemandes().subscribe({
      next: (res) => {
        this.demandes = res.data ?? res;
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

  openModal(content: any, demande: Demande | null = null) {
    this.selectedDemande = demande ? { ...demande } : {} as Demande;
    this.formDemande = { ...this.selectedDemande };
    this.modalService.open(content, { size: 'lg' });
    this.errors = {};
  }

  saveDemande(formData: any) {
    const payload = { ...this.selectedDemande, ...formData };

    const request = this.selectedDemande.id
      ? this.demandeService.updateDemandes(payload)
      : this.demandeService.createDemandes(payload);

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



  loadDemandes() {
    this.demandeService.getDemandes().subscribe((data: any) => {
      this.demandes = data;
    });
  }

  updateStatut(demandeId: number, statut: number) {
    this.demandeService.updateStatutDemandes(demandeId, statut).subscribe(() => {
      this.loadDemandes();
    });
  }

  hasPendingRequests(): boolean {
    return this.demandes?.some(d => d.statut === 0);
  }

  deleteDemande(id?: number) {
    if (!id) return;
    if (!confirm('Voulez-vous supprimer cette demande ?')) return;
    this.demandeService.deleteDemandes(id).subscribe(() => this.loadClients());
  }
}

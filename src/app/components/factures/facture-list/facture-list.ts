import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterEvent, RouterModule } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { FactureService, Facture } from '../../../services/factures.service';
import $ from 'jquery';
import 'datatables.net';

@Component({
  selector: 'app-facture-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule, RouterModule],
  templateUrl: './facture-list.html',
  styleUrls: ['./facture-list.scss']
})
export class FactureListComponent implements OnInit, OnDestroy {
  factures: Facture[] = [];
  selectedFacture: Facture = {} as Facture;
  dataTable: any;
  motifRefus = '';

  constructor(
    private facturesService: FactureService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadFactures();
  }

  ngOnDestroy(): void {
    if (this.dataTable) this.dataTable.destroy(true);
  }

  /** 🔹 Charger la liste des factures */
  loadFactures(): void {
    this.facturesService.getFactures().subscribe({
      next: (res) => {
        this.factures = res;

        // ⚙️ Réinitialisation du DataTable
        setTimeout(() => {
          if ($.fn.DataTable.isDataTable('#factureTable')) {
            $('#factureTable').DataTable().clear().destroy();
          }
          $('#factureTable').DataTable({
            language: { url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/French.json' },
            pageLength: 10,
            lengthMenu: [10, 25, 50, 100],
            order: [[0, 'desc']],
            columnDefs: [{ orderable: false, targets: -1 }]
          });
        }, 0);
      },
      error: () => this.toastr.error('Erreur lors du chargement des factures.', 'Erreur')
    });
  }

  /** 🔹 Ouvrir une modale pour créer ou éditer */
  openModal(content: any, facture: Facture | null = null): void {
    this.selectedFacture = facture ? { ...facture } : {} as Facture;
    this.modalService.open(content, { size: 'lg' });
  }

  /** 🔹 Sauvegarder une facture (création ou mise à jour) */
  saveFacture(formData: any): void {
    const payload = { ...this.selectedFacture, ...formData };

    const obs = this.selectedFacture.id
      ? this.facturesService.updateFacture(payload)
      : this.facturesService.createFacture(payload);

    obs.subscribe({
      next: () => {
        this.modalService.dismissAll();
        this.loadFactures();
        this.toastr.success(
          this.selectedFacture.id ? 'Facture mise à jour avec succès !' : 'Facture créée avec succès !',
          'Succès'
        );
      },
      error: () => this.toastr.error('Erreur lors de l’enregistrement.', 'Erreur')
    });
  }

  validateFacture(id?: number) {
    if (!id) return;
    if (!confirm('Voulez-vous Valider cette facture ?')) return;

    this.facturesService.validateFacture(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success(res.message, 'Succès');
        } else {
          this.toastr.warning(res.message, 'Attention');
        }

       this.loadFactures();
        this.toastr.success(
          this.selectedFacture.id ? 'Facture validé avec succès !' : 'Facture créée avec succès !',
          'Succès'
        );
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(err.error?.message || 'Erreur serveur', 'Erreur');
      }
    });
  }

   openRefusModal(content: any, facture: Facture): void {
      this.selectedFacture = facture;
      this.motifRefus = '';
      this.modalService.open(content, { centered: true });
  }

  refuserFacture(modal: any) {
    if (!this.selectedFacture) return;

    const id = this.selectedFacture.id;

    if (!this.motifRefus || this.motifRefus.trim() === '') {
      this.toastr.warning('Veuillez saisir un motif de refus', 'Attention');
      return;
    }

    this.facturesService.refuseFacture(id, this.motifRefus).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success(res.message, 'Succès');
          modal.close();
          this.loadFactures(); // recharge la liste
        } else {
          this.toastr.warning(res.message, 'Attention');
        }
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(err.error?.message || 'Erreur serveur', 'Erreur');
      }
    });
  }

  /** 🔹 Supprimer une facture */
  deleteFacture(id?: number): void {
    if (!id) return;
    if (!confirm('Voulez-vous vraiment supprimer cette facture ?')) return;

    this.facturesService.deleteFacture(id).subscribe({
      next: () => {
        this.factures = this.factures.filter(f => f.id !== id);
        this.toastr.success('Facture supprimée avec succès.', 'Succès');
      },
      error: () => this.toastr.error('Erreur lors de la suppression.', 'Erreur')
    });
  }

  /** 🔹 Ouvrir le PDF */
  getPdfUrl(id: number): void {
    this.facturesService.getPdfUrl(id);
  }

  openDevisPdf(devisId: number): void {
    this.facturesService.openDevisUrl(devisId);
  }

  /** 🔹 Style du badge de statut */
  // getStatusBadgeClass(status: string): string {
  //   switch (status?.toLowerCase()) {
  //     case 'Encaissé':
  //       return 'bg-success';
  //     case 'Approuvé':
  //       return 'bg-warning text-dark';
  //     case 'Non approuvé':
  //       return 'bg-danger';
  //     default:
  //       return 'bg-secondary';
  //   }
  // }

  getStatusBadgeClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'Encaissé': 'bg-success',
      'Approuvé': 'bg-warning text-dark',
      'Refusé': 'bg-danger',
      'Non approuvé': 'bg-info',
    };
    
    return statusClasses[status] || 'bg-secondary';
  }
}



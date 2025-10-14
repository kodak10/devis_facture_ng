import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FactureService } from '../../../services/factures.service';
import { DevisService } from '../../../services/devis.service';

@Component({
  selector: 'app-facture-paiement',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './facture-paiement.html'
})
export class FacturePaiementComponent implements OnInit {
  facturesApprouvees: any[] = [];
  isLoading = false;

  selectedFacture: any;
  paiementMontant = 0;
  historiquePaiements: any[] = [];

  constructor(
    private factureService: FactureService,
    private devisService: DevisService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadFacturesApprouvees();
  }

  loadFacturesApprouvees(): void {
    this.isLoading = true;
    this.factureService.getFactures().subscribe({
      next: (data: any[]) => {
        this.facturesApprouvees = data.filter(f => f.status === 'Approuvé');

        // Calculer le cumul des paiements pour chaque facture
        this.facturesApprouvees.forEach(f => {
          if (f.paiements && f.paiements.length > 0) {
            f.montant_paye = f.paiements.reduce((sum: number, p: any) => sum + parseFloat(p.montant), 0);
          } else {
            f.montant_paye = 0;
          }
          f.isSolde = f.montant_paye >= f.total_ttc; // True si soldé
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.toastr.error('Erreur lors du chargement des factures', 'Erreur');
      }
    });
  }


  openFacturePdf(factureId: number) {
    this.factureService.getPdfUrl(factureId);
  }

  openDevisPdf(devis_id: number) {
    this.devisService.getPdfUrl(devis_id);
  }

  openPaiementModal(content: any, facture: any) {
    this.selectedFacture = facture;
    this.paiementMontant = 0;
    this.modalService.open(content, { centered: true });
  }

  ajouterPaiement(modal: any) {
    if (this.paiementMontant <= 0) {
      this.toastr.warning('Veuillez saisir un montant valide');
      return;
    }

    // ⚡ Appel API backend via FactureService pour enregistrer le paiement
    this.factureService.ajouterPaiement(this.selectedFacture.id, this.paiementMontant)
      .subscribe({
        next: (res) => {
          this.toastr.success('Paiement enregistré avec succès');
          modal.close();
          // Optionnel : rafraîchir l'historique ou la liste
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Erreur lors de l\'enregistrement du paiement');
        }
      });
  }

  openHistoriqueModal(content: any, facture: any) {
    this.selectedFacture = facture;
    // ⚡ récupérer l'historique via FactureService
    this.factureService.getHistoriquePaiements(facture.id)
    .subscribe({
      next: (res: any) => {
        this.historiquePaiements = res.data; // ⚡ utiliser res.data
        this.modalService.open(content, { size: 'lg', centered: true });
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Erreur lors du chargement de l\'historique des paiements');
      }
    });

  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'approuvé': return 'bg-primary';
      case 'encaissé': return 'bg-success';
      default: return 'bg-secondary';
    }
  }
}

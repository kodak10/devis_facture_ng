import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DevisService, Devis } from '../../../services/devis.service';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-facture-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgbModalModule],
  templateUrl: './facture-create.html'
})
export class FactureCreateComponent implements OnInit {
  devisEnvoyes: Devis[] = [];
  isLoading = false;
  selectedDevis?: Devis;
  motifRefus = '';

  constructor(
    private devisService: DevisService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadDevisEnvoyes();
  }

  loadDevisEnvoyes(): void {
    this.isLoading = true;
    this.devisService.getDevis().subscribe({
      next: (data: any) => {
        this.devisEnvoyes = data.filter((d: any) => d.status === 'Envoyé');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur chargement devis:', error);
        this.isLoading = false;
      }
    });
  }

  openPdf(devisId: number): void {
    this.devisService.getPdfUrl(devisId);
  }

  openRefusModal(content: any, devis: Devis): void {
    this.selectedDevis = devis;
    this.motifRefus = '';
    this.modalService.open(content, { centered: true });
  }

  refuserProforma(modal: any) {
    if (!this.selectedDevis) return;

    const id = this.selectedDevis.id;

    if (!this.motifRefus || this.motifRefus.trim() === '') {
      this.toastr.warning('Veuillez saisir un motif de refus', 'Attention');
      return;
    }

    this.devisService.refuseProforma(id, this.motifRefus).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success(res.message, 'Succès');
          modal.close();
          this.loadDevisEnvoyes(); // recharge la liste
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


  goToFacturePartielle(id: number) {
    window.location.href = `/factures/create/partielle/${id}`;
  }

  goToFactureTotale(id: number) {
    window.location.href = `/factures/create/totale/${id}`;
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'payée':
        return 'bg-success';
      case 'en attente':
      case 'en attente du daf':
        return 'bg-warning text-dark';
      case 'rejetée':
      case 'annulée':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}

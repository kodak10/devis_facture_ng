import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FactureService, FactureCreate } from '../../../services/factures.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-facture-create-totale',
  imports: [CommonModule, FormsModule, RouterModule, DecimalPipe, ],
  templateUrl: './facture-create-totale.html'
})
export class FactureCreateTotaleComponent implements OnInit {
  devis: any;
  isLoading = false;
  totalMontant = 0;

  factureData: FactureCreate = {
    devis_id: 0,
    banque_id: 0,
    client_id: 0,
    num_bc: '',
    num_rap: '',
    num_bl: '',
    remise_speciale: '0',
    type_facture: 'Totale',
    net_a_payer: 0,
    montant: 0,
    selected_items: [],
    libelle: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private factureService: FactureService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const devisId = this.route.snapshot.paramMap.get('id');
    if (devisId) {
      this.loadDevis(parseInt(devisId));
    }
  }

  loadDevis(id: number): void {
    this.isLoading = true;
    this.factureService.getDevisById(id).subscribe({
      next: (devis) => {
        this.devis = devis;
        this.factureData.devis_id = devis.id;
        this.factureData.banque_id = devis.banque_id;
        this.factureData.client_id = devis.client_id;
        this.factureData.montant = devis.total_ttc;
        this.factureData.net_a_payer = devis.total_ttc;
        this.totalMontant = devis.total_ttc;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du devis:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    // 🔹 Vérification simple (ex: montant ou devis manquant)
    if (!this.devis || !this.factureData.devis_id) {
      this.toastr.error('La Proforma est introuvable ou invalide.', 'Erreur de validation');
      return;
    }

    this.isLoading = true;

    const payload = {
      ...this.factureData,
      type_facture: 'Totale', // ✅ forcer le type
      montant: this.devis.total_ttc,
      libelle: this.factureData.libelle,
      net_a_payer: this.devis.total_ttc - (parseFloat(this.factureData.remise_speciale) || 0)
    };

    this.factureService.createFactureTotale(payload).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.toastr.success('Facture totale créée avec succès !', 'Succès');

        // ✅ Ouvre le PDF dans un nouvel onglet si l’API le renvoie
        if (response.pdf_url) {
          window.open(response.pdf_url, '_blank');
        }

        // 🔹 Retour à la liste après ouverture du PDF
        this.router.navigate(['/factures/create']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur lors de la création:', error);
        this.toastr.error('Erreur lors de la création de la facture.', 'Erreur');
      }
    });
  }

  openDevisPdf(): void {
    if (this.devis?.id) {
      this.factureService.getDevisPdfUrl(this.devis.id);
    }
  }
}

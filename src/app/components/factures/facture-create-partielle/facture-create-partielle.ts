// facture-create-partielle.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FactureService, FactureCreate, DevisLigne } from '../../../services/factures.service';

@Component({
  imports: [CommonModule, FormsModule, RouterModule, DecimalPipe],
  selector: 'app-facture-create-partielle',
  templateUrl: './facture-create-partielle.html'
})
export class FactureCreatePartielleComponent implements OnInit {
  devis: any;
  isLoading = false;
  selectedItems: number[] = [];
  totalMontant = 0;

  factureData: FactureCreate = {
    devis_id: 0,
    banque_id: 0,
    client_id: 0,
    num_bc: '',
    num_rap: '',
    num_bl: '',
    remise_speciale: '0',
    type_facture: 'Partielle',
    net_a_payer: 0,
    montant: 0,
    selected_items: [],
    libelle: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private factureService: FactureService
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
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du devis:', error);
        this.isLoading = false;
      }
    });
  }

  onItemSelectionChange(itemId: number, event: any): void {
    const isChecked = event.target.checked;
    const item = this.devis.lignes.find((l: DevisLigne) => l.id === itemId);
    
    if (isChecked) {
      this.selectedItems.push(itemId);
      this.totalMontant += item.total;
    } else {
      this.selectedItems = this.selectedItems.filter(id => id !== itemId);
      this.totalMontant -= item.total;
    }
    
    this.factureData.selected_items = this.selectedItems;
    this.factureData.montant = this.totalMontant * (1 + (this.devis.tva / 100));
    this.factureData.net_a_payer = this.factureData.montant;
  }

  onSubmit(): void {
    if (this.selectedItems.length === 0) {
      alert('Veuillez sélectionner au moins un élément');
      return;
    }

    this.isLoading = true;
    this.factureService.createFacturePartielle(this.factureData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/factures']).then(() => {
          alert('Facture partielle créée avec succès!');
        });
      },
      error: (error) => {
        console.error('Erreur lors de la création:', error);
        this.isLoading = false;
        alert('Erreur lors de la création de la facture');
      }
    });
  }

  openDevisPdf(): void {
    if (this.devis?.id) {
      this.factureService.getDevisPdfUrl(this.devis.id);
    }
  }
}
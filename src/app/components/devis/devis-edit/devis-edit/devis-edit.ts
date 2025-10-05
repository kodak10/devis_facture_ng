import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DevisService, Devis } from '../../../../services/devis.service';
import { DeviseService, Devise, TauxChange } from '../../../../services/devise.service';
import { ClientService, Client } from '../../../../services/client.service';
import { DesignationService, Designation } from '../../../../services/designation.service';
import { BanqueService, Banque } from '../../../../services/banque.service';

// Fonction round helper
function round(value: number, decimals: number = 2): number {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
}

@Component({
  selector: 'app-devis-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './devis-edit.html',
  styleUrls: ['./devis-edit.scss']
})
export class DevisEditComponent implements OnInit {
  devisId!: number;
  devis: Devis = {} as Devis;

  // Wizard
  step = 1;

  // Propriétés pour les devises
  devises: Devise[] = [];
  tauxChange: TauxChange = {};
  deviseDepart: string = 'XOF';
  tauxAuto: boolean = true;
  
  // Propriétés devis
  devise: string = 'XOF';
  taux: number = 1;

  // Champs du devis avec validation
  dateEcheance: string = '';
  dateDemission: string = '';
  clientId: number | null = null;
  banqueId: number | null = null;
  tva: number = 18;
  tvaActive: boolean = true;
  commande: number = 0;
  livraison: number = 0;
  validiteOffre: number = 30;
  delaiType: string = 'jours';
  delaiJours: number = 0;
  delaiDe: number = 0;
  delaiA: number = 0;
  
  // Totaux
  totalHT: number = 0;
  totalTVA: number = 0;
  totalTTC: number = 0;
  acompte: number = 0;
  solde: number = 0;

  // Lignes
  lignes: { 
    designationId?: number; 
    quantite?: number; 
    prix?: number;
    remise?: number;
    prixNet?: number;
    total?: number;
  }[] = [];

  // Données pour selects
  clients: Client[] = [];
  banques: Banque[] = [];
  designations: Designation[] = [];

  // Validation
  errors: any = {};
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private devisService: DevisService,
    private deviseService: DeviseService,
    private toastr: ToastrService,
    private clientService: ClientService,
    private designationService: DesignationService,
    private banqueService: BanqueService
  ) {}

  ngOnInit(): void {
    this.devisId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDevis();
    this.loadClients();
    this.loadBanques();
    this.loadDesignations();
    this.loadDevises();
  }

  loadDevis() {
    this.isLoading = true;
    
    // Une seule requête pour tout charger
    this.devisService.getDevisById(this.devisId).subscribe({
      next: (devis: Devis) => {
        console.log('Devis complet chargé:', devis);
        this.devis = devis;
        this.populateForm();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur chargement devis:', error);
        this.toastr.error('Erreur lors du chargement du devis', 'Erreur');
        this.isLoading = false;
      }
    });
  }

 // Dans devis-edit.component.ts
populateForm() {
  console.log('Devis reçu:', this.devis);
  console.log('Lignes reçues:', this.devis.lignes);

  // Remplir tous les champs du formulaire avec des valeurs par défaut sécurisées
  this.dateEcheance = this.formatDateForInput(this.devis.date_echeance) || '';
  this.dateDemission = this.formatDateForInput(this.devis.date_emission) || '';
  this.clientId = this.devis.client_id || null;
  this.banqueId = this.devis.banque_id || null;
  this.devise = this.devis.devise || 'XOF';
  this.taux = Number(this.devis.taux) || 1;
  this.tva = Number(this.devis.tva) || 18;
  this.tvaActive = Number(this.devis.tva) > 0;
  this.commande = Number(this.devis.commande) || 0;
  this.livraison = Number(this.devis.livraison) || 0;
  this.validiteOffre = Number(this.devis.validite) || 30;
  this.delaiType = this.devis.delai_type || 'jours';
  this.delaiJours = Number(this.devis.delai_jours) || 0;
  this.delaiDe = Number(this.devis.delai_de) || 0;
  this.delaiA = Number(this.devis.delai_a) || 0;
  
  // Charger les lignes directement depuis this.devis.lignes
  if (this.devis.lignes && this.devis.lignes.length > 0) {
    console.log('Lignes chargées depuis devis:', this.devis.lignes);
    this.lignes = this.devis.lignes.map(ligne => ({
      designationId: ligne.designation_id,
      quantite: Number(ligne.quantite) || 1,
      prix: Number(ligne.prix_unitaire) || 0,
      remise: Number(ligne.remise) || 0,
      prixNet: Number(ligne.prix_net) || 0,
      total: Number(ligne.total) || 0
    }));
  } else {
    console.warn('Aucune ligne trouvée dans le devis');
    this.lignes = [];
  }

  console.log('Lignes transformées:', this.lignes);
  this.calculateTotals();
}

// Ajouter cette méthode pour formater les dates
formatDateForInput(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Erreur formatage date:', error);
    return '';
  }
}

  loadDevises() {
    this.deviseService.getDevises().subscribe({
      next: (res) => {
        this.devises = res;
      },
      error: (error: any) => {
        console.error('Erreur chargement devises:', error);
      }
    });
  }

  loadTauxChange() {
    this.deviseService.getTauxChange().subscribe({
      next: (res) => {
        this.tauxChange = res;
        this.calculateTaux();
      },
      error: (error: any) => {
        console.error('Erreur chargement taux:', error);
      }
    });
  }

  onDeviseChange() {
    if (this.tauxAuto) {
      this.calculateTaux();
    }
    this.calculateTotals();
  }

  onDeviseDepartChange() {
    if (this.tauxAuto) {
      this.calculateTaux();
    }
  }

  calculateTaux() {
    if (this.deviseDepart === this.devise) {
      this.taux = 1;
      return;
    }

    const taux = this.tauxChange[this.devise];
    if (taux) {
      this.taux = taux;
    } else {
      this.taux = 1;
    }

    this.updateAllPricesWithTaux();
  }

  updateAllPricesWithTaux() {
    this.lignes.forEach(ligne => {
      if (ligne.designationId) {
        const designation = this.designations.find(d => d.id === ligne.designationId);
        if (designation && designation.prix_unitaire) {
          ligne.prix = this.calculatePriceWithTaux(designation.prix_unitaire);
          this.calculateLineTotal(ligne);
        }
      }
    });
    this.calculateTotals();
  }

  getTauxDisplay(): string {
    if (this.deviseDepart === this.devise) {
      return `1 ${this.deviseDepart} = 1 ${this.devise}`;
    }
    
    if (this.taux && this.taux !== 0) {
      const tauxInverse = 1 / this.taux;
      return `1 ${this.devise} = ${tauxInverse.toFixed(2)} ${this.deviseDepart}`;
    }
    
    return `1 ${this.deviseDepart} = ${this.taux} ${this.devise}`;
  }

  onDesignationChange(ligne: any, index: number) {
    if (ligne.designationId) {
      const designation = this.designations.find(d => d.id === ligne.designationId);
      if (designation && designation.prix_unitaire) {
        ligne.prix = this.calculatePriceWithTaux(designation.prix_unitaire);
        this.calculateLineTotal(ligne);
        this.calculateTotals();
      }
    }
    this.errors[`ligne_${index}_designation`] = '';
  }

  calculatePriceWithTaux(prixOriginal: number): number {
    if (this.deviseDepart === this.devise) {
      return prixOriginal;
    }
    return prixOriginal * this.taux;
  }

  loadClients() {
    this.clientService.getClients().subscribe(res => this.clients = res);
  }

  loadBanques() {
    this.banqueService.getBanques().subscribe(res => this.banques = res);
  }

  loadDesignations() {
    this.designationService.getDesignations().subscribe(res => this.designations = res.data ?? res);
  }

  addLine() {
    this.lignes.push({ quantite: 1, remise: 0, prix: 0, prixNet: 0, total: 0 });
  }

  removeLine(index: number) {
    this.lignes.splice(index, 1);
    this.calculateTotals();
  }

  validateStep1(): boolean {
    this.errors = {};

    if (!this.dateEcheance) {
      this.errors.dateEcheance = 'La date d\'échéance est obligatoire';
    }

    if (!this.clientId) {
      this.errors.clientId = 'Le client est obligatoire';
    }

    if (this.lignes.length === 0) {
      this.errors.lignes = 'Au moins une ligne est requise';
    }

    this.lignes.forEach((ligne, index) => {
      if (!ligne.designationId) {
        this.errors[`ligne_${index}_designation`] = 'La désignation est obligatoire';
      }
      if (!ligne.quantite || ligne.quantite <= 0) {
        this.errors[`ligne_${index}_quantite`] = 'La quantité doit être supérieure à 0';
      }
      if (!ligne.prix || ligne.prix < 0) {
        this.errors[`ligne_${index}_prix`] = 'Le prix doit être positif';
      }
    });

    return Object.keys(this.errors).length === 0;
  }

  nextStep() {
    if (this.step === 1) {
      if (!this.validateStep1()) {
        this.toastr.error('Veuillez corriger les erreurs dans le formulaire', 'Erreur de validation');
        return;
      }
      this.calculateTotals();
    }
    this.step++;
  }

  previousStep() {
    this.step--;
  }

  calculateLineTotal(ligne: any): number {
    const quantite = ligne.quantite || 0;
    const prix = ligne.prix || 0;
    const remise = ligne.remise || 0;
    
    const prixNet = prix * (1 - remise / 100);
    ligne.prixNet = this.devise === 'XOF' ? Math.round(prixNet) : Number(prixNet.toFixed(2));
    
    const total = quantite * prixNet;
    ligne.total = this.devise === 'XOF' ? Math.round(total) : Number(total.toFixed(2));
    
    return ligne.total;
  }

  calculateTotals() {
    this.totalHT = this.lignes.reduce((sum, ligne) => sum + (this.calculateLineTotal(ligne) || 0), 0);
    this.totalHT = this.devise === 'XOF' ? Math.round(this.totalHT) : Number(this.totalHT.toFixed(2));

    this.totalTVA = this.tvaActive ? (this.totalHT * this.tva) / 100 : 0;
    this.totalTVA = this.devise === 'XOF' ? Math.round(this.totalTVA) : Number(this.totalTVA.toFixed(2));

    this.totalTTC = this.totalHT + this.totalTVA;
    this.totalTTC = this.devise === 'XOF' ? Math.round(this.totalTTC) : Number(this.totalTTC.toFixed(2));

    this.updateAcompte();
  }

  updateAcompte() {
    this.acompte = (this.totalTTC * this.commande) / 100;
    this.acompte = this.devise === 'XOF' ? Math.round(this.acompte) : Number(this.acompte.toFixed(2));
    this.solde = this.totalTTC - this.acompte;
    this.solde = this.devise === 'XOF' ? Math.round(this.solde) : Number(this.solde.toFixed(2));
  }

  onCommandeChange() {
    if (this.commande > 100) this.commande = 100;
    if (this.commande < 0) this.commande = 0;
    
    if (this.commande === 100) {
      this.livraison = 0;
    } else {
      this.livraison = 100 - this.commande;
    }
    
    this.updateAcompte();
  }

  onLivraisonChange() {
    if (this.livraison > 100) this.livraison = 100;
    if (this.livraison < 0) this.livraison = 0;
    
    if (this.livraison === 100) {
      this.commande = 0;
    } else {
      this.commande = 100 - this.livraison;
    }
    
    this.updateAcompte();
  }

  onLineChange() {
    setTimeout(() => {
      this.calculateTotals();
    }, 100);
  }

  onTvaToggle() {
    this.calculateTotals();
  }

  saveDevis() {
    if (!this.validateStep1()) {
      this.toastr.error('Veuillez corriger les erreurs avant d\'enregistrer', 'Erreur de validation');
      return;
    }

    const payload = {
      generate_num_proforma: false, // Ne pas regénérer le numéro pour l'édition
      devise_depart: this.deviseDepart,
      devise: this.devise,
      taux: this.taux,
      date_echeance: this.dateEcheance,
      date_emission: this.dateDemission || new Date().toISOString().split('T')[0],
      client_id: this.clientId,
      banque_id: this.banqueId,
      tva: this.tvaActive ? this.tva : 0,
      commande: this.commande,
      livraison: this.livraison,
      validite_offre: this.validiteOffre,
      delai_type: this.delaiType,
      delai_jours: this.delaiJours,
      delai_de: this.delaiDe,
      delai_a: this.delaiA,
      total_ht: this.totalHT,
      total_tva: this.totalTVA,
      total_ttc: this.totalTTC,
      acompte: this.acompte,
      solde: this.solde,
      lignes: this.lignes.map(ligne => ({
        designation_id: ligne.designationId,
        quantite: ligne.quantite,
        prix_unitaire: ligne.prix,
        remise: ligne.remise,
        prix_net: ligne.prixNet,
        total: ligne.total
      }))
    };

    this.devisService.updateDevis({ ...payload, id: this.devisId }).subscribe({
      next: (response: any) => {
        this.toastr.success('Devis mis à jour !', 'Succès');
        
        if (response.pdf_url) {
          window.open(response.pdf_url, '_blank');
        }
        
        this.router.navigate(['/devis']);
      },
      error: (error: any) => {
        console.error('Erreur:', error);
        this.toastr.error('Erreur lors de la mise à jour.', 'Erreur');
      }
    });
  }

  cancel() {
    this.router.navigate(['/devis']);
  }

  getClientName(): string {
    const client = this.clients.find(c => c.id === this.clientId);
    return client ? client.nom : 'Non spécifié';
  }

  getBanqueName(): string {
    const banque = this.banques.find(b => b.id === this.banqueId);
    return banque ? banque.name : 'Non spécifiée';
  }

  getDesignationName(designationId?: number): string {
    if (!designationId) return 'Non spécifiée';
    const designation = this.designations.find(d => d.id === designationId);
    return designation ? designation.libelle : 'Non trouvée';
  }

  getDelaiText(): string {
    switch (this.delaiType) {
      case 'jours':
        return `${this.delaiJours} jours`;
      case 'deja_livre':
        return 'Déjà livré';
      case 'planning':
        return 'Selon planning du client';
      case 'periode':
        return `De ${this.delaiDe} à ${this.delaiA} jours`;
      default:
        return 'Non spécifié';
    }
  }
}
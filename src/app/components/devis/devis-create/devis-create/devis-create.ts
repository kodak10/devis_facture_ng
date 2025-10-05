import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
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
  selector: 'app-devis',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './devis-create.html',
  styleUrls: ['./devis-create.scss']
})
export class DevisCreateComponent implements OnInit, OnDestroy {
  devisList: Devis[] = [];
  selectedDevis: Devis = {} as Devis;

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


  // Validation pour le délai
  validateDelai(): boolean {
    this.errors.delai = '';
    
    switch (this.delaiType) {
      case 'jours':
        if (!this.delaiJours || this.delaiJours <= 0) {
          this.errors.delai = 'Le nombre de jours est requis';
          return false;
        }
        break;
        
      case 'periode':
        if (!this.delaiDe || this.delaiDe <= 0) {
          this.errors.delai = 'La date de début est requise';
          return false;
        }
        if (!this.delaiA || this.delaiA <= 0) {
          this.errors.delai = 'La date de fin est requise';
          return false;
        }
        if (this.delaiA < this.delaiDe) {
          this.errors.delai = 'La date de fin doit être après la date de début';
          return false;
        }
        break;
        
      case 'deja_livre':
      case 'planning':
        // Pas de validation supplémentaire nécessaire
        break;
    }
    
    return true;
  }
  // Validation
  errors: any = {};

  constructor(
    private devisService: DevisService,
    private deviseService: DeviseService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private clientService: ClientService,
    private designationService: DesignationService,
    private banqueService: BanqueService
  ) {}

  ngOnInit(): void {
    this.loadDevis();
    this.loadClients();
    this.loadBanques();
    this.loadDesignations();
    this.loadDevises();
    setTimeout(() => {
      this.loadTauxChange();
    }, 1000);
  }

  ngOnDestroy(): void {}

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
        this.loadTauxChangeDirect();
      }
    });
  }

  loadTauxChangeDirect() {
    this.deviseService.getTauxChangeDirect().subscribe({
      next: (res: any) => {
        if (res.conversion_rates) {
          Object.keys(res.conversion_rates).forEach(devise => {
            this.tauxChange[devise] = round(1 / res.conversion_rates[devise], 4);
          });
          this.calculateTaux();
        }
      },
      error: (error: any) => {
        console.error('Erreur API taux change:', error);
        this.taux = 1;
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

    console.log(`Taux calculé: 1 ${this.deviseDepart} = ${this.taux} ${this.devise}`);
    this.updateAllPricesWithTaux();
  }

  updateAllPricesWithTaux() {
    this.lignes.forEach(ligne => {
      if (ligne.designationId) {
        const designation = this.designations.find(d => d.id === ligne.designationId);
        if (designation && designation.prix_unitaire) {
          // Le prix unitaire des designations est en XOF
          // On le convertit dans la devise sélectionnée
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
        // Appliquer le taux de change et mettre à jour le prix
        ligne.prix = this.calculatePriceWithTaux(designation.prix_unitaire);
        this.calculateLineTotal(ligne);
        this.calculateTotals();
      }
    }
    // Effacer l'erreur de validation
    this.errors[`ligne_${index}_designation`] = '';
  }
  // Méthode pour calculer le prix avec le taux de change
  calculatePriceWithTaux(prixOriginal: number): number {
    if (this.deviseDepart === this.devise) {
      return prixOriginal;
    }
    return prixOriginal * this.taux;
  }

  loadDevis() {
    this.devisService.getDevis().subscribe(res => {
      this.devisList = res;
    });
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
      generate_num_proforma: true,
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

    const obs = this.selectedDevis.id
      ? this.devisService.updateDevis({ ...payload, id: this.selectedDevis.id })
      : this.devisService.createDevis(payload);

    obs.subscribe({
      next: (response: any) => {
        this.toastr.success(this.selectedDevis.id ? 'Devis mis à jour !' : 'Devis créé !', 'Succès');
        
        if (response.pdf_url) {
          window.open(response.pdf_url, '_blank');
        }
        
        this.resetForm();
        this.loadDevis();
      },
      error: (error: any) => {
        console.error('Erreur:', error);
        this.toastr.error('Erreur lors de l\'enregistrement.', 'Erreur');
      }
    });
  }

  resetForm() {
    this.step = 1;
    this.dateEcheance = '';
    this.dateDemission = '';
    this.clientId = null;
    this.banqueId = null;
    this.devise = 'XOF';
    this.deviseDepart = 'XOF';
    this.taux = 1;
    this.tva = 18;
    this.tvaActive = true;
    this.commande = 0;
    this.livraison = 0;
    this.validiteOffre = 30;
    this.delaiType = 'jours';
    this.delaiJours = 0;
    this.delaiDe = 0;
    this.delaiA = 0;
    this.totalHT = 0;
    this.totalTVA = 0;
    this.totalTTC = 0;
    this.acompte = 0;
    this.solde = 0;
    this.lignes = [];
    this.selectedDevis = {} as Devis;
    this.errors = {};
  }

  deleteDevis(id?: number) {
    if (!id) return;
    if (!confirm('Voulez-vous supprimer ce devis ?')) return;
    this.devisService.deleteDevis(id).subscribe(() => {
      this.devisList = this.devisList.filter(d => d.id !== id);
      this.toastr.success('Devis supprimé !', 'Succès');
    });
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
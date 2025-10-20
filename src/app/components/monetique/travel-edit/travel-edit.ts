import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TravelsService, Travels } from '../../../services/travel.service';
// import { DeviseService, Devise, TauxChange } from '../../../../services/devise.service';
// import { ClientService, Client } from '../../../../services/client.service';
// import { DesignationService, Designation } from '../../../../services/designation.service';
// import { BanqueService, Banque } from '../../../../services/banque.service';

// Fonction round helper
function round(value: number, decimals: number = 2): number {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
}

@Component({
  selector: 'app-travels-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './travel-edit.html',
  styleUrls: ['./travel-edit.scss']
})
export class TravelsEditComponent implements OnInit {
  travelsId!: number;
  travels: Travels = {} as Travels;

  // Wizard
  step = 1;

  // Champs du devis avec validation
  nom_prenom: string = '';
  date: string = '';
  lieu: string = '';
  debut: string = '';
  fin: string = '';
  motif: string = '';
  montant_en_chiffre: string = '';
  montant_en_lettre: string = '';
  billet_avion: number = 0;
  cheque: number = 0;
  hebergement_repars: number = 0;
  especes: number = 0;
  totale: number = 0;


  // Validation
  errors: any = {};
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private travelsService: TravelsService,
  ) {}

  ngOnInit(): void {
    this.travelsId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTravels();
  }

  loadTravels() {
    this.isLoading = true;

    // Une seule requête pour tout charger
    this.travelsService.getTravelsById(this.travelsId).subscribe({
      next: (response: any) => {
        console.log('Tavel rquest complet chargé:', response);
        this.travels = response.data;
        this.populateForm();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur chargement travel:', error);
        this.toastr.error('Erreur lors du chargement du travel', 'Erreur');
        this.isLoading = false;
      }
    });
  }

 // Dans devis-edit.component.ts
populateForm() {
  console.log('Travel request reçu:', this.travels);

  // Remplir tous les champs du formulaire avec des valeurs par défaut sécurisées
  this.nom_prenom = this.travels.nom_prenom ?? '';
  this.date = this.formatDateForInput(this.travels.date ?? '');
  this.lieu = this.travels.lieu ?? '';
  this.debut = this.formatDateForInput(this.travels.debut ?? '');
  this.fin = this.formatDateForInput(this.travels.fin ?? '');
  this.motif = this.travels.motif ?? '';
  this.montant_en_chiffre = this.travels.montant_en_chiffre ?? '';
  this.montant_en_lettre = this.travels.montant_en_lettre?? '';
  this.billet_avion = Number(this.travels.billet_avion) || 0;
  this.cheque = Number(this.travels.cheque) || 0;
  this.hebergement_repars = Number(this.travels.hebergement_repars) || 30;
  this.especes = Number(this.travels.especes) || 0;
  this.totale = Number(this.travels.totale) || 0;

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

  updateTotal() {
    const avion = Number(this.billet_avion) || 0;
    const cheque = Number(this.cheque) || 0;
    const hebergement = Number(this.hebergement_repars) || 0;
    const especes = Number(this.especes) || 0;
    this.totale = avion + cheque + hebergement + especes;
  }

  validateStep1(): boolean {
    this.errors = {};

    if (!this.nom_prenom) this.errors.nom_prenom = 'Le nom et prénom sont obligatoires.';
    if (!this.date) this.errors.date = 'La date d’émission est obligatoire.';
    if (!this.lieu) this.errors.lieu = 'Le lieu est obligatoire.';
    if (!this.debut) this.errors.debut = 'La date de début est obligatoire.';
    if (!this.fin) this.errors.fin = 'La date de fin est obligatoire.';

    return Object.keys(this.errors).length === 0;
  }

  nextStep() {
    if (this.step === 1) {
      if (!this.validateStep1()) {
        this.toastr.error('Veuillez corriger les erreurs dans le formulaire', 'Erreur de validation');
        return;
      }
    }
    this.step++;
  }

  previousStep() {
    this.step--;
  }

  saveTravels() {
    if (!this.validateStep1()) {
      this.toastr.error('Veuillez corriger les erreurs avant d\'enregistrer', 'Erreur de validation');
      return;
    }

    this.updateTotal();

    const payload = {
      generate_num_proforma: false,
      nom_prenom: this.nom_prenom,
      date: this.date || new Date().toISOString().split('T')[0],
      lieu: this.lieu,
      debut: this.debut,
      fin: this.fin,
      motif: this.motif,
      montant_en_chiffre: Number(this.montant_en_chiffre) || 0,
      montant_en_lettre: this.montant_en_lettre,
      billet_avion: Number(this.billet_avion) || 0,
      cheque: Number(this.cheque) || 0,
      hebergement_repars: Number(this.hebergement_repars) || 0,
      especes: Number(this.especes) || 0,
      totale: Number(this.totale) || 0, // ✅ ce champ manquait !
    };

    this.travelsService.updateTravels({ ...payload, id: this.travelsId }).subscribe({
      next: (response: any) => {
        this.toastr.success('Travels request mis à jour !', 'Succès');

        if (response.pdf_url) {
          window.open(response.pdf_url, '_blank');
        }

        this.router.navigate(['/travel']);
      },
      error: (error: any) => {
        console.error('Erreur:', error);
        this.toastr.error('Erreur lors de la mise à jour.', 'Erreur');
      }
    });
  }

  cancel() {
    this.router.navigate(['/travel']);
  }

}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TravelsService, Travels } from '../../../services/travel.service';

@Component({
  selector: 'app-travels',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './travel-create.html',
  styleUrls: ['./travel-create.scss']
})
export class TravelCreateComponent implements OnInit {
  travelsList: Travels[] = [];
  selectedTravel: Travels = {} as Travels;

  // Étapes du wizard
  step = 1;

  // Champs du formulaire
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

  // Gestion des erreurs
  errors: any = {};

  constructor(
    private travelsService: TravelsService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadTravels();
  }

  // Charger la liste des travel requests
  loadTravels() {
    this.travelsService.getTravels().subscribe({
      next: (res) => (this.travelsList = res),
      error: (err) => console.error('Erreur de chargement :', err)
    });
  }

  /** ✅ Calcul automatique du total */
  updateTotal() {
    const avion = Number(this.billet_avion) || 0;
    const cheque = Number(this.cheque) || 0;
    const hebergement = Number(this.hebergement_repars) || 0;
    const especes = Number(this.especes) || 0;
    this.totale = avion + cheque + hebergement + especes;
  }

  /** ✅ Validation du formulaire étape 1 */
  validateStep1(): boolean {
    this.errors = {};

    if (!this.nom_prenom) this.errors.nom_prenom = 'Le nom et prénom sont obligatoires.';
    if (!this.date) this.errors.date = 'La date d’émission est obligatoire.';
    if (!this.lieu) this.errors.lieu = 'Le lieu est obligatoire.';
    if (!this.debut) this.errors.debut = 'La date de début est obligatoire.';
    if (!this.fin) this.errors.fin = 'La date de fin est obligatoire.';

    return Object.keys(this.errors).length === 0;
  }

  /** Étapes du wizard */
  nextStep() {
    if (this.step === 1 && !this.validateStep1()) {
      this.toastr.error('Veuillez corriger les erreurs dans le formulaire', 'Erreur de validation');
      return;
    }
    this.step++;
  }

  previousStep() {
    this.step--;
  }

  /** ✅ Enregistrer la Travel Request */
  saveTravels() {
    if (!this.validateStep1()) {
      this.toastr.error('Veuillez corriger les erreurs avant d’enregistrer', 'Erreur de validation');
      return;
    }

    const payload = {
      nom_prenom: this.nom_prenom,
      date: this.date,
      lieu: this.lieu,
      debut: this.debut,
      fin: this.fin,
      motif: this.motif,
      montant_en_chiffre: this.montant_en_chiffre,
      montant_en_lettre: this.montant_en_lettre,
      billet_avion: this.billet_avion,
      cheque: this.cheque,
      hebergement_repars: this.hebergement_repars,
      especes: this.especes,
      totale: this.totale
    };

    const obs = this.selectedTravel.id
      ? this.travelsService.updateTravels({ ...payload, id: this.selectedTravel.id })
      : this.travelsService.createTravels(payload);

    obs.subscribe({
      next: (response: any) => {
        this.toastr.success(
          this.selectedTravel.id ? 'Travel request mise à jour !' : 'Travel request créée !',
          'Succès'
        );
        this.resetForm();
        this.loadTravels();

        // ouvrir le PDF si fourni par le backend
        if (response.pdf_url) {
          window.open(response.pdf_url, '_blank');
        }
      },
      error: (error: any) => {
        console.error('Erreur :', error);
        this.toastr.error('Erreur lors de l’enregistrement.', 'Erreur');
      }
    });
  }

  /** ✅ Réinitialisation du formulaire */
  resetForm() {
    this.step = 1;
    this.nom_prenom = '';
    this.date = '';
    this.lieu = '';
    this.debut = '';
    this.fin = '';
    this.motif = '';
    this.montant_en_chiffre = '';
    this.montant_en_lettre = '';
    this.billet_avion = 0;
    this.cheque = 0;
    this.hebergement_repars = 0;
    this.especes = 0;
    this.totale = 0;
    this.errors = {};
    this.selectedTravel = {} as Travels;
  }

  /** ✅ Suppression */
  deleteTravel(id?: number) {
    if (!id) return;
    if (!confirm('Voulez-vous supprimer cette demande ?')) return;
    this.travelsService.deleteTravels(id).subscribe({
      next: () => {
        this.travelsList = this.travelsList.filter((t) => t.id !== id);
        this.toastr.success('Demande supprimée !', 'Succès');
      }
    });
  }
}

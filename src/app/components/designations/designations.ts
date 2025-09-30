import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DesignationService, Designation } from '../../services/designation.service';
import $ from 'jquery';
import 'datatables.net';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-designations',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './designations.html',
  styleUrls: ['./designations.scss']
})
export class DesignationsComponent implements OnInit, AfterViewInit, OnDestroy {
  designations: Designation[] = [];
  selectedDesignation: Designation = {} as Designation;
  formDesignation: Designation = {} as Designation;

  errors: any = {};
  generalError: string = '';

  dataTable: any;
  isDataTableInitialized = false;

  @ViewChild('designationsTable', { static: false }) table!: ElementRef;

  constructor(
    private designationService: DesignationService, 
    private modalService: NgbModal, 
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadDesignations();
  }

  ngAfterViewInit(): void {
    // DataTable sera initialisé après le chargement des données
  }

  ngOnDestroy(): void {
    this.destroyDataTable();
  }

  destroyDataTable() {
    if (this.dataTable) {
      try {
        this.dataTable.clear().destroy();
      } catch (e) {
        console.log('Error destroying DataTable:', e);
      }
      this.dataTable = null;
    }
    this.isDataTableInitialized = false;
  }

  initializeDataTable() {
    // Détruire DataTable existant
    this.destroyDataTable();

    // Vérifier que le tableau contient des données
    if (this.designations.length === 0) {
      console.log('Aucune donnée pour initialiser DataTable');
      return;
    }

    // Attendre que le DOM soit mis à jour
    setTimeout(() => {
      const tableElement = $(this.table.nativeElement);
      
      // Vérifier si DataTable est déjà initialisé
      if ($.fn.DataTable.isDataTable(tableElement)) {
        tableElement.DataTable().clear().destroy();
      }

      // Initialiser DataTable
      this.dataTable = tableElement.DataTable({
        language: { 
          url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/French.json',
          emptyTable: "Aucune donnée disponible dans le tableau",
          zeroRecords: "Aucun enregistrement correspondant trouvé"
        },
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        order: [[0, 'asc']],
        columnDefs: [
          { orderable: false, targets: 3 },
          { className: "dt-center", targets: [0, 2, 3] }
        ],
        destroy: true,
        retrieve: true,
        responsive: true
      } as any);     

      this.isDataTableInitialized = true;
      console.log('DataTable initialisé avec', this.designations.length, 'enregistrements');
    }, 100);
  }

  loadDesignations() {
    this.designationService.getDesignations().subscribe({
      next: (res) => {
        this.designations = res.data ?? res;
        console.log('Données chargées:', this.designations);
        
        // Réinitialiser DataTable avec les nouvelles données
        this.initializeDataTable();
      },
      error: (err) => {
        console.error('Erreur chargement designations:', err);
        this.toastr.error('Erreur lors du chargement des désignations', 'Erreur');
      }
    });
  }

  openModal(content: any, designation: Designation | null = null) {
    this.selectedDesignation = designation ? { ...designation } : {} as Designation;
    this.formDesignation = { ...this.selectedDesignation };

    this.errors = {};
    this.generalError = '';
    
    this.modalService.open(content, { 
      size: 'lg',
      backdrop: 'static'
    });
  }

  saveDesignation(formData: any) {
    const payload = {
      ...this.selectedDesignation,
      ...formData,
      prix_unitaire: parseFloat(formData.prix_unitaire) || 0
    };

    const obs = this.selectedDesignation.id
      ? this.designationService.updateDesignation(payload)
      : this.designationService.createDesignation(payload);

    obs.subscribe({
      next: (res) => {
        // Fermer le modal
        this.modalService.dismissAll();

        // Message de succès
        this.toastr.success(
          this.selectedDesignation.id ? 'Désignation mise à jour !' : 'Désignation créée !',
          'Succès'
        );

        // Réinitialiser le formulaire
        this.selectedDesignation = {} as Designation;
        this.formDesignation = {} as Designation;

        // Recharger les données
        this.loadDesignations();
      },
      error: (err) => {
        this.errors = err.error?.errors || {};
        this.generalError = err.error?.message || 'Une erreur est survenue';
        this.toastr.error('Erreur lors de l\'enregistrement', 'Erreur');
      }
    });
  }

  deleteDesignation(id?: number) {
    if (!id) return;
    
    if (!confirm('Voulez-vous vraiment supprimer cette désignation ?')) return;

    this.designationService.deleteDesignation(id).subscribe({
      next: () => {
        this.toastr.success('Désignation supprimée avec succès', 'Succès');
        this.loadDesignations();
      },
      error: (err) => {
        this.toastr.error('Erreur lors de la suppression', 'Erreur');
      }
    });
  }

  // Méthode pour forcer le rafraîchissement de DataTable
  refreshDataTable() {
    if (this.dataTable && this.isDataTableInitialized) {
      this.dataTable.clear();
      this.dataTable.rows.add(this.designations);
      this.dataTable.draw();
    } else {
      this.initializeDataTable();
    }
  }
}
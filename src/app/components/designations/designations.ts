import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DesignationService, Designation } from '../../services/designation.service';

declare var $: any;

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
  currentPage = 1;
  totalPages = 1;
  pages: number[] = [];

  @ViewChild('designationsTable') table: any;
  dataTable: any;

  constructor(private designationService: DesignationService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadDesignations();
  }

  ngAfterViewInit(): void {
    this.initializeDataTable();
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }

  initializeDataTable() {
    // Détruire la DataTable existante
    if (this.dataTable) {
      this.dataTable.destroy();
    }

    // Initialiser DataTable après un court délai pour permettre le rendu du DOM
    setTimeout(() => {
      this.dataTable = $('#designationsTable').DataTable({
        language: {
          url: '//cdn.datatables.net/plug-ins/1.10.25/i18n/French.json'
        },
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        order: [[0, 'asc']],
        columnDefs: [
          { orderable: false, targets: 3 } // Désactiver le tri sur la colonne Actions
        ]
      });
    }, 100);
  }

  loadDesignations(page: number = 1) {
    this.designationService.getDesignations(page).subscribe(res => {
      this.designations = res.data ?? res;
      this.currentPage = res.current_page ?? 1;
      this.totalPages = res.last_page ?? 1;
      this.pages = Array.from({length: this.totalPages}, (_, i) => i + 1);
      
      // Reinitialiser DataTable après le chargement des données
      this.reinitializeDataTable();
    });
  }

  reinitializeDataTable() {
    // Détruire et réinitialiser DataTable avec les nouvelles données
    if (this.dataTable) {
      this.dataTable.destroy();
    }
    
    setTimeout(() => {
      this.dataTable = $('#designationsTable').DataTable({
        language: {
          url: '//cdn.datatables.net/plug-ins/1.10.25/i18n/French.json'
        },
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        order: [[0, 'asc']],
        columnDefs: [
          { orderable: false, targets: 3 }
        ]
      });
    }, 100);
  }

  openModal(content: any, designation: Designation | null = null) {
    this.selectedDesignation = designation ? { ...designation } : {} as Designation;
    this.formDesignation = { ...this.selectedDesignation };
    this.modalService.open(content, { size: 'lg' });
    this.errors = {};
  }

  saveDesignation(formData: any) {
    const payload = { ...this.selectedDesignation, ...formData };
    
    const observable = this.selectedDesignation.id 
      ? this.designationService.updateDesignation(payload)
      : this.designationService.createDesignation(payload);

    observable.subscribe({
      next: () => {
        this.loadDesignations();
        this.modalService.dismissAll();
      },
      error: (err) => this.errors = err.error.errors
    });
  }

  deleteDesignation(id?: number) {
    if (!id) return;
    if (!confirm('Voulez-vous supprimer cette désignation ?')) return;
    
    this.designationService.deleteDesignation(id).subscribe(() => {
      this.loadDesignations();
    });
  }
}
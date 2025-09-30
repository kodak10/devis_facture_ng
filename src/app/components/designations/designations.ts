import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
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

  constructor(private designationService: DesignationService, private modalService: NgbModal, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadDesignations();
  }

  ngAfterViewInit(): void {
    // DataTable sera initialisé après le chargement des données
  }

  ngOnDestroy(): void {
    if (this.dataTable) this.dataTable.destroy(true);
  }

  loadDesignations() {
    this.designationService.getDesignations().subscribe(res => {
      this.designations = res.data ?? res;

      // Recharger DataTable proprement
      setTimeout(() => {
        if ($.fn.DataTable.isDataTable('#designationsTable')) {
          $('#designationsTable').DataTable().clear().destroy();
        }
        $('#designationsTable').DataTable({
          language: { url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/French.json' },
          pageLength: 10,
          lengthMenu: [10, 25, 50, 100],
          order: [[0, 'asc']],
          columnDefs: [{ orderable: false, targets: 3 }]
        });
      }, 0);
    });
  }


  openModal(content: any, designation: Designation | null = null) {
    this.selectedDesignation = designation ? { ...designation } : {} as Designation;
    this.formDesignation = { ...this.selectedDesignation };

    this.errors = {};
    this.generalError = '';
    this.modalService.open(content, { size: 'lg' });
  }

  saveDesignation(formData: any) {
    // Forcer prix_unitaire en nombre
    const payload = {
      ...this.selectedDesignation,
      ...formData,
      prix_unitaire: parseFloat(formData.prix_unitaire) || 0
    };

    const obs = this.selectedDesignation.id 
      ? this.designationService.updateDesignation(payload)
      : this.designationService.createDesignation(payload);

    obs.subscribe({
      next: () => {
        this.modalService.dismissAll();
        this.loadDesignations(); // recharge la liste
        this.toastr.success(
          this.selectedDesignation.id ? 'Désignation mise à jour !' : 'Désignation créée !',
          'Succès'
        );
      },
      error: err => {
        this.errors = err.error.errors;
        this.toastr.error('Une erreur est survenue lors de l\'enregistrement.', 'Erreur');
      }
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

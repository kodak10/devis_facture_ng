import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DevisService, Devis } from '../../../services/devis.service';
import $ from 'jquery';
import 'datatables.net';

@Component({
  selector: 'app-devis',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule, RouterModule],
  templateUrl: './devis-list.html',
  styleUrls: ['./devis-list.scss']
})
export class DevisListsComponent implements OnInit, OnDestroy {
  devisList: Devis[] = [];
  selectedDevis: Devis = {} as Devis;
  dateDebut: string = '';
  dateFin: string = '';
  isLoading: boolean = false;

  dataTable: any;

  private apiUrl = 'http://192.168.1.75:8000/api/devis';
  //private apiUrl = 'http://127.0.0.1:8000/api/devis';

  constructor(private devisService: DevisService, private modalService: NgbModal, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadDevis();
  }

  ngOnDestroy(): void {
    if (this.dataTable) this.dataTable.destroy(true);
  }

  loadDevis() {
    this.isLoading = true;
    
    // Construire les paramètres de filtre
    const params: any = {};
    if (this.dateDebut) params.date_debut = this.dateDebut;
    if (this.dateFin) params.date_fin = this.dateFin;

    this.devisService.getDevis(params).subscribe(res => {
      this.devisList = res;
      this.isLoading = false;

      setTimeout(() => {
        this.initializeDataTable();
      }, 0);
    });
  }

  onSearchChange(event: any) {
    const value = event.target.value;
    if (this.dataTable) {
      this.dataTable.search(value).draw();
    }
  }


  initializeDataTable() {
    if ($.fn.DataTable.isDataTable('#devisTable')) {
      $('#devisTable').DataTable().clear().destroy();
    }
    
    this.dataTable = $('#devisTable').DataTable({
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/French.json'
      },
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100],
      order: [[0, 'desc']],
      columnDefs: [{ orderable: false, targets: -1 }],
      dom:
        "<'row mb-2 justify-content-between'<'col-sm-6'l><'col-sm-6'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row mt-2'<'col-sm-5'i><'col-sm-7'p>>",
    });

  }

  onDateFilterChange(): void {
    this.loadDevis();
  }

  resetFilters(): void {
    this.dateDebut = '';
    this.dateFin = '';
    this.loadDevis();
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'Brouillon': 'bg-secondary',
      'Envoyé': 'bg-warning text-dark',
      'Refusé': 'bg-danger',
      'Facturé': 'bg-info',
      'Approuvé': 'bg-primary',
      'Non approuvé': 'bg-dark',
      'Encaissé': 'bg-warning text-dark'
    };
    
    return statusClasses[status] || 'bg-secondary';
  }

  // ++++++++++++++ ACTIONS +++++++++++++++

  // Envoyé du devis changement de Brouillon à envoyé
  updateStatut(id?: number) {
    if (!id) return;
    if (!confirm('Voulez-vous envoyer ce devis ?')) return;

    this.devisService.updateStatut(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success(res.message, 'Succès');
        } else {
          this.toastr.warning(res.message, 'Attention');
        }

        // Recharger la liste
        this.devisList = this.devisList.filter(d => d.id !== id);
        setTimeout(() => this.initializeDataTable(), 0);
      },
      error: (err : any) => {
        console.error(err);
        this.toastr.error(err.error?.message || 'Erreur serveur', 'Erreur');
      }
    });
  }

  // Obtenir l'url du devis pour voir dans un onglet
  getPdfUrl(devisId: number): void {
    const url = `${this.apiUrl}/${devisId}/pdf`;
    window.open(url, '_blank');
  }

  // suppression du devis
  deleteDevis(id?: number) {
    if (!id) return;

    if (!confirm('Voulez-vous supprimer ce devis ?')) return;

    this.devisService.deleteDevis(id).subscribe({
      next: (res) => {
        // Met à jour la liste locale
        this.devisList = this.devisList.filter(d => d.id !== id);
        this.toastr.success(res.message, 'Succès');

        // Recharger DataTables après suppression
        setTimeout(() => {
          this.initializeDataTable();
        }, 0);
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(err.error?.message || 'Erreur serveur', 'Erreur');
      }
    });
  }
  

}
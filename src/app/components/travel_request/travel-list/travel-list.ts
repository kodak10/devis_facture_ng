import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TravelsService, Travels } from '../../../services/travel.service';
import $ from 'jquery';
import 'datatables.net';

@Component({
  selector: 'app-devis',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule, RouterModule],
  templateUrl: './travel-list.html',
  styleUrls: ['./travel-list.scss']
})
export class TravelsListsComponent implements OnInit, OnDestroy {
  travelsList: Travels[] = [];
  selectedTravels: Travels = {} as Travels;

  dataTable: any;

  // private apiUrl = 'http://192.168.1.13:8000/api/travel';
  private apiUrl = 'http://127.0.0.1:8000/api/travel';


  constructor(private TravelsService: TravelsService, private modalService: NgbModal, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadTravels();
  }

  ngOnDestroy(): void {
    if (this.dataTable) this.dataTable.destroy(true);
  }

  loadTravels() {
    this.TravelsService.getTravels().subscribe(res => {
      this.travelsList = res;

      setTimeout(() => {
        if ($.fn.DataTable.isDataTable('#travelsTable')) {
          $('#travelsTable').DataTable().clear().destroy();
        }
        $('#travelsTable').DataTable({
          language: { url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/French.json' },
          pageLength: 10,
          lengthMenu: [10, 25, 50, 100],
          order: [[0, 'desc']],
          columnDefs: [{ orderable: false, targets: -1 }]
        });
      }, 0);
    });
  }

  initializeDataTable() {
    if ($.fn.DataTable.isDataTable('#travelsTable')) {
      $('#travelsTable').DataTable().clear().destroy();
    }

    this.dataTable = $('#travelsTable').DataTable({
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

  // Envoyé du devis changement de Brouillon à envoyé
  updateStatut(id?: number) {
    if (!id) return;
    if (!confirm('Voulez-vous envoyer ce travel request ?')) return;

    this.TravelsService.updateStatut(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success(res.message, 'Succès');
        } else {
          this.toastr.warning(res.message, 'Attention');
        }

        // Recharger la liste
        this.travelsList = this.travelsList.filter(d => d.id !== id);
        setTimeout(() => this.initializeDataTable(), 0);
      },
      error: (err : any) => {
        console.error(err);
        this.toastr.error(err.error?.message || 'Erreur serveur', 'Erreur');
      }
    });
  }

  openModal(content: any, travels: Travels | null = null) {
    this.selectedTravels = travels ? { ...travels } : {} as Travels;
    this.modalService.open(content, { size: 'lg' });
  }
  // Obtenir l'url du devis pour voir dans un onglet
  getPdfUrl(devisId: number): void {
    const url = `${this.apiUrl}/${devisId}/pdf`;
    window.open(url, '_blank');
  }

  saveTravels(formData: any) {
    const payload = { ...this.selectedTravels, ...formData };

    const obs = this.selectedTravels.id
      ? this.TravelsService.updateTravels(payload)
      : this.TravelsService.createTravels(payload);

    obs.subscribe({
      next: () => {
        this.modalService.dismissAll();
        this.loadTravels();
        this.toastr.success(
          this.selectedTravels.id ? 'Travel request mis à jour !' : 'Travel request créé !',
          'Succès'
        );
      },
      error: err => {
        this.toastr.error('Erreur lors de l\'enregistrement.', 'Erreur');
      }
    });
  }

  deleteTravels(id?: number) {
    if (!id) return;
    if (!confirm('Voulez-vous supprimer ce devis ?')) return;

    this.TravelsService.deleteTravels(id).subscribe(() => {
      this.travelsList = this.travelsList.filter(d => d.id !== id);
      this.toastr.success('Travel request supprimé !', 'Succès');
    });
  }
}

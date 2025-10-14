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

  private apiUrl = 'http://192.168.1.13:8000/api/travel';
  //private apiUrl = 'http://127.0.0.1:8000/api/devis';


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

  openModal(content: any, travels: Travels | null = null) {
    this.selectedTravels = travels ? { ...travels } : {} as Travels;
    this.modalService.open(content, { size: 'lg' });
  }

  getPdfUrl(travelsId: number): string {
    return `${this.apiUrl}/${travelsId}/pdf`;
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

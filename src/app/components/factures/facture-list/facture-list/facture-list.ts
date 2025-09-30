import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DevisService, Devis } from '../../../../services/devis.service';
import $ from 'jquery';
import 'datatables.net';

@Component({
  selector: 'app-devis',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './facture-list.html',
  styleUrls: ['./facture-list.scss']
})
export class FactureListComponent implements OnInit, OnDestroy {
  devisList: Devis[] = [];
  selectedDevis: Devis = {} as Devis;

  dataTable: any;

  constructor(private devisService: DevisService, private modalService: NgbModal, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadFacture();
  }

  ngOnDestroy(): void {
    if (this.dataTable) this.dataTable.destroy(true);
  }

  loadFacture() {
    this.devisService.getDevis().subscribe(res => {
      this.devisList = res;

      setTimeout(() => {
        if ($.fn.DataTable.isDataTable('#devisTable')) {
          $('#devisTable').DataTable().clear().destroy();
        }
        $('#devisTable').DataTable({
          language: { url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/French.json' },
          pageLength: 10,
          lengthMenu: [10, 25, 50, 100],
          order: [[0, 'desc']],
          columnDefs: [{ orderable: false, targets: -1 }]
        });
      }, 0);
    });
  }

  openModal(content: any, devis: Devis | null = null) {
    this.selectedDevis = devis ? { ...devis } : {} as Devis;
    this.modalService.open(content, { size: 'lg' });
  }

  saveDevis(formData: any) {
    const payload = { ...this.selectedDevis, ...formData };

    const obs = this.selectedDevis.id
      ? this.devisService.updateDevis(payload)
      : this.devisService.createDevis(payload);

    obs.subscribe({
      next: () => {
        this.modalService.dismissAll();
        this.loadFacture();
        this.toastr.success(
          this.selectedDevis.id ? 'Devis mis à jour !' : 'Devis créé !',
          'Succès'
        );
      },
      error: err => {
        this.toastr.error('Erreur lors de l\'enregistrement.', 'Erreur');
      }
    });
  }

  deleteDevis(id?: number) {
    if (!id) return;
    if (!confirm('Voulez-vous supprimer ce devis ?')) return;

    this.devisService.deleteDevis(id).subscribe(() => {
      this.devisList = this.devisList.filter(d => d.id !== id);
      this.toastr.success('Devis supprimé !', 'Succès');
    });
  }
}

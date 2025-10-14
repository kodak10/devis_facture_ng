import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BanqueService, Banque } from '../../services/banque.service';
import { ToastrService } from 'ngx-toastr';

declare var $: any; // pour initialiser DataTable

@Component({
  selector: 'app-banques',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './banques.html',
  styleUrls: ['./banques.scss']
})
export class BanquesComponent implements OnInit {
  banques: Banque[] = [];
  selectedBanque: Banque = {} as Banque;
  formBanque: Banque = {} as Banque;
  errors: any = {};

  constructor(private banqueService: BanqueService, private modalService: NgbModal, private toastr: ToastrService,) {}

  ngOnInit(): void {
    this.loadBanques();
  }

  loadBanques() {
    this.banqueService.getBanques().subscribe({
      next: (res) => {
        this.banques = res.data ?? res; // selon ta réponse API
        this.initDataTable();
      }
    });
  }

  initDataTable() {
    setTimeout(() => {
      $('#datatable').DataTable({
        destroy: true, // éviter doublons
        responsive: true
      });
    }, 0);
  }

  openModal(content: any, banque: Banque | null = null) {
    this.selectedBanque = banque ? { ...banque } : {} as Banque;
    this.formBanque = { ...this.selectedBanque };
    this.modalService.open(content, { size: 'lg' });
    this.errors = {};
  }

  saveBanque(formData: any) {
    const payload = { ...this.selectedBanque, ...formData };

    const request = this.selectedBanque.id
      ? this.banqueService.updateBanque(payload)
      : this.banqueService.createBanque(payload);

    request.subscribe({
      next: (res) => {
        this.modalService.dismissAll();
        this.toastr.success('Opération réussie', 'Succès');
        this.loadBanques();
      },
      error: (err) => {
        if (err.error?.errors) {
          // Validation errors
          this.errors = err.error.errors;
        }
        this.toastr.error(err.error?.message || 'Erreur serveur', 'Erreur');
      }
    });
  }

  deleteBanque(id?: number) {
    if (!id) return;
    if (!confirm('Voulez-vous supprimer cette banque ?')) return;

    this.banqueService.deleteBanque(id).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'Banque supprimée', 'Succès');
        this.loadBanques();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Erreur serveur', 'Erreur');
      }
    });
  }

}

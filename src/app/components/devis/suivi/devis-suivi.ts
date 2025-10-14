import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevisService } from '../../../services/devis.service';
import { ToastrService } from 'ngx-toastr';
import $ from 'jquery';
import 'datatables.net';

interface SuiviItem {
  id: number;
  num_proforma: string;
  date_emission: string;
  date_echeance: string;
  total_ttc: string;
  devise: string;
  client_name: string;
  user_name: string;
  etape: string;
  facture_num?: string;
  facture_pdf?: string;
}

@Component({
  selector: 'app-suivi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './devis-suivi.html',
  styleUrls: ['./devis-suivi.scss']
})
export class DevisSuiviComponent implements OnInit {
  suiviList: SuiviItem[] = [];
  isLoading = false;
  dataTable: any;

  private apiUrl = 'http://192.168.1.75:8000/api/devis';

  constructor(private devisService: DevisService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadSuivi();
  }

  getPdfUrl(devisId: number): void {
    const url = `${this.apiUrl}/${devisId}/pdf`;
    window.open(url, '_blank');
  }

  loadSuivi(): void {
    this.isLoading = true;

    this.devisService.getSuivi().subscribe({
      next: (res: any) => {
        // Comme le service renvoie `any[]`, on simule le typage ici
        if (res.success !== undefined && res.data) {
          this.suiviList = res.data;
        } else {
          this.suiviList = res;
        }

        this.isLoading = false;

        // Initialiser DataTable après le rendu du DOM
        setTimeout(() => this.initializeDataTable(), 0);
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.toastr.error('Erreur lors du chargement du suivi', 'Erreur');
      }
    });
  }

  initializeDataTable(): void {
    if ($.fn.DataTable.isDataTable('#suiviTable')) {
      $('#suiviTable').DataTable().clear().destroy();
    }

    this.dataTable = $('#suiviTable').DataTable({
      language: { url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/French.json' },
      pageLength: 10,
      order: [[0, 'desc']],
    });
  }

  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      'Proforma | Envoyé': 'bg-warning text-dark',
      'Proforma | Refusé': 'bg-danger',
      'Proforma | Facturé': 'bg-info',
      'Facture | Approuvé': 'bg-primary',
      'Facture | Non approuvé': 'bg-dark',
      'Facture | Encaissé': 'bg-success',
      'Facture | Refusé': 'bg-danger',
    };
    return classes[status] || 'bg-secondary';
  }

  openFacture(pdfPath?: string): void {
    if (pdfPath) {
      const url = `http://192.168.1.75:8000/storage/${pdfPath}`;
      window.open(url, '_blank');
    } else {
      this.toastr.info('Aucune facture disponible pour ce devis', 'Info');
    }
  }
}

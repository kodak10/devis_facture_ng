import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevisService } from '../../../services/devis.service';
import { ToastrService } from 'ngx-toastr';
import $ from 'jquery';
import 'datatables.net';

interface SuiviFactureItem {
  id: number;
  num_proforma: string;
  date_emission: string;
  total_ttc: string;
  devise: string;
  client_name: string;
  user_name: string;
  pays_name: string;
  facture_num?: string;
  facture_pdf?: string;
  facture_status: string; // "Soldé" ou "Non soldé"
  libelle: string;
}

@Component({
  selector: 'app-facture-suivi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './facture-suivi.html',
  styleUrls: ['./facture-suivi.scss']
})
export class FactureSuiviComponent implements OnInit {
  suiviList: SuiviFactureItem[] = [];
  isLoading = false;
  dataTable: any;

  constructor(private devisService: DevisService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadSuivi();
  }

  loadSuivi(): void {
    this.isLoading = true;

    this.devisService.getSuivi().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          // Transformation pour suivre le statut de la facture
          this.suiviList = res.data.map((item: any) => ({
            ...item,
            facture_status: item.etape.includes('Encaissé') ? 'Soldé' : 'Non soldé',
            facture_num: item.facture_num,
            facture_pdf: item.facture_pdf
          }));
        } else {
          this.suiviList = [];
        }
        this.isLoading = false;

        setTimeout(() => this.initializeDataTable(), 0);
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.toastr.error('Erreur lors du chargement du suivi des factures', 'Erreur');
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
      'Soldé': 'bg-success',
      'Non soldé': 'bg-warning text-dark'
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

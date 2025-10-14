import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ClientService, Client } from '../../services/client.service';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './clients.html',
  styleUrls: ['./clients.scss']
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  selectedClient: Client = {} as Client;
  formClient: Client = {} as Client;
  errors: any = {};

  constructor(private clientService: ClientService, private modalService: NgbModal,  private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getClients().subscribe({
      next: (res) => {
        this.clients = res.data ?? res;
        this.initDataTable();
      }
    });
  }

  initDataTable() {
    setTimeout(() => {
      if ($.fn.DataTable.isDataTable('#datatable')) {
        $('#datatable').DataTable().destroy();
      }
      $('#datatable').DataTable({
        responsive: true
      });
    }, 0);
  }

  openModal(content: any, client: Client | null = null) {
    this.selectedClient = client ? { ...client } : {} as Client;
    this.formClient = { ...this.selectedClient };
    this.modalService.open(content, { size: 'lg' });
    this.errors = {};
  }

  saveClient(formData: any) {
    const payload = { ...this.selectedClient, ...formData };

    const request = this.selectedClient.id
      ? this.clientService.updateClient(payload)
      : this.clientService.createClient(payload);

    request.subscribe({
      next: (res) => {
        // Fermer la modal
        this.modalService.dismissAll();

        // Recharger la liste
        this.loadClients();

        // Réinitialiser les erreurs
        this.errors = {};

        // Message succès
        this.toastr.success('Opération réussie', 'Succès');
      },
      error: (err) => {
        // Gestion des erreurs de validation
        if (err.error?.errors) {
          this.errors = err.error.errors;
        }
        this.toastr.error(err.error?.message || 'Erreur serveur', 'Erreur');
      }
    });
  }

  deleteClient(id?: number) {
    if (!id) return;
    if (!confirm('Voulez-vous supprimer ce client ?')) return;

    this.clientService.deleteClient(id).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'Client supprimé', 'Succès');
        this.loadClients();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Erreur serveur', 'Erreur');
      }
    });
  }

}

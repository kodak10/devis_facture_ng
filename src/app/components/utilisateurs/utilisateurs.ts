import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { UtilisateurService, User } from '../../services/utilisateur.service';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService, ToastrModule } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './utilisateurs.html',
  styleUrls: ['./utilisateurs.scss']
})
export class UtilisateursComponent implements OnInit {
  users: User[] = [];
  currentPage = 1;
  totalPages = 1;
  totalUsers = 0;
  pages: number[] = [];
  selectedUser: User = {} as User;
  formUser: User = {} as User;

  errors: any = {};
  countries: any[] = [];
  roles: any[] = [];
  isLoading = true;
  //formUser: any = {};


  rolesSelect2Instance: any = null;
  paysSelect2Instance: any = null;

  constructor(private utilisateurService: UtilisateurService, private modalService: NgbModal, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
    this.loadPays();
  }

<<<<<<< HEAD
  showNotification(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    // cacher après 5 secondes
    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }
=======
  
>>>>>>> 14b31ab3f47908ea168ef56ef12479dd2df1faf5

  loadRoles() {
    this.utilisateurService.getRoles().subscribe(res => {
      this.roles = res;
    });
  }

  loadPays() {
    this.utilisateurService.getPays().subscribe(res => {
      this.countries = res;
    });
  }

  loadUsers(page: number = 1) {
    this.isLoading = true;
    this.utilisateurService.getUsers(page).subscribe({
      next: (res) => {
        this.users = res.data;
        this.currentPage = res.current_page;
        this.totalPages = res.last_page;
        this.totalUsers = res.total;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openModal(content: any, user: User | null = null) {
    this.destroySelect2();

    this.selectedUser = user ? { ...user } : {} as User;
    this.formUser = { ...this.selectedUser };
    this.errors = {};

    const modalRef = this.modalService.open(content, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    // Réinitialiser Select2 après l'ouverture de la modal
    setTimeout(() => {
      this.initializeSelect2();
      this.setSelect2Values();
    }, 100);

    // Nettoyer lors de la fermeture
    modalRef.result.finally(() => {
      this.destroySelect2();
    });
  }

  initializeSelect2() {
    const rolesElement = $('#roles');
    if (rolesElement.length && !rolesElement.hasClass('select2-hidden-accessible')) {
      this.rolesSelect2Instance = rolesElement.select2({
        width: '100%',
        placeholder: 'Sélectionnez les rôles',
        allowClear: true,
        multiple: true,
        dropdownParent: $('.modal-content') // Important pour le z-index dans les modals
      });

      this.rolesSelect2Instance.on('change', (e: any) => {
        this.formUser.roles = $(e.target).val();
      });
    }

    const paysElement = $('#pays_id');
    if (paysElement.length && !paysElement.hasClass('select2-hidden-accessible')) {
      this.paysSelect2Instance = paysElement.select2({
        width: '100%',
        placeholder: 'Sélectionnez un pays',
        dropdownParent: $('.modal-content')
      });

      this.paysSelect2Instance.on('change', (e: any) => {
        this.formUser.pays_id = $(e.target).val();
      });
    }
  }

  destroySelect2() {
    try {
      if (this.rolesSelect2Instance) {
        const rolesElement = $('#roles');
        if (rolesElement.hasClass('select2-hidden-accessible')) {
          rolesElement.select2('destroy');
        }
        this.rolesSelect2Instance = null;
      }

      if (this.paysSelect2Instance) {
        const paysElement = $('#pays_id');
        if (paysElement.hasClass('select2-hidden-accessible')) {
          paysElement.select2('destroy');
        }
        this.paysSelect2Instance = null;
      }

      $('.select2-container').remove();

    } catch (error) {
      console.log('Erreur lors du nettoyage Select2:', error);
    }
  }

  setSelect2Values() {
    // Définir les valeurs pour les rôles
    if (this.formUser.roles) {
      const roleNames = this.formUser.roles.map((role: any) =>
        typeof role === 'object' ? role.name : role
      );
      $('#roles').val(roleNames).trigger('change');
    }

    // Définir la valeur pour le pays
    if (this.formUser.pays_id) {
      $('#pays_id').val(this.formUser.pays_id.toString()).trigger('change');
    }
  }

  saveUser(formData: any) {
    // Préparer le payload
    const payload = {
      ...this.selectedUser,
      ...formData,
      roles: this.formUser.roles || [],
      pays_id: this.formUser.pays_id || null
    };

    console.log('Payload envoyé :', payload);

    const request = this.selectedUser.id
      ? this.utilisateurService.updateUser(payload)
      : this.utilisateurService.createUser(payload);

    request.subscribe({
      next: (res) => {
<<<<<<< HEAD
        console.log(this.selectedUser.id ? 'Update réussi :' : 'Création réussie :', res);
        this.modalService.dismissAll();
        this.loadUsers();
        this.showNotification(
          this.selectedUser.id
            ? 'Utilisateur modifié avec succès'
            : 'Utilisateur créé avec succès',
          'success'
        );
=======
        this.toastr.success('Enregistré avec succès', 'Succès');
        
>>>>>>> 14b31ab3f47908ea168ef56ef12479dd2df1faf5
      },
      error: (err : any) => {
        console.error(err);
        this.toastr.error(err.error?.message || 'Erreur serveur', 'Erreur');
      }
    });
  }

  deleteUser(userId?: number) {
    if (!userId) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    this.utilisateurService.deleteUser(userId).subscribe({
      next: (res) => {
        this.toastr.success(res.message, 'Succès');
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(err.error?.message || 'Erreur serveur', 'Erreur');
      }
    });
  }

}

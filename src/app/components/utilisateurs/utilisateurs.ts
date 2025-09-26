import { Component, OnInit } from '@angular/core';
import { UtilisateurService, User } from '../../services/utilisateur.service';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  totalUsers = 0; // ajouté
  pages: number[] = []; // ajouté
  selectedUser: User = {} as User; // éviter le ?. dans ngModel
  errors: any = {};
  countries: any[] = []; // à remplir si nécessaire
  roles: any[] = []; // à remplir si nécessaire

  formUser: User = {} as User;
  isLoading = true;

  constructor(private utilisateurService: UtilisateurService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadUsers();
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
  // loadUsers(page: number = 1) {
  //   if (page < 1 || (this.totalPages && page > this.totalPages)) return;

  //   this.utilisateurService.getUsers(page).subscribe(res => {
  //     this.users = res.data;
  //     this.currentPage = res.current_page;
  //     this.totalPages = res.last_page;
  //     this.totalUsers = res.total; // récupère le total depuis ton API

  //     // Générer un tableau pour la pagination
  //     this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  //   });
  // }

  openModal(content: any, user: User | null = null) {
    this.selectedUser = user ? { ...user } : {} as User;
    this.formUser = { ...this.selectedUser }; // copie pour le formulaire
    this.modalService.open(content, { size: 'lg' });
    this.errors = {};
  }

  saveUser(formData: any) {
    const payload = { ...this.selectedUser, ...formData };

    if (this.selectedUser.id) {
      this.utilisateurService.updateUser(payload).subscribe({
        next: () => this.loadUsers(),
        error: (err) => (this.errors = err.error.errors)
      });
    } else {
      this.utilisateurService.createUser(payload).subscribe({
        next: () => this.loadUsers(),
        error: (err) => (this.errors = err.error.errors)
      });
    }
  }


  deleteUser(userId?: number) {
    if (!userId) return; // ignorer si undefined
    if (!confirm('Are you sure?')) return;
    this.utilisateurService.deleteUser(userId).subscribe(() => this.loadUsers());
  }


  onFileChange(event: any) {
    // gérer l'image ici
  }
}

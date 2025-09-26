import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { EntrepriseService, Entreprise } from '../../services/entreprise.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-configuration-generale',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './configuration-generale.html',
  styleUrls: ['./configuration-generale.scss']
})
export class ConfigurationGeneraleComponent implements OnInit {
  entreprise: Entreprise = {
    nom: '',
    logo: '',
    contact: '',
    ncc: '',
    adresse: '',
    email: ''
  };

  errors: any = {};

  constructor(
    private service: EntrepriseService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.service.getEntreprise().subscribe(data => {
      this.entreprise = data;
    });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    this.service.updateEntreprise(this.entreprise).subscribe({
      next: () => {
        this.errors = {};
        this.toastr.success('Entreprise mise à jour avec succès !', 'Succès');
      },
      error: (err) => {
        if (err.status === 422) {
          this.errors = err.error.errors; // messages de validation Laravel
        }
      }
    });
  }
}

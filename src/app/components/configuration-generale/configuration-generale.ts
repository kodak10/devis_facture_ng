import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ConfigurationGeneraleService, ConfigurationGenerale } from '../../services/configuration.service';
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
  configuration: ConfigurationGenerale = {
    nom: '',
    logo: '',
    contact: '',
    ncc: '',
    adresse: '',
    email: ''
  };

  errors: any = {};
  globalError: string | null = null;
  logoFile?: File;

  constructor(
    private service: ConfigurationGeneraleService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.service.getConfigurationGenerale().subscribe({
      next: (data) => this.configuration = data,
      error: (err) => this.globalError = 'Impossible de charger la configuration.'
    });
  }

  onFileChange(event: any) {
  if (event.target.files && event.target.files.length > 0) {
    this.logoFile = event.target.files[0];

    const reader = new FileReader();
    reader.onload = (e: any) => this.configuration.logo = e.target.result;
    if (this.logoFile) {
      reader.readAsDataURL(this.logoFile);
    }
  }
}

  onSubmit(form: NgForm) {
  if (!form.valid) return;

  this.service.updateConfigurationGenerale(this.configuration, this.logoFile).subscribe({
    next: (res) => {
      this.toastr.success(res.message, 'Succès');
      this.errors = {};
      this.globalError = null;
      this.configuration = res.config;
    },
    error: (err) => {
      if (err.status === 422) {
        this.errors = err.error.errors;
        this.globalError = err.error.message || 'Erreur de validation';
      } else {
        this.globalError = 'Une erreur est survenue, veuillez réessayer.';
      }
    }
  });
}
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ConfigurationGenerale {
  id?: number;
  nom: string;
  logo: string;
  contact: string;
  ncc: string;
  adresse: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class ConfigurationGeneraleService {
  private apiUrl = 'http://localhost:8000/api/entreprise';

  constructor(private http: HttpClient) {}

  getConfigurationGenerale(): Observable<ConfigurationGenerale> {
    return this.http.get<ConfigurationGenerale>(this.apiUrl);
  }

  updateConfigurationGenerale(data: ConfigurationGenerale, file?: File): Observable<any> {
  const formData = new FormData();

  formData.append('nom', data.nom ?? '');
  formData.append('contact', data.contact ?? '');
  formData.append('ncc', data.ncc ?? '');
  formData.append('adresse', data.adresse ?? '');
  formData.append('email', data.email ?? '');

  if (file) {
    formData.append('logo', file, file.name);
  }

  return this.http.post<any>(this.apiUrl, formData);
}



}

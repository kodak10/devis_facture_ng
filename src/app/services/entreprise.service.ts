import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Entreprise {
  nom: string;
  logo: string;
  contact: string;
  ncc: string;
  adresse: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class EntrepriseService {
  private apiUrl = 'http://localhost:8000/api/entreprise'; // API Laravel

  constructor(private http: HttpClient) {}

  getEntreprise(): Observable<Entreprise> {
    return this.http.get<Entreprise>(this.apiUrl);
  }

  // ← Nouvelle méthode pour mettre à jour l'entreprise
  updateEntreprise(data: Entreprise): Observable<Entreprise> {
    return this.http.put<Entreprise>(this.apiUrl, data);
  }
}

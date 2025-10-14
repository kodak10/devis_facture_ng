// services/devis.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DevisLigne {
  designation_id: number;
  quantite: number;
  prix_unitaire: number;
  remise: number;
  prix_net: number;
  total: number;
  designation?: {
    id: number;
    libelle: string;
    prix_unitaire: number;
  };
}

export interface TravelsCreate {
  nom_prenom?: string;
  date?: string;
  lieu?: string ;
  debut?: string;
  fin?: string;
  motif?: string;
  montant_en_chiffre?: string;
  montant_en_lettre?: string;
  billet_avion?: string;
  cheque?: string;
  hebergement_repars?: string;
  especes?: string;
  totale?: string;
}

export interface Travels extends TravelsCreate {
  id: number;
  nom_prenom?: string;
  date?: string;
  lieu?: string ;
  debut?: string;
  fin?: string;
  motif?: string;
  montant_en_chiffre?: string;
  montant_en_lettre?: string;
  billet_avion?: string;
  cheque?: string;
  hebergement_repars?: string;
  especes?: string;
  totale?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TravelsService {
  private apiUrl = 'http://127.0.0.1:8000/api/travel';
  // private apiUrl = 'http://192.168.1.13:8000/api/devis';

  constructor(private http: HttpClient) {}

  getTravels(): Observable<Travels[]> {
    return this.http.get<Travels[]>(this.apiUrl);
  }

  createTravels(travel: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, travel);
  }

  getTravelsById(id: number): Observable<Travels> {
    return this.http.get<Travels>(`${this.apiUrl}/${id}`);
  }

  updateTravels(travel: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${travel.id}`, travel);
  }

getPdfUrl(travelId: number): void {
  const url = `${this.apiUrl}/${travelId}/pdf`;
  window.open(url, '_blank'); // ouvre dans un nouvel onglet
}

  deleteTravels(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

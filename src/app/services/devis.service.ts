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

export interface DevisCreate {
  date_echeance: string;
  date_emission: string;
  client_id: number | null;
  banque_id: number | null;
  generate_num_proforma?: boolean;
  devise_depart?: string;
  devise_arrivee?: string;
  devise?: string;
  taux?: number;
  tva?: number;
  commande?: number;
  livraison?: number;
  validite_offre?: number;
  delai_type?: string;
  delai_jours?: number;
  delai_de?: number;
  delai_a?: number;
  total_ht?: number;
  total_tva?: number;
  total_ttc?: number;
  acompte?: number;
  solde?: number;
}

export interface Devis extends DevisCreate {
  id: number;
  date?: string;
  client_name?: string;
  total_ht: number;
  tva: number;
  total_ttc: number;
  status: string;
  num_proforma?: string;
  pdf_url?: string;
  validite?: number;
  delai_type?: string;
  delai_jours?: number;
  delai_de?: number;
  delai_a?: number;
  lignes?: DevisLigne[];
  // Ajouter tous les champs qui peuvent être retournés par l'API
  pdf_path?: string;
  pays_id?: number;
  user_id?: number;
  texte?: string;
  message?: string;
  created_at?: string;
  updated_at?: string;
  banque_name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DevisService {
  private apiUrl = 'http://127.0.0.1:8000/api/devis';
  // private apiUrl = 'http://192.168.1.13:8000/api/devis';

  constructor(private http: HttpClient) {}

  getDevis(): Observable<Devis[]> {
    return this.http.get<Devis[]>(this.apiUrl);
  }

  createDevis(devis: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, devis);
  }

  getDevisById(id: number): Observable<Devis> {
    return this.http.get<Devis>(`${this.apiUrl}/${id}`);
  }

  updateDevis(devis: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${devis.id}`, devis);
  }

getPdfUrl(devisId: number): void {
  const url = `${this.apiUrl}/${devisId}/pdf`;
  window.open(url, '_blank'); // ouvre dans un nouvel onglet
}

  deleteDevis(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

// services/devis.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders  } from '@angular/common/http';
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
  user_name?: string;
  pays_name?: string;
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
  pdf_path?: string;
  pays_id?: number;
  user_id?: number;
  texte?: string;
  message?: string;
  created_at?: string;
  updated_at?: string;
  banque_name?: string;
  notes?: string;

}

@Injectable({
  providedIn: 'root'
})
export class DevisService {
  // private apiUrl = 'http://127.0.0.1:8000/api/devis';
  private apiUrl = 'http://192.168.1.75:8000/api/devis';

  constructor(private http: HttpClient) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : ''
      })
    };
  }

  getDevis(filters?: { date_debut?: string; date_fin?: string }): Observable<Devis[]> {
    let params = new HttpParams();
    
    if (filters?.date_debut) {
      params = params.set('date_debut', filters.date_debut);
    }
    
    if (filters?.date_fin) {
      params = params.set('date_fin', filters.date_fin);
    }

    return this.http.get<Devis[]>(this.apiUrl, { params, ...this.getHeaders() },);
  }

  createDevis(devis: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, devis, this.getHeaders());
  }

  getDevisById(id: number): Observable<Devis> {
    return this.http.get<Devis>(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  updateDevis(devis: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${devis.id}`, devis, this.getHeaders());
  }

  updateStatut(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/send-devis`, {}, this.getHeaders()); 
  }

  refuseProforma(id: number, message: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/refuse-devis`, { message }, this.getHeaders()); 
  }

  getSuivi(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl.replace('/devis', '')}/suivi`, this.getHeaders());
  }

  getPdfUrl(devisId: number): void {
    const url = `${this.apiUrl}/${devisId}/pdf`;
    window.open(url, '_blank'); // ouvre dans un nouvel onglet
  }

  deleteDevis(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }
  
}
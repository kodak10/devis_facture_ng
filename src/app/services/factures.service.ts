// services/factures.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Facture {
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
  type_facture?: 'Totale' | 'Partielle';
  montant?: number;
  net_a_payer?: number;
  devis_id?: number;
  num_bc?: string;
  num_rap?: string;
  num_bl?: string;
  remise_speciale?: string;
  numero?: string;
  libelle?: string;

}

export interface FactureCreate {
  pays_name?: string;
  devis_id: number;
  banque_id: number;
  client_id: number;
  num_bc: string;
  num_rap?: string;
  num_bl?: string;
  remise_speciale: string;
  type_facture: 'Totale' | 'Partielle';
  net_a_payer?: number;
  montant?: number;
  selected_items?: number[];
  libelle?: string;
}

export interface Designation {
  id: number;
  libelle: string;
  prix_unitaire: number;
  description?: string;
  unite?: string;
}

export interface DevisLigne {
  id: number;
  designation: Designation;
  libelle: string;
  quantite: number;
  prix_unitaire: number;
  total: number;
  devise: string;
}

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = 'http://192.168.1.75:8000/api/factures';

  constructor(private http: HttpClient) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : ''
      })
    };
  }

  getFactures(filters?: { date_debut?: string; date_fin?: string }): Observable<Facture[]> {
    let params = new HttpParams();
    
    if (filters?.date_debut) {
      params = params.set('date_debut', filters.date_debut);
    }
    
    if (filters?.date_fin) {
      params = params.set('date_fin', filters.date_fin);
    }

    return this.http.get<Facture[]>(this.apiUrl, { params, ...this.getHeaders() });
  }

  getDevisById(id: number): Observable<any> {
    return this.http.get<any>(`http://192.168.1.75:8000/api/devis/${id}`, this.getHeaders());
  }

  createFacture(facture: FactureCreate): Observable<any> {
    return this.http.post<any>(this.apiUrl, facture, this.getHeaders());
  }

  createFacturePartielle(factureData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, factureData, this.getHeaders());
  }

  createFactureTotale(factureData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, factureData, this.getHeaders());
  }

  getPdfUrl(factureId: number): void {
    const url = `${this.apiUrl}/${factureId}/pdf`;
    window.open(url, '_blank');
  }

  getDevisPdfUrl(devisId: number): void {
    const url = `http://192.168.1.75:8000/api/devis/${devisId}/pdf`;
    window.open(url, '_blank');
  }

  updateFacture(facture: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${facture.id}`, facture, this.getHeaders());
  }

  validateFacture(factureId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${factureId}/validate`, {}, this.getHeaders());
  }

  refuseFacture(id: number, message: string): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/${id}/refuse-facture`, { message }, this.getHeaders()); 
  }
  

  openDevisUrl(devisId: number): void {
    if (!devisId) return;
    const url = `http://192.168.1.75:8000/api/devis/${devisId}/pdf`;
    window.open(url, '_blank');
  }


  ajouterPaiement(factureId: number, montant: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${factureId}/paiements`, { montant }, this.getHeaders());
  }

  getHistoriquePaiements(factureId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${factureId}/paiements`, this.getHeaders());
  }

  deleteFacture(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }
}
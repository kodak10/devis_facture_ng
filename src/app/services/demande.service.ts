import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Demande {
  id?: number;
  document_justificatif?: any;
  motif_permi?: string;
  motif?: string;
  montant_demande?: number;
  lieu_travail?: string;
  payement?: number;
  heure_debut?: string;
  heure_fin?: string;
  type?: string;
  statut?: string;
  nombre_de_jours?: number;
  user_id?: number;
  direction_id?: number;
  filliale_id?: number;
  dem_vers_objets_id?: number;
  type_demandes_id?: number;
  created_by?: number;
}

@Injectable({ providedIn: 'root' })
export class DemandeService {
  private apiUrl = 'http://localhost:8000/api/demande';
  // private apiUrl = 'http://192.168.1.13:8000/api/clients';

  constructor(private http: HttpClient) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : ''
      })
    };
  }

  getDemandes(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}`, this.getHeaders());
  }

  createDemandes(demande: Demande): Observable<Demande> {
    return this.http.post<Demande>(`${this.apiUrl}/store`, demande, this.getHeaders());
  }

  updateDemandes(demande: Demande): Observable<Demande> {
    return this.http.put<Demande>(`${this.apiUrl}/update/${demande.id}`, demande, this.getHeaders());
  }

  updateStatutDemandes(id: number, statut: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/statut`, { statut }, this.getHeaders());
  }

  deleteDemandes(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, this.getHeaders());
  }
}


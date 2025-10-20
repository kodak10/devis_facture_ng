import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Congers {
  id?: number;
  document_justificatif?: any;
  date_fin?: string;
  date_depart?: Date;
  dem_objets?: string;
  motif_permi?: string;
  motif?: string;
  lieu_travail?: string;
  type?: string;
  statut?: string;
  nombre_de_jours?: number;
  user_id?: number;
  direction_id?: number;
  filliale_id?: number;
  type_demandes_id?: number;
  created_by?: number;
}

@Injectable({ providedIn: 'root' })
export class CongerService {
  private apiUrl = 'http://localhost:8000/api/congers';
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

  getCongers(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/conger?page=${page}`, this.getHeaders());
  }

  createCongers(conger: Congers): Observable<Congers> {
    return this.http.post<Congers>(`${this.apiUrl}/storeconger`, conger, this.getHeaders());
  }

  updateCongers(conger: Congers): Observable<Congers> {
    return this.http.put<Congers>(`${this.apiUrl}/update/conger/${conger.id}`, conger, this.getHeaders());
  }

  updateStatutCongers(id: number, statut: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/statut`, { statut }, this.getHeaders());
  }

  deleteCongers(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/conger/${id}`, this.getHeaders());
  }
}

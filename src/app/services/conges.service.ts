import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getCongers(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/conger?page=${page}`);
  }

  createCongers(conger: Congers): Observable<Congers> {
    return this.http.post<Congers>(`${this.apiUrl}/storeconger`, conger);
  }

  updateCongers(conger: Congers): Observable<Congers> {
    return this.http.patch<Congers>(`${this.apiUrl}/update/conger/${conger.id}`, conger);
  }

  deleteCongers(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/conger/${id}`);
  }
}

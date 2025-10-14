import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Absence {
  id?: number;
  document_justificatif?: any;
  date_fin?: Date;
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
export class AbsenceService {
  private apiUrl = 'http://localhost:8000/api/absence';
  // private apiUrl = 'http://192.168.1.13:8000/api/clients';

  constructor(private http: HttpClient) {}

  getAbsences(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/absence?page=${page}`);
  }

  createAbsences(absence: Absence): Observable<Absence> {
    return this.http.post<Absence>(`${this.apiUrl}/storeabsence`, absence);
  }

  updateAbsences(absence: Absence): Observable<Absence> {
    return this.http.patch<Absence>(`${this.apiUrl}/updates/${absence.id}`, absence);
  }

  deleteAbsences(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deletes/${id}`);
  }
}

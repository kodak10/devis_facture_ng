import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Permissions {
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
export class permissionsService {
  private apiUrl = 'http://localhost:8000/api/permission';
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

  getPermissions(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/permission?page=${page}`, this.getHeaders());
  }

  createPermissions(permissions: Permissions): Observable<Permissions> {
    return this.http.post<Permissions>(`${this.apiUrl}/storepermission`, permissions, this.getHeaders());
  }

  updatePermissions(permissions: Permissions): Observable<Permissions> {
    return this.http.put<Permissions>(`${this.apiUrl}/updates/permission/${permissions.id}`, permissions, this.getHeaders());
  }

  updateStatutPermissions(id: number, statut: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/statut`, { statut }, this.getHeaders());
  }

  deletePermissions(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deletes/permission/${id}`, this.getHeaders());
  }
}

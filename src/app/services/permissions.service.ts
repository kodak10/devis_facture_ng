import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getPermissions(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/permission?page=${page}`);
  }

  createPermissions(permissions: Permissions): Observable<Permissions> {
    return this.http.post<Permissions>(`${this.apiUrl}/storepermission`, permissions);
  }

  updatePermissions(permissions: Permissions): Observable<Permissions> {
    return this.http.patch<Permissions>(`${this.apiUrl}/updates/permission/${permissions.id}`, permissions);
  }

  deletePermissions(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deletes/permission/${id}`);
  }
}

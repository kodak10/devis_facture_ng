import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Designation {
  id?: number;
  reference: string;
  libelle: string;
  description?: string;
  prix_unitaire: number;
}

@Injectable({ providedIn: 'root' })
export class DesignationService {
  // private apiUrl = 'http://localhost:8000/api/designations';
  private apiUrl = 'http://192.168.1.13:8000/api/designations';

  constructor(private http: HttpClient) {}

  getDesignations(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}`);
  }

  createDesignation(designation: Designation): Observable<Designation> {
    return this.http.post<Designation>(this.apiUrl, designation);
  }

  updateDesignation(designation: Designation): Observable<Designation> {
    return this.http.put<Designation>(`${this.apiUrl}/${designation.id}`, designation);
  }

  deleteDesignation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  

}

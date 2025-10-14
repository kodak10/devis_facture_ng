import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Categorie {
  id: number;
  nom: string;
}


export interface Designation {
  id?: number;
  reference: string;
  libelle: string;
  description?: string;
  prix_unitaire: number;
  categorie_id?: number;
  categorie?: Categorie; 
}

@Injectable({ providedIn: 'root' })
export class DesignationService {
  // private apiUrl = 'http://localhost:8000/api/designations';
  private apiUrl = 'http://192.168.1.75:8000/api/designations';

  constructor(private http: HttpClient) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : ''
      })
    };
  }

  getDesignations(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}`, this.getHeaders());
  }

  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>('http://192.168.1.75:8000/api/categories', this.getHeaders());
  }


  createDesignation(designation: Designation): Observable<Designation> {
    return this.http.post<Designation>(this.apiUrl, designation, this.getHeaders());
  }

  updateDesignation(designation: Designation): Observable<Designation> {
    return this.http.put<Designation>(`${this.apiUrl}/${designation.id}`, designation, this.getHeaders());
  }

  deleteDesignation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }
  

}

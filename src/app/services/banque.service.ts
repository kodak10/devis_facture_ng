import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Banque {
  id?: number;
  name: string;
  num_compte: string;
}

@Injectable({ providedIn: 'root' })
export class BanqueService {
  private apiUrl = 'http://localhost:8000/api/banques';
  // private apiUrl = 'http://192.168.1.13:8000/api/banques';

  constructor(private http: HttpClient) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : ''
      })
    };
  }

  getBanques(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}`, this.getHeaders());
  }

  createBanque(banque: Banque): Observable<Banque> {
    return this.http.post<Banque>(this.apiUrl, banque, this.getHeaders());
  }

  updateBanque(banque: Banque): Observable<Banque> {
    return this.http.put<Banque>(`${this.apiUrl}/${banque.id}`, banque, this.getHeaders());
  }

  deleteBanque(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }
}

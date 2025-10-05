import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Banque {
  id?: number;
  name: string;
  num_compte: string;
}

@Injectable({ providedIn: 'root' })
export class BanqueService {
  // private apiUrl = 'http://localhost:8000/api/banques';
  private apiUrl = 'http://192.168.1.13:8000/api/banques';

  constructor(private http: HttpClient) {}

  getBanques(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}`);
  }

  createBanque(banque: Banque): Observable<Banque> {
    return this.http.post<Banque>(this.apiUrl, banque);
  }

  updateBanque(banque: Banque): Observable<Banque> {
    return this.http.put<Banque>(`${this.apiUrl}/${banque.id}`, banque);
  }

  deleteBanque(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

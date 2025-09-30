import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Devis {
  id: number;
  date: string;
  client_id: number;
  client_name?: string;
  date_emission: string;
  date_echeance: string;
  total_ht: number;
  tva: number;
  total_ttc: number;
  status: string;
  num_proforma?: string;
  // Ajoute d'autres champs si nécessaire
}

@Injectable({
  providedIn: 'root'
})
export class DevisService {
  private apiUrl = 'http://127.0.0.1:8000/api/devis';

  constructor(private http: HttpClient) {}

  getDevis(): Observable<Devis[]> {
    return this.http.get<Devis[]>(this.apiUrl);
  }
//   getDevis(): Observable<Devis[]> {
//     return this.http.get<{ devis: Devis[] }>(this.apiUrl)
//         .pipe(
//         map(res => res.devis)  // On récupère uniquement le tableau
//         );
//     }


  createDevis(devis: Devis): Observable<Devis> {
    return this.http.post<Devis>(this.apiUrl, devis);
  }

  updateDevis(devis: Devis): Observable<Devis> {
    return this.http.put<Devis>(`${this.apiUrl}/${devis.id}`, devis);
  }

  deleteDevis(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

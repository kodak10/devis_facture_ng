// services/devise.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Devise {
  id: number;
  code: string;
  nom: string;
  symbole: string;
}

export interface TauxChange {
  [devise: string]: number;
}

@Injectable({
  providedIn: 'root'
})
export class DeviseService {
  // private apiUrl = 'http://127.0.0.1:8000/api';
  private apiUrl = 'http://192.168.1.13:8000/api';

  private exchangeApiKey = 'd4a11ade825bdc9907f23c6a';

  private defaultDevises: Devise[] = [
    { id: 1, code: 'XOF', nom: 'Franc CFA', symbole: 'FCFA' },
    { id: 2, code: 'EUR', nom: 'Euro', symbole: '€' },
    { id: 3, code: 'USD', nom: 'Dollar US', symbole: '$' }
  ];

  // Taux par défaut plus réalistes
  private defaultTaux: TauxChange = {
    'EUR': 0.0015,  // 1 XOF = 0.0015 EUR
    'USD': 0.0016,  // 1 XOF = 0.0016 USD
    'XOF': 1
  };

  constructor(private http: HttpClient) {}

  getDevises(): Observable<Devise[]> {
    return this.http.get<Devise[]>(`${this.apiUrl}/devises`).pipe(
      catchError((error) => {
        console.warn('Erreur API devises, utilisation des devises par défaut:', error);
        return of(this.defaultDevises);
      }),
      map((response: any) => {
        if (Array.isArray(response)) {
          return response;
        } else if (response && response.data) {
          return response.data;
        } else {
          return this.defaultDevises;
        }
      })
    );
  }

  getTauxChange(baseDevise: string = 'XOF'): Observable<TauxChange> {
    return this.http.get<TauxChange>(`${this.apiUrl}/taux-change?base=${baseDevise}`).pipe(
      catchError((error) => {
        console.warn('Erreur API taux change, utilisation de taux par défaut:', error);
        return of(this.defaultTaux);
      })
    );
  }

  getTauxChangeDirect(): Observable<any> {
    return this.http.get(`https://v6.exchangerate-api.com/v6/${this.exchangeApiKey}/latest/XOF`).pipe(
      catchError((error) => {
        console.error('Erreur API taux change direct:', error);
        throw error;
      })
    );
  }
}
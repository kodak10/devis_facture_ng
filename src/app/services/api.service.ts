// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://192.168.1.75:8000/api'; // ton URL API

  constructor(private http: HttpClient) {}

  /**
   * Retourne les headers avec token si connecté
   */
  getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : ''
      })
    };
  }

  /**
   * Construit l'URL complète
   */
  url(path: string): string {
    return `${this.baseUrl}/${path}`;
  }

  // Optionnel: wrapper GET / POST / PUT / DELETE
  get(path: string, params: any = {}) {
    return this.http.get(this.url(path), { ...this.getHeaders(), params });
  }

  post(path: string, body: any) {
    return this.http.post(this.url(path), body, this.getHeaders());
  }

  put(path: string, body: any) {
    return this.http.put(this.url(path), body, this.getHeaders());
  }

  delete(path: string) {
    return this.http.delete(this.url(path), this.getHeaders());
  }
}

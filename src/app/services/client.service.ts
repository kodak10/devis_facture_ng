import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Client {
  id?: number;
  nom: string;
  numero_cc: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  attn?: string;
  email?: string;
  created_by?: number;
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  // private apiUrl = 'http://localhost:8000/api/clients';
  private apiUrl = 'http://192.168.1.75:8000/api/clients';

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : ''
      })
    };
  }

  constructor(private http: HttpClient) {}

  getClients(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}`, this.getHeaders());
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client, this.getHeaders());
  }

  updateClient(client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${client.id}`, client, this.getHeaders());
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }
}

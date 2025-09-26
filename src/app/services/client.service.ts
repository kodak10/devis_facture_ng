import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private apiUrl = 'http://localhost:8000/api/clients';

  constructor(private http: HttpClient) {}

  getClients(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}`);
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  updateClient(client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${client.id}`, client);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

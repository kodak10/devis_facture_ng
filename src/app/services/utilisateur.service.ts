import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Role {
  id: number;
  name: string;
  guard_name?: string;
}

export interface Pays {
  id: number;
  name: string;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  status: boolean;
  pays_id?: number;
  phone?: string;
  adresse?: string;
  image?: string;
  roles: Role[];
}

@Injectable({ providedIn: 'root' })
export class UtilisateurService {
  // private apiUrl = 'http://localhost:8000/api/users';
  private apiUrl = 'http://192.168.1.13:8000/api/users';


  constructor(private http: HttpClient) {}

  getUsers(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}`);
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>('http://localhost:8000/api/roles');
  }

  getPays(): Observable<Pays[]> {
    return this.http.get<Pays[]>('http://localhost:8000/api/pays');
  }


  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

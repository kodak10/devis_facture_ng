import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {
  private api = 'http://localhost:8000/api';
  // private api = 'http://192.168.1.75:8000/api'; // adapte

  constructor(private http: HttpClient) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : ''
      })
    };
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.api}/login`, { email, password });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.api}/logout`, {}, this.getHeaders());
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.api}/forgot-password`, { email },);
  }

  resetPassword(email: string, token: string, password: string, password_confirmation: string): Observable<any> {
    return this.http.post(`${this.api}/reset-password`, { email, token, password, password_confirmation });
  }
}

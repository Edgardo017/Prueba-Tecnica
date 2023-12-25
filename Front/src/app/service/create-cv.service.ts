import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../Interfaces/User';
import { Router } from '@angular/router';
import { WorkExperience  } from '../Interfaces/WorkExperience';

@Injectable({
  providedIn: 'root',
})
export class CreateCvService {
  constructor(private http: HttpClient, private router: Router) {}

  requestAddCv(user: User, exp: WorkExperience[]): Observable<any> {
    const token = localStorage.getItem('token');
  
    if (token) {
      const headers = new HttpHeaders({
        Authorization: token,
      });
  
      const data = {
        user: user,
        workExperience: exp,
      };
  
      console.log(data.workExperience[0].company);
  
      return this.http.post('http://localhost:8080/api/actualizarCv', data, {
        headers: headers,
        responseType: 'text',
      }).pipe(
        tap((response) => {
          if (response === 'Sesion Expirada') {
            this.router.navigate(['/login']);
            localStorage.removeItem('token');
            throw new Error('Sesión Expirada');
          } else if (response === 'Error 403') {
            throw new Error('No se pudo actualizar el cv');
          }
        }),
        catchError(this.handleError)
      );
    } else {
      throw new Error('No se encontró un token de autenticación');
    }
  }
  

  requestDataCV(): Observable<any> {
    const token = localStorage.getItem('token');
  
    if (token) {
      const headers = new HttpHeaders({
        Authorization: token,
      });
  
      return this.http.get('http://localhost:8080/api/requestCv', { headers }).pipe(
        tap((response) => {
          console.log('Response from server:', response);
          if (response === 'Token Expirado') {
            this.router.navigate(['/login'], { queryParams: { alert: 'Sesión Expirada' } });
            localStorage.removeItem('token');
            throw new Error('Sesión Expirada');
          }
  
          if (response === 'Usuario no encontrado') {
            localStorage.removeItem('token');
            this.router.navigate(['/login'], { queryParams: { alert: 'Error' } });
            throw new Error('Usuario no encontrado');
          }
        }),
        catchError((error) => this.handleError(error))
      );
    } else {
      throw new Error('No se encontró un token de autenticación');
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.message;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}

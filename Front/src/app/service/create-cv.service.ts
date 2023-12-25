import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../Interfaces/User';
import { Router } from '@angular/router';
import { WorkExperience  } from '../Interfaces/WorkExperience';
import { Certifications  } from '../Interfaces/Certifications';
import { Skills  } from '../Interfaces/Skills';

@Injectable({
  providedIn: 'root',
})
export class CreateCvService {
  constructor(private http: HttpClient, private router: Router) {}

  updateCurriculum(user: User, exp: WorkExperience[], est: Certifications[], sk: Skills[]): Observable<any> {
    const token = localStorage.getItem('token');
  
    if (token) {
      const headers = new HttpHeaders({
        Authorization: token,
      });
  
      const data = { 
        user: user,
        workExperience: exp,
        certifications: est,
        skills: sk,
      };
    
      return this.http.post('http://localhost:8080/api/actualizarCv', data, {
        headers: headers,
        responseType: 'json',
      }).pipe(
        tap((response) => {
          if (response === 'Sesion Expirada') {
            this.router.navigate(['/login']);
            localStorage.removeItem('token');
            throw new Error('Sesión Expirada');
          } else if (response === 'Error 403') {
            // Mostrar alerta en caso de error 403
            alert('No se pudo actualizar el CV');
            throw new Error('No se pudo actualizar el CV');
          } else if (response === null) {
            // Mostrar alerta si la respuesta es nula
            alert('La actualización del CV falló');
            throw new Error('La actualización del CV falló');
          }
        }),
        catchError(this.handleError)
      );
    } else {
      throw new Error('No se encontró un token de autenticación');
    }
  }
  
  

  getCurriculum(): Observable<any> {
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

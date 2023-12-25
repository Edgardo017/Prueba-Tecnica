import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VerCurriculumsService {

  constructor(private http: HttpClient, private router: Router) {}

  verCurriculum(usuario: string): Observable<any> {
    return this.http.post('http://localhost:8080/verCurriculum', usuario, { responseType: 'json' })
      .pipe(
        tap((respuesta: any) => {
          if (respuesta === 'Usuario no encontrado') {
            alert('Usuario no encontrado')
          } else if (respuesta === 'Error de solicitud') {
            alert('Error de solicitud')
          }
        }),
        catchError(this.handleError)
      );
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

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../Interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private http: HttpClient) { }

  requestLogin(credentials: User): Observable<any> {
    return this.http.post("http://localhost:8080/api/register", credentials, { responseType: 'text' }).pipe(
      tap((response) => {
        if (response === "error 401") 
          throw new Error('Error 401: No se pudo registrar el usuario (elige otro username)');
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

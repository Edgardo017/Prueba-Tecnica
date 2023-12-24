import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../Interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) { }

  requestLogin(credentials: User): Observable<any> {
    return this.http.post("http://localhost:8080/api/login", credentials, { responseType: 'text' }).pipe(
      tap((response) => {
        if (response === "error 401") {
          throw new Error('Error 401: Nombre de usuario o contraseña incorrecto');
        } else {
          console.log("token" + response);
          localStorage.setItem("token", response);
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

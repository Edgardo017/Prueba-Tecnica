import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../Interfaces/User';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',

})
export class CreateCvService {
  constructor(private http: HttpClient, private router: Router) { }

  requestAddCv(credentials: User): Observable<any> {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
    console.log("requiriendo actualizar cv2")

    // Verificar si hay un token almacenado
    if (token) {
      // Crear un encabezado con el token
      const headers = new HttpHeaders({
        'Authorization':token
      });
  
      // Realizar la solicitud HTTP con el encabezado y el cuerpo de datos (credentials)
      return this.http.post("http://localhost:8080/api/actualizarCv", credentials, { headers: headers, responseType: 'text' }).pipe(
        tap((response) => {
          if (response === "Sesion Expirada") {
             this.router.navigate(['/login']);
             localStorage.removeItem('token');
             throw new Error('Sesion Expirada');
          }else if (response === "Error 403")
              throw new Error('No se puedo Actualizar el cv');
        }),
        catchError(this.handleError)
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User } from '../../Interfaces/User';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private router: Router, private loginService: LoginService ) { }

  error: string = '';

  loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  get username() {
    return this.loginForm.controls.username;
  }

  get password() {
    return this.loginForm.controls.password;
  }


  requestLogin() {
    if (this.loginForm.valid) {
      this.error = '';
      this.loginService.requestLogin(this.loginForm.value as User).subscribe({
        next: (userData) => {
          alert("Sesion Iniciada");
          this.loginForm.reset();
          this.router.navigate(['/crearCv']);
          return;
        },
        error: (errorData) => {
          alert(errorData);
          this.error = errorData;
          return;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      if (this.username.errors?.['required']) {
        this.error = 'Falta el nombre de usuario.';
      } else if (this.password.errors?.['required']) {
        this.error = 'Falta la contraseña.';
      } else {
        this.error = 'Faltaron Datos.';
      }
      alert(this.error);
    }
  }

  ngOnInit(): void {
  }
}
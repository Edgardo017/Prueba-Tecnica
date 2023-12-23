import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private router: Router ) { }

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
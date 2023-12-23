import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl  } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private formBuilder: FormBuilder, private router: Router ) { }
  registrationForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_]).{8,}$/)
      ],
    ],
    repassword: ['', Validators.required],
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    dni: ['', [Validators.required, Validators.pattern(/[0-9]{8,}/)]],
    telf: ['', [Validators.required, Validators.pattern(/[0-9]{9,}/)]],
  })

  togglePassword(fieldId: string) {
    const field = document.getElementById(fieldId) as HTMLInputElement;
    if (field.type === 'password') {
      field.type = 'text';
    } else {
      field.type = 'password';
    }
  }
  get username() {
    return this.registrationForm.controls.username;
  }
  
  get password() {
    return this.registrationForm.controls.password;

  }
  
  get repassword() {
    return this.registrationForm.controls.repassword;
  }
  
  get name() {
    return this.registrationForm.controls.name;
  }
  
  get lastname() {
    return this.registrationForm.controls.lastname;
  }
  
  get dni() {
    return this.registrationForm.controls.dni;
  }
  
  get telf() {
    return this.registrationForm.controls.telf;
  }
  

  
  requestRegistration() {
    if (this.registrationForm.valid) {
      if (this.password.value !== this.repassword.value) {
        // Lógica para manejar el caso de que las contraseñas no coincidan
        alert('Las contraseñas no coinciden');
        return;
      }
 
    } else {
      alert("Debes LLenar Correctamente todos los campos")
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../Interfaces/User';
import { RegisterService } from '../../service/register.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private formBuilder: FormBuilder, private router: Router, private registerService: RegisterService ) { }
  error: string = '';

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
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    dni: ['',  [Validators.required, Validators.pattern(/[0-9]{8,}/)]],
    phone: ['', [Validators.required, Validators.pattern(/[0-9]{9,}/)]],
  })

  validatePassword(): string[] {
    console.log("x")
    const passwordControl = this.registrationForm.controls.password;
    const errors: string[] = [];
    
    if (!passwordControl || !passwordControl.value || passwordControl.value.trim() === '') {
      errors.push('La contraseña es obligatoria.');
    } else {
      const password = passwordControl.value;
  
      if (!/(?=.*[A-Z])/.test(password)) {
        errors.push('Debe haber una mayúscula.');
      } else if (!/(?=.*\d)/.test(password)) {
        errors.push('Debe contener al menos un número.');
      } else if (!/(?=.*[\W_])/.test(password)) {
        errors.push('Debe contener al menos un carácter especial.');
      } else if (password.length < 8) {
        errors.push('Debe contener al menos 8 caracteres.');
      }
    }
  
    return errors;
  }

  validateRepassword(): string[] {
    console.log("y");
    const repasswordControl = this.registrationForm.controls.repassword;
    const errors: string[] = [];

    if (!repasswordControl || !repasswordControl.value || repasswordControl.value.trim() === '') {
      errors.push('La confirmación de contraseña es obligatoria.');
    } else {
      const passwordControl = this.registrationForm.controls.password;
      const password = passwordControl?.value;
      const repassword = repasswordControl.value;

      if (password !== repassword) {
        errors.push('Las contraseñas no coinciden.');
      }
    }
    return errors;
  }

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
  
  get firstName() {
    return this.registrationForm.controls.firstName;
  }
  
  get lastName() {
    return this.registrationForm.controls.lastName;
  }
  
  get dni() {
    return this.registrationForm.controls.dni;
  }
  
  get phone() {
    return this.registrationForm.controls.phone;
  }

  requestRegistration() {
    if (this.registrationForm.valid) {
      this.error = '';
      this.registerService.requestLogin(this.registrationForm.value as User).subscribe({
        next: (userData) => {
          alert(this.registrationForm.controls.username.value + " registrado");
          this.registrationForm.reset();
          this.router.navigate(['/login']);
          return;
        },
        error: (errorData) => {
          alert(errorData);
          this.error = errorData;
          return;
        }
      }); 
    } else {
      this.registrationForm.markAllAsTouched();
      if (this.username.errors?.['required']) {
        this.error = 'Falta el nombre de usuario.';
      } else if (this.password.errors?.['required']) {
        this.error = 'Falta la contraseña.';
      }else if (this.repassword.errors?.['required']) {
        this.error = 'Falta confirmar la contraseña.'; 
      }else if (this.firstName.errors?.['required']) {
        this.error = 'Falta llenar el nombre'; 
      }else if (this.lastName.errors?.['required']) {
        this.error = 'Falta llenar el apellito'; 
      }else if (this.dni.errors?.['required']) {
          this.error = 'Falta llenar el apellito';        
      }else if (this.phone.errors?.['required']) {
        this.error = 'Falta llenar el telefono'; 
      }
      else {
        this.error = 'Faltaron Datos.';
      }
      alert(this.error);
    }
  }

}

import { Component, OnInit , Renderer2  } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Importa el servicio de modales de Bootstrap
import { User } from '../../../Interfaces/User';
import { WorkExperience  } from '../../../Interfaces/WorkExperience';
import { CreateCvService } from '../../../service/create-cv.service';

@Component({
  selector: 'app-curriculum',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, ],
  templateUrl: './curriculum.component.html',
  styleUrl: './curriculum.component.css'
})

export class CurriculumComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private router: Router, private modalService: NgbModal, private createCvService: CreateCvService) {}

  ngOnInit() {
    if (typeof localStorage !== 'undefined' && !localStorage.getItem('token')) {
      alert("Necesitas iniciar sesión");
      // Redireccionar a la página /login si no existe el token
      this.router.navigate(['/login']);
    }
  }
  
  

  modalAddInfoError: boolean = false;
  modalEditInfoError: boolean = false;
  modalExpError: boolean = false;
  modalHaberror: boolean = false;

  // Creamos el User Interface vacio 
  Cliente: User = {} as User;

  // Creamos la listas de Experiencias
  Experiencias: WorkExperience[] = [];


  // Obtener las claves del objeto Cliente
  getClienteKeys(): string[] {
    return Object.keys(this.Cliente);
  }

  // Obtener el valor de una clave específica del objeto Cliente
  getKeyValue(key: string): string | number | ArrayBuffer | null | undefined {
  return (this.Cliente as any)[key];
  }

  shouldDisplay(key: string): boolean {
    const excludedKeys = ['id', 'username', 'password', 'bannerImage', 'profileImage'];
    return !excludedKeys.includes(key);
  }

  getKeyLabel(key: string): string {
    const labels: { [key: string]: string } = {
      id: 'Identificación',
      username: 'Nombre de usuario',
      password: 'Contraseña',
      firstName: 'Nombres',
      lastName: 'Apellidos',
      email: 'Correo electrónico',
      dni: 'DNI',
      phone: 'Teléfono',
      address: 'Dirección',
      district: 'Distrito',
      city: 'Ciudad',
      country: 'País',
      profileImage: 'Imagen de perfil',
      bannerImage: 'Imagen de banner',
    };
  
    return labels[key] || key;
  }

  listaExperienciaLaborales: any[] = [];

  currentKeyUser: any;
  currentItemExperienciaLaborales: any;


  // Modal para añadir Informacion 

  addInformationForm = this.formBuilder.group({
    gridlist: ['firstName', Validators.required],
    value: ['', Validators.required],
  });


  // Modal para editar la informacion 

  editInformationForm = this.formBuilder.group({
    gridlist: ['' , Validators.required],
    editvalue: ['', Validators.required],
  });

  // Modal para añadir Experiencia laboral

  addWorkExperienceForm =  this.formBuilder.group({
    companyName: ['', Validators.required],
    country: ['', Validators.required],
    position: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: [''],
    jobDescription: ['', Validators.required]
  });

  editWorkExperienceForm =  this.formBuilder.group({
    edcompanyName: ['', Validators.required],
    edcountry: ['', Validators.required],
    edposition: ['', Validators.required],
    edstartDate: ['', Validators.required],
    edendDate: [''],
    edjobDescription: ['', Validators.required]
  });
 

  get value() {
    return this.addInformationForm.controls.value;
  }

  get editvalue() {
    return this.editInformationForm.controls.editvalue;
  }

  get companyName() {
    return this.addWorkExperienceForm.controls.companyName;
  }

  get country() {
    return this.addWorkExperienceForm.controls.country;
  }

  get position() {
    return this.addWorkExperienceForm.controls.position;
  }

  get startDate() {
    return this.addWorkExperienceForm.controls.startDate;
  }

  get endDate() {
    return this.addWorkExperienceForm.controls.endDate;
  }

  get jobDescription() {
    return this.addWorkExperienceForm.controls.jobDescription;
  }

  get edcompanyName() {
    return this.editWorkExperienceForm.controls.edcompanyName;
  }

  get edcountry() {
    return this.editWorkExperienceForm.controls.edcountry;
  }

  get edposition() {
    return this.editWorkExperienceForm.controls.edposition;
  }

  get edstartDate() {
    return this.editWorkExperienceForm.controls.edstartDate;
  }

  get edendDate() {
    return this.editWorkExperienceForm.controls.edendDate;
  }

  get edjobDescription() {
    return this.editWorkExperienceForm.controls.edjobDescription;
  }
  
  addPersonalInformation() {
    if (this.modalAddInfoError === true) {
      alert("Hay Errores en los campos");
    } else {
      if (this.addInformationForm.valid) {
        const gridlist = document.getElementById("personalInformationGridList") as HTMLSelectElement;
        const input = document.getElementById("personalInformationValue") as HTMLInputElement;
        
        const selectedOption = gridlist.selectedOptions[0];
        const nameInformation = selectedOption.value;
        const textInformation = selectedOption.textContent || selectedOption.innerText;
        const valueInput      = input.value;
        const currentKeyValue = this.Cliente[nameInformation as keyof User]

        if (currentKeyValue === undefined || currentKeyValue === null) {
          this.Cliente[nameInformation as keyof User] = valueInput as never;                       
        } else {
          alert("Ya existe esa información");
          return;
        }

        this.addInformationForm.reset();
        console.log(this.Cliente)
        alert("informacion agregada")
        const closebutton =  document.getElementById('addPersonalInformationClose');
        closebutton?.click();
      } else {
        alert("Debes llenar todos los campos");
      }
    }
  }
  
  validarCampoDeInformacion() {
    this.modalAddInfoError = false 
    const errors: string[] = [];
    const gridlistControl = this.addInformationForm.controls.gridlist;
    const valueControl = this.addInformationForm.controls.value;
  
    // Verificar si el valor tiene al menos una letra y no es nulo
    const letters = valueControl.value?.length

    if (letters && letters > 0) {
      // Si el gridlist es 'dni', verificar que value tenga al menos 8 dígitos numéricos

      if (gridlistControl.value === 'dni') {
        const dniValue = valueControl.value.toString(); // Asegurarse de que value sea un string
        if (!/^\d+$/.test(dniValue)) {
          this.modalAddInfoError = true;
          errors.push('El DNI solo acepta datos numericos');
        }else if (dniValue.length !== 8) {
            this.modalAddInfoError = true;
            errors.push('El DNI debe tener exactamente 8 dígitos numéricos.');
        }
        
      } else if (gridlistControl.value === 'phone') {
        const phoneValue = valueControl.value.toString(); // Asegurarse de que value sea un string
        if (!/^\d+$/.test(phoneValue)) {
          this.modalAddInfoError = true;
          errors.push('Solo se aceptan datos numericos');
        }else if (phoneValue.length !== 9) {
            this.modalAddInfoError = true;
            errors.push('El Telefono debe tener exactamente 9 dígitos numéricos.');
        }
      } else if (gridlistControl.value === 'email') {
        // Si el gridlist es 'email', verificar el formato de correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(valueControl.value)) {
          this.modalAddInfoError = true 
          errors.push('El formato del correo electrónico no es válido.');
        }
      }
    } 
  
    return errors;
  }
  
  eliminarInformacionPersonal(key: string) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta información personal?');
    if (confirmacion) {
      delete this.Cliente[key as keyof User];
    }
  }
  
  preeditarInformacionPersonal(key: string) {
    const gridlistControl = this.editInformationForm.get('gridlist');
    const valueControl = this.editInformationForm.get('editvalue');
    
    if (valueControl && gridlistControl && this.Cliente[key as keyof User] !== undefined) {
      // Establecer los valores en los controles del formulario
      gridlistControl.setValue(key);
      const clienteValue = this.Cliente[key as keyof User] as string; // Asegurando que el valor sea string
      valueControl.setValue(clienteValue);
    
      // Agregar una opción al gridlist (suponiendo que es un select)
      const gridlistElement = document.getElementById("edit.personalInformationGridList") as HTMLSelectElement;
      const newOption = document.createElement('option');
      newOption.value = key;
      newOption.text =this.getKeyLabel(key);
      gridlistElement.appendChild(newOption);
    
      // Marcar todos los controles como tocados
      this.editInformationForm.markAllAsTouched();
      
      // Establecer el ítem actual de información personal
      this.currentKeyUser = key;
    }
  }
  
  validarCampoDeEdicionInformacion() {
    this.modalEditInfoError = false 
    const errors: string[] = [];
    const gridlistControl = this.editInformationForm.controls.gridlist;
    const valueControl = this.editInformationForm.controls.editvalue;
  
    const letters = valueControl.value?.length
    if (letters && letters > 0) {
      if (gridlistControl.value === 'dni') {
        const dniValue = valueControl.value.toString(); // Asegurarse de que value sea un string
        if (!/^\d+$/.test(dniValue)) {
          this.modalAddInfoError = true;
          errors.push('El DNI solo acepta datos numericos');
        }else if (dniValue.length !== 8) {
            this.modalAddInfoError = true;
            errors.push('El DNI debe tener exactamente 8 dígitos numéricos.');
        }
        
      } else if (gridlistControl.value === 'phone') {
        const phoneValue = valueControl.value.toString(); // Asegurarse de que value sea un string
        if (!/^\d+$/.test(phoneValue)) {
          this.modalAddInfoError = true;
          errors.push('Solo se aceptan datos numericos');
        }else if (phoneValue.length !== 9) {
            this.modalAddInfoError = true;
            errors.push('El Telefono debe tener exactamente 9 dígitos numéricos.');
        }
      } else if (gridlistControl.value === 'email') {
        // Si el gridlist es 'email', verificar el formato de correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(valueControl.value)) {
          this.modalAddInfoError = true 
          errors.push('El formato del correo electrónico no es válido.');
        }
      }
    }else{
      errors.push('Debe Rellenar el Campo sad');
    } 
  
    return errors;
  }

  
  editPersonalInformation(){
    if (this.modalEditInfoError === true){
      alert("Hay Errores en los campos");
    } else {
      if (this.editInformationForm.valid) {
        const input = document.getElementById("edit.personalInformationValue") as HTMLInputElement;
        const valueInput = input.value;

        if (valueInput && input && this.Cliente[this.currentKeyUser as keyof User] !== undefined) {
            const oldvalye  =  this.Cliente[this.currentKeyUser as keyof User] 
            if (oldvalye === valueInput) {
               alert("La Informacion es la misma")    
            }else{
              this.Cliente[this.currentKeyUser as keyof User] =  valueInput as never;  
              this.currentKeyUser = null;
              this.editInformationForm.reset();
              console.log(this.Cliente);
              alert("informacion actualizada")
              const closebutton = document.getElementById('editPersonalInformationClose');
              closebutton?.click();
            }
        }
      } else {
        alert("Debes llenar todos los campos asdasd");
      }
    }
  }

  deleteBanner() {
    const image = document.getElementById('bannerImage') as HTMLImageElement;
    if (image) {
       alert("Se coloco el Banner Por Defecto")
       image.src = 'data:image/jpeg;base64,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'; // Vaciar el src para eliminar la imagen
        delete this.Cliente.bannerImage;
      
     }
   }
   
   changeBanner() {
    const inputFile = document.getElementById('bannerImputFile') as HTMLInputElement;
    if (inputFile) {
      inputFile.click(); // Activar el selector de archivos al hacer clic en el botón
    }
  }
  
  onBannerSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
  
    if (file) {
      const reader = new FileReader();
      const image = document.getElementById('bannerImage') as HTMLImageElement;
  
      reader.onload = (e) => {
        if (e.target && e.target.result instanceof ArrayBuffer) {
          const result = e.target.result;
  
          // Convertir el ArrayBuffer a una cadena base64
          const base64String = this.arrayBufferToBase64(result);
  
          // Asignar la cadena base64 a this.Cliente.profileImage
          this.Cliente.bannerImage = base64String; // Se asume que Cliente.profileImage es de tipo string
  
          if (image) {
            // Mostrar la imagen en la página
            const imageUrl = URL.createObjectURL(file);
            image.src = imageUrl;
          }
        }
      };
  
      reader.readAsArrayBuffer(file); // Leer el archivo como ArrayBuffer
    }
  }
  
  
  deletePerfil() {
    const image = document.getElementById('perfilImage') as HTMLImageElement;
    if (image) {
       alert("Se coloco el perfil Por Defecto")
       image.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnGZWTF4dIu8uBZzgjwWRKJJ4DisphDHEwT2KhLNxBAA&amp;s'; // Vaciar el src para eliminar la imagen
       delete this.Cliente.profileImage;
     }
   }

   changePerfil() {
    const inputFile = document.getElementById('perfilImputFile') as HTMLInputElement;
     if (inputFile) {
      inputFile.click(); // Activar el selector de archivos al hacer clic en el botón
     }
      return
    }
    onPerfilSelected(event: Event) {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
    
      if (file) {
        const reader = new FileReader();
        const image = document.getElementById('perfilImage') as HTMLImageElement;
    
        reader.onload = (e) => {
          if (e.target && e.target.result instanceof ArrayBuffer) {
            const result = e.target.result;
    
            // Convertir el ArrayBuffer a una cadena base64
            const base64String = this.arrayBufferToBase64(result);
    
            // Asignar la cadena base64 a this.Cliente.profileImage
            this.Cliente.profileImage = base64String; // Se asume que Cliente.profileImage es de tipo string
    
            if (image) {
              // Mostrar la imagen en la página
              const imageUrl = URL.createObjectURL(file);
              image.src = imageUrl;
            }
          }
        };
    
        reader.readAsArrayBuffer(file); // Leer el archivo como ArrayBuffer
      }
    }
    
    // Función para convertir ArrayBuffer a base64
    arrayBufferToBase64(buffer: ArrayBuffer): string {
      const binary = new Uint8Array(buffer);
      let result = '';
      for (let i = 0; i < binary.length; i++) {
        result += String.fromCharCode(binary[i]);
      }
      return btoa(result);
    }
    
    


  addWorkExperience() {
    if (this.addWorkExperienceForm.valid) {
      const company = document.getElementById("nombreEmpresa") as HTMLInputElement;
      const country = document.getElementById("pais") as HTMLSelectElement;
      const position = document.getElementById("cargo") as HTMLSelectElement;
      const startDate = document.getElementById("fechaInicio") as HTMLSelectElement;
      const endDate = document.getElementById("fechaFin") as HTMLSelectElement;
      const description = document.getElementById("funciones") as HTMLSelectElement;
  
      // Crear una instancia de workExperience
      const newItem: WorkExperience = {
        company: company.value,
        country: country.value,
        job: position.value,
        startDate: new Date(startDate.value), 
        endDate: new Date(endDate.value), 
        functions: description.value,
        state:1 ,
      };

      // Agregar la nueva instancia a la lista
      this.Experiencias.push(newItem);
  
      const closebutton = document.getElementById('addWorkExperienceClose');
      closebutton?.click();
    } else {
      alert("Debes llenar todos los campos");
    }
  }

  requestEditWorkExperience(index: number) {
 
  }

  deleteWorkExperience(index : number) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta experiencia laboral?');
  
    if (confirmacion) {
      this.Experiencias[index].state = 0;
    } 
  }

  editWorkExperience(){

  }


requestAddCv() {
   console.log("requiriendo actualizar cv")
  this.createCvService.requestAddCv(this.Cliente as User).subscribe({
    next: (userData) => {
      alert("Curriculum Actualizado");
    },
    error: (errorData) => {
      alert(errorData);
    }
  });
}




  



    cerrarSesion() {
      const confirmLogout = confirm("¿Estás seguro de que quieres cerrar la sesión?");
      if (confirmLogout) {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
        alert("¡Sesión cerrada exitosamente!");
      }
    }
}

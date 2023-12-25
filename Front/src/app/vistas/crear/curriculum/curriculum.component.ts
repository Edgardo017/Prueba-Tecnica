import { Component, OnInit , Renderer2  } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Importa el servicio de modales de Bootstrap
import { User } from '../../../Interfaces/User';
import { WorkExperience  } from '../../../Interfaces/WorkExperience';
import { Certifications  } from '../../../Interfaces/Certifications';
import { Skills  } from '../../../Interfaces/Skills';
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
      return;
    }
  
    this.createCvService.getCurriculum().subscribe({
      next: (userData) => {
        console.log(userData);
        // Verifica si hay datos de usuario y experiencias laborales
        if (userData) {
          if (userData.user)
              this.Cliente = userData.user;
          if (userData.workExperience)
              this.Experiencias = userData.workExperience;
          if (userData.certifications)
              this.Estudios = userData.certifications;
          if (userData.skills)
              this.Habilidades = userData.skills;
          // Cargar las imágenes si están disponibles
          this.loadPerfilImage();
          this.loadBannerImage();
        } else {
          // Manejar el caso donde no se recibe un currículum válido
          console.error('El currículum recibido es inválido');
          // Podrías redirigir a una página de error específica si es necesario
        }
      },
      error: (errorData) => {
        alert("Sesión expirada");
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }
  
  loadPerfilImage() {
    const perfilImageElement = document.getElementById('perfilImage') as HTMLImageElement;
    if (perfilImageElement && this.Cliente.profileImage) {
      perfilImageElement.src = `http://localhost:8080/${this.Cliente.profileImage}`;
    }
  }
  
  loadBannerImage() {
    const bannerImageElement = document.getElementById('bannerImage') as HTMLImageElement;
    if (bannerImageElement && this.Cliente.bannerImage) {
      bannerImageElement.src = `http://localhost:8080/${this.Cliente.bannerImage}`;
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

  // Creamos la listas de Estudios
  Estudios: Certifications[] = [];

  Habilidades: Skills[] = [];


  // Obtener las claves del objeto Cliente
  getClienteKeys(): string[] {
    return Object.keys(this.Cliente);
  }

  // Obtener el valor de una clave específica del objeto Cliente
  getKeyValue(key: string): string | number | ArrayBuffer | null | undefined {
  return (this.Cliente as any)[key];
  }

  shouldDisplay(key: string): boolean {
    const excludedKeys = ['id', 'username', 'password', 'bannerImage', 'profileImage', 'presentation'];
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
      presentation: 'Carta de Presentacion',
      profile: "Perfil",
      profileImage: 'Imagen de perfil',
      bannerImage: 'Imagen de banner',
    };
  
    return labels[key] || key;
  }


  currentKeyUser: any;
  currentIndexExperience: any;
  currentIndexStudy: any;
  currentIndexSkill: any;


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

  addStudiesForm =  this.formBuilder.group({

    typeStudy: ['', Validators.required],
    school: ['', Validators.required],
    career: ['', Validators.required],
    studySemestre: ['1', Validators.required],
    startStudy: [''],
    endStudy: ['', Validators.required],
    studyState: ['', Validators.required]
  });
 
  editStudiesForm = this.formBuilder.group({
    editTypeStudy: ['', Validators.required],
    editSchool: ['', Validators.required],
    editCareer: ['', Validators.required],
    editStudySemestre: ['1', Validators.required],
    editStartStudy: [''],
    editEndStudy: ['', Validators.required],
    editStudyState: ['', Validators.required]
  });

  addSkillForm = this.formBuilder.group({
    skillName: ['', Validators.required],
    skillPercentage: ['', Validators.pattern('^[0-9]+$')],
    skillDescription: ['', Validators.required],
  });

  editSkillForm = this.formBuilder.group({
    editSkillName: ['', Validators.required],
    editSkillPercentage: ['', Validators.pattern('^[0-9]+$')],
    editSkillDescription: ['', Validators.required],
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

  get typeStudy() {
    return this.addStudiesForm.controls.typeStudy;
  }
  
  get school() {
    return this.addStudiesForm.controls.school;
  }
  
  get career() {
    return this.addStudiesForm.controls.career;
  }
  
  get studySemestre() {
    return this.addStudiesForm.controls.studySemestre;
  }
  
  get startStudy() {
    return this.addStudiesForm.controls.startStudy;
  }
  
  get endStudy() {
    return this.addStudiesForm.controls.endStudy;
  }
  
  get studyState() {
    return this.addStudiesForm.controls.studyState;
  }

  get editTypeStudy() {
    return this.editStudiesForm.controls.editTypeStudy;
  }
  
  get editSchool() {
    return this.editStudiesForm.controls.editSchool;
  }
  
  get editCareer() {
    return this.editStudiesForm.controls.editCareer;
  }
  
  get editStudySemestre() {
    return this.editStudiesForm.controls.editStudySemestre;
  }
  
  get editStartStudy() {
    return this.editStudiesForm.controls.editStartStudy;
  }
  
  get editEndStudy() {
    return this.editStudiesForm.controls.editEndStudy;
  }
  
  get editStudyState() {
    return this.editStudiesForm.controls.editStudyState;
  }

  get skillName() {
    return this.addSkillForm.controls.skillName;
  }

  get skillPercentage() {
    return this.addSkillForm.controls.skillPercentage;
  }

  get skillDescription() {
    return this.addSkillForm.controls.skillDescription;
  }

  get editSkillName() {
    return this.editSkillForm.controls.editSkillName;
  }

  get editSkillPercentage() {
    return this.editSkillForm.controls.editSkillPercentage;
  }

  get editSkillDescription() {
    return this.editSkillForm.controls.editSkillDescription;
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
        console.log(nameInformation)

        if (currentKeyValue === undefined || currentKeyValue === null) {
          this.Cliente[nameInformation as keyof User] = valueInput as never;                       
        } else {
          alert("Ya existe esa información");
          return;
        }

        this.addInformationForm.reset();
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
    
      // Limpiar las opciones actuales en el gridlist (suponiendo que es un select)
      const gridlistElement = document.getElementById("edit.personalInformationGridList") as HTMLSelectElement;
      gridlistElement.innerHTML = ''; // Elimina todas las opciones actuales
    
      // Agregar una única opción al gridlist
      const newOption = document.createElement('option');
      newOption.value = key;
      newOption.text = this.getKeyLabel(key); // Suponiendo que tienes una función para obtener la etiqueta
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
          this.modalEditInfoError = true;
          errors.push('El DNI solo acepta datos numericos');
        }else if (dniValue.length !== 8) {
            this.modalEditInfoError = true;
            errors.push('El DNI debe tener exactamente 8 dígitos numéricos.');
        }
        
      } else if (gridlistControl.value === 'phone') {
        const phoneValue = valueControl.value.toString(); // Asegurarse de que value sea un string
        if (!/^\d+$/.test(phoneValue)) {
          this.modalEditInfoError = true;
          errors.push('Solo se aceptan datos numericos');
        }else if (phoneValue.length !== 9) {
            this.modalEditInfoError = true;
            errors.push('El Telefono debe tener exactamente 9 dígitos numéricos.');
        }
      } else if (gridlistControl.value === 'email') {
        // Si el gridlist es 'email', verificar el formato de correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(valueControl.value)) {
          this.modalEditInfoError = true 
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
  
      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];
  
          this.Cliente.bannerImage = base64String;
  
          if (image) {
            image.src = URL.createObjectURL(file);
          }
        }
      };
  
      reader.readAsDataURL(file); 
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

        reader.onload = () => {
          if (reader.result && typeof reader.result === 'string') {
            if (image) {
              image.src = URL.createObjectURL(file);
            }
            const base64String = reader.result.split(',')[1];
            this.Cliente.profileImage = base64String;
          }
        };
    
        reader.readAsDataURL(file); 
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

   const company = this.editWorkExperienceForm.get("edcompanyName");
   const country = this.editWorkExperienceForm.get("edcountry")
   const work = this.editWorkExperienceForm.get("edposition")
   const func = this.editWorkExperienceForm.get("edjobDescription")


   company?.setValue(this.Experiencias[index]?.company ?? null);
   country?.setValue(this.Experiencias[index]?.country ?? null);
   work?.setValue(this.Experiencias[index]?.job ?? null);
   func?.setValue(this.Experiencias[index]?.functions ?? null);

   const sDate = this.editWorkExperienceForm.get("edstartDate");
   const startDate = this.Experiencias[index]?.startDate;
   
   if (startDate instanceof Date) {
     const startDateString = startDate.toISOString().split('T')[0]; // Obtener YYYY-MM-DD
     sDate?.setValue(startDateString);
   } else if (typeof startDate === 'string') {
     sDate?.setValue(startDate);
   } else {
     sDate?.setValue(null);
   }

   const eDate = this.editWorkExperienceForm.get("edendDate");
   const endDate = this.Experiencias[index]?.endDate;
   
   if (endDate instanceof Date) {
     const startDateString = endDate.toISOString().split('T')[0]; 
     eDate?.setValue(startDateString);
   } else if (typeof endDate === 'string') {
     eDate?.setValue(endDate);
   } else {
     eDate?.setValue(null);
   }

   // Marcar todos los controles como tocados
    this.editWorkExperienceForm.markAllAsTouched();
    // Establecer el index actual de la lista de experiencia para luego editarlo
    this.currentIndexExperience = index;
 
  }

  deleteWorkExperience(index : number) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta experiencia laboral?');
    if (confirmacion) {
       this.Experiencias[index].state = 0;
    } 
  }

  editWorkExperience(){
    if (this.editWorkExperienceForm.valid) {
      
const empresa = document.getElementById("ednombreEmpresa") as HTMLInputElement;
const pais = document.getElementById("edpais") as HTMLInputElement;
const edcargo = document.getElementById("edcargo") as HTMLInputElement;
const edfechaInicio = document.getElementById("edfechaInicio") as HTMLInputElement;
const edfechaFin = document.getElementById("edfechaFin") as HTMLInputElement;
const edfunciones = document.getElementById("edfunciones") as HTMLInputElement;

const startDateString = edfechaInicio.value;
const endDateString = edfechaFin.value;

if (startDateString && endDateString) {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
    const index = this.currentIndexExperience;
    
    this.Experiencias[index].company = empresa.value;
    this.Experiencias[index].country = pais.value;
    this.Experiencias[index].job = edcargo.value;
    this.Experiencias[index].startDate = startDate;
    this.Experiencias[index].endDate = endDate;
    this.Experiencias[index].functions = edfunciones.value;

    const closebutton = document.getElementById('editWorkExperienceClose');
    closebutton?.click();
    alert("Informacion Actualizada");
  } else {
    alert("La fecha de inicio o la fecha de fin no son válidas");
  }
} else {
  alert("Asegúrate de completar las fechas de inicio y fin");
}

      } else {
        alert("Debes llenar todos los campos");
      }
  

  }

  addEsudies(){
    if (this.addStudiesForm.valid) {
        const typeStudy = document.getElementById("typeStudy") as HTMLInputElement;
        const Institucion = document.getElementById("Institucion") as HTMLSelectElement;
        const career = document.getElementById("career") as HTMLSelectElement;
        const studySemestre = document.getElementById("studySemestre") as HTMLSelectElement;
        const startStudy = document.getElementById("startStudy") as HTMLSelectElement;
        const endStudy = document.getElementById("endStudy") as HTMLSelectElement;
        const studyState = document.getElementById("studyState") as HTMLSelectElement;

      // Crear una instancia de workExperience
      const newItem: Certifications = {
        type: typeStudy.value,
        institution: Institucion.value,
        career: career.value,
        semester: studySemestre.value,
        startYear: new Date(startStudy.value),
        endYear: new Date(endStudy.value),
        studyState: studyState.value,
        state: 1,
      };
      this.Estudios.push(newItem);
      const closebutton = document.getElementById('addStudiesModalClose');
      closebutton?.click();
    
    }else {
      alert("Debes llenar todos los campos");
    }

  }
  deleteStudy(index: number){
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar estos estudios?');
     if (confirmacion) {
         this.Estudios[index].state = 0;
    } 
  }

  requestEditStudies(index: number) {
    const typeStudy = this.editStudiesForm.get('editTypeStudy');
    const school = this.editStudiesForm.get('editSchool');
    const career = this.editStudiesForm.get('editCareer');
    const studySemestre = this.editStudiesForm.get('editStudySemestre');
    const startStudy = this.editStudiesForm.get('editStartStudy');
    const endStudy = this.editStudiesForm.get('editEndStudy');
    const studyState = this.editStudiesForm.get('editStudyState');
    const startDate = this.Estudios[index]?.startYear;
    const endDate = this.Estudios[index]?.endYear;

    typeStudy?.setValue(this.Estudios[index]?.type ?? null);
    school?.setValue(this.Estudios[index]?.institution ?? null);
    career?.setValue(this.Estudios[index]?.career ?? null);
    studySemestre?.setValue(this.Estudios[index]?.semester ?? null);
    studyState?.setValue(this.Estudios[index]?.studyState ?? null);

    if (startDate instanceof Date) {
      const startDateString = startDate.toISOString().split('T')[0]; // Obtener YYYY-MM-DD
      startStudy?.setValue(startDateString);
    } else if (typeof startDate === 'string') {
      startStudy?.setValue(startDate);
    } else {
      startStudy?.setValue(null);
    }

    if (endDate instanceof Date) {
      const startDateString = endDate.toISOString().split('T')[0]; // Obtener YYYY-MM-DD
      endStudy?.setValue(startDateString);
    } else if (typeof startDate === 'string') {
      endStudy?.setValue(startDate);
    } else {
      endStudy?.setValue(null);
    }


    // Marcar todos los controles como tocados
    this.editStudiesForm.markAllAsTouched();
    // Establecer el índice actual de la lista de estudios para editar
    this.currentIndexStudy = index;
  }
  
  editStudies(){
    if (this.addStudiesForm.valid) {
      const index = this.currentIndexStudy;
      const typeStudy = document.getElementById("editTypeStudy") as HTMLInputElement;
      const Institucion = document.getElementById("editInstitucion") as HTMLSelectElement;
      const career = document.getElementById("editCareer") as HTMLSelectElement;
      const studySemestre = document.getElementById("editStudySemestre") as HTMLSelectElement;
      const startStudy = document.getElementById("editStartStudy") as HTMLSelectElement;
      const endStudy = document.getElementById("editEndStudy") as HTMLSelectElement;
      const studyState = document.getElementById("editStudyState") as HTMLSelectElement;

      this.Estudios[index].type = typeStudy.value;
      this.Estudios[index].institution = Institucion.value;
      this.Estudios[index].career = career.value;
      this.Estudios[index].semester = studySemestre.value;
      this.Estudios[index].startYear = new Date(startStudy.value);
      this.Estudios[index].endYear = new Date(endStudy.value);
      this.Estudios[index].studyState = studyState.value;

      const closebutton = document.getElementById('editStudiesModalClose');
      closebutton?.click();
      alert("Estudio Actualizado");
    }else {
      alert("Debes llenar todos los campos");
    }
  }


  addSkill() {
    if (this.addSkillForm.valid) {
      const percentageValue = this.addSkillForm.value.skillPercentage;
  
      if (percentageValue !== null && percentageValue !== undefined) {
        const parsedPercentage = parseInt(percentageValue, 10);
  
        if (!isNaN(parsedPercentage)) {
          const newSkill: Skills = {
            skill: this.addSkillForm.value.skillName,
            percentage: parsedPercentage,
            description:  this.addSkillForm.value.skillDescription,
            state: 1
          };
  
          this.Habilidades.push(newSkill);
          this.addSkillForm.reset(); 
          const closebutton = document.getElementById('addSkillModalClose');
          closebutton?.click();
          alert("Habilidad añadida");
        }
      }
    }
  }

  deleteSkill(index: number){
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar habilidad?');
     if (confirmacion) {
         this.Habilidades[index].state = 0;
    } 
  }
  requestEditSkill(index: number) {
    const skillName = this.editSkillForm.get('editSkillName');
    const skillPercentage = this.editSkillForm.get('editSkillPercentage');
    const skillDescription = this.editSkillForm.get('editSkillDescription');
  
    skillName?.setValue(this.Habilidades[index]?.skill ?? null);
    skillPercentage?.setValue(this.Habilidades[index]?.percentage?.toString() ?? null);
    skillDescription?.setValue(this.Habilidades[index]?.description ?? null);
  
    // Marcar todos los controles como tocados
    this.editSkillForm.markAllAsTouched();
    // Establecer el índice actual de la lista de habilidades para editar
    this.currentIndexSkill = index;
  }
  
  editSkill() {
    const index = this.currentIndexSkill;
    const skillName = this.editSkillForm.get('editSkillName');
    const skillPercentage = this.editSkillForm.get('editSkillPercentage');
    const skillDescription = this.editSkillForm.get('editSkillDescription');
  
    if (skillName && skillPercentage && skillDescription) {
      const parsedPercentage = skillPercentage.value ? parseInt(skillPercentage.value, 10) : null;
  
      if (parsedPercentage !== null && !isNaN(parsedPercentage)) {
        this.Habilidades[index].skill = skillName.value || null;
        this.Habilidades[index].percentage = parsedPercentage;
        this.Habilidades[index].description = skillDescription.value || null;
  
        const closebutton = document.getElementById('editSkillModalClose');
        closebutton?.click();
        alert('Habilidad actualizada');
      } else {
        alert('Porcentaje no válido');
      }
    } else {
      alert('Debes llenar todos los campos');
    }
  }
  
  
  

  updateCurriculum() {
  const presentation = document.getElementById("cartaPresentacion") as HTMLTextAreaElement;
    if (presentation) 
      this.Cliente.presentation = presentation.value;
    
  this.createCvService.updateCurriculum(this.Cliente as User, this.Experiencias as WorkExperience[], this.Estudios as Certifications[], this.Habilidades as Skills[]).subscribe({
    next: (userData) => {
      if (userData) {
        console.log(userData);
        if (userData.user)
            this.Cliente = userData.user;
        if (userData.workExperience)
            this.Experiencias = userData.workExperience;
        if (userData.certifications)
            this.Estudios = userData.certifications;
        if (userData.skills)
            this.Habilidades = userData.skills;
      }
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

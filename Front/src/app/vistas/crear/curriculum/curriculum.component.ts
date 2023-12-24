import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl  } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-curriculum',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './curriculum.component.html',
  styleUrl: './curriculum.component.css'
})
export class CurriculumComponent  implements OnInit {

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      alert('No estás logueado');
      this.router.navigate(['/login']);
      return
    }
  }
  listaInformacionPersonal: any[] = []; 
  listaExperienciaLaborales: any[] = [];


  constructor(private formBuilder: FormBuilder, private router: Router ) { }


  addInformationForm = this.formBuilder.group({
    gridlist: ['firstName', Validators.required],
    value: ['', Validators.required],
  });

   get value() {
      return this.addInformationForm.controls.value;
   }



  addWorkExperienceForm =  this.formBuilder.group({
    companyName: ['', Validators.required], // Nombre de la Empresa requerido
    country: ['', Validators.required], // País requerido
    position: ['', Validators.required], // Cargo requerido
    startDate: ['', Validators.required], // Fecha de Inicio requerida
    endDate: [''], // Fecha de Fin (opcional)
    jobDescription: ['', Validators.required] // 
  });

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

  addPersonalInformation() {
    if (this.addInformationForm.valid) {
      const gridlist = document.getElementById("personalInformationGridList") as HTMLSelectElement;
      const input = document.getElementById("personalInformationValue") as HTMLInputElement;
      const selectedOption = gridlist.selectedOptions[0];
      const nameInformation = selectedOption.value;
      const textInformation = selectedOption.textContent || selectedOption.innerText;
      const valueInput = input.value;
  
      const orderOfOptions = Array.from(gridlist.options).map(option => option.value);
  
      const existingItem = this.listaInformacionPersonal.find(item => item.item === nameInformation);
      if (existingItem) {
        alert(`Ya existe un elemento con el nombre ${nameInformation}`);
      } else {
        const newItem = { item: nameInformation, title: textInformation, value: valueInput };
        this.listaInformacionPersonal.push(newItem);
  
        // Ordenar listaInformacionPersonal según el orden de items en el gridlist
        this.listaInformacionPersonal.sort((a, b) => {
          const indexA = orderOfOptions.indexOf(a.item);
          const indexB = orderOfOptions.indexOf(b.item);
          return indexA - indexB;
        });
  
        const closebutton =  document.getElementById('addPersonalInformationClose');
        closebutton?.click();
      }
    } else {
      alert("Debes llenar todos los campos");
    }
  }

  eliminarInformacionPersonal(index: number) {
       this.listaInformacionPersonal.splice(index, 1)
  }

  addWorkExperience(){
    if (this.addWorkExperienceForm.valid) {
       const company = document.getElementById("nombreEmpresa") as HTMLInputElement;
       const country = document.getElementById("pais") as HTMLSelectElement;
       const position = document.getElementById("cargo") as HTMLSelectElement;
       const startDate = document.getElementById("fechaInicio") as HTMLSelectElement;
       const endDate = document.getElementById("fechaFin") as HTMLSelectElement;
       const description = document.getElementById("funciones") as HTMLSelectElement;

       console.log(company.value)
       console.log(country.value)
       console.log(position.value)
       console.log(startDate.value)
       console.log(endDate.value)
       console.log(description.value)


       const newItem = { company: company.value, country: country.value, position: position.value, startDate: startDate.value,  endDate: endDate.value, description: description.value   };
       this.listaExperienciaLaborales.push(newItem);

       const closebutton =  document.getElementById('addWorkExperienceClose');
       closebutton?.click();
       
    } else {
      alert("Debes llenar todos los campos");
    }

  }
}

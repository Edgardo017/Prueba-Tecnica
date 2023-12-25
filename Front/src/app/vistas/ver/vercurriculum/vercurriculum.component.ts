import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../../Interfaces/User';
import { WorkExperience } from '../../../Interfaces/WorkExperience';
import { Certifications } from '../../../Interfaces/Certifications';
import { Skills } from '../../../Interfaces/Skills';
import { VerCurriculumsService } from '../../../service/ver-curriculums.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-vercurriculum',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, ],
  templateUrl: './vercurriculum.component.html',
  styleUrls: ['./vercurriculum.component.css']
})
export class VercurriculumComponent implements OnInit {
  constructor(
    private verCurriculumsService: VerCurriculumsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  username: string = '';
  cliente: User = {} as User;
  experiencias: WorkExperience[] = [];
  estudios: Certifications[] = [];
  habilidades: Skills[] = [];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.username = params['username'];
      console.log(this.username);
      this.verCurriculumsService.verCurriculum(this.username).subscribe({
        next: (userData: any) => {
          if (userData) {
            console.log(userData);
            this.cliente = userData.user || {} as User;
            this.experiencias = userData.workExperience || [];
            this.estudios = userData.certifications || [];
            this.habilidades = userData.skills || [];
            alert('Curriculum Encontrado');
            this.loadPerfilImage();
            this.loadBannerImage();

          }
        },
        error: (error: any) => {
          alert(error.message)
          this.router.navigate(['/login']);
        }
      });
    });
  }

  loadPerfilImage() {
    const perfilImageElement = document.getElementById('perfilImage') as HTMLImageElement;
    if (perfilImageElement && this.cliente.profileImage) {
      perfilImageElement.src = `http://localhost:8080/${this.cliente.profileImage}`;
    }
  }

  loadBannerImage() {
    const bannerImageElement = document.getElementById('bannerImage') as HTMLImageElement;
    if (bannerImageElement && this.cliente.bannerImage) {
      bannerImageElement.src = `http://localhost:8080/${this.cliente.bannerImage}`;
    }
  }

  toLogin(){
    this.router.navigate(['/login']);
  }
}




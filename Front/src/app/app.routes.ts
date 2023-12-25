import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './session/login/login.component';
import { RegisterComponent } from './session/register/register.component';
import { CurriculumComponent } from './vistas/crear/curriculum/curriculum.component';
import { VercurriculumComponent } from './vistas/ver/vercurriculum/vercurriculum.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'crearcurriculum', component: CurriculumComponent },
    { path: 'vercurriculum/:username', component: VercurriculumComponent },
    { path: '**', component:LoginComponent}, 

];

@NgModule({
    imports: [RouterModule.forRoot(routes), HttpClientModule],
    exports: [RouterModule]
})

export class AppRoutingModule {}
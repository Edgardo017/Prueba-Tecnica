import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './session/login/login.component';
import { RegisterComponent } from './session/register/register.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', component:AppComponent}, 

];

@NgModule({
    imports: [RouterModule.forRoot(routes), HttpClientModule, FontAwesomeModule],
    exports: [RouterModule]
})

export class AppRoutingModule {}
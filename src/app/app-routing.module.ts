import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppDashboardComponent } from './modules/dashboard/app-dashboard/app-dashboard.component';
import { AppLoginComponent } from './modules/login/app-login/app-login.component';
import { AppRegisterComponent } from './modules/register/app-register/app-register.component';
import { AppCaracterizacionComponent } from './modules/caracterizacion/app-caracterizacion/app-caracterizacion.component';
import { AppDiagnosticoComponent } from './modules/diagnostico/app-diagnostico/app-diagnostico.component';

//! First Set of routes 
const routes: Routes = [
  {path: '', component: AppLoginComponent},
  {path: 'register', component: AppRegisterComponent},
  {path: 'dashboard', component: AppDashboardComponent},
  // {path: '', component: AppCaracterizacionComponent},
  {path: 'caracterizacion', component: AppCaracterizacionComponent},
  {path: 'diagnostico', component: AppDiagnosticoComponent},
  //{path: '', component: AppMyExampleComponent},
  // { path: 'login', component: AppLoginComponent },
  { path: 'register', component: AppRegisterComponent },
  // { path: 'dashboard', component: AppDashboardComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

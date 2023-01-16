import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppMyExampleComponent } from './modules/example/example';

import { AppLoginComponent } from './modules/login/app-login/app-login.component';
import { AppRegisterComponent } from './modules/register/app-register/app-register.component';
import { AppDashboardComponent } from './modules/dashboard/app-dashboard/app-dashboard.component';
import { AppCaracterizacionComponent } from './modules/caracterizacion/app-caracterizacion/app-caracterizacion.component';
AppCaracterizacionComponent

const routes: Routes = [
  //{path: '', component: AppLoginComponent},
  {path: 'register', component: AppRegisterComponent},
  {path: 'dashboard', component: AppDashboardComponent},
  {path: '', component: AppCaracterizacionComponent}
  //{path: '', component: AppMyExampleComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

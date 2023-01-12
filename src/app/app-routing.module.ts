import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppDashboardComponent } from './modules/dashboard/app-dashboard/app-dashboard.component';

import { AppMyExampleComponent } from './modules/example/example';

import { AppLoginComponent } from './modules/login/app-login/app-login.component';
import { AppRegisterComponent } from './modules/register/app-register/app-register.component';



const routes: Routes = [
  { path: 'login', component: AppLoginComponent },

  { path: 'register', component: AppRegisterComponent },
  { path: 'dashboard', component: AppDashboardComponent },

  //{path: '', component: AppMyExampleComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

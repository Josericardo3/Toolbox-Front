import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppMyExampleComponent } from './modules/example/example';
import { AppLoginComponent } from './modules/login/app-login/app-login.component';
import { AppRegisterComponent } from './modules/register/app-register/app-register.component';



const routes: Routes = [
  {path: '', component: AppLoginComponent},
  {path: '', component: AppMyExampleComponent},
  {path: 'register', component: AppRegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

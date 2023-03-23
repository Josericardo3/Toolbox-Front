import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppDashboardComponent } from './modules/dashboard/app-dashboard/app-dashboard.component';
import { AppMyExampleComponent } from './modules/example/example';
import { AppLoginComponent } from './modules/login/app-login/app-login.component';
import { AppRegisterComponent } from './modules/register/app-register/app-register.component';
import { AppCaracterizacionComponent } from './modules/caracterizacion/app-caracterizacion/app-caracterizacion.component';
import { AppDiagnosticoComponent } from './modules/diagnostico/app-diagnostico/app-diagnostico.component';
import { AppHeaderComponent } from './modules/header/app-header/app-header.component';
import { AppDiagnosticoDocComponent } from './modules/diagnosticoDoc/app-diagnostico-doc/app-diagnostico-doc.component';
import { AppDocumentacionComponent } from './modules/documentacion/app-documentacion/app-documentacion.component';
import { AppGestionDeUsuariosComponent } from './modules/gestionDeUsuarios/app-gestion-de-usuarios/app-gestion-de-usuarios.component';
import { AppEvidenciaComponent } from './modules/evidencia/app-evidencia/app-evidencia.component';
import { RecoveryComponent } from './recovery/app-recovery/recovery.component';
import { EMatrizRequisitosLegalesComponent } from './modules/e-matriz-requisitos-legales/e-matriz-requisitos-legales.component';

const routes: Routes = [
  {path: '', component: AppLoginComponent},
  {path: 'register', component: AppRegisterComponent},
  {path: 'dashboard', component: AppDashboardComponent},
  {path: 'caracterizacion', component: AppCaracterizacionComponent},
  {path: 'diagnostico', component: AppDiagnosticoComponent},
  {path: 'header', component: AppHeaderComponent},
  {path: 'diagnosticoDoc', component: AppDiagnosticoDocComponent},
  {path: 'documentacion', component: AppDocumentacionComponent},
  {path: 'gestionUsuario', component: AppGestionDeUsuariosComponent},
  {path: 'evidencia', component: AppEvidenciaComponent},
  {path: 'recovery/:id', component: RecoveryComponent},
  {path: 'EMatrizRequisitosLegales', component: EMatrizRequisitosLegalesComponent},
  {path: 'recovery', component: RecoveryComponent},
  //{path: '', component: AppMyExampleComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [RouterModule],
  exports: [RouterModule]
})

export class AppRoutingModule { }
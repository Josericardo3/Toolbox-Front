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
import { AppAuditoriaInternaComponent } from './modules/AuditoriaInterna/app-auditoria-interna/app-auditoria-interna.component';
import { EMatrizRequisitosLegalesComponent } from './modules/e-matriz-requisitos-legales/e-matriz-requisitos-legales.component';
import { AppNuevoPlanDeAuditoriaComponent } from './modules/NuevoPlanDeAuditoria/app-nuevo-plan-de-auditoria/app-nuevo-plan-de-auditoria.component';
import { AppListaDeVerificacionComponent } from './modules/ListaDeVerificacion/app-lista-de-verificacion/app-lista-de-verificacion.component';
import { AppInformeDeAuditoriaComponent } from './modules/InformeDeAuditoria/app-informe-de-auditoria/app-informe-de-auditoria.component';
import { AppPlanificacionComponent } from './modules/planificacion/app-planificacion/app-planificacion.component';
import { AppNoticiaComponent } from './modules/noticia/app-noticia/app-noticia.component';
import { AppGestorNoticiaComponent } from './modules/GestorNoticia/app-gestor-noticia/app-gestor-noticia.component';
import { AppHistorialNoticiasComponent } from './modules/historialNoticias/app-historial-noticias/app-historial-noticias.component';
import { AppNoticiasCompletasComponent } from './modules/noticiasCompletas/app-noticias-completas/app-noticias-completas.component';
import { AppMenuComponent } from './modules/Menu/app-menu/app-menu.component';
import { AppProcRequisitosLegalesComponent } from './modules/proc-requisitos-legales/app-proc-requisitos-legales/app-proc-requisitos-legales.component';
import { AppMatrizPartesInteresadasComponent } from './modules/matrizPartesInteresadas/app-matriz-partes-interesadas/app-matriz-partes-interesadas.component';

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
  {path: 'evidencia/:section', component: AppEvidenciaComponent},
  {path: 'evidencia/:section/:subSection', component: AppEvidenciaComponent },
  {path: 'recovery', component: RecoveryComponent},
  {path: 'auditoria', component: AppAuditoriaInternaComponent},
  {path: 'EMatrizRequisitosLegales', component: EMatrizRequisitosLegalesComponent},
  {path: 'nuevoPlanDeAuditoria', component: AppNuevoPlanDeAuditoriaComponent},
  {path: 'listaDeVerificacion', component: AppListaDeVerificacionComponent},
  {path: 'informeAuditoria', component: AppInformeDeAuditoriaComponent},
  {path: 'planificacion', component: AppPlanificacionComponent},
  {path: 'noticia', component: AppNoticiaComponent},
  {path: 'gestorNoticia', component: AppGestorNoticiaComponent},
  {path: 'historial', component: AppHistorialNoticiasComponent},
  {path: 'noticiaCompleta', component: AppNoticiasCompletasComponent},
  {path: 'requisitosLegales', component: AppProcRequisitosLegalesComponent},
  {path: 'partesInteresadas', component: AppMatrizPartesInteresadasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [RouterModule],
  exports: [RouterModule]
})

export class AppRoutingModule { }

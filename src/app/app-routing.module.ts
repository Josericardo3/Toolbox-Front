import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanLoad } from '@angular/router';
import { AppDashboardComponent } from './modules/dashboard/app-dashboard/app-dashboard.component';
// import { AppMyExampleComponent } from './modules/example/example';
import { AppLoginComponent } from './modules/login/app-login/app-login.component';
import { AppRegisterComponent } from './modules/register/app-register/app-register.component';
import { AppCaracterizacionComponent } from './modules/caracterizacion/app-caracterizacion/app-caracterizacion.component';
import { AppDiagnosticoComponent } from './modules/diagnostico/app-diagnostico/app-diagnostico.component';
// import { AppHeaderComponent } from './modules/header/app-header/app-header.component';
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
// import { AppMenuComponent } from './modules/Menu/app-menu/app-menu.component';
// import { AppMejoraContinuaComponent } from './modules/MejoraContinua/app-mejora-continua/app-mejora-continua.component';
import { AppProcRequisitosLegalesComponent } from './modules/proc-requisitos-legales/app-proc-requisitos-legales/app-proc-requisitos-legales.component';
import { AppPoliticaDesarrolloSostenibleComponent } from './modules/e-matriz-requisitos-legales/app-politica-desarrollo-sostenible/app-politica-desarrollo-sostenible.component';
import { AppMatrizPartesInteresadasComponent } from './modules/matrizPartesInteresadas/app-matriz-partes-interesadas/app-matriz-partes-interesadas.component';
import { AppAlcanceSGSComponent } from './modules/AlcanceSistemaGestiónSostenibilidad/app-alcance-sgs/app-alcance-sgs.component';
// import { MenuCortoComponent } from './modules/menuCorto/menu-corto/menu-corto.component';
import { AppActividadesComponent } from './modules/Actividades/app-actividades/app-actividades.component';
import { AppEncuestaComponent } from './modules/Encuesta/app-encuesta/app-encuesta.component';
import { AppMapaColombiaComponent } from './modules/mapaColombia/app-mapa-colombia/app-mapa-colombia.component';
import { MejoraaContinuaComponent } from './modules/mejoraa-continua/mejoraa-continua.component';
import { AppMenuAltaGerenciaComponent } from './modules/menuAltaGerencia/app-menu-alta-gerencia/app-menu-alta-gerencia.component';
import { AppResultadosEncuestasComponent } from './modules/resultadoEncuestas/app-resultados-encuestas/app-resultados-encuestas.component';
import { AppResultadosAuditoriaComponent } from './modules/resultadosAuditoria/app-resultados-auditoria/app-resultados-auditoria.component';
import { AppTablaPartesInteresadasComponent } from './modules/tablaPartesInteresadas/app-tabla-partes-interesadas/app-tabla-partes-interesadas.component';
import { AppActividadesPlanificadasComponent } from './modules/actividadesPlanificadas/app-actividades-planificadas/app-actividades-planificadas.component';
import { AppResultEncuestasPreguntasComponent } from './modules/resultEncuestasPreguntas/app-result-encuestas-preguntas/app-result-encuestas-preguntas.component';
import { AppEncuestaCreadaComponent } from './modules/encuestaCreada/app-encuesta-creada/app-encuesta-creada.component';
import { AppTablaEncuestasComponent } from './modules/tablaEncuestas/app-tabla-encuestas/app-tabla-encuestas.component';
import { AppMonitorizacionComponent } from './modules/monitorizacion/app-monitorizacion/app-monitorizacion.component';
import { AppMapaProcesosComponent } from './modules/mapaDeProcesos/app-mapa-procesos/app-mapa-procesos.component';
import { DiagramaProcesoComponent } from './modules/mapaDeProcesos/diagrama-proceso/diagrama-proceso.component';

import { MedicionKpisComponent } from './modules/medicion-kpis/medicion-kpis.component';
import { IndicadoresKpisComponent } from './modules/medicion-kpis/indicadores-kpis/indicadores-kpis.component';
import { ObjetivosKpisComponent } from './modules/medicion-kpis/objetivos-kpis/objetivos-kpis.component';
import { PaquetesComponent } from './modules/medicion-kpis/paquetes/paquetes.component';
import { RegistroEvaluacionIndicadorComponent } from './modules/medicion-kpis/registro-evaluacion-indicador/registro-evaluacion-indicador.component';
import { RecordatoriosKpisComponent } from './modules/medicion-kpis/recordatorios-kpis/recordatorios-kpis.component';
import { RecoveryFormularioComponent } from './recovery/app-recovery/recoveryformulario/recoveryformulario.component';
import { VariablesComponent } from './modules/medicion-kpis/variables/variables.component';
import { AppDiagnosticoProgressComponent } from './modules/diagnosticoProgress/app-diagnostico-progress/app-diagnostico-progress.component';
import { AppUserSettingsComponent } from './modules/UserSettings/app-user-settings.component';
import { DiagnosticoEtapasComponent } from './modules/diagnostico-etapas/diagnostico-etapas.component';
import { AuthGuard } from './guards/auth.guard';
import { PageErrorComponent } from './modules/page-error/page-error.component';
import { DiagramaCircularComponent } from './common/diagrama-circular/diagrama-circular.component';

const routes: Routes = [
  {path: '', component: AppLoginComponent},
  {path: 'register', component: AppRegisterComponent},
  {path: 'dashboard', component: AppDashboardComponent,
  canActivate:[AuthGuard],
  data: {
    propiedad: ['dashboard','TIPO_PERMISO'],
  },
  canLoad:[AuthGuard]
  },
  
  {path: 'caracterizacion', component: AppCaracterizacionComponent,
  
  canActivate:[AuthGuard],
  data: {
    propiedad: 'CARACTERIZACION',
  },
  canLoad:[AuthGuard]
},
  {path: 'diagnostico/:id', component: AppDiagnosticoComponent},
  {path: 'diagnosticoDoc', component: AppDiagnosticoDocComponent},
  {path: 'documentacion', component: AppDocumentacionComponent,
  canActivate:[AuthGuard],
  data: {
    propiedad: 'DOCUMENTACION',
  },
  canLoad:[AuthGuard]},
  {path: 'gestionUsuario', component: AppGestionDeUsuariosComponent},
  {path: 'evidencia/:section', component: AppEvidenciaComponent,
  
  canActivate:[AuthGuard],
  data: {
    propiedad: 'EVIDENCIA_IMPLEMENTACION',
  },
  canLoad:[AuthGuard]
},
  {path: 'evidencia/:section/:subSection', component: AppEvidenciaComponent },
  {path: 'recovery', component: RecoveryComponent},
  {path: 'recoveryformulario', component: RecoveryFormularioComponent},
  {path: 'auditoria', component: AppAuditoriaInternaComponent,
  canActivate:[AuthGuard],
  data: {
    propiedad: 'AUDITORIA_INTERNA',
  },
  canLoad:[AuthGuard]},
  {path: 'EMatrizRequisitosLegales', component: EMatrizRequisitosLegalesComponent,
  canActivate:[AuthGuard],
  data: {
    propiedad: 'EVIDENCIA_IMPLEMENTACION',
  },
  canLoad:[AuthGuard]
},
  {path: 'nuevoPlanDeAuditoria', component: AppNuevoPlanDeAuditoriaComponent},
  {path: 'listaDeVerificacion', component: AppListaDeVerificacionComponent,
  canActivate:[AuthGuard],
  data: {
    propiedad: 'AUDITORIA_INTERNA',
  },
  canLoad:[AuthGuard]
},
  {path: 'informeAuditoria', component: AppInformeDeAuditoriaComponent,

  canActivate:[AuthGuard],
  data: {
    propiedad: 'AUDITORIA_INTERNA',
  },
  canLoad:[AuthGuard]},
  {path: 'planificacion', component: AppPlanificacionComponent},
  {path: 'noticia', component: AppNoticiaComponent},
  {path: 'gestorNoticia', component: AppGestorNoticiaComponent,
  canActivate:[AuthGuard],
  data: {
    propiedad: 'NOTICIAS',
  },
  canLoad:[AuthGuard]
},
  {path: 'historial', component: AppHistorialNoticiasComponent},
  {path: 'noticiaCompleta', component: AppNoticiasCompletasComponent},
  {path: 'requisitosLegales', component: AppProcRequisitosLegalesComponent,
  canActivate:[AuthGuard],
  data: {
    propiedad: 'EVIDENCIA_IMPLEMENTACION',
  },
  canLoad:[AuthGuard]},
  {path: 'actividades', component: AppActividadesComponent,
  canActivate:[AuthGuard],
  data: {
    propiedad: 'MEJORA_CONTINUA',
  },
  canLoad:[AuthGuard]

},
  // {path: 'encuesta/:id', component: AppEncuestaComponent},
  {path: 'encuesta/crear', component: AppEncuestaComponent },
  {path: 'encuesta/editar/:id', component: AppEncuestaComponent },
  {path: 'mapaColombia', component:AppMapaColombiaComponent},
  {path: 'politicaDesarrolloSostenible', component: AppPoliticaDesarrolloSostenibleComponent},
  {path: 'partesInteresadas', component: AppMatrizPartesInteresadasComponent,
  
  canLoad:[AuthGuard]},
  {path: 'alcancedelSGS', component:AppAlcanceSGSComponent,
  canActivate:[AuthGuard],
  data: {
    propiedad: 'EVIDENCIA_IMPLEMENTACION',
  },
  canLoad:[AuthGuard]
},
  {path: 'mejoraContinua', component:MejoraaContinuaComponent,
  
  canActivate:[AuthGuard],
  data: {
    propiedad: 'MEJORA_CONTINUA',
  },
  canLoad:[AuthGuard]
},
  {path: 'resultadosEncuestas', component: AppResultadosEncuestasComponent,
  canActivate:[AuthGuard],
  data: {
    propiedad: 'ALTA_GERENCIA',
  },
  canLoad:[AuthGuard]
},
  {path: 'resultadosAuditoria', component: AppResultadosAuditoriaComponent,
  canActivate:[AuthGuard],
  data: {
    propiedad: 'ALTA_GERENCIA',
  },
  canLoad:[AuthGuard]
},
  {path: 'tablaPartesInteresadas', component: AppTablaPartesInteresadasComponent,
  canActivate:[AuthGuard],
  data: {
    propiedad: 'ALTA_GERENCIA',
  },
  canLoad:[AuthGuard]
},
  {path: 'actividadesPlanificadas', component: AppActividadesPlanificadasComponent,
  canActivate:[AuthGuard],
  data: {
    propiedad: 'ALTA_GERENCIA',
  },
  canLoad:[AuthGuard]
},
  {path: 'resultadosEncuestasPreguntas/:id/:numEncuestado', component: AppResultEncuestasPreguntasComponent},
  {path: 'encuestaCreada/:id', component: AppEncuestaCreadaComponent},
  {path: 'tablaEncuestas', component: AppTablaEncuestasComponent,
  canActivate:[AuthGuard],
  data: {
    propiedad: 'MEJORA_CONTINUA',
  },
  canLoad:[AuthGuard]
},
  {path: 'monitorizacion', component:AppMonitorizacionComponent,
  
  canActivate:[AuthGuard],
  data: {
    propiedad: 'MONITORIZACION',
  },
  canLoad:[AuthGuard]

},
  {path: 'mapaprocesos', component: AppMapaProcesosComponent,
  canActivate:[AuthGuard],
  data: {
    propiedad: 'EVIDENCIA_IMPLEMENTACION',
  },
  canLoad:[AuthGuard]
},
  {path: 'diagrama', component: DiagramaProcesoComponent },
  {path: 'kpis',component:MedicionKpisComponent},
  {path: 'indicadores',component:IndicadoresKpisComponent,
  
  canActivate:[AuthGuard],
  data: {
    propiedad: 'MEDICION_KPIS',
  },
  canLoad:[AuthGuard]
},
  {path: 'objetivos',component:ObjetivosKpisComponent,
  canActivate:[AuthGuard],
  data: {
    propiedad: 'MEDICION_KPIS',
  },
  canLoad:[AuthGuard]},
  {path: 'paquetes',component:PaquetesComponent,
  canActivate:[AuthGuard],
  data: {
    propiedad: 'MEDICION_KPIS',
  },
  canLoad:[AuthGuard]},
  {path: 'variables',component:VariablesComponent,
  canActivate:[AuthGuard],
  data: {
    propiedad: 'MEDICION_KPIS',
  },
  canLoad:[AuthGuard]},
  {path: 'evaluaciones',component:RegistroEvaluacionIndicadorComponent,
  canActivate:[AuthGuard],
  data: {
    propiedad: 'MEDICION_KPIS',
  },
  canLoad:[AuthGuard]},
  {path: 'recordatorios',component:RecordatoriosKpisComponent,
  canActivate:[AuthGuard],
  data: {
    propiedad: 'MEDICION_KPIS',
  },
  canLoad:[AuthGuard]},
  {path: 'diagnosticoProgress', component:AppDiagnosticoProgressComponent,
  canActivate:[AuthGuard],
  data: {
    propiedad: 'DIAGNOSTICO',
  },
  canLoad:[AuthGuard]
},
  {path: 'userSettings',component:AppUserSettingsComponent},
  {path: 'diagnosticoEtapas',component:DiagnosticoEtapasComponent,
  canActivate:[AuthGuard],
  data: {
    propiedad: 'DIAGNOSTICO',
  },
  canLoad:[AuthGuard]},
  {path: ':id',component:AppLoginComponent},
  {path: 'page/error',component:PageErrorComponent},
  {path: 'circular', component:DiagramaCircularComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [RouterModule],
  exports: [RouterModule]
})

export class AppRoutingModule { }

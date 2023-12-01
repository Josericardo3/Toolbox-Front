import { NgModule, CUSTOM_ELEMENTS_SCHEMA, isDevMode } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLoginComponent } from './modules/login/app-login/app-login.component';
import { AppFooterComponent } from './modules/footer/app-footer/app-footer.component';
import { AppHeaderComponent } from './modules/header/app-header/app-header.component';
import { AppRegisterComponent } from './modules/register/app-register/app-register.component';
import { AppDashboardComponent } from './modules/dashboard/app-dashboard/app-dashboard.component';
import { StoreModule } from '@ngrx/store'; 
import { stateReducer } from './state/reducer/example.reducer';
import { AppMyExampleComponent } from './modules/example/example';
import { DirectivesModule } from './directives/directives.module';
import { AppCaracterizacionComponent } from './modules/caracterizacion/app-caracterizacion/app-caracterizacion.component';
import { AppDiagnosticoComponent } from './modules/diagnostico/app-diagnostico/app-diagnostico.component';
import { AppModalInicialComponent } from './modules/modal/app-modal-inicial/app-modal-inicial.component';
import { AppModalSuccessComponent } from './modules/modal-success/app-modal-success/app-modal-success.component';
import { AppGestionDeUsuariosComponent } from './modules/gestionDeUsuarios/app-gestion-de-usuarios/app-gestion-de-usuarios.component';
import { AppModalPstComponent } from './modules/modalPst/app-modal-pst/app-modal-pst.component'; 
import { CommonModule } from '@angular/common';
import { AppDiagnosticoDocComponent } from './modules/diagnosticoDoc/app-diagnostico-doc/app-diagnostico-doc.component';
import { AppDocumentacionComponent } from './modules/documentacion/app-documentacion/app-documentacion.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InterceptorService } from './servicios/interceptorService/interceptor.service';
import { AppEvidenciaComponent } from './modules/evidencia/app-evidencia/app-evidencia.component';
import { RecoveryComponent } from './recovery/app-recovery/recovery.component';
import { ModalComponent } from './messagemodal/messagemodal.component';
import { EMatrizRequisitosLegalesComponent } from './modules/e-matriz-requisitos-legales/e-matriz-requisitos-legales.component';
import { AppAuditoriaInternaComponent } from './modules/AuditoriaInterna/app-auditoria-interna/app-auditoria-interna.component';
// ngx-bootstrap
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDatepickerModule, BsDatepickerConfig, BsDatepickerInlineConfig } from 'ngx-bootstrap/datepicker';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { registerLocaleData } from '@angular/common';
import localeEsPE from '@angular/common/locales/es-PE';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { AppNuevoPlanDeAuditoriaComponent } from './modules/NuevoPlanDeAuditoria/app-nuevo-plan-de-auditoria/app-nuevo-plan-de-auditoria.component';
import { AppListaDeVerificacionComponent } from './modules/ListaDeVerificacion/app-lista-de-verificacion/app-lista-de-verificacion.component';

import { PipesModule } from './pipes/pipes.module';
import { AppInformeDeAuditoriaComponent } from './modules/InformeDeAuditoria/app-informe-de-auditoria/app-informe-de-auditoria.component';
import { AppFormularioComponent } from './modules/formulario/app-formulario/app-formulario.component';
// import { MatTabsModule } from '@angular/material/tabs';

registerLocaleData(localeEsPE, 'es-PE');

import { AppPlanificacionComponent } from './modules/planificacion/app-planificacion/app-planificacion.component';
// ***ngx-bootstrap****
import { CarouselModule } from "ngx-bootstrap/carousel"; 
import { TabsModule, TabsetConfig } from 'ngx-bootstrap/tabs';
// import { NgxPaginationModule } from 'ngx-pagination';

import { AppAvatarComponent } from './modules/avatar/app-avatar/app-avatar.component';
import { AppColaboradorComponent } from './modules/colaborador/app-colaborador.component';
import { AppDeleteActivitiesComponent } from './modules/planificacion/app-delete-activities/app-delete-activities.component';
import { AppHeaderArrowLeftComponent } from './modules/header/app-header-arrow-left/app-header-arrow-left.component';
import { AppMenuComponent } from './modules/Menu/app-menu/app-menu.component';
import { AppAuditoriaPlanificacionComponent } from './modules/AuditoriaInterna/app-auditoria-planificacion/app-auditoria-planificacion.component';
import { AppNoticiaComponent } from "./modules/noticia/app-noticia/app-noticia.component";
import { AppGestorNoticiaComponent } from './modules/GestorNoticia/app-gestor-noticia/app-gestor-noticia.component';
import { AppEliminarNoticiaComponent } from './modules/GestorNoticia/app-eliminar-noticia/app-eliminar-noticia.component';
import { AppAgregarRequisitoComponent } from './modules/ListaDeVerificacion/app-agregar-requisito/app-agregar-requisito.component';
// import { SelectMultipleComponent } from './select-multiple/select-multiple.component';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { MatTabsModule } from '@angular/material/tabs';
import { NgxSelectModule } from 'ngx-select-ex';
import { AppHistorialNoticiasComponent } from './modules/historialNoticias/app-historial-noticias/app-historial-noticias.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AppNoticiasCompletasComponent } from './modules/noticiasCompletas/app-noticias-completas/app-noticias-completas.component';
import { ModalDetalleComponent } from './modules/ListaDeVerificacion/modal-detalle/modal-detalle.component';
// import { AppMejoraContinuaComponent } from './modules/MejoraContinua/app-mejora-continua/app-mejora-continua.component';
import { AppProcRequisitosLegalesComponent } from './modules/proc-requisitos-legales/app-proc-requisitos-legales/app-proc-requisitos-legales.component';
import { AppPoliticaDesarrolloSostenibleComponent } from './modules/e-matriz-requisitos-legales/app-politica-desarrollo-sostenible/app-politica-desarrollo-sostenible.component';
import { AppMatrizPartesInteresadasComponent } from './modules/matrizPartesInteresadas/app-matriz-partes-interesadas/app-matriz-partes-interesadas.component';
import { AppAlcanceSGSComponent } from './modules/AlcanceSistemaGestiónSostenibilidad/app-alcance-sgs/app-alcance-sgs.component';


import { MenuCortoComponent } from './modules/menuCorto/menu-corto/menu-corto.component';
// import { AppMejoraContinuaComponent } from './modules/mejoraContinua/app-mejora-continua/app-mejora-continua.component';
import { AppActividadesComponent } from './modules/Actividades/app-actividades/app-actividades.component';
import { AppEncuestaComponent } from './modules/Encuesta/app-encuesta/app-encuesta.component';
import { AppTarjetasComponent } from './modules/Tarjetas/app-tarjetas/app-tarjetas.component';
import { AppMapaColombiaComponent } from './modules/mapaColombia/app-mapa-colombia/app-mapa-colombia.component';
import { HeatmapComponent } from './heatmap/heatmap.component';
import { MejoraaContinuaComponent } from "./modules/mejoraa-continua/mejoraa-continua.component";
import { AppMenuAltaGerenciaComponent } from './modules/menuAltaGerencia/app-menu-alta-gerencia/app-menu-alta-gerencia.component';
import { AppResultadosAuditoriaComponent } from './modules/resultadosAuditoria/app-resultados-auditoria/app-resultados-auditoria.component';
import { AppResultadosEncuestasComponent } from './modules/resultadoEncuestas/app-resultados-encuestas/app-resultados-encuestas.component';
import { AppActividadesPlanificadasComponent } from './modules/actividadesPlanificadas/app-actividades-planificadas/app-actividades-planificadas.component';
import { AppTablaPartesInteresadasComponent } from './modules/tablaPartesInteresadas/app-tabla-partes-interesadas/app-tabla-partes-interesadas.component';
import { AppResultEncuestasPreguntasComponent } from './modules/resultEncuestasPreguntas/app-result-encuestas-preguntas/app-result-encuestas-preguntas.component';
import { AppEncuestaCreadaComponent } from './modules/encuestaCreada/app-encuesta-creada/app-encuesta-creada.component';
import { AppTablaEncuestasComponent } from './modules/tablaEncuestas/app-tabla-encuestas/app-tabla-encuestas.component';
import { AppEliminarEncuestaComponent } from './modules/tablaEncuestas/app-eliminar-encuesta/app-eliminar-encuesta.component';
import { AppMonitorizacionComponent } from './modules/monitorizacion/app-monitorizacion/app-monitorizacion.component';
import { AppMapaProcesosComponent } from './modules/mapaDeProcesos/app-mapa-procesos/app-mapa-procesos.component';
import { DiagramaProcesoComponent } from './modules/mapaDeProcesos/diagrama-proceso/diagrama-proceso.component';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MedicionKpisComponent } from './modules/medicion-kpis/medicion-kpis.component';
import { MenuMedicionKpisComponent } from './modules/medicion-kpis/menu-medicion-kpis/menu-medicion-kpis.component';
import { ObjetivosKpisComponent } from './modules/medicion-kpis/objetivos-kpis/objetivos-kpis.component';
import { IndicadoresKpisComponent } from './modules/medicion-kpis/indicadores-kpis/indicadores-kpis.component';
import { FormularioObjetivoKpiComponent } from './modules/medicion-kpis/objetivos-kpis/formulario-objetivo-kpi/formulario-objetivo-kpi.component';
import { GestionObjetivoKpiComponent } from './modules/medicion-kpis/objetivos-kpis/gestion-objetivo-kpi/gestion-objetivo-kpi.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MaterialModule } from "./material.module";
//import { AppMejoraContinuaComponent } from "./modules/mejoraContinua/app-mejora-continua/app-mejora-continua.component";
// import {GoogleMapsModule} from '@angular/google-maps'; 
import { FormularioIndicadorKpiComponent } from './modules/medicion-kpis/indicadores-kpis/formulario-indicador-kpi/formulario-indicador-kpi.component';
import { GestionIndicadorKpiComponent } from "./modules/medicion-kpis/indicadores-kpis/gestion-indicador-kpi/gestion-indicador-kpi.component";
import { AlertComponent } from "./modules/alert/alert.component";
import { PaquetesComponent } from "./modules/medicion-kpis/paquetes/paquetes.component";
import { GestionPaqueteKpiComponent } from "./modules/medicion-kpis/paquetes/gestion-paquete-kpi/gestion-paquete-kpi.component";
import { FormularioPaqueteKpiComponent } from "./modules/medicion-kpis/paquetes/formulario-paquete-kpi/formulario-paquete-kpi.component";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { MatPaginatorIntlEsp } from "./MatPaginatorIntl";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { FormularioEvaluacionIndicadorComponent } from "./modules/medicion-kpis/indicadores-kpis/formulario-evaluacion-indicador/formulario-evaluacion-indicador.component";
import { GestionEvaluacionIndicadorComponent } from "./modules/medicion-kpis/indicadores-kpis/gestion-evaluacion-indicador/gestion-evaluacion-indicador.component";
import { RegistroEvaluacionIndicadorComponent } from "./modules/medicion-kpis/registro-evaluacion-indicador/registro-evaluacion-indicador.component";
import { GestionRegistroEvaluacionIndicadorComponent } from "./modules/medicion-kpis/registro-evaluacion-indicador/gestion-registro-evaluacion-indicador/gestion-registro-evaluacion-indicador.component";
import { FormularioRegistroEvaluacionIndicadorComponent } from "./modules/medicion-kpis/registro-evaluacion-indicador/formulario-registro-evaluacion-indicador/formulario-registro-evaluacion-indicador.component";
import { DetalleRegistroEvaluacionIndicadorComponent } from "./modules/medicion-kpis/registro-evaluacion-indicador/detalle-registro-evaluacion-indicador/detalle-registro-evaluacion-indicador.component";
import { GraficoIndicadoresEvaluacionComponent } from "./modules/medicion-kpis/indicadores-kpis/grafico-indicadores-evaluacion/grafico-indicadores-evaluacion.component";
import { RecordatoriosKpisComponent } from "./modules/medicion-kpis/recordatorios-kpis/recordatorios-kpis.component";
import { FormularioRecordatorioKpisComponent } from "./modules/medicion-kpis/recordatorios-kpis/formulario-recordatorio-kpis/formulario-recordatorio-kpis.component";
import { AppDeleteLeyComponent } from "./modules/e-matriz-requisitos-legales/app-delete-ley/app-delete-ley.component";
import { RecoveryFormularioComponent } from "./recovery/app-recovery/recoveryformulario/recoveryformulario.component";
import { CargarDocumentoComponent } from "./modules/evidencia/cargar-documento/cargar-documento.component";
import { VariablesComponent } from "./modules/medicion-kpis/variables/variables.component";
import { GestionVariableKpiComponent } from "./modules/medicion-kpis/variables/gestion-variable-kpi/gestion-variable-kpi.component";
import { FormularioVariableKpiComponent } from "./modules/medicion-kpis/variables/formulario-variable-kpi/formulario-variable-kpi.component";
// import { AppDiagnosticoProgressComponent } from "./modules/diagnosticoProgress/app-diagnostico-progress/app-diagnostico-progress.component";
import { AppUserSettingsComponent } from './modules/UserSettings/app-user-settings.component';
import { EditorModule } from '@tinymce/tinymce-angular';

import { AppDiagnosticoProgressComponent } from "./modules/diagnosticoProgress/app-diagnostico-progress/app-diagnostico-progress.component";
import { Footer2Component } from "./modules/footer2/footer2/footer.component";
import { AppHeader2Component } from "./modules/header/app-header2/app-header2.component";
import { DiagnosticoEtapasComponent } from "./modules/diagnostico-etapas/diagnostico-etapas.component";
import { FormulasSemaforizacionComponent } from "./modules/medicion-kpis/indicadores-kpis/formulas-semaforizacion/formulas-semaforizacion.component";

@NgModule({
  declarations: [
    AppUserSettingsComponent,
    AppComponent,
    AppLoginComponent,
    AppFooterComponent,
    AppHeaderComponent,
    AppRegisterComponent,
    AppDashboardComponent,
    AppMyExampleComponent,
    AppCaracterizacionComponent,
    AppDiagnosticoComponent,
    AppModalInicialComponent,
    AppModalSuccessComponent,
    AppGestionDeUsuariosComponent,
    AppModalPstComponent,
    AppDiagnosticoDocComponent,
    AppDocumentacionComponent,
    AppEvidenciaComponent,
    RecoveryComponent,
    RecoveryFormularioComponent,
    ModalComponent,
    EMatrizRequisitosLegalesComponent,
    //DELETE LEY
    AppDeleteLeyComponent,
    AppAuditoriaInternaComponent,
    AppNuevoPlanDeAuditoriaComponent,
    AppListaDeVerificacionComponent,
    AppInformeDeAuditoriaComponent,
    AppFormularioComponent,
    AppPlanificacionComponent,
    AppColaboradorComponent,
    AppAvatarComponent,
    AppDeleteActivitiesComponent,
    AppHeaderArrowLeftComponent,
    AppMenuComponent,
    AppAuditoriaPlanificacionComponent,
    AppNoticiaComponent,
    AppGestorNoticiaComponent,
    AppEliminarNoticiaComponent,
    AppAgregarRequisitoComponent,
    AppHistorialNoticiasComponent,
    AppNoticiasCompletasComponent,
    ModalDetalleComponent,
    // AppMejoraContinuaComponent,
    AppProcRequisitosLegalesComponent,
    AppPoliticaDesarrolloSostenibleComponent,
    AppMatrizPartesInteresadasComponent,
    AppAlcanceSGSComponent,
    MenuCortoComponent,
    // AppMejoraContinuaComponent,
    AppActividadesComponent,
    AppEncuestaComponent,
    AppTarjetasComponent,
    AppMapaColombiaComponent,
    HeatmapComponent,
    // SelectMultipleComponent,
    MejoraaContinuaComponent,
    AppMenuAltaGerenciaComponent,
    AppResultadosAuditoriaComponent,
    AppResultadosEncuestasComponent,
    AppActividadesPlanificadasComponent,
    AppTablaPartesInteresadasComponent,
    AppResultEncuestasPreguntasComponent,
    AppEncuestaCreadaComponent,
    AppTablaEncuestasComponent,
    AppEliminarEncuestaComponent,
    AppMonitorizacionComponent,
    AppMapaProcesosComponent,
    DiagramaProcesoComponent,
    DiagramaProcesoComponent,
    MedicionKpisComponent,
    MenuMedicionKpisComponent,
    ObjetivosKpisComponent,
    IndicadoresKpisComponent,
    FormularioObjetivoKpiComponent,
    GestionObjetivoKpiComponent,
    FormularioIndicadorKpiComponent,
    GestionIndicadorKpiComponent,
    AlertComponent,
    PaquetesComponent,
    GestionPaqueteKpiComponent,
    FormularioPaqueteKpiComponent,
    FormularioEvaluacionIndicadorComponent,
    GestionEvaluacionIndicadorComponent,
    RegistroEvaluacionIndicadorComponent,
    GestionRegistroEvaluacionIndicadorComponent,
    FormularioRegistroEvaluacionIndicadorComponent,
    DetalleRegistroEvaluacionIndicadorComponent,
    GraficoIndicadoresEvaluacionComponent,
    RecordatoriosKpisComponent,
    FormularioRecordatorioKpisComponent,
    CargarDocumentoComponent,
    VariablesComponent,
    GestionVariableKpiComponent,
    FormularioVariableKpiComponent,
    AppDiagnosticoProgressComponent,
    Footer2Component,
    AppHeader2Component,
    DiagnosticoEtapasComponent,
    FormulasSemaforizacionComponent
  ],
  imports: [
    /*NgxSpinnerModule.forRoot({
      bdColor: 'rgba(0, 0, 0, 0.8)',
      size: 'medium',
      color: '#fff',
      type: 'ball-scale-multiple',
    }),*/
    EditorModule,
    MaterialModule,
    PipesModule,
    BrowserModule,
    AppRoutingModule,
    NgxSelectModule,
    FormsModule,
    ReactiveFormsModule, 
    StoreModule.forRoot({ data: stateReducer }),
    ModalModule.forRoot(),
    HttpClientModule,
    DirectivesModule,
    ModalModule,
    CommonModule,
    NgxSpinnerModule,
    ButtonsModule,
    MaterialModule,
    PaginationModule.forRoot(),
    AccordionModule.forRoot(),
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    PaginationModule.forRoot(),
    TimepickerModule.forRoot(),
    CarouselModule,
    BrowserAnimationsModule,
    TabsModule,
    //NgSelectModule,
    AngularEditorModule,
    DragDropModule,
    
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    // GoogleMapsModule,
    
  ],

  providers: 
    [
    { provide: HTTP_INTERCEPTORS,  useClass: InterceptorService, multi: true  },
    BsDatepickerInlineConfig,
    BrowserAnimationsModule,
    BsDatepickerConfig, 
    
    //NgbCarouselModule,
    BsModalService,
    TabsetConfig,
    AppPlanificacionComponent,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlEsp },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  ],
  entryComponents: [
    AppDeleteActivitiesComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule { }

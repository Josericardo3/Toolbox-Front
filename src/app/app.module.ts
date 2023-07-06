import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
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
import {AppGestionDeUsuariosComponent } from './modules/gestionDeUsuarios/app-gestion-de-usuarios/app-gestion-de-usuarios.component';
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
import { AppProcRequisitosLegalesComponent } from './modules/proc-requisitos-legales/app-proc-requisitos-legales/app-proc-requisitos-legales.component';
import { AppMatrizPartesInteresadasComponent } from './modules/matrizPartesInteresadas/app-matriz-partes-interesadas/app-matriz-partes-interesadas.component';

@NgModule({
  declarations: [
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
    ModalComponent,
    EMatrizRequisitosLegalesComponent,
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
    AppProcRequisitosLegalesComponent,
    AppMatrizPartesInteresadasComponent,
    // SelectMultipleComponent,
    
  ],
  imports: [
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
    AngularEditorModule
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
  ],
  entryComponents: [
    AppDeleteActivitiesComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule { }

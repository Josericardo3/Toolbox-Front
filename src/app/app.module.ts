import { NgModule } from '@angular/core';
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
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AppDiagnosticoDocComponent } from './modules/diagnosticoDoc/app-diagnostico-doc/app-diagnostico-doc.component';
import { AppDocumentacionComponent } from './modules/documentacion/app-documentacion/app-documentacion.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InterceptorService } from './servicios/interceptorService/interceptor.service';
import { AppEvidenciaComponent } from './modules/evidencia/app-evidencia/app-evidencia.component';
import { RecoveryComponent } from './recovery/app-recovery/recovery.component';
import { ModalComponent } from './messagemodal/messagemodal.component';
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule, 
    StoreModule.forRoot({ data: stateReducer }),
    //StoreModule.forRoot(reducer),
    ModalModule.forRoot(),
    HttpClientModule,
    DirectivesModule,
    ModalModule,
    CommonModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    PaginationModule.forRoot()
  ],
  providers: 
    [
    { provide: HTTP_INTERCEPTORS,  useClass: InterceptorService, multi: true },
  ],

  bootstrap: [AppComponent],
 
})
export class AppModule { }
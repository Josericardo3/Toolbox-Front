import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ErrorTailorModule } from '@ngneat/error-tailor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLoginComponent } from './modules/login/app-login/app-login.component';
import { AppFooterComponent } from './modules/footer/app-footer/app-footer.component';
import { AppHeaderComponent } from './modules/header/app-header/app-header.component';
import { AppRegisterComponent } from './modules/register/app-register/app-register.component';
import { AppDashboardComponent } from './modules/dashboard/app-dashboard/app-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    AppLoginComponent,
    AppFooterComponent,
    AppHeaderComponent,
    AppRegisterComponent,
    AppDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule, 
    ErrorTailorModule.forRoot({
      errors: {
        useValue: {
          required: 'Campo requerido',
          minlength: ({ requiredLength, actualLength }) =>
            `Expect ${requiredLength} but got ${actualLength}`,
          invalidAddress: error => `Address isn't valid`
        }
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
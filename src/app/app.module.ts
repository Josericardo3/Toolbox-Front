import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLoginComponent } from './modules/login/app-login/app-login.component';
import { AppFooterComponent } from './modules/footer/app-footer/app-footer.component';
import { AppHeaderComponent } from './modules/header/app-header/app-header.component';
import { AppRegisterComponent } from './modules/register/app-register/app-register.component';

@NgModule({
  declarations: [
    AppComponent,
    AppLoginComponent,
    AppFooterComponent,
    AppHeaderComponent,
    AppRegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

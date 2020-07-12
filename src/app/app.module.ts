import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material-module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { AuthInterCeptor } from './auth/auth-interceptor';
import { ErrorInterCeptor } from './error-interceptor';
import { ErrorComponent } from './error/error/error.component';
import { PostsModule } from './posts/posts.module';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    PostsModule,
  ],
  providers: [
              {provide: HTTP_INTERCEPTORS, useClass: AuthInterCeptor, multi: true},
              {provide: HTTP_INTERCEPTORS, useClass: ErrorInterCeptor, multi: true},
            ],
  bootstrap: [AppComponent],
  entryComponents:[ErrorComponent]
})
export class AppModule { }

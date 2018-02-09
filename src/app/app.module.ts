import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CoolStorageModule } from 'angular2-cool-storage';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';

import { ApiService } from './api.service';
import { SocketService } from './socket.service';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from 'app/auth-guard.service';
import { RoomComponent } from './room/room.component';

const ROUTES = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'home',
        canActivate: [AuthGuardService],
        component: HomeComponent
    },
    {
        path: 'rooms/:id',
        canActivate: [AuthGuardService],
        component: RoomComponent
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RoomComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES),
    CoolStorageModule,
    NgbModule.forRoot()
  ],
  providers: [ApiService, SocketService, AuthGuardService],
  bootstrap: [AppComponent]
})

export class AppModule { }

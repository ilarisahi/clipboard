import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    constructor(private apiService: ApiService) { }

    ngOnInit() {
    }

    login = {
        username: '',
        password: ''
    }

    register = {
        username: '',
        password: '',
        passwordConfirm: ''
    }

    onLoginSubmit() {
        console.log('logging in ' + this.login);
        this.apiService.login(this.login.username, this.login.password); 
    }

    onRegisterSubmit() {
        console.log('registering new user');
        this.apiService.register(this.register);
    }
}

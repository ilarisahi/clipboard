import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { CoolLocalStorage } from 'angular2-cool-storage';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {Router} from '@angular/router'

@Injectable()
export class ApiService {
    localStorage: CoolLocalStorage;
    loggedIn: Subject<boolean> = new Subject<boolean>();

    constructor(localStorage: CoolLocalStorage, private http: Http, private router: Router) {
        this.localStorage = localStorage;
        this.loggedIn.next(this.isLoggedIn());
    }

    saveToken(token: string) {
        console.log(token);
        localStorage.setItem('user-token', token);
        this.loggedIn.next(true);        
    }

    getToken(): string {
        return localStorage.getItem('user-token');
    }

    register(newUser: any) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('/api/register', newUser, options)
            .map(res => res.json())
            .subscribe(
            (data) => {
                this.saveToken(data.token);
                this.router.navigate(['/home']);
            },
            (err) => console.log('login error: ' + err));
    }

    logout() {
        localStorage.removeItem('user-token');
        this.loggedIn.next(false);
        this.router.navigate(['/login']);
    }

    login(username, password) {
        console.log('logging in... ' + username + ' : ' + password);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('/api/login', { username: username, password: password }, options)
            .map(res => res.json())
            .subscribe(
                (data) => {
                    this.saveToken(data.token);
                    this.router.navigate(['/home']);
                },
                (err) => console.log('login error: ' + err));
    }

    isLoggedIn(): boolean {
        let token = this.getToken();
        let payload;

        if (token) {
            payload = token.split('.')[1];
            payload = atob(payload);
            payload = JSON.parse(payload);
            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    }

    currentUser(): Object {
        if (this.isLoggedIn()) {
            let token = this.getToken();
            let payload;
            payload = token.split('.')[1];
            payload = atob(payload);
            payload = JSON.parse(payload);

            console.log(payload);
            return ({
                user_id: payload.id,
                username: payload.username
            });
        } else {
            return null;
        }
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Promise.reject(errMsg);
    }
}

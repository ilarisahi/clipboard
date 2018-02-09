import { Injectable } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { ApiService } from './api.service';

@Injectable()
export class AuthGuardService implements CanActivate {
    isLoggedIn: boolean;
    _loggedIn: any;

    constructor(private apiService: ApiService, private router: Router) {
        this.isLoggedIn = apiService.isLoggedIn();
        this._loggedIn = apiService.loggedIn.subscribe((value) => {
            this.isLoggedIn = value;
        });
    }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      console.log(route, state);
      if (this.isLoggedIn) {
          return true;
      };
      this.router.navigate(['/login']);
      return false;
  }

  ngOnDestroy() {
      this._loggedIn.unsubscribe();
  }
}

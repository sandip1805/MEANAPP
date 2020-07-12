import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from "./auth-data.model";
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + "/users";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenTimer:any;
  private isAuthenticated = false;
  private token: string;
  private userId: string;
  private authStatusListner = new Subject<boolean>();
  constructor(private http:HttpClient, private router: Router) { }

  getToken() {

    return this.token;
  }

  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  createUser(email: string, password:  string) {
      const authData: AuthData = {
        email,
        password
      }
      this.http.post(BACKEND_URL + "/signup", authData)
      .subscribe((responseData)=>{
        this.router.navigate(['/']);
      }, error=>{
        this.authStatusListner.next(false);
      })
  }

  login(email: string, password:  string) {
    const authData: AuthData = {
      email,
      password
    }
    this.http.post<{token: string, expiresIn: number, userId: string}>(BACKEND_URL + "/login", authData)
    .subscribe((response)=>{
      const token = response.token;
      this.token = token;
      if(token) {
        const expiresIn = response.expiresIn;
        this.setAuthTimer(expiresIn);
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authStatusListner.next(true);
        const now = new Date();
        const expirartionDate = new Date(now.getTime() + expiresIn * 1000);
        //console.log(expirartionDate);
        this.saveAuthData(token, expirartionDate, this.userId);
        this.router.navigate(['/']);
      }
    }, error => {
      this.authStatusListner.next(false);
    })
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if(!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirartionDate.getTime() - now.getTime();
    if(expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListner.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

private setAuthTimer(duration: number) {
  this.tokenTimer = setTimeout(()=>{
    this.logout();
  }, duration * 1000);
}

private saveAuthData(token: string, expirartionDate: Date, userId: string) {
  localStorage.setItem("token", token);
  localStorage.setItem("expiration", expirartionDate.toISOString());
  localStorage.setItem("userId", userId);
}

private clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
  localStorage.removeItem("userId");
}

private getAuthData() {
  const token = localStorage.getItem("token");
  const expirartionDate = localStorage.getItem("expiration");
  const userId = localStorage.getItem("userId");
  if(!token || !expirartionDate) {
    return;
  }

  return {
    token,
    expirartionDate:new Date(expirartionDate),
    userId
  }

}

}

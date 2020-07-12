import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginFormField } from './login-form-field';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  loginModel = new LoginFormField();
  authStatusSub: Subscription;
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListner().subscribe((authStatus)=>{
      this.isLoading = false;
    })
  }

  onLogin(form: NgForm) {
    if(form.invalid) {
      return
    }
    this.isLoading = true;
    this.authService.login(this.loginModel.email, this.loginModel.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}

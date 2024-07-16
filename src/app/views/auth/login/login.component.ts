import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/http/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  LoginForm: FormGroup;
  isError = false;

  constructor(private AuthService: AuthService, private router: Router) {
    this.LoginForm = new FormGroup({
      phone: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }

  login() {
    if (this.LoginForm.invalid)
      return
    this.AuthService.login(this.LoginForm.getRawValue()).subscribe(res => {
      localStorage.setItem('token', res.token)
      localStorage.setItem('user', res)
      this.AuthService.setAuthUser({id: res.id, role: res.role})
      this.router.navigate(['/admin'])
    }, error => {
      this.isError = true
    })
  }


}

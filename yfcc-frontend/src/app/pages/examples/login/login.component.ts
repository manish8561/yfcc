import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../../shared/common.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  focus;
  focus1;
  loginform: FormGroup;
  constructor(private commonservice: CommonService, private router: Router) { }

  ngOnInit() {
    /* this.commonservice.get('address/getAll/5ddb9b2e00dd674b85be34ae').subscribe(data => {
      console.log(data, 'service');
    }); */
    if (localStorage.loggedin === 'yes') {
      this.router.navigate(['/dashboards']);
    }
    this.loginform = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }
  login() {
    if (this.loginform.valid) {
      const data = this.loginform.value;
      data.device_token = 'website';
      this.commonservice.post('login/loginCheck', data).subscribe(res => {
        // console.log(res, 'after login');
        localStorage.setItem('loggedin', 'yes');
        localStorage.setItem('token', res.token);
        this.commonservice.login();
        this.router.navigate(['/dashboards']);
      });
    }
  }
}

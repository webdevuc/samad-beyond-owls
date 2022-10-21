import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  renderer: any;

  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.body.classList.add('leftmenu');
   }
   loginbox: boolean = true;
   forgotbox: boolean = false;
   signupform :boolean = false;

  ngOnInit(): void {
    
  }
  ngOnDestroy() {
    this.document.body.classList.remove('leftmenu');
  }
  forgetboxshow(){
    this.loginbox = false;
    this.forgotbox = true;
    this.signupform = false;
  }
  createAccount(){
    this.loginbox = false;
    this.forgotbox = false;
    this.signupform = true;
  }

}

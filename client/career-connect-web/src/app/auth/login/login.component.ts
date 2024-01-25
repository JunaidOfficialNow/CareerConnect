import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Auth,  signInWithEmailAndPassword} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private firebaseAuth: Auth, private router: Router) {}

  onLoginSubmit(form: NgForm) {
    signInWithEmailAndPassword(this.firebaseAuth, form.value['email'], form.value['password'])
    .then((userCred) => {
      userCred.user.getIdTokenResult().then((token) => {
        if (token.claims['admin']) {
          this.router.navigateByUrl('/admin');
        } else this.router.navigateByUrl('/');
      })
    });

    
  } 

}

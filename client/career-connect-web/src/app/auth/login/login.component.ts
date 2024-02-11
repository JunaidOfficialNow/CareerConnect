import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Auth,  signInWithEmailAndPassword} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private firebaseAuth: Auth, private router: Router, private snackBar: SnackbarService) {}

  onLoginSubmit(form: NgForm) {
    signInWithEmailAndPassword(this.firebaseAuth, form.value['email'], form.value['password'])
    .then((userCred) => {
      userCred.user.getIdTokenResult().then((token) => {
        if (token.claims['admin']) {
          this.router.navigateByUrl('/admin');
        } else this.router.navigateByUrl('/home');
      })
    }).catch((error) => {
         if (error.code === 'auth/invalid-credential') {
          this.snackBar.openSnackBar('Invalid credentials');
         }
    });

    
  } 

}

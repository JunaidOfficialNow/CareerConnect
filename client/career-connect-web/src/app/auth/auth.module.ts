import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: 'auth',
      children: [
        {
          path: 'login',
          component: LoginComponent
        }

      ]
    }]),
    FormsModule
  ]
})
export class AuthModule { }

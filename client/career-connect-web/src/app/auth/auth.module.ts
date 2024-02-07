import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule} from '@angular/material/autocomplete'
import { MatIconModule } from '@angular/material/icon';
import { RegisterService } from './register/register.service';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { DeslugifyPipe } from './register/deslugify.pipe';




@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    DeslugifyPipe
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    RouterModule.forChild([{
      path: 'auth',
      children: [
        {
          path: 'login',
          component: LoginComponent
        },
        {
          path: 'register',
          component: RegisterComponent,
        }

      ]
    }]),
    FormsModule
  ],
  providers: [RegisterService]
})
export class AuthModule { }

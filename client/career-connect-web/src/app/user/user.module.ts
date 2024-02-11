import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav'
import { DeslugifyPipeModule } from '../shared/deslugify.pipe';



@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    DeslugifyPipeModule,
    MatSidenavModule,
    RouterModule.forChild([
      {
        path: 'home',
        component:  HomeComponent
      }
    ])
  ]
})
export class UserModule { }

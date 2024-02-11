import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { NotificationsComponent } from './notifications/notifications.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { SkillsComponent } from './skills/skills.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EducationsComponent } from './educations/educations.component';
import { CategoriesComponent } from './categories/categories.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { AddNotificationDialogComponent } from './notifications/add-notification-dialog/add-notification-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DeslugifyPipeModule } from '../shared/deslugify.pipe';
import { MatSnackBarModule } from '@angular/material/snack-bar';




@NgModule({
  declarations: [
    LayoutComponent,
    NotificationsComponent,
    DashboardComponent,
    AddNotificationDialogComponent,
  ],
  imports: [
    CommonModule, 
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTableModule,
    MatDialogModule,
    MatChipsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    DeslugifyPipeModule,
    MatAutocompleteModule,
    RouterModule.forChild([
      {
        path: 'admin',
        component: LayoutComponent,
        children: [
          {
            path: 'dashboard',
            component:  DashboardComponent
          },
          {
            path: 'notifications',
            component: NotificationsComponent
          },
          {
            path: 'skills',
            component: SkillsComponent
          },
          {
            path: 'educations',
            component: EducationsComponent
          },
          {
            path: 'categories',
            component: CategoriesComponent
          },
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch : 'full'
          },
        ]
      }
    ]),
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }

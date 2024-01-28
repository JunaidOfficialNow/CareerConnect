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




@NgModule({
  declarations: [
    LayoutComponent,
    NotificationsComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule, 
    MatButtonModule,
    MatIconModule,
    MatTableModule,
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
            path: '',
            redirectTo: 'dashboard',
            pathMatch : 'full'
          },
        ]
      }
    ]),
    MatGridListModule,
    MatCardModule,
    MatMenuModule
  ]
})
export class AdminModule { }

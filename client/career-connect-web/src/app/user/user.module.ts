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
import { MatSidenavModule } from '@angular/material/sidenav';
import { DeslugifyPipeModule } from '../shared/deslugify.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { EditJobPreferenceComponent } from './edit-job-preference/edit-job-preference.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard'
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormatedDescriptionPipeModule } from '../shared/formatedDescription.pipe';
import { RelativePipeModule } from '../shared/getRelativeTime.pipe';

@NgModule({
  declarations: [
    HomeComponent,
    EditJobPreferenceComponent,
    EditProfileComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    ReactiveFormsModule,
    MatDialogModule,
    DeslugifyPipeModule,
    MatSidenavModule,
    FormatedDescriptionPipeModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatCheckboxModule,
    RelativePipeModule,
    MatSelectModule,
    RouterModule.forChild([
      {
        path: 'home',
        canActivate: [AuthGuard],
        data: {authGuardPipe: () => redirectUnauthorizedTo('/auth')},
        component: HomeComponent,
      },
    ]),
  ],
})
export class UserModule {}

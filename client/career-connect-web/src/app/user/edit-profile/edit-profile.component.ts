import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Auth, updateEmail, verifyBeforeUpdateEmail } from '@angular/fire/auth'
import { EditProfileService } from './edit-profile.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from 'src/app/shared/snackbar.service';

export interface EditProfileUserData {
  id: string;
  name: string;
  email: string;
  age: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  private _formBuilder = inject(FormBuilder);
  private editProfileService =  inject(EditProfileService);
  private data : EditProfileUserData = inject(MAT_DIALOG_DATA);
  private snackBarService = inject(SnackbarService);
  private matDialogRef = inject(MatDialogRef)
  private auth = inject(Auth);
  basicDetailsFormGroup = this._formBuilder.group(
    {
      name: [this.data.name, Validators.required],
      age: [this.data.age, Validators.required],
      phoneNumber: [
        this.data.phoneNumber,
        [Validators.required, Validators.pattern('[6-9]\\d{9}')],
      ],
    },
  );
  

  onBasicDetailsFormSubmit() {
    if (this.basicDetailsFormGroup.valid) {
      this.editProfileService.updateUserProfile(this.data.id, {
        name: this.basicDetailsFormGroup.value.name!,
        age: this.basicDetailsFormGroup.value.age!,
        phoneNumber:  this.basicDetailsFormGroup.value.phoneNumber!,
      }).subscribe(() => this.matDialogRef.close({
        name: this.basicDetailsFormGroup.value.name!,
        age: this.basicDetailsFormGroup.value.age!,
        phoneNumber:  this.basicDetailsFormGroup.value.phoneNumber!,
      }))
    }
  }
}

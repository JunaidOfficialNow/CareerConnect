import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EditProfileService } from './edit-profile.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


export interface EditProfileUserData {
  id: string;
  name: string;
  email: string;
  dob: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent  {
  private _formBuilder = inject(FormBuilder);
  private editProfileService =  inject(EditProfileService);
  private data : EditProfileUserData = inject(MAT_DIALOG_DATA);
  private matDialogRef = inject(MatDialogRef)
  basicDetailsFormGroup = this._formBuilder.group(
    {
      name: [this.data.name, Validators.required],
      dob: [this.data.dob, Validators.required],
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
        dob: this.basicDetailsFormGroup.value.dob!,
        phoneNumber:  this.basicDetailsFormGroup.value.phoneNumber!,
      }).subscribe(() => this.matDialogRef.close({
        name: this.basicDetailsFormGroup.value.name!,
        age: this.basicDetailsFormGroup.value.dob!,
        phoneNumber:  this.basicDetailsFormGroup.value.phoneNumber!,
      }))
    }
  }
}
